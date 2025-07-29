import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { Grid, Button, Alert, FormControlLabel, Switch } from '@mui/material';
import { variantService } from '../../../../services/admin/variantService';
import { productService } from '../../../../services/admin/productService';
import { variantValueService } from '../../../../services/admin/variantValueService';
import { API_BASE_URL } from '../../../../constants/environment';
import ProductInformationSection from './ProductInformationSection';
import ProductSpecificationsSection from './ProductSpecificationsSection';
import ProductVariantConfigSection from './ProductVariantConfigSection';
import ProductSkuSection from './ProductSkuSection';
import AddVariantTypeDialog from './AddVariantTypeDialog';
import AddVariantValueDialog from './AddVariantValueDialog';


const getFrontendFileType = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const ext = url.split('?')[0].split('.').pop().toLowerCase();
  const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'ogg'];
  return videoExtensions.includes(ext) ? 'video' : 'image';
};

const ProductForm = ({ onSubmit, initialData }) => {
  const isInitialized = useRef(false);

  const createEmptySku = useCallback(
    () => ({
      id: null,
      skuCode: '',
      originalPrice: '',
      price: '',
      stock: '',
      height: '',
      width: '',
      length: '',
      weight: '',
      mediaUrls: [],
      variantValueIds: [],
      variantSelections: {}
    }),
    []
  );

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    orderIndex: 0,
    isActive: true,
    categoryId: '',
    brandId: '',
    hasVariants: false,
    variants: [],
    skus: [createEmptySku()],
    productSpecs: [{ key: '', specGroup: '', value: '', sortOrder: 0 }]
  });

  const [brandList, setBrandList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [badgeImage, setBadgeImage] = useState(null);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [productConfiguredVariants, setProductConfiguredVariants] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [skuMediaFiles, setSkuMediaFiles] = useState({});
  const [infoContent, setInfoContent] = useState('');
  const [isAddVariantTypeDialogOpen, setIsAddVariantTypeDialogOpen] = useState(false);
  const [newVariantTypeNameInput, setNewVariantTypeNameInput] = useState('');
  const [variantTypeDialogError, setVariantTypeDialogError] = useState('');
  const [isSavingVariantType, setIsSavingVariantType] = useState(false);
  const [targetPvcIndexForNewType, setTargetPvcIndexForNewType] = useState(null);
  const [isAddVariantValueDialogOpen, setIsAddVariantValueDialogOpen] = useState(false);
  const [newVariantValueInput, setNewVariantValueInput] = useState('');
  const [currentVariantTypeForNewValue, setCurrentVariantTypeForNewValue] = useState(null);
  const [variantValueDialogError, setVariantValueDialogError] = useState('');
  const [isSavingVariantValue, setIsSavingVariantValue] = useState(false);
  const [targetPvcIndexForNewValue, setTargetPvcIndexForNewValue] = useState(null);

  const ADD_NEW_VARIANT_TYPE_VALUE = '___ADD_NEW_VARIANT_TYPE___';
  const ADD_NEW_VARIANT_VALUE = '___ADD_NEW_VARIANT_VALUE___';
  const availableSpecGroups = useMemo(() => {
    const groups = (formData.productSpecs || []).map((spec) => spec.specGroup?.trim()).filter(Boolean);
    return [...new Set(groups)];
  }, [formData.productSpecs]);
  const fetchAvailableVariants = useCallback(async (selectAfterFetch = null) => {
    setIsSavingVariantType(true);
    setIsSavingVariantValue(true);
    try {
      const res = await variantService.getAllWithValues();
      const fetchedVariants = res.data.data || [];
      setAvailableVariants(fetchedVariants);
      if (selectAfterFetch) {
        const { type, id, pvcIndex, variantTypeIdForNewValue } = selectAfterFetch;
        if (type === 'variantType' && pvcIndex !== undefined) {
          const newType = fetchedVariants.find((vt) => vt.id === id);
          if (newType) {
            setProductConfiguredVariants((prev) => {
              const updated = [...prev];
              updated[pvcIndex] = {
                ...updated[pvcIndex],
                variantTypeId: newType.id,
                variantTypeName: newType.name,
                applicableValueIds: []
              };
              return updated;
            });
          }
        } else if (type === 'variantValue' && pvcIndex !== undefined && variantTypeIdForNewValue) {
          setProductConfiguredVariants((prev) => {
            const updated = [...prev];
            if (updated[pvcIndex] && updated[pvcIndex].variantTypeId === variantTypeIdForNewValue) {
              if (!updated[pvcIndex].applicableValueIds.includes(id)) {
                updated[pvcIndex].applicableValueIds = [...updated[pvcIndex].applicableValueIds, id];
              }
            }
            return updated;
          });
        }
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách thuộc tính:', err);
    } finally {
      setIsSavingVariantType(false);
      setIsSavingVariantValue(false);
    }
  }, []);
  const handleOnDragEndProductSpecs = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.productSpecs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedSpecsWithSortOrder = items.map((spec, index) => ({ ...spec, sortOrder: index }));
    setFormData((prev) => ({ ...prev, productSpecs: updatedSpecsWithSortOrder }));
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSkuChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedSkus = [...prev.skus];
      if (updatedSkus[index]) {
        updatedSkus[index] = { ...updatedSkus[index], [key]: value };
      }
      return { ...prev, skus: updatedSkus };
    });
  };
  const handleMediaChangeForSku = (skuIndex, files) => {
    setSkuMediaFiles((prev) => ({ ...prev, [skuIndex]: files }));
  };
  const addSku = () => {
    if (formData.skus.length > 1 && productConfiguredVariants.some((pvc) => !pvc.variantTypeId || pvc.applicableValueIds.length === 0)) {
      setFormErrors((prev) => ({
        ...prev,
        form: 'Hoàn tất cấu hình các loại thuộc tính và chọn giá trị cho chúng trước khi thêm SKU mới.'
      }));
      return;
    }
    setFormErrors((prev) => ({ ...prev, form: '' }));
    setFormData((prev) => ({ ...prev, skus: [...prev.skus, createEmptySku()] }));
  };
  const removeSku = (indexToRemove) => {
    if (formData.skus.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      skus: prev.skus.filter((_, i) => i !== indexToRemove)
    }));
    setSkuMediaFiles((prevSkuMedia) => {
      const newSkuMedia = { ...prevSkuMedia };
      delete newSkuMedia[indexToRemove];
      const reindexedMedia = {};
      let newIndex = 0;
      Object.keys(newSkuMedia)
        .sort((a, b) => a - b)
        .forEach((oldIndex) => {
          reindexedMedia[newIndex] = newSkuMedia[oldIndex];
          newIndex++;
        });
      return reindexedMedia;
    });
  };
  const handleProductSpecChange = (specIndex, field, value) => {
    setFormData((prev) => {
      const specs = [...prev.productSpecs];
      specs[specIndex] = { ...specs[specIndex], [field]: value };
      return { ...prev, productSpecs: specs };
    });
  };
  const addProductSpec = () => {
    setFormData((prev) => {
      const currentSpecs = prev.productSpecs || [];
      return { ...prev, productSpecs: [...currentSpecs, { key: '', value: '', specGroup: '', sortOrder: currentSpecs.length }] };
    });
  };
  const removeProductSpec = (specIndex) => {
    setFormData((prev) => {
      const updatedSpecs = prev.productSpecs.filter((_, i) => i !== specIndex);
      return { ...prev, productSpecs: updatedSpecs.length > 0 ? updatedSpecs : [{ key: '', specGroup: '', value: '', sortOrder: 0 }] };
    });
  };
  const handleOpenAddVariantTypeDialog = (pvcIndex) => {
    setIsAddVariantTypeDialogOpen(true);
    setTargetPvcIndexForNewType(pvcIndex);
  };
  const handleCloseAddVariantTypeDialog = () => {
    setIsAddVariantTypeDialogOpen(false);
    setNewVariantTypeNameInput('');
    setVariantTypeDialogError('');
  };
  const handleSaveNewVariantType = async () => {
    if (!newVariantTypeNameInput.trim()) return setVariantTypeDialogError('Tên không được trống.');
    setIsSavingVariantType(true);
    try {
      const res = await variantService.createVariantType({ name: newVariantTypeNameInput.trim() });
      await fetchAvailableVariants({ type: 'variantType', id: res.data.data.id, pvcIndex: targetPvcIndexForNewType });
      handleCloseAddVariantTypeDialog();
    } catch (error) {
      setVariantTypeDialogError(error.response?.data?.message || 'Lỗi server.');
    } finally {
      setIsSavingVariantType(false);
    }
  };
  const handleOpenAddVariantValueDialog = (variantType, pvcIndex) => {
    setCurrentVariantTypeForNewValue(variantType);
    setTargetPvcIndexForNewValue(pvcIndex);
    setIsAddVariantValueDialogOpen(true);
  };
  const handleCloseAddVariantValueDialog = () => {
    setIsAddVariantValueDialogOpen(false);
    setNewVariantValueInput('');
    setVariantValueDialogError('');
  };
  const handleSaveNewVariantValue = async () => {
    if (!newVariantValueInput.trim()) return setVariantValueDialogError('Giá trị không được trống.');
    if (!currentVariantTypeForNewValue?.id) return setVariantValueDialogError('Lỗi xác định loại thuộc tính.');
    setIsSavingVariantValue(true);
    try {
      const res = await variantValueService.createQuick({
        value: newVariantValueInput.trim(),
        variantId: currentVariantTypeForNewValue.id
      });
      await fetchAvailableVariants({
        type: 'variantValue',
        id: res.data.data.id,
        pvcIndex: targetPvcIndexForNewValue,
        variantTypeIdForNewValue: currentVariantTypeForNewValue.id
      });
      handleCloseAddVariantValueDialog();
    } catch (error) {
      setVariantValueDialogError(error.response?.data?.message || 'Lỗi server.');
    } finally {
      setIsSavingVariantValue(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const payloadForJson = {
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      thumbnail: '',
      badge: formData.badge || null,

      orderIndex: formData.orderIndex === '' || isNaN(Number(formData.orderIndex)) ? 0 : parseInt(formData.orderIndex, 10),
      isActive: formData.isActive,
      hasVariants: formData.hasVariants,
      categoryId: formData.categoryId === '' ? null : Number(formData.categoryId),
      brandId: formData.brandId === '' ? null : Number(formData.brandId),
      infoContent: infoContent.trim(),
      variants: [],
      specs: (formData.productSpecs || [])
        .map((s) => ({
          key: String(s.key || '').trim(),
          value: String(s.value || '').trim(),
          specGroup: String(s.specGroup || '').trim(),
          sortOrder: Number(s.sortOrder || 0)
        }))
        .filter((s) => s.key !== '' && s.value !== ''),
      skus: []
    };

    if (formData.hasVariants) {
      payloadForJson.variants = productConfiguredVariants
        .filter((pvc) => pvc.variantTypeId && pvc.applicableValueIds.length > 0)
        .map((pvc) => {
          const variantTypeDetails = availableVariants.find((av) => av.id === pvc.variantTypeId);
          return {
            id: pvc.variantTypeId,
            name: pvc.variantTypeName,
            values: pvc.applicableValueIds.map((valueId) => {
              const valueDetails = variantTypeDetails?.values.find((v) => v.id === valueId);
              return { id: valueId, value: valueDetails?.value || 'N/A' };
            })
          };
        });
    }

    payloadForJson.skus = formData.skus.map((sku, index) => ({
      id: sku.id,
      skuCode: String(sku.skuCode || '').trim(),
      originalPrice: sku.originalPrice == null || sku.originalPrice === '' ? null : Number(sku.originalPrice),
      price: sku.price == null || sku.price === '' ? null : Number(sku.price),
      stock: sku.stock == null || sku.stock === '' ? null : Number(sku.stock),
      height: sku.height == null || sku.height === '' ? null : Number(sku.height),
      width: sku.width == null || sku.width === '' ? null : Number(sku.width),
      length: sku.length == null || sku.length === '' ? null : Number(sku.length),
      weight: sku.weight == null || sku.weight === '' ? null : Number(sku.weight),
      mediaUrls: (skuMediaFiles[index] || []).map((f) => f.url).filter((url) => typeof url === 'string' && !url.startsWith('blob:')),

      variantValueIds: formData.hasVariants
        ? Object.values(sku.variantSelections || {})
          .filter((vId) => vId !== '' && vId != null)
          .map(Number)
        : []
    }));

    const finalPayload = new FormData();
    if (thumbnail?.file instanceof File) {
      finalPayload.append('thumbnail', thumbnail.file);
    } else if (typeof formData.thumbnail === 'string' && formData.thumbnail && !formData.thumbnail.startsWith('blob:')) {
      payloadForJson.thumbnail = formData.thumbnail;
    }

    if (badgeImage?.file instanceof File) {
      finalPayload.append('badgeImage', badgeImage.file);
    } else if (typeof formData.badgeImage === 'string' && formData.badgeImage) {
      payloadForJson.badgeImage = formData.badgeImage;
    }

    if (formData.skus.length > 0) {
      if (!formData.hasVariants) {
        const mediaFiles = skuMediaFiles[0] || [];
        mediaFiles.forEach((m) => {
          if (m.file instanceof File) {
            finalPayload.append(`media_sku_0`, m.file, m.file.name);
          }
        });
      } else {
        formData.skus.forEach((_, skuIndex) => {
          const filesForThisSku = skuMediaFiles[skuIndex] || [];
          filesForThisSku.forEach((item) => {
            if (item.file instanceof File) {
              finalPayload.append(`media_sku_${skuIndex}`, item.file, item.file.name);
            }
          });
        });
      }
    }

    finalPayload.append('product', JSON.stringify(payloadForJson));

    try {
      await onSubmit(finalPayload);
      if (!initialData) {
        localStorage.removeItem('product_form_draft');
      }
    } catch (err) {
      const errorsObjInner = {
        form: 'Vui lòng kiểm tra lại các thông tin bắt buộc.'
      };

      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach((errorItem) => {
          if (errorItem.field) {
            const skuMatch = errorItem.field.match(/^skus\[(\d+)\]\.(.+)$/);
            if (skuMatch) {
              const index = parseInt(skuMatch[1], 10);
              const fieldName = skuMatch[2];
              if (!errorsObjInner.skus) errorsObjInner.skus = [];
              if (!errorsObjInner.skus[index]) errorsObjInner.skus[index] = {};
              errorsObjInner.skus[index][fieldName] = errorItem.message;
            } else {
              errorsObjInner[errorItem.field] = errorItem.message;
            }
          } else if (errorItem.message) {
            errorsObjInner.form = errorItem.message;
          }
        });
      } else if (err.response?.data?.message) {
        errorsObjInner.form = err.response.data.message;
      }
      setFormErrors(errorsObjInner);
    }
  };

  useEffect(() => {
    productService
      .getCategoryTree()
      .then((res) => setCategoryTree(res.data.data || []))
      .catch(console.error);
    productService
      .getBrandList()
      .then((res) => setBrandList(res.data.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    if (formData.hasVariants) {
      fetchAvailableVariants();
    } else {
      setProductConfiguredVariants([]);
    }
  }, [formData.hasVariants, fetchAvailableVariants]);
  useEffect(() => {
    if (initialData) {
      const {
        name,
        badgeImage,
        shortDescription,
        description,
        thumbnail,
        orderIndex,
        isActive,
        hasVariants,
        categoryId,
        brandId,
        infoContent,
        variants,
        skus,
        specs
      } = initialData;


      const processedSkus =
        skus && skus.length > 0
          ? skus.map((s) => ({
            ...createEmptySku(),
            ...s,
            variantSelections: s.selectedValues || {}
          }))
          : [createEmptySku()];

      setFormData((prev) => ({
        ...prev,
        name: name || '',
        shortDescription: shortDescription || '',
        description: description || '',
        badge: initialData.badge || '',  // ← QUAN TRỌNG
        thumbnail: thumbnail || '',
        orderIndex: orderIndex ?? 0,
        isActive: isActive !== false,
        hasVariants: !!hasVariants,
        categoryId: categoryId?.toString() || '',
        brandId: brandId?.toString() || '',
        skus: processedSkus,
        productSpecs:
          specs && specs.length > 0
            ? specs.map((s) => ({ key: s.key, value: s.value, specGroup: s.specGroup, sortOrder: s.sortOrder }))
            : [{ key: '', value: '', sortOrder: 0 }]
      }));

      setInfoContent(infoContent || '');
      setThumbnail(thumbnail ? { url: thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}${thumbnail}` } : null);
      if (typeof badgeImage === 'string' && badgeImage.trim() !== '') {
        setBadgeImage({ url: badgeImage.startsWith('http') ? badgeImage : `${API_BASE_URL}${badgeImage}` });
      } else {
        setBadgeImage(null);
      }

      const newSkuMediaFiles = {};
      processedSkus.forEach((sku, index) => {
        newSkuMediaFiles[index] = (sku.mediaUrls || [])
          .filter((m) => {
            const url = typeof m === 'string' ? m : m?.url;
            return typeof url === 'string' && url.trim();
          })
          .map((m, i) => {
            const url = typeof m === 'string' ? m : m?.url;
            if (!url || typeof url !== 'string' || !url.trim()) {
              console.warn(`❌ SKU ${index} media ${i} bị lỗi`, m);
              return null;
            }

            const finalUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
            const fallbackType = getFrontendFileType(url) || 'image';
            const type = m?.type || fallbackType;

            return {
              id: `media-${index}-${i}`,
              url: finalUrl,
              type
            };
          })

          .filter(Boolean);
      });
      setSkuMediaFiles(newSkuMediaFiles);

      if (hasVariants && variants && variants.length > 0) {
        setProductConfiguredVariants(
          variants.map((v) => ({
            variantTypeId: v.id,
            variantTypeName: v.name,
            applicableValueIds: v.applicableValueIds || (v.values ? v.values.map((val) => val.id) : [])
          }))
        );
      } else {
        setProductConfiguredVariants([]);
      }

      isInitialized.current = true;
    } else {
      isInitialized.current = true;
    }
  }, [initialData, createEmptySku]);
  const canManageVariantSkus =
    productConfiguredVariants.length > 0 &&
    productConfiguredVariants.every((pvc) => pvc.variantTypeId && pvc.applicableValueIds.length > 0);

  return (
    <form onSubmit={handleSubmit} className="bg-[#fff] p-4">

      <Grid container spacing={4}>
        <ProductInformationSection
          formData={formData}
          handleChange={handleChange}
          formErrors={formErrors}
          setFormData={setFormData}
          infoContent={infoContent}
          setInfoContent={setInfoContent}
          badgeImage={badgeImage}
          setBadgeImage={setBadgeImage}
          thumbnail={thumbnail}
           setCategoryTree={setCategoryTree}
          setThumbnail={setThumbnail}
          categoryTree={categoryTree}
          
          brandList={brandList}
          setBrandList={setBrandList}
        />


        <ProductSpecificationsSection
          productSpecs={formData.productSpecs}
          handleProductSpecChange={handleProductSpecChange}
          addProductSpec={addProductSpec}
          removeProductSpec={removeProductSpec}
          handleOnDragEndProductSpecs={handleOnDragEndProductSpecs}
          availableSpecGroups={availableSpecGroups}
          formErrors={formErrors}
        />

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={!!formData.hasVariants}
                onChange={(event) => {
                  const newHasVariants = event.target.checked;
                  setFormData((prev) => {
                    let newSkus = [...prev.skus];
                    if (newHasVariants) {
                      if (newSkus.length === 0 || !prev.hasVariants) {
                        newSkus = [createEmptySku()];
                      }
                    } else {
                      newSkus = [prev.skus.length > 0 ? prev.skus[0] : createEmptySku()];
                    }
                    return { ...prev, hasVariants: newHasVariants, skus: newSkus };
                  });
                }}
                color="primary"
              />
            }
            label="Sản phẩm có nhiều phiên bản (biến thể)"
          />
          <Alert severity={formData.hasVariants ? 'info' : 'warning'} sx={{ mt: 1, mb: 2 }}>
            {formData.hasVariants
              ? 'Bật chế độ nhiều phiên bản. Mỗi SKU sẽ có thông tin giá, kho, media riêng.'
              : 'Tắt chế độ nhiều phiên bản. Sản phẩm chỉ có một thông tin giá, kho, media duy nhất.'}
          </Alert>
        </Grid>

        {formData.hasVariants && (
          <ProductVariantConfigSection
            productConfiguredVariants={productConfiguredVariants}
            setProductConfiguredVariants={setProductConfiguredVariants}
            availableVariants={availableVariants}
            handleOpenAddVariantTypeDialog={handleOpenAddVariantTypeDialog}
            handleOpenAddVariantValueDialog={handleOpenAddVariantValueDialog}
            ADD_NEW_VARIANT_TYPE_VALUE={ADD_NEW_VARIANT_TYPE_VALUE}
            ADD_NEW_VARIANT_VALUE={ADD_NEW_VARIANT_VALUE}
          />
        )}

        <ProductSkuSection
          formData={formData}
          addSku={addSku}
          canManageVariantSkus={canManageVariantSkus}
          removeSku={removeSku}
          handleSkuChange={handleSkuChange}
          handleMediaChangeForSku={handleMediaChangeForSku}
          productConfiguredVariants={productConfiguredVariants}
          availableVariants={availableVariants}
          skuMediaFiles={skuMediaFiles}
          formErrors={formErrors}
        />

        <Grid item xs={12} sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Lưu sản phẩm
          </Button>
          {formErrors.form && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formErrors.form}
            </Alert>
          )}
        </Grid>
      </Grid>

      <AddVariantTypeDialog
        open={isAddVariantTypeDialogOpen}
        onClose={handleCloseAddVariantTypeDialog}
        newVariantTypeNameInput={newVariantTypeNameInput}
        setNewVariantTypeNameInput={setNewVariantTypeNameInput}
        onSave={handleSaveNewVariantType}
        isSaving={isSavingVariantType}
        error={variantTypeDialogError}
      />

      <AddVariantValueDialog
        open={isAddVariantValueDialogOpen}
        onClose={handleCloseAddVariantValueDialog}
        newVariantValueInput={newVariantValueInput}
        setNewVariantValueInput={setNewVariantValueInput}
        onSave={handleSaveNewVariantValue}
        isSaving={isSavingVariantValue}
        error={variantValueDialogError}
        currentVariantType={currentVariantTypeForNewValue}
      />
    </form>
  );
};

export default ProductForm;
