import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Box,
  Alert,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import ThumbnailUpload from '../ThumbnailUpload';
import MediaUpload from '../MediaUpload';
import TinyEditor from '../../../../components/Admin/TinyEditor';

import { variantService } from '../../../../services/admin/variantService';
import { productService } from '../../../../services/admin/productService';
import { variantValueService } from '../../../../services/admin/variantValueService';
 import { API_BASE_URL } from '../../../../constants/environment'; 

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);


const getFrontendFileType = (url) => {
  if (!url || typeof url !== 'string') {
    return 'image'; 
  }
  const ext = url.split('?')[0].split('.').pop().toLowerCase();
  const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'ogg'];
  if (videoExtensions.includes(ext)) {
    return 'video';
  }
  return 'image';
};

const ProductForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    thumbnail: '',
    orderIndex: 0,
    isActive: true,
    hasVariants: false,
    categoryId: '',
    brandId: '',
    variants: [], 
    skus: []     
  });

  const [brandList, setBrandList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [thumbnail, setThumbnail] = useState(null); 
  const [media, setMedia] = useState([]); 
  const [availableVariants, setAvailableVariants] = useState([]); 
  const [productConfiguredVariants, setProductConfiguredVariants] = useState([]); 
  const [categoryTree, setCategoryTree] = useState([]);
  const [skuMediaFiles, setSkuMediaFiles] = useState({});

  const [infoContent, setInfoContent] = useState('');
const LOCAL_STORAGE_KEY = "product_form_draft";

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

  const ADD_NEW_VARIANT_TYPE_VALUE = "___ADD_NEW_VARIANT_TYPE___";

  const createEmptySku = () => ({
    skuCode: '', originalPrice: '', price: '', stock: '',
    height: '', width: '', length: '', weight: '',
    mediaUrls: [], // Will hold URLs for submission
    variantValueIds: [], // Will hold selected variant value IDs for submission
    variantSelections: {}, // UI state: { variantTypeId: variantValueId }
    description: '',
    specs: [{ key: '', value: '', sortOrder: 0 }],
  });
useEffect(() => {
  const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedDraft && !initialData) {
    try {
      const parsed = JSON.parse(savedDraft);
      setFormData(parsed.formData || {});
      setThumbnail(parsed.thumbnail || null);
      setMedia(parsed.media || []);
      setSkuMediaFiles(parsed.skuMediaFiles || {});
      setInfoContent(parsed.infoContent || '');
      setProductConfiguredVariants(parsed.productConfiguredVariants || []);
    } catch (err) {
      console.error("Lỗi khi đọc bản nháp localStorage:", err);
    }
  }
}, []);
useEffect(() => {
  const timeoutId = setTimeout(() => {
    const dataToSave = {
      formData,
      thumbnail,
      media,
      skuMediaFiles,
      infoContent,
      productConfiguredVariants
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, 500); // đợi 500ms sau mỗi lần thay đổi

  return () => clearTimeout(timeoutId);
}, [formData, thumbnail, media, skuMediaFiles, infoContent, productConfiguredVariants]);

  useEffect(() => {
    if (!formData.hasVariants && formData.skus.length === 0) {
      setFormData(prev => ({ ...prev, skus: [createEmptySku()] }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.hasVariants]);

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
          const newType = fetchedVariants.find(vt => vt.id === id);
          if (newType) {
            setProductConfiguredVariants(prev => {
              const updated = [...prev];
              const targetIndex = pvcIndex === -1 ? prev.length -1 : pvcIndex;
              if (updated[targetIndex]) {
                  updated[targetIndex] = { ...updated[targetIndex], variantTypeId: newType.id, variantTypeName: newType.name, applicableValueIds: [] };
              } else if (targetIndex === -1 && prev.length === 0) { // Adding to empty list
                  updated.push({ variantTypeId: newType.id, variantTypeName: newType.name, applicableValueIds: [] });
              } else if (targetIndex !== -1 && !updated[targetIndex] && pvcIndex === prev.length) { // Adding a new row directly
                  updated.push({ variantTypeId: newType.id, variantTypeName: newType.name, applicableValueIds: [] });
              }
              return updated;
            });
          }
        } else if (type === 'variantValue' && pvcIndex !== undefined && variantTypeIdForNewValue) {
            setProductConfiguredVariants(prev => {
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
      setFormErrors(prev => ({...prev, form: 'Không thể tải danh sách thuộc tính.'}))
    } finally {
        setIsSavingVariantType(false);
        setIsSavingVariantValue(false);
    }
  }, []);

  useEffect(() => {
    if (formData.hasVariants) {
      fetchAvailableVariants();
    } else {
      setProductConfiguredVariants([]);
    }
  }, [formData.hasVariants, fetchAvailableVariants]);


  useEffect(() => {
    if (initialData?.hasVariants && availableVariants.length > 0 && initialData?.variants?.length > 0) {
      const variantConfig = initialData.variants.map(v => ({
        variantTypeId: v.id,
        variantTypeName: v.name,

        applicableValueIds: Array.isArray(v.values) ? v.values.map(val => val.id) : []
      }));
      setProductConfiguredVariants(variantConfig);
    }
  }, [initialData?.hasVariants, initialData?.variants, availableVariants]);


 
  useEffect(() => {
    if (thumbnail?.url && typeof thumbnail.url === 'string' && !thumbnail.url.startsWith('blob:')) {
      setFormData((prev) => ({ ...prev, thumbnail: thumbnail.url }));
    } else if (!thumbnail && formData.thumbnail !== '') {
      setFormData((prev) => ({ ...prev, thumbnail: '' }));
    }
  }, [thumbnail, formData.thumbnail]);

  useEffect(() => {
    if (!formData.hasVariants && formData.skus.length > 0) {
      const urls = media
        .map(m => (m.url && typeof m.url === 'string' && !m.url.startsWith('blob:') ? m.url : null))
        .filter(Boolean);

      if (formData.skus[0] && JSON.stringify(formData.skus[0].mediaUrls || []) !== JSON.stringify(urls)) {
        handleSkuChange(0, 'mediaUrls', urls);
      }
    }
 
  }, [media, formData.hasVariants]); 


  useEffect(() => {
    if (!formData.hasVariants && formData.name && formData.skus.length === 1 && !(formData.skus[0]?.skuCode || '').trim()) {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      handleSkuChange(0, 'skuCode', `${slug}-sku`);
    }
  
  }, [formData.name, formData.hasVariants]);


  const handleMediaChangeForVariantSku = (skuIndex, files) => {
    const newSkuMediaFiles = { ...skuMediaFiles, [skuIndex]: files };
    setSkuMediaFiles(newSkuMediaFiles);
    const urls = files
      .map(f => (f.url && typeof f.url === 'string' && !f.url.startsWith('blob:') ? f.url : null))
      .filter(Boolean);
    handleSkuChange(skuIndex, 'mediaUrls', urls); 
  };

  useEffect(() => {
    productService.getCategoryTree().then(res => setCategoryTree(res.data.data || [])).catch(err => console.error('Error fetching category tree:', err));
    productService.getBrandList().then(res => setBrandList(res.data.data || [])).catch(err => console.error('Error fetching brand list:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const renderCategoryOptions = (categories, level = 0) => {
    let options = [];
    if (!categories) return options;
    categories.forEach((cat) => {
      options.push(
        <MenuItem key={cat.id} value={cat.id} style={{ paddingLeft: `${level * 20 + 16}px` }}>
          {cat.name}
        </MenuItem>
      );
      if (cat.children?.length > 0) {
        options = options.concat(renderCategoryOptions(cat.children, level + 1));
      }
    });
    return options;
  };

  const handleSkuChange = (index, key, value) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      if (updatedSkus[index]) {
        updatedSkus[index] = { ...updatedSkus[index], [key]: value };
      } else if (index === 0 && !prev.hasVariants && !updatedSkus[0] ) {
         updatedSkus[0] = { ...createEmptySku(), [key]: value };
      }
      return { ...prev, skus: updatedSkus };
    });
  };

  const addSku = () => {
    if (!formData.hasVariants && formData.skus.length >= 1) return;
    if (formData.hasVariants && !canManageVariantSkus) {
        setFormErrors(prev => ({...prev, form: "Hoàn tất cấu hình các loại thuộc tính và chọn giá trị cho chúng trước khi thêm SKU."}));
        return;
    }
    setFormData((prev) => ({ ...prev, skus: [...prev.skus, createEmptySku()] }));
  };
  
  const handleOpenAddVariantTypeDialog = (pvcIndex) => { setIsAddVariantTypeDialogOpen(true); setTargetPvcIndexForNewType(pvcIndex); };
  const handleCloseAddVariantTypeDialog = () => { setIsAddVariantTypeDialogOpen(false); setNewVariantTypeNameInput(''); setVariantTypeDialogError(''); setTargetPvcIndexForNewType(null);};
  const handleSaveNewVariantType = async () => {
    if (!newVariantTypeNameInput.trim()) {
        setVariantTypeDialogError("Tên loại thuộc tính không được để trống.");
        return;
    }
    setIsSavingVariantType(true);
    setVariantTypeDialogError('');
    try {
    const res = await variantService.createVariantType({ name: newVariantTypeNameInput.trim() });

        const newVariantType = res.data.data;
        await fetchAvailableVariants({ type: 'variantType', id: newVariantType.id, pvcIndex: targetPvcIndexForNewType === null && productConfiguredVariants.length === 0 ? -1 : targetPvcIndexForNewType });
        handleCloseAddVariantTypeDialog();
    } catch (error) {
        console.error("Lỗi lưu loại thuộc tính mới:", error);
        setVariantTypeDialogError(error.response?.data?.message || "Lỗi lưu loại thuộc tính.");
    } finally {
        setIsSavingVariantType(false);
    }
  };

  const handleOpenAddVariantValueDialog = (variantType, pvcIndex) => { setCurrentVariantTypeForNewValue(variantType); setTargetPvcIndexForNewValue(pvcIndex); setIsAddVariantValueDialogOpen(true);};
  const handleCloseAddVariantValueDialog = () => { setIsAddVariantValueDialogOpen(false); setNewVariantValueInput(''); setCurrentVariantTypeForNewValue(null); setVariantValueDialogError(''); setTargetPvcIndexForNewValue(null);};
  const handleSaveNewVariantValue = async () => {
    if (!newVariantValueInput.trim()) {
        setVariantValueDialogError("Tên giá trị không được để trống.");
        return;
    }
    if (!currentVariantTypeForNewValue || !currentVariantTypeForNewValue.id) {
        setVariantValueDialogError("Không xác định được loại thuộc tính.");
        return;
    }
    setIsSavingVariantValue(true);
    setVariantValueDialogError('');
    try {
       const res = await variantValueService.createQuick({
  value: newVariantValueInput.trim(),
  variantId: currentVariantTypeForNewValue.id
});

        const newVariantValue = res.data.data;
        await fetchAvailableVariants({ type: 'variantValue', id: newVariantValue.id, pvcIndex: targetPvcIndexForNewValue, variantTypeIdForNewValue: currentVariantTypeForNewValue.id });
        handleCloseAddVariantValueDialog();
    } catch (error) {
        console.error("Lỗi lưu giá trị thuộc tính mới:", error);
        setVariantValueDialogError(error.response?.data?.message || "Lỗi lưu giá trị thuộc tính.");
    } finally {
        setIsSavingVariantValue(false);
    }
  };

  const checkForDuplicateSkuVariants = (skusToTest, configuredVariantTypes) => {
    if (!Array.isArray(skusToTest) || skusToTest.length === 0 || !Array.isArray(configuredVariantTypes) || configuredVariantTypes.length === 0) {
        return { hasDuplicates: false, message: '' };
    }

    const activeVariantTypeIds = configuredVariantTypes
        .filter(pvc => pvc.variantTypeId && pvc.applicableValueIds.length > 0)
        .map(pvc => pvc.variantTypeId);

    if (activeVariantTypeIds.length === 0) {
        return { hasDuplicates: false, message: '' };
    }

    const skuVariantSignatures = new Set();

    for (let i = 0; i < skusToTest.length; i++) {
        const sku = skusToTest[i];
        if (!sku.variantSelections) continue;

        const currentSignatureParts = [];
        activeVariantTypeIds.sort().forEach(typeId => { // Ensure consistent order
            const valueId = sku.variantSelections[typeId];
            if (valueId !== undefined && valueId !== '') {
                currentSignatureParts.push(`${typeId}:${valueId}`);
            }
        });
        
        const currentSignature = currentSignatureParts.join('|');

        if (currentSignatureParts.length > 0) {
            if (skuVariantSignatures.has(currentSignature)) {
                return {
                    hasDuplicates: true,
                    message: `Phiên bản SKU ${i + 1} có cùng tổ hợp thuộc tính với một SKU khác. Mỗi SKU phải có một tổ hợp thuộc tính duy nhất.`
                };
            }
            skuVariantSignatures.add(currentSignature);
        }
    }
    return { hasDuplicates: false, message: '' };
  };

  const handleSkuSpecChange = (skuIndex, specIndex, field, value) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      if (updatedSkus[skuIndex] && Array.isArray(updatedSkus[skuIndex].specs)) {
        const newSpecs = updatedSkus[skuIndex].specs.map((spec, i) => {
          if (i === specIndex) {
            return { ...spec, [field]: value };
          }
          return spec;
        });
        updatedSkus[skuIndex].specs = newSpecs;
      }
      return { ...prev, skus: updatedSkus };
    });
  };

  const addSkuSpec = (skuIndex) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      if (updatedSkus[skuIndex]) {
        if (!Array.isArray(updatedSkus[skuIndex].specs)) {
          updatedSkus[skuIndex].specs = [];
        }
        const currentSpecs = updatedSkus[skuIndex].specs;
        updatedSkus[skuIndex].specs = [
          ...currentSpecs,
          { key: '', value: '', sortOrder: currentSpecs.length > 0 ? Math.max(...currentSpecs.map(s => Number(s.sortOrder || 0))) + 1 : 0 }
        ];
      }
      return { ...prev, skus: updatedSkus };
    });
  };

  const removeSkuSpec = (skuIndex, specIndex) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      if (updatedSkus[skuIndex] && Array.isArray(updatedSkus[skuIndex].specs)) {
        updatedSkus[skuIndex].specs = updatedSkus[skuIndex].specs.filter((_, i) => i !== specIndex);
      }
      return { ...prev, skus: updatedSkus };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let currentFormErrors = {};

    if (!formData.name.trim()) currentFormErrors.name = "Tên sản phẩm không được để trống.";
    if (!formData.categoryId) currentFormErrors.categoryId = "Vui lòng chọn danh mục.";
    if (!formData.brandId) currentFormErrors.brandId = "Vui lòng chọn thương hiệu.";
    if (!thumbnail || (!thumbnail.url && !thumbnail.file)) currentFormErrors.thumbnail = "Ảnh đại diện không được để trống.";
    if (formData.orderIndex === '' || formData.orderIndex === null || isNaN(formData.orderIndex) || Number(formData.orderIndex) < 0)
      currentFormErrors.orderIndex = "Thứ tự hiển thị phải là số không âm.";

    if (!formData.skus || formData.skus.length === 0) {
        currentFormErrors.form = "Sản phẩm phải có ít nhất một SKU.";
    } else {
        formData.skus.forEach((sku, index) => {
            currentFormErrors.skus = currentFormErrors.skus || [];
            currentFormErrors.skus[index] = currentFormErrors.skus[index] || {};

            if (!sku.skuCode?.trim()) currentFormErrors.skus[index].skuCode = "Mã SKU không được để trống.";
            
            if (sku.originalPrice === '' || sku.originalPrice === null || isNaN(Number(sku.originalPrice))) {
                currentFormErrors.skus[index].originalPrice = "Giá gốc không được để trống và phải là số.";
            } else if (Number(sku.originalPrice) <= 0) {
                currentFormErrors.skus[index].originalPrice = "Giá gốc phải lớn hơn 0.";
            }

            if (sku.stock === '' || sku.stock === null || isNaN(Number(sku.stock))) {
                currentFormErrors.skus[index].stock = "Tồn kho không được để trống và phải là số.";
            } else if (Number(sku.stock) < 0) {
                currentFormErrors.skus[index].stock = "Tồn kho phải là số không âm.";
            }

            const dimensionsFields = { height: 'Chiều cao', width: 'Chiều rộng', length: 'Chiều dài', weight: 'Khối lượng' };
            for (const dimKey in dimensionsFields) {
                const value = sku[dimKey];
                const fieldName = dimensionsFields[dimKey];
                if (value === '' || value === null || value === undefined) {
                    currentFormErrors.skus[index][dimKey] = `${fieldName} không được để trống.`;
                } else if (isNaN(Number(value))) {
                    currentFormErrors.skus[index][dimKey] = `${fieldName} phải là một số.`;
                } else if (Number(value) < 0) {
                    currentFormErrors.skus[index][dimKey] = `${fieldName} không được là số âm.`;
                }
            }
            
            (sku.specs || []).forEach((specItem, specIdx) => {
                currentFormErrors.skus[index].specs = currentFormErrors.skus[index].specs || [];
                currentFormErrors.skus[index].specs[specIdx] = currentFormErrors.skus[index].specs[specIdx] || {};
                if (!specItem.key?.trim() && specItem.value?.trim()) {
                    currentFormErrors.skus[index].specs[specIdx].key = "Tên thông số không được trống nếu có giá trị.";
                }
                if (specItem.key?.trim() && !specItem.value?.trim()) {
                    currentFormErrors.skus[index].specs[specIdx].value = "Giá trị thông số không được trống nếu có tên.";
                }
                if(Object.keys(currentFormErrors.skus[index].specs[specIdx]).length === 0) {
                    currentFormErrors.skus[index].specs[specIdx] = null;
                }
            });
            if(currentFormErrors.skus[index].specs) {
                currentFormErrors.skus[index].specs = currentFormErrors.skus[index].specs.filter(Boolean);
                if(currentFormErrors.skus[index].specs.length === 0) delete currentFormErrors.skus[index].specs;
            }

            if (formData.hasVariants) {
              (productConfiguredVariants || []).forEach(pvc => {
                  if(pvc.variantTypeId && pvc.applicableValueIds.length > 0) {
                      if (!sku.variantSelections || sku.variantSelections[pvc.variantTypeId] === undefined || sku.variantSelections[pvc.variantTypeId] === '') {
                          if(!currentFormErrors.skus[index].variantSelections) currentFormErrors.skus[index].variantSelections = {};
                          currentFormErrors.skus[index].variantSelections[pvc.variantTypeId] = `Vui lòng chọn ${pvc.variantTypeName}.`;
                      }
                  }
              });
            }
            if(Object.keys(currentFormErrors.skus[index]).length === 0) {
                currentFormErrors.skus[index] = null; 
            }
        });
        if(currentFormErrors.skus) {
            currentFormErrors.skus = currentFormErrors.skus.filter(Boolean);
            if(currentFormErrors.skus.length === 0) delete currentFormErrors.skus;
        }
    }

    if (Object.keys(currentFormErrors).length > 0) {
      if (!currentFormErrors.form && (currentFormErrors.name || currentFormErrors.categoryId || currentFormErrors.brandId || currentFormErrors.thumbnail || currentFormErrors.orderIndex || currentFormErrors.skus ) ){
        currentFormErrors.form = "Vui lòng nhập đầy đủ và chính xác các thông tin bắt buộc được đánh dấu.";
      }
      setFormErrors(currentFormErrors);
      return;
    }
    setFormErrors({});

    const payloadForJson = {
        name: formData.name.trim(),
        shortDescription: formData.shortDescription.trim(),
        thumbnail: '', 
        orderIndex: formData.orderIndex === '' || isNaN(formData.orderIndex) ? null : parseInt(formData.orderIndex, 10),
        isActive: formData.isActive,
        hasVariants: formData.hasVariants,
        categoryId: Number(formData.categoryId) || null,
        brandId: Number(formData.brandId) || null,
        infoContent: infoContent.trim(),
        variants: [],
        skus: [],
    };

    if (formData.hasVariants) {
      payloadForJson.variants = productConfiguredVariants
        .filter(pvc => pvc.variantTypeId && pvc.applicableValueIds.length > 0)
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
        const { hasDuplicates, message } = checkForDuplicateSkuVariants(formData.skus, productConfiguredVariants);
        if (hasDuplicates) {
          setFormErrors(prev => ({ ...prev, form: message }));
          return;
        }
    }

    payloadForJson.skus = formData.skus.map((sku) => {
      const newSku = {
        skuCode: String(sku.skuCode || '').trim(),
        originalPrice: isNaN(Number(sku.originalPrice)) ? null : Number(sku.originalPrice),
        price: (sku.price === '' || sku.price === null || isNaN(Number(sku.price))) ? null : Number(sku.price),
        stock: isNaN(Number(sku.stock)) ? null : parseInt(sku.stock, 10),
        height: (sku.height === '' || sku.height === null || isNaN(Number(sku.height))) ? null : Number(sku.height),
        width: (sku.width === '' || sku.width === null || isNaN(Number(sku.width))) ? null : Number(sku.width),
        length: (sku.length === '' || sku.length === null || isNaN(Number(sku.length))) ? null : Number(sku.length),
        weight: (sku.weight === '' || sku.weight === null || isNaN(Number(sku.weight))) ? null : Number(sku.weight),
        mediaUrls: Array.isArray(sku.mediaUrls) ? sku.mediaUrls : [],
        description: String(sku.description || '').trim(),
        specs: (sku.specs || [])
          .map(s => ({
            key: String(s.key || '').trim(),
            value: String(s.value || '').trim(),
            sortOrder: Number(s.sortOrder || 0),
          }))
          .filter(s => s.key !== '' && s.value !== ''),
        variantValueIds: [],
      };
      if (formData.hasVariants) {
        newSku.variantValueIds = sku.variantSelections
          ? Object.values(sku.variantSelections).filter((vId) => vId !== '' && vId != null).map(Number)
          : [];
      }
      return newSku;
    });

    try {
    const finalPayload = new FormData();


if (thumbnail?.file instanceof File) {
  finalPayload.append('thumbnail', thumbnail.file);
} else if (
  typeof formData.thumbnail === 'string' &&
  formData.thumbnail &&
  !formData.thumbnail.startsWith('blob:')
) {
  payloadForJson.thumbnail = formData.thumbnail;
}


if (!formData.hasVariants && media.length > 0 && formData.skus.length > 0) {
  const urls = media
    .map((m) =>
      typeof m.url === "string" && !m.url.startsWith("blob:") ? m.url : null
    )
    .filter(Boolean);

  payloadForJson.skus[0].mediaUrls = urls;

  media.forEach((m) => {
    if (m.file instanceof File) {
      finalPayload.append(`media_sku_0`, m.file);
    }
  });
}


finalPayload.append('product', JSON.stringify(payloadForJson));


if (formData.hasVariants) {
  formData.skus.forEach((sku, skuIndex) => {
    const filesForThisSku = skuMediaFiles[skuIndex] || [];
    filesForThisSku.forEach((item) => {
      if (item.file instanceof File) {
        finalPayload.append(`media_sku_${skuIndex}`, item.file);
      }
    });
  });
}

      await onSubmit(finalPayload);
      localStorage.removeItem(LOCAL_STORAGE_KEY);

    } catch (err) {
        console.error('LỖI GỬI FORM:', err.response || err);
        const errorsObjInner = { ...formErrors };
        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          err.response.data.errors.forEach((errorItem) => {
            if (errorItem && errorItem.field) {
              const match = errorItem.field.match(/^skus\[(\d+)\]\.(.+)$/);
              if (match) {
                const index = parseInt(match[1], 10);
                const field = match[2];
                errorsObjInner.skus = errorsObjInner.skus || [];
                errorsObjInner.skus[index] = errorsObjInner.skus[index] || {};
                errorsObjInner.skus[index][field] = errorItem.message;
              } else { errorsObjInner[errorItem.field] = errorItem.message; }
            }
          });
        } else if (err.message) { errorsObjInner.form = err.message; } 
        else { errorsObjInner.form = 'Đã có lỗi không xác định xảy ra khi gửi form.'; }
        setFormErrors(errorsObjInner);
    }
  };

  const canManageVariantSkus =
    formData.hasVariants &&
    productConfiguredVariants.length > 0 &&
    productConfiguredVariants.every((pvc) => pvc.variantTypeId && pvc.applicableValueIds.length > 0);

  // This is the PRIMARY useEffect for initializing form with `initialData`
// useEffect xử lý initialData đã được cập nhật
useEffect(() => {
  if (initialData) {
    console.log("📦 initialData:", initialData);
    console.log("📦 variants:", initialData.variants);

    const {
      name: initialName,
      shortDescription: initialShortDescription,
      thumbnail: initialProductThumbnail,
      orderIndex: initialOrderIndex,
      isActive: initialIsActive,
      hasVariants: initialHasVariants,
      categoryId: initialCategoryId,
      brandId: initialBrandId,
      infoContent: initialInfoContent,
      variants: initialProductVariants,
      skus: initialProductSkusFromBackend // Đổi tên để phân biệt
    } = initialData;

    // Xử lý SKUs để map 'selectedValues' từ backend thành 'variantSelections' cho frontend
    const processedSkus = (initialProductSkusFromBackend || []).map(backendSku => {
      // Bắt đầu với cấu trúc SKU mặc định của frontend (có variantSelections: {})
      const frontendSkuStructure = createEmptySku(); 
      
      return {
        ...frontendSkuStructure, // Áp dụng cấu trúc mặc định của frontend
        ...backendSku,          // Ghi đè bằng dữ liệu từ backend
        variantSelections: backendSku.selectedValues || {}, // QUAN TRỌNG: Map selectedValues thành variantSelections
        // Đảm bảo các trường khác như mediaUrls, specs từ backendSku được giữ lại nếu createEmptySku không có
        mediaUrls: backendSku.mediaUrls || [], 
        specs: backendSku.specs || frontendSkuStructure.specs, 
      };
    });

    setFormData({
      name: initialName || '',
      shortDescription: initialShortDescription || '',
      thumbnail: initialProductThumbnail || '',
      orderIndex: initialOrderIndex ?? 0,
      isActive: !!initialIsActive,
      hasVariants: !!initialHasVariants,
      categoryId: initialCategoryId?.toString() || '',
      brandId: initialBrandId?.toString() || '',
      variants: initialProductVariants || [],
      skus: processedSkus // Sử dụng SKUs đã được xử lý
    });

  
setThumbnail(initialProductThumbnail
  ? { url: initialProductThumbnail.startsWith('http') ? initialProductThumbnail : `${API_BASE_URL}${initialProductThumbnail}` }
  : null
);

    setInfoContent(initialInfoContent || '');

    // Xử lý media cho sản phẩm không có biến thể
    if (!initialHasVariants && processedSkus.length > 0 && processedSkus[0]) {
      const mediaUrls = processedSkus[0].mediaUrls; // Lấy mediaUrls từ SKU đã xử lý
      setMedia(
  Array.isArray(mediaUrls)
    ? mediaUrls.map(url => ({
        url: url.startsWith('http') ? url : `${API_BASE_URL}${url}`,
        type: getFrontendFileType(url)
      }))
    : []
);
      setSkuMediaFiles({});
    } 
    // Xử lý media cho sản phẩm có biến thể
    else if (initialHasVariants && processedSkus.length > 0) {
      const newSkuMediaFiles = {};
      processedSkus.forEach((sku, index) => {
        if (sku.mediaUrls && Array.isArray(sku.mediaUrls)) {
        newSkuMediaFiles[index] = sku.mediaUrls.map(url => ({
  url: url.startsWith('http') ? url : `${API_BASE_URL}${url}`,
  type: getFrontendFileType(url),
  id: Date.now() + Math.random() // 👈 tránh bị React lỗi key
}));


        } else {
          newSkuMediaFiles[index] = [];
        }
      });
      setSkuMediaFiles(newSkuMediaFiles);
      setMedia([]);
    } 
    else {
      setMedia([]);
      setSkuMediaFiles({});
    }

    // Xử lý cấu hình productConfiguredVariants
    if (initialHasVariants && Array.isArray(initialProductVariants) && initialProductVariants.length > 0) {
      const variantConfig = initialProductVariants.map(v => ({
        variantTypeId: v.id,
        variantTypeName: v.name,
        applicableValueIds: Array.isArray(v.values) ? v.values.map(val => val.id) : []
      }));
      setProductConfiguredVariants(variantConfig);
    } else if (!initialHasVariants) {
      setProductConfiguredVariants([]);
    }
  }
}, [initialData]); // Chỉ chạy lại khi initialData thay đổi
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        {/* === Left Column: Product Info === */}
        <Grid item xs={12} md={8}>
          <TextField fullWidth label="Tên sản phẩm" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} error={!!formErrors.name} helperText={formErrors.name}  />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Mô tả ngắn</Typography>
          <TinyEditor value={formData.shortDescription} onChange={(val) => setFormData(prev => ({ ...prev, shortDescription: val }))} height={200} />
          
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Thông tin thêm (Chung cho sản phẩm)</Typography>
          <TinyEditor value={infoContent} onChange={setInfoContent} height={250} />
        </Grid>

        {/* === Right Column: Product Meta === */}
        <Grid item xs={12} md={4}>
            <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
            {formErrors.thumbnail && <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>{formErrors.thumbnail}</Typography>}
            
            <TextField select fullWidth label="Danh mục" name="categoryId" value={formData.categoryId} onChange={handleChange} sx={{ mt: 3, mb: 2 }} error={!!formErrors.categoryId} helperText={formErrors.categoryId} >
              <MenuItem value="">-- Chọn danh mục --</MenuItem>
              {renderCategoryOptions(categoryTree)}
            </TextField>
            <TextField select fullWidth label="Thương hiệu" name="brandId" value={formData.brandId} onChange={handleChange} sx={{ mb: 2 }} error={!!formErrors.brandId} helperText={formErrors.brandId} >
              <MenuItem value="">-- Chọn thương hiệu --</MenuItem>
              {brandList.map((brand) => (<MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>))}
            </TextField>
            <TextField fullWidth type="number" label="Thứ tự hiển thị" name="orderIndex" value={formData.orderIndex} onChange={handleChange} sx={{ mb: 1 }} inputProps={{ min: 0 }} error={!!formErrors.orderIndex} helperText={formErrors.orderIndex || 'Số nhỏ hơn sẽ hiển thị trước.'}/>
            <TextField select fullWidth label="Trạng thái" name="isActive" value={formData.isActive ? '1' : '0'} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === '1' }))} sx={{ mt: 2, mb: 2 }}>
              <MenuItem value="1">Hiển thị</MenuItem>
              <MenuItem value="0">Ẩn</MenuItem>
            </TextField>
        </Grid>

        {/* === Variant Toggle & Configuration === */}
        <Grid item xs={12}>
          <FormControlLabel control={<Switch checked={!!formData.hasVariants} onChange={(event) => {
            const newHasVariants = event.target.checked;
            setFormData(prev => {
              let newSkus = [...prev.skus];
              if (newHasVariants) {
                newSkus = prev.skus.length > 0 && !prev.hasVariants 
                    ? [{ ...createEmptySku(), skuCode: prev.skus[0].skuCode }] 
                    : []; 
              } else {
                const baseSkuData = prev.skus.length > 0 ? prev.skus[0] : {}; 
                newSkus = [{ 
                    ...createEmptySku(), 
                    ...baseSkuData, 
                    variantSelections: {}, 
                    variantValueIds: [] 
                }];
                if (prev.skus.length > 0 && skuMediaFiles[0]) { 
                    setMedia(skuMediaFiles[0].map(fileObj => ({...fileObj, id: fileObj.id || Date.now() + Math.random()})));
                } else if (prev.skus.length > 0 && prev.skus[0]?.mediaUrls?.length > 0) { 
                    setMedia(prev.skus[0].mediaUrls.map(url => ({ url, type: getFrontendFileType(url) })));
                } else { 
                    setMedia([]); 
                }
              }
              return { ...prev, hasVariants: newHasVariants, skus: newSkus };
            });
            if (!newHasVariants) { 
                setProductConfiguredVariants([]); 
                setSkuMediaFiles({}); 
            } else { 
                setMedia([]); 
            }
          }} color="primary" />} label="Sản phẩm có biến thể (phiên bản)" />
           <Alert severity={formData.hasVariants ? 'info' : 'success'} sx={{ mt: 1, mb: 2 }}>
            {formData.hasVariants ? 'Sản phẩm có nhiều phiên bản. Mỗi SKU sẽ có mô tả chi tiết, thông số kỹ thuật, và ảnh/video riêng.' : 'Sản phẩm chỉ có một phiên bản. Nhập mô tả chi tiết, thông số kỹ thuật, và ảnh/video cho sản phẩm bên dưới.'}
          </Alert>
        </Grid>

        {formData.hasVariants && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Cấu hình Thuộc tính & Giá trị Áp dụng</Typography>
            {productConfiguredVariants.map((pvc, pvcIndex) => (
              <Box key={`pvc-${pvcIndex}`} sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Grid container spacing={1} alignItems="flex-start">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      select fullWidth label={`Loại thuộc tính ${pvcIndex + 1}`}
                      value={pvc.variantTypeId || ''}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue === ADD_NEW_VARIANT_TYPE_VALUE) {
                          handleOpenAddVariantTypeDialog(pvcIndex);
                        } else {
                          const selectedAV = availableVariants.find((av) => av.id === selectedValue);
                          setProductConfiguredVariants((prev) => {
                            const updated = [...prev];
                            updated[pvcIndex] = {
                              variantTypeId: selectedValue,
                              variantTypeName: selectedAV?.name || '',
                              applicableValueIds: [] 
                            };
                            return updated;
                          });
                        }
                      }}
                      size="small"
                    >
                      <MenuItem value="">-- Chọn loại thuộc tính --</MenuItem>
                      {availableVariants.map((av) => (
                        <MenuItem key={av.id} value={av.id}
                          disabled={productConfiguredVariants.some((item, index) => index !== pvcIndex && item.variantTypeId === av.id)}
                        >{av.name}</MenuItem>
                      ))}
                      <MenuItem value={ADD_NEW_VARIANT_TYPE_VALUE} dense sx={{color: "primary.main", fontStyle: "italic", display: 'flex', alignItems: 'center'}}>
                        <AddCircleOutlineIcon fontSize="small" sx={{mr:0.5}}/> Tạo loại thuộc tính mới...
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {pvc.variantTypeId && (
                      <FormControl fullWidth size="small">
                        <InputLabel id={`select-values-label-${pvcIndex}`}>Chọn các giá trị sẽ dùng</InputLabel>
                        <Select
                          labelId={`select-values-label-${pvcIndex}`} label="Chọn các giá trị sẽ dùng"
                          multiple value={pvc.applicableValueIds}
                          onChange={(e) => {
                            let newSelectedValueIds = e.target.value;
                            if (!Array.isArray(newSelectedValueIds)) { newSelectedValueIds = [newSelectedValueIds];}
                            const actionItemIndex = newSelectedValueIds.indexOf(`add_new_value_for_${pvc.variantTypeId}`);
                            if (actionItemIndex > -1) {
                              newSelectedValueIds.splice(actionItemIndex, 1); 
                              const currentType = availableVariants.find(av_1 => av_1.id === pvc.variantTypeId);
                              if(currentType) handleOpenAddVariantValueDialog(currentType, pvcIndex);
                            }
                             setProductConfiguredVariants((prev_1) => {
                                const updated_1 = [...prev_1];
                                updated_1[pvcIndex].applicableValueIds = newSelectedValueIds.filter(Boolean);
                                return updated_1;
                              });
                          }}
                          renderValue={(selectedIds) => {
                            const selectedAV_1 = availableVariants.find((av_2) => av_2.id === pvc.variantTypeId);
                            if (!selectedAV_1?.values) return '';
                            return selectedIds.map((id) => selectedAV_1.values.find((val) => val.id === id)?.value).filter(Boolean).join(', ');
                          }}
                        >
                          {(availableVariants.find((av_3) => av_3.id === pvc.variantTypeId)?.values || []).map((valOpt) => (
                            <MenuItem key={valOpt.id} value={valOpt.id}>
                              <Checkbox checked={pvc.applicableValueIds.includes(valOpt.id)} size="small"/>
                              <ListItemText primary={valOpt.value} />
                            </MenuItem>
                          ))}
                          <MenuItem value={`add_new_value_for_${pvc.variantTypeId}`} dense sx={{color: "primary.main", fontStyle: "italic", display: 'flex', alignItems: 'center'}}>
                              <AddCircleOutlineIcon fontSize="small" sx={{mr:0.5}}/> Thêm giá trị mới...
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                    <IconButton onClick={() => setProductConfiguredVariants((prev_2) => prev_2.filter((_, i) => i !== pvcIndex))}
                      color="error" aria-label="Xóa dòng cấu hình thuộc tính này"
                        disabled={productConfiguredVariants.length === 1 && !pvc.variantTypeId && pvc.applicableValueIds.length === 0 }
                    > <DeleteIcon /> </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button variant="outlined"
              onClick={() => setProductConfiguredVariants((prev_3) => [...prev_3, { variantTypeId: '', variantTypeName: '', applicableValueIds: [] }])}
              disabled={availableVariants.length > 0 && productConfiguredVariants.length >= availableVariants.length}
            > + Thêm dòng cấu hình thuộc tính </Button>
          </Grid>
        )}

        {/* === SKU List Section === */}
        <Grid item xs={12}>
            {!formData.hasVariants && formData.skus[0] && (
             <Box key={`sku-item-novariant-0`} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, background: '#fff' }}>
                <Typography variant="h6" gutterBottom>Thông tin Sản phẩm / SKU</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Mã SKU (Sản phẩm)" value={formData.skus[0].skuCode || ''} onChange={(e) => handleSkuChange(0, 'skuCode', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.skuCode} helperText={formErrors.skus?.[0]?.skuCode || 'Bắt buộc'}  /></Grid>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Giá gốc" value={formData.skus[0].originalPrice || ''} onChange={(e) => handleSkuChange(0, 'originalPrice', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.originalPrice} helperText={formErrors.skus?.[0]?.originalPrice || 'Bắt buộc, phải lớn hơn 0'} InputProps={{ inputProps: { min: 0 } }}  /></Grid>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Giá bán" value={formData.skus[0].price || ''} onChange={(e) => handleSkuChange(0, 'price', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.price} helperText={formErrors.skus?.[0]?.price} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Tồn kho" value={formData.skus[0].stock || ''} onChange={(e) => handleSkuChange(0, 'stock', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.stock} helperText={formErrors.skus?.[0]?.stock || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }}  /></Grid>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Rộng (cm)" value={formData.skus[0].width || ''} onChange={(e) => handleSkuChange(0, 'width', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.width} helperText={formErrors.skus?.[0]?.width || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Cao (cm)" value={formData.skus[0].height || ''} onChange={(e) => handleSkuChange(0, 'height', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.height} helperText={formErrors.skus?.[0]?.height || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Dài (cm)" value={formData.skus[0].length || ''} onChange={(e) => handleSkuChange(0, 'length', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.length} helperText={formErrors.skus?.[0]?.length || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                  <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Nặng (kg)" value={formData.skus[0].weight || ''} onChange={(e) => handleSkuChange(0, 'weight', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[0]?.weight} helperText={formErrors.skus?.[0]?.weight || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                  
                  <Grid item xs={12}><Typography variant="subtitle1" sx={{ mb: 1 }}>Ảnh/Video sản phẩm</Typography>
                    <MediaUpload files={media} onChange={setMedia} />
                    {formErrors.skus?.[0]?.mediaUrls && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{formErrors.skus[0].mediaUrls}</Typography>}
                    {formErrors.media && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{formErrors.media}</Typography>}
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 1, pt: 2, borderTop: '1px dashed #ddd' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Mô tả chi tiết sản phẩm</Typography>
                    <TinyEditor value={formData.skus[0].description || ''} onChange={(val) => handleSkuChange(0, 'description', val)} height={300} />
                    {formErrors.skus?.[0]?.description && <Typography color="error" variant="caption">{formErrors.skus[0].description}</Typography>}
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 1, pt: 2, borderTop: '1px dashed #ddd' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Thông số kỹ thuật sản phẩm</Typography>
                    {(formData.skus[0].specs || []).map((spec, specIndex) => (
                      <Box key={`sku-0-spec-${specIndex}`} sx={{ p: 1.5, border: '1px dashed #eee', borderRadius: 0.5, mb: 1.5, background: '#fdfdfd' }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={12} sm={4}><TextField fullWidth label="Tên thông số" value={spec.key} onChange={(e) => handleSkuSpecChange(0, specIndex, 'key', e.target.value)} size="small" error={!!formErrors.skus?.[0]?.specs?.[specIndex]?.key} helperText={formErrors.skus?.[0]?.specs?.[specIndex]?.key} /></Grid>
                          <Grid item xs={12} sm={4}><TextField fullWidth label="Giá trị" value={spec.value} onChange={(e) => handleSkuSpecChange(0, specIndex, 'value', e.target.value)} size="small" error={!!formErrors.skus?.[0]?.specs?.[specIndex]?.value} helperText={formErrors.skus?.[0]?.specs?.[specIndex]?.value} /></Grid>
                          <Grid item xs={12} sm={3}><TextField fullWidth type="number" label="Thứ tự" value={spec.sortOrder || 0} onChange={(e) => handleSkuSpecChange(0, specIndex, 'sortOrder', e.target.value)} size="small" InputProps={{ inputProps: { min: 0 } }} /></Grid>
                          <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}><IconButton onClick={() => removeSkuSpec(0, specIndex)} color="error" aria-label="Xóa thông số"><DeleteIcon /></IconButton></Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Button variant="outlined" onClick={() => addSkuSpec(0)} startIcon={<AddCircleOutlineIcon />} size="small">Thêm thông số</Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {formData.hasVariants && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, display: productConfiguredVariants.length > 0 ? 'block' : 'none' }}>Danh sách các Phiên bản (SKU)</Typography>
                <Tooltip title={!canManageVariantSkus ? "Hoàn tất cấu hình các loại thuộc tính và chọn giá trị cho chúng trước khi thêm SKU." : "Thêm phiên bản sản phẩm mới"}>
                  <span>
                    <Button onClick={addSku} variant="outlined" sx={{ mb: 2, mt: productConfiguredVariants.length === 0 ? 2 : 0, display: productConfiguredVariants.length > 0 ? 'inline-flex' : 'none' }}
                      disabled={!canManageVariantSkus || formData.skus.length >= 50} > + Thêm Phiên bản (SKU) </Button>
                  </span>
                </Tooltip>
                {!canManageVariantSkus && productConfiguredVariants.length > 0 && productConfiguredVariants.some(pvc => !pvc.variantTypeId || pvc.applicableValueIds.length === 0) && (
                  <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>Vui lòng chọn đầy đủ thông tin cho tất cả các loại thuộc tính đã thêm để có thể tạo SKU.</Alert>
                )}

                {canManageVariantSkus && formData.skus.map((sku, i) => (
                  <Box key={`sku-item-variant-${i}`} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, background: i % 2 ? '#fafafa' : '#fff' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      Chi tiết cho Phiên bản {i + 1}
                      <IconButton size="small" color="error" onClick={() => {
                        setFormData((prev) => ({ ...prev, skus: prev.skus.filter((_, si) => si !== i) }));
                        setSkuMediaFiles(prevSkuMedia => { const newSkuMedia = {...prevSkuMedia}; delete newSkuMedia[i]; return newSkuMedia; });
                      }} aria-label={`Xóa Phiên bản ${i + 1}`} > <DeleteIcon /> </IconButton>
                    </Typography>
                    <Grid container spacing={2}>
                        {productConfiguredVariants.filter(pvc => pvc.variantTypeId && pvc.applicableValueIds.length > 0).map((pvc) => (
                            <Grid item xs={12} sm={6} md={4} key={pvc.variantTypeId}>
                                <TextField
                                    select
                                    fullWidth
                                    label={pvc.variantTypeName}
                                    value={sku.variantSelections?.[pvc.variantTypeId] || ''}
                                    onChange={(e) => {
                                        const newSelections = { ...sku.variantSelections, [pvc.variantTypeId]: e.target.value };
                                        handleSkuChange(i, 'variantSelections', newSelections);
                                    }}
                                    sx={{ mb: 2 }}
                                    error={!!formErrors.skus?.[i]?.variantSelections?.[pvc.variantTypeId]}
                                    helperText={formErrors.skus?.[i]?.variantSelections?.[pvc.variantTypeId]}
                                >
                                    <MenuItem value="">-- Chọn {pvc.variantTypeName} --</MenuItem>
                                    {availableVariants.find(av => av.id === pvc.variantTypeId)?.values
                                        .filter(val => pvc.applicableValueIds.includes(val.id))
                                        .map(valOpt => (
                                            <MenuItem key={valOpt.id} value={valOpt.id}>{valOpt.value}</MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                        ))}
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Mã SKU" value={sku.skuCode || ''} onChange={(e) => handleSkuChange(i, 'skuCode', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.skuCode} helperText={formErrors.skus?.[i]?.skuCode || 'Bắt buộc'} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Giá gốc" value={sku.originalPrice || ''} onChange={(e) => handleSkuChange(i, 'originalPrice', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.originalPrice} helperText={formErrors.skus?.[i]?.originalPrice || 'Bắt buộc, phải lớn hơn 0'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Giá bán" value={sku.price || ''} onChange={(e) => handleSkuChange(i, 'price', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.price} helperText={formErrors.skus?.[i]?.price} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Tồn kho" value={sku.stock || ''} onChange={(e) => handleSkuChange(i, 'stock', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.stock} helperText={formErrors.skus?.[i]?.stock || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Rộng (cm)" value={sku.width || ''} onChange={(e) => handleSkuChange(i, 'width', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.width} helperText={formErrors.skus?.[i]?.width || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Cao (cm)" value={sku.height || ''} onChange={(e) => handleSkuChange(i, 'height', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.height} helperText={formErrors.skus?.[i]?.height || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Dài (cm)" value={sku.length || ''} onChange={(e) => handleSkuChange(i, 'length', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.length} helperText={formErrors.skus?.[i]?.length || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                      <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Nặng (kg)" value={sku.weight || ''} onChange={(e) => handleSkuChange(i, 'weight', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.weight} helperText={formErrors.skus?.[i]?.weight || 'Bắt buộc, số không âm'} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                      
                      <Grid item xs={12}><Typography variant="subtitle2" sx={{ mb: 1 }}>Ảnh/Video cho phiên bản này (SKU {i+1})</Typography>
                      <MediaUpload
  key={`sku-media-${i}`} // 👈 Bắt buộc thêm key để react nhận diện
  files={skuMediaFiles?.[i]?.map((file) => ({
    ...file,
    url: file.url?.startsWith('http') ? file.url : `${API_BASE_URL}${file.url}`,
    type: file.type || getFrontendFileType(file.url)
  })) || []}
  onChange={(files) => handleMediaChangeForVariantSku(i, files)}
/>

                        {formErrors.skus?.[i]?.mediaUrls && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{formErrors.skus[i].mediaUrls}</Typography>}
                      </Grid>

                      <Grid item xs={12} sx={{ mt: 1, pt: 2, borderTop: '1px dashed #ddd' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>Mô tả chi tiết (cho Phiên bản {i + 1})</Typography>
                        <TinyEditor value={sku.description || ''} onChange={(val) => handleSkuChange(i, 'description', val)} height={250} />
                        {formErrors.skus?.[i]?.description && <Typography color="error" variant="caption">{formErrors.skus[i].description}</Typography>}
                      </Grid>

                      <Grid item xs={12} sx={{ mt: 1, pt: 2, borderTop: '1px dashed #ddd' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>Thông số kỹ thuật (cho Phiên bản {i + 1})</Typography>
                        {(sku.specs || []).map((spec, specIndex) => (
                          <Box key={`sku-${i}-spec-${specIndex}`} sx={{ p: 1.5, border: '1px dashed #eee', borderRadius: 0.5, mb: 1.5, background: '#fdfdfd' }}>
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={12} sm={4}><TextField fullWidth label="Tên thông số" value={spec.key} onChange={(e) => handleSkuSpecChange(i, specIndex, 'key', e.target.value)} size="small" error={!!formErrors.skus?.[i]?.specs?.[specIndex]?.key} helperText={formErrors.skus?.[i]?.specs?.[specIndex]?.key}/></Grid>
                                <Grid item xs={12} sm={4}><TextField fullWidth label="Giá trị" value={spec.value} onChange={(e) => handleSkuSpecChange(i, specIndex, 'value', e.target.value)} size="small" error={!!formErrors.skus?.[i]?.specs?.[specIndex]?.value} helperText={formErrors.skus?.[i]?.specs?.[specIndex]?.value}/></Grid>
                                <Grid item xs={12} sm={3}><TextField fullWidth type="number" label="Thứ tự" value={spec.sortOrder || 0} onChange={(e) => handleSkuSpecChange(i, specIndex, 'sortOrder', e.target.value)} size="small" InputProps={{ inputProps: { min: 0 } }} /></Grid>
                                <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}><IconButton onClick={() => removeSkuSpec(i, specIndex)} color="error" aria-label="Xóa thông số"><DeleteIcon /></IconButton></Grid>
                              </Grid>
                          </Box>
                        ))}
                        <Button variant="outlined" onClick={() => addSkuSpec(i)} startIcon={<AddCircleOutlineIcon />} size="small">Thêm thông số</Button>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </>
            )}
        </Grid>

        <Grid item xs={12} sx={{mt: 4}}>
          <Button type="submit" variant="contained" color="primary" size="large">Lưu sản phẩm</Button>
          {formErrors.form && (<Alert severity="error" sx={{ mt: 2 }}>{formErrors.form}</Alert>)}
        </Grid>
      </Grid>

      <Dialog open={isAddVariantTypeDialogOpen} onClose={handleCloseAddVariantTypeDialog} maxWidth="xs" fullWidth disableRestoreFocus>
        <DialogTitle>Tạo Loại Thuộc Tính Mới</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb:2}}>Nhập tên cho loại thuộc tính mới (ví dụ: Chất liệu, Phiên bản, Dung lượng).</DialogContentText>
          <TextField autoFocus margin="dense" id="new-variant-type-name" label="Tên loại thuộc tính" type="text" fullWidth variant="outlined" value={newVariantTypeNameInput} onChange={(e) => setNewVariantTypeNameInput(e.target.value)} error={!!variantTypeDialogError} helperText={variantTypeDialogError}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddVariantTypeDialog} disabled={isSavingVariantType}>Hủy</Button>
          <Button onClick={handleSaveNewVariantType} variant="contained" disabled={isSavingVariantType}>
            {isSavingVariantType ? <CircularProgress size={24} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {currentVariantTypeForNewValue && (
        <Dialog open={isAddVariantValueDialogOpen} onClose={handleCloseAddVariantValueDialog} maxWidth="xs" fullWidth disableRestoreFocus>
          <DialogTitle>Thêm Giá Trị Mới cho "{currentVariantTypeForNewValue.name}"</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{mb:2}}>Nhập giá trị mới (ví dụ: nếu loại là "Màu sắc", nhập "Tím"; nếu là "Kích thước", nhập "XXL").</DialogContentText>
            <TextField autoFocus margin="dense" id="new-variant-value" label="Tên giá trị mới" type="text" fullWidth variant="outlined" value={newVariantValueInput} onChange={(e) => setNewVariantValueInput(e.target.value)} error={!!variantValueDialogError} helperText={variantValueDialogError}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddVariantValueDialog} disabled={isSavingVariantValue}>Hủy</Button>
            <Button onClick={handleSaveNewVariantValue} variant="contained" disabled={isSavingVariantValue}>
              {isSavingVariantValue ? <CircularProgress size={24} /> : "Lưu"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </form>
  );
};

export default ProductForm;