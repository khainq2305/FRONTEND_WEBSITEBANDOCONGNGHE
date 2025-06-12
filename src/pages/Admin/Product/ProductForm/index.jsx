import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Tooltip,
  FormHelperText
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
// và các import khác của bạn
import ThumbnailUpload from '../ThumbnailUpload';
import MediaUpload from '../MediaUpload';
import TinyEditor from '../../../../components/Admin/TinyEditor';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { variantService } from '../../../../services/admin/variantService';
import { productService } from '../../../../services/admin/productService';
import { variantValueService } from '../../../../services/admin/variantValueService';
import { API_BASE_URL } from '../../../../constants/environment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
    description: '', // <-- Mô tả chi tiết giờ là thuộc tính của sản phẩm
    thumbnail: '',
    orderIndex: 0,
    isActive: true,
    hasVariants: false,
    categoryId: '',
    brandId: '',
    variants: [],
    skus: [],
    productSpecs: [{ key: '', specGroup: '', value: '', sortOrder: 0 }]
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

  const LOCAL_STORAGE_KEY = 'product_form_draft';
  const MAX_DISPLAY_MEDIA_ERRORS = 2;

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

  const handleOnDragEndProductSpecs = (result) => {
    if (!result.destination) return;

    const items = Array.from(formData.productSpecs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSpecsWithSortOrder = items.map((spec, index) => ({
      ...spec,
      sortOrder: index
    }));

    setFormData((prev) => ({
      ...prev,
      productSpecs: updatedSpecsWithSortOrder
    }));
  };

  const createEmptySku = () => ({
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
    // <-- Đã xóa description khỏi đây
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft && !initialData) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData) {
          setFormData((prev) => ({
            ...prev,
            ...parsed.formData,
            productSpecs:
              Array.isArray(parsed.formData.productSpecs) && parsed.formData.productSpecs.length > 0
                ? parsed.formData.productSpecs
                : [{ key: '', value: '', sortOrder: 0 }]
          }));
        }
        setThumbnail(parsed.thumbnail || null);
        setMedia(parsed.media || []);
        setSkuMediaFiles(parsed.skuMediaFiles || {});
        setInfoContent(parsed.infoContent || '');
        setProductConfiguredVariants(parsed.productConfiguredVariants || []);
      } catch (err) {
        console.error('Lỗi khi đọc bản nháp localStorage:', err);
      }
    }
  }, [initialData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!initialData) {
        const dataToSave = {
          formData,
          thumbnail,
          media,
          skuMediaFiles,
          infoContent,
          productConfiguredVariants
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, thumbnail, media, skuMediaFiles, infoContent, productConfiguredVariants, initialData]);

  useEffect(() => {
    if (!formData.hasVariants && formData.skus.length === 0) {
      setFormData((prev) => ({ ...prev, skus: [createEmptySku()] }));
    }
  }, [formData.hasVariants, formData.skus.length]);

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
              const targetIndex = pvcIndex === -1 ? (prev.length > 0 ? prev.length - 1 : 0) : pvcIndex;
              if (updated[targetIndex] && prev.length > 0) {
                updated[targetIndex] = {
                  ...updated[targetIndex],
                  variantTypeId: newType.id,
                  variantTypeName: newType.name,
                  applicableValueIds: []
                };
              } else {
                updated.push({ variantTypeId: newType.id, variantTypeName: newType.name, applicableValueIds: [] });
              }
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
      setFormErrors((prev) => ({ ...prev, form: 'Không thể tải danh sách thuộc tính.' }));
    } finally {
      setIsSavingVariantType(false);
      setIsSavingVariantValue(false);
    }
  }, []);
  const availableSpecGroups = useMemo(() => {
    // Lọc những specGroup không rỗng, rồi lấy duy nhất
    return Array.from(new Set(formData.productSpecs.map((s) => s.specGroup && s.specGroup.trim()).filter(Boolean)));
  }, [formData.productSpecs]);

  useEffect(() => {
    if (formData.hasVariants) {
      fetchAvailableVariants();
    } else {
      setProductConfiguredVariants([]);
    }
  }, [formData.hasVariants, fetchAvailableVariants]);

  useEffect(() => {
    if (initialData?.hasVariants && availableVariants.length > 0 && initialData?.variants?.length > 0) {
      setProductConfiguredVariants((prev) => {
        if (prev.length > 0) return prev;
        const variantConfig = initialData.variants.map((v) => ({
          variantTypeId: v.id,
          variantTypeName: v.name,
          applicableValueIds: Array.isArray(v.values) ? v.values.map((val) => val.id) : []
        }));
        return variantConfig;
      });
    }
  }, [initialData, availableVariants]);

  useEffect(() => {
    if (thumbnail?.url && typeof thumbnail.url === 'string' && !thumbnail.url.startsWith('blob:')) {
      setFormData((prev) => ({ ...prev, thumbnail: thumbnail.url }));
    } else if (!thumbnail && formData.thumbnail) {
      setFormData((prev) => ({ ...prev, thumbnail: '' }));
    }
  }, [thumbnail, formData.thumbnail]);

  useEffect(() => {
    if (!formData.hasVariants && formData.skus.length > 0 && formData.skus[0]) {
      const urls = media.map((m) => (m.url && typeof m.url === 'string' && !m.url.startsWith('blob:') ? m.url : null)).filter(Boolean);
      if (JSON.stringify(formData.skus[0].mediaUrls || []) !== JSON.stringify(urls)) {
        handleSkuChange(0, 'mediaUrls', urls);
      }
    }
  }, [media, formData.hasVariants, formData.skus]);

  useEffect(() => {
    if (
      !formData.hasVariants &&
      formData.name &&
      formData.skus.length === 1 &&
      formData.skus[0] &&
      !(formData.skus[0].skuCode || '').trim()
    ) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      handleSkuChange(0, 'skuCode', `${slug}-sku`);
    }
  }, [formData.name, formData.hasVariants, formData.skus]);

  const handleMediaChangeForVariantSku = (skuIndex, files) => {
    const newSkuMediaFiles = { ...skuMediaFiles, [skuIndex]: files };
    setSkuMediaFiles(newSkuMediaFiles);
    const urls = files.map((f) => (f.url && typeof f.url === 'string' && !f.url.startsWith('blob:') ? f.url : null)).filter(Boolean);
    handleSkuChange(skuIndex, 'mediaUrls', urls);
  };

  useEffect(() => {
    productService
      .getCategoryTree()
      .then((res) => setCategoryTree(res.data.data || []))
      .catch((err) => console.error('Error fetching category tree:', err));
    productService
      .getBrandList()
      .then((res) => setBrandList(res.data.data || []))
      .catch((err) => console.error('Error fetching brand list:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const renderCategoryOptions = (categories, level = 0) => {
    let options = [];
    categories.forEach((cat, idx) => {
      const isLast = idx === categories.length - 1;
      const verticalBars = Array(level).fill('│   ').join('');
      const branchChar = level === 0 ? '' : isLast ? '└── ' : '├── ';
      const prefix = verticalBars + branchChar;

      options.push(
        <MenuItem key={cat.id} value={cat.id} style={{ paddingLeft: `${level * 16 + 8}px` }}>
          {prefix}
          {cat.name}
        </MenuItem>
      );

      if (Array.isArray(cat.children) && cat.children.length > 0) {
        options = options.concat(renderCategoryOptions(cat.children, level + 1));
      }
    });
    return options;
  };

  const handleSkuChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedSkus = [...prev.skus];
      if (updatedSkus[index]) {
        updatedSkus[index] = { ...updatedSkus[index], [key]: value };
      } else if (index === 0 && !prev.hasVariants && !updatedSkus[0]) {
        updatedSkus[0] = { ...createEmptySku(), [key]: value };
      }
      return { ...prev, skus: updatedSkus };
    });
  };

  const addSku = () => {
    if (!formData.hasVariants && formData.skus.length >= 1) return;
    if (formData.hasVariants && !canManageVariantSkus) {
      setFormErrors((prev) => ({ ...prev, form: 'Hoàn tất cấu hình các loại thuộc tính và chọn giá trị cho chúng trước khi thêm SKU.' }));
      return;
    }
    setFormData((prev) => ({ ...prev, skus: [...prev.skus, createEmptySku()] }));
  };

  const handleOpenAddVariantTypeDialog = (pvcIndex) => {
    setIsAddVariantTypeDialogOpen(true);
    setTargetPvcIndexForNewType(pvcIndex);
  };
  const handleCloseAddVariantTypeDialog = () => {
    setIsAddVariantTypeDialogOpen(false);
    setNewVariantTypeNameInput('');
    setVariantTypeDialogError('');
    setTargetPvcIndexForNewType(null);
  };
  const handleSaveNewVariantType = async () => {
    if (!newVariantTypeNameInput.trim()) {
      setVariantTypeDialogError('Tên loại thuộc tính không được để trống.');
      return;
    }
    setIsSavingVariantType(true);
    setVariantTypeDialogError('');
    try {
      const res = await variantService.createVariantType({ name: newVariantTypeNameInput.trim() });
      const newVariantType = res.data.data;
      await fetchAvailableVariants({ type: 'variantType', id: newVariantType.id, pvcIndex: targetPvcIndexForNewType });
      handleCloseAddVariantTypeDialog();
    } catch (error) {
      console.error('Lỗi lưu loại thuộc tính mới:', error);
      setVariantTypeDialogError(error.response?.data?.message || 'Lỗi lưu loại thuộc tính.');
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
    setCurrentVariantTypeForNewValue(null);
    setVariantValueDialogError('');
    setTargetPvcIndexForNewValue(null);
  };
  const handleSaveNewVariantValue = async () => {
    if (!newVariantValueInput.trim()) {
      setVariantValueDialogError('Tên giá trị không được để trống.');
      return;
    }
    if (!currentVariantTypeForNewValue || !currentVariantTypeForNewValue.id) {
      setVariantValueDialogError('Không xác định được loại thuộc tính.');
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
      await fetchAvailableVariants({
        type: 'variantValue',
        id: newVariantValue.id,
        pvcIndex: targetPvcIndexForNewValue,
        variantTypeIdForNewValue: currentVariantTypeForNewValue.id
      });
      handleCloseAddVariantValueDialog();
    } catch (error) {
      console.error('Lỗi lưu giá trị thuộc tính mới:', error);
      setVariantValueDialogError(error.response?.data?.message || 'Lỗi lưu giá trị thuộc tính.');
    } finally {
      setIsSavingVariantValue(false);
    }
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
      const currentSpecs = Array.isArray(prev.productSpecs) ? prev.productSpecs : [];
      return {
        ...prev,
        productSpecs: [
          ...currentSpecs,
          {
            key: '',
            value: '',
            sortOrder: currentSpecs.length > 0 ? Math.max(0, ...currentSpecs.map((s) => Number(s.sortOrder || 0))) + 1 : 0
          }
        ]
      };
    });
  };

  const removeProductSpec = (specIndex) => {
    setFormData((prev) => {
      const updatedProductSpecs = (Array.isArray(prev.productSpecs) ? prev.productSpecs : []).filter((_, i) => i !== specIndex);
      if (updatedProductSpecs.length === 0) {
        return { ...prev, productSpecs: [{ key: '', value: '', sortOrder: 0 }] };
      }
      return { ...prev, productSpecs: updatedProductSpecs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Chuẩn bị payload dạng JSON để gửi đi
    const payloadForJson = {
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      thumbnail: '', // Sẽ được xử lý riêng bên dưới
      orderIndex: formData.orderIndex === '' || isNaN(Number(formData.orderIndex)) ? '' : parseInt(formData.orderIndex, 10),
      isActive: formData.isActive,
      hasVariants: formData.hasVariants,
      categoryId: formData.categoryId === '' ? '' : Number(formData.categoryId),
      brandId: formData.brandId === '' ? '' : Number(formData.brandId),
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

    // Xử lý 'variants' nếu sản phẩm có biến thể
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

    // Xử lý 'skus' - đây là nguồn dữ liệu chính xác cho các URL media cũ
    payloadForJson.skus = formData.skus.map((sku) => ({
      id: sku.id, // ✅ ADD THIS LINE
      skuCode: String(sku.skuCode || '').trim(),
      originalPrice:
        sku.originalPrice == null || sku.originalPrice === '' ? '' : isNaN(Number(sku.originalPrice)) ? '' : Number(sku.originalPrice),
      price: sku.price == null || sku.price === '' ? '' : isNaN(Number(sku.price)) ? '' : Number(sku.price),
      stock: sku.stock == null || sku.stock === '' ? '' : isNaN(Number(sku.stock)) ? '' : Number(sku.stock),
      height: sku.height == null || sku.height === '' ? '' : isNaN(Number(sku.height)) ? '' : Number(sku.height),
      width: sku.width == null || sku.width === '' ? '' : isNaN(Number(sku.width)) ? '' : Number(sku.width),
      length: sku.length == null || sku.length === '' ? '' : isNaN(Number(sku.length)) ? '' : Number(sku.length),
      weight: sku.weight == null || sku.weight === '' ? '' : isNaN(Number(sku.weight)) ? '' : Number(sku.weight),
      mediaUrls: sku.mediaUrls || [], // URL cũ đã có ở đây
      variantValueIds: formData.hasVariants
        ? sku.variantSelections
          ? Object.values(sku.variantSelections)
              .filter((vId) => vId !== '' && vId != null)
              .map(Number)
          : []
        : []
    }));

    // Tạo đối tượng FormData để chứa cả JSON và file
    const finalPayload = new FormData();

    // Xử lý thumbnail
    if (thumbnail?.file instanceof File) {
      finalPayload.append('thumbnail', thumbnail.file);
    } else if (typeof formData.thumbnail === 'string' && formData.thumbnail && !formData.thumbnail.startsWith('blob:')) {
      payloadForJson.thumbnail = formData.thumbnail;
    }

    // --- PHẦN ĐÃ SỬA LỖI ---
    // Giờ đây chỉ append file mới, không push lại url cũ

    // 1. Xử lý cho sản phẩm không có biến thể
    if (!formData.hasVariants && media.length > 0) {
      media.forEach((m) => {
        // Chỉ xử lý và gửi lên file mới
        if (m.file instanceof File) {
          finalPayload.append(`media_sku_0`, m.file, m.file.name);
        }
      });
    }
    // 2. Xử lý cho sản phẩm có biến thể
    else if (formData.hasVariants) {
      formData.skus.forEach((sku, skuIndex) => {
        const filesForThisSku = skuMediaFiles[skuIndex] || [];
        filesForThisSku.forEach((item) => {
          // Chỉ xử lý và gửi lên file mới cho từng SKU
          if (item.file instanceof File) {
            finalPayload.append(`media_sku_${skuIndex}`, item.file, item.file.name);
          }
        });
      });
    }

    // Gắn chuỗi JSON vào payload cuối cùng
    finalPayload.append('product', JSON.stringify(payloadForJson));

    // Gửi dữ liệu đi và xử lý kết quả/lỗi
    try {
      await onSubmit(finalPayload);
      if (!initialData) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (err) {
      const errorsObjInner = {
        form: 'Vui lòng nhập đầy đủ và chính xác các thông tin bắt buộc.'
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
      }
      setFormErrors(errorsObjInner);
    }
  };

  const canManageVariantSkus =
    formData.hasVariants &&
    productConfiguredVariants.length > 0 &&
    productConfiguredVariants.every((pvc) => pvc.variantTypeId && pvc.applicableValueIds.length > 0);

  useEffect(() => {
    if (initialData) {
      const {
        name: initialName,
        shortDescription: initialShortDescription,
        description: initialDescription, // <-- Lấy description chính
        thumbnail: initialProductThumbnail,
        orderIndex: initialOrderIndex,
        isActive: initialIsActive,
        hasVariants: initialHasVariants,
        categoryId: initialCategoryId,
        brandId: initialBrandId,
        infoContent: initialInfoContent,
        variants: initialProductVariantsData,
        skus: initialProductSkusFromBackend,
        specs: initialProductSpecs
      } = initialData;

      const processedSkus = (initialProductSkusFromBackend || []).map((backendSku) => {
        const frontendSkuStructure = createEmptySku();
        return {
          ...frontendSkuStructure,
          id: backendSku.id,
          skuCode: backendSku.skuCode,
          originalPrice: backendSku.originalPrice,
          price: backendSku.price,
          stock: backendSku.stock,
          height: backendSku.height,
          width: backendSku.width,
          length: backendSku.length,
          weight: backendSku.weight,
          variantSelections: backendSku.selectedValues || {},
          mediaUrls: backendSku.mediaUrls || [],
          variantValueIds: backendSku.variantValueIds || []
          // <-- Không còn description ở đây
        };
      });

      setFormData({
        name: initialName || '',
        shortDescription: initialShortDescription || '',
        description: initialDescription || '', // <-- Set description chính
        thumbnail: initialProductThumbnail || '',
        orderIndex: initialOrderIndex ?? 0,
        isActive: initialIsActive === undefined ? true : !!initialIsActive,
        hasVariants: !!initialHasVariants,
        categoryId: initialCategoryId?.toString() || '',
        brandId: initialBrandId?.toString() || '',
        variants: initialProductVariantsData || [],
        skus: processedSkus,
        productSpecs:
          initialProductSpecs && initialProductSpecs.length > 0
            ? initialProductSpecs.map((s) => ({
                key: s.key || '',
                specGroup: s.specGroup || '',
                value: s.value || '',
                sortOrder: s.sortOrder || 0
              }))
            : [{ key: '', value: '', sortOrder: 0 }]
      });

      setThumbnail(
        initialProductThumbnail
          ? {
              url:
                initialProductThumbnail.startsWith('http') || initialProductThumbnail.startsWith('blob:')
                  ? initialProductThumbnail
                  : `${API_BASE_URL}${initialProductThumbnail}`
            }
          : null
      );
      setInfoContent(initialInfoContent || '');

      if (!initialHasVariants && processedSkus.length > 0 && processedSkus[0]) {
        const mediaUrls = processedSkus[0].mediaUrls;
        setMedia(
          Array.isArray(mediaUrls)
            ? mediaUrls.map((url) => ({
                url: url.startsWith('http') || url.startsWith('blob:') ? url : `${API_BASE_URL}${url}`,
                type: getFrontendFileType(url),
                id: Date.now() + Math.random()
              }))
            : []
        );
        setSkuMediaFiles({});
      } else if (initialHasVariants && processedSkus.length > 0) {
        const newSkuMediaFiles = {};
        processedSkus.forEach((sku, index) => {
          if (sku.mediaUrls && Array.isArray(sku.mediaUrls)) {
            newSkuMediaFiles[index] = sku.mediaUrls.map((url) => ({
              url: url.startsWith('http') || url.startsWith('blob:') ? url : `${API_BASE_URL}${url}`,
              type: getFrontendFileType(url),
              id: Date.now() + Math.random()
            }));
          } else {
            newSkuMediaFiles[index] = [];
          }
        });
        setSkuMediaFiles(newSkuMediaFiles);
        setMedia([]);
      } else {
        setMedia([]);
        setSkuMediaFiles({});
      }

      if (initialHasVariants && Array.isArray(initialProductVariantsData) && initialProductVariantsData.length > 0) {
        const variantConfig = initialProductVariantsData.map((v) => ({
          variantTypeId: v.id,
          variantTypeName: v.name,
          applicableValueIds: Array.isArray(v.values) ? v.values.map((val) => val.id) : []
        }));
        setProductConfiguredVariants(variantConfig);
      } else if (!initialHasVariants) {
        setProductConfiguredVariants([]);
      }
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Thông tin thêm
          </Typography>
          <TinyEditor value={infoContent} onChange={setInfoContent} height={250} />

          {/* --- MÔ TẢ CHI TIẾT ĐÃ ĐƯỢC DỜI LÊN ĐÂY --- */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Mô tả chi tiết
          </Typography>
          <TinyEditor
            value={formData.description}
            onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))}
            height={400}
          />
          {formErrors.description && <FormHelperText error>{formErrors.description}</FormHelperText>}
        </Grid>

        <Grid item xs={12} md={4}>
          <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
          {formErrors.thumbnail && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              {formErrors.thumbnail}
            </Typography>
          )}

          <TextField
            select
            fullWidth
            label="Danh mục"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            sx={{ mt: 3, mb: 2 }}
            error={!!formErrors.categoryId}
            helperText={formErrors.categoryId}
          >
            <MenuItem value="">-- Chọn danh mục --</MenuItem>
            {renderCategoryOptions(categoryTree)}
          </TextField>
          <TextField
            select
            fullWidth
            label="Thương hiệu"
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!formErrors.brandId}
            helperText={formErrors.brandId}
          >
            <MenuItem value="">-- Chọn thương hiệu --</MenuItem>
            {brandList.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Thứ tự hiển thị"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            sx={{ mb: 1 }}
            inputProps={{ min: 0 }}
            error={!!formErrors.orderIndex}
            helperText={formErrors.orderIndex || 'Số nhỏ hơn sẽ hiển thị trước.'}
          />
          <TextField
            select
            fullWidth
            label="Trạng thái"
            name="isActive"
            value={formData.isActive ? '1' : '0'}
            onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === '1' }))}
            sx={{ mt: 2, mb: 2 }}
          >
            <MenuItem value="1">Hiển thị</MenuItem>
            <MenuItem value="0">Ẩn</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Thông số kỹ thuật
          </Typography>
          <DragDropContext onDragEnd={handleOnDragEndProductSpecs}>
            <Droppable droppableId="productSpecsDroppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {(formData.productSpecs || []).map((spec, specIndex) => (
                    <Draggable
                      key={`product-spec-key-${specIndex}`}
                      draggableId={`product-spec-draggable-${specIndex.toString()}`}
                      index={specIndex}
                    >
                      {(providedDraggable) => (
                        <Box
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          sx={{
                            p: 1.5,
                            border: '1px dashed #e0e0e0',
                            borderRadius: 0.5,
                            mb: 1.5,
                            background: '#fdfdfd',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Box
                            {...providedDraggable.dragHandleProps}
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'grab', mr: 1, color: '#757575' }}
                          >
                            <DragIndicatorIcon />
                          </Box>
                          <Grid container spacing={1} alignItems="center">
                            {/* Nhóm */}
                            <Grid item xs={12} sm={3}>
                              <Autocomplete
                                freeSolo
                                options={availableSpecGroups}
                                value={spec.specGroup}
                                onChange={(e, newValue) => handleProductSpecChange(specIndex, 'specGroup', newValue || '')}
                                onInputChange={(e, newInputValue) => handleProductSpecChange(specIndex, 'specGroup', newInputValue)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Nhóm"
                                    size="small"
                                    placeholder="VD: Kích thước, Chất liệu…"
                                    error={!!formErrors.productSpecs?.[specIndex]?.specGroup}
                                    helperText={formErrors.productSpecs?.[specIndex]?.specGroup}
                                  />
                                )}
                              />
                            </Grid>

                            {/* Key */}
                            <Grid item xs={12} sm={3}>
                              <TextField
                                fullWidth
                                label="Tên thông số"
                                size="small"
                                value={spec.key}
                                onChange={(e) => handleProductSpecChange(specIndex, 'key', e.target.value)}
                              />
                            </Grid>

                            {/* Value */}
                            <Grid item xs={12} sm={3}>
                              <TextField
                                fullWidth
                                label="Giá trị"
                                size="small"
                                value={spec.value}
                                onChange={(e) => handleProductSpecChange(specIndex, 'value', e.target.value)}
                              />
                            </Grid>

                            {/* Thứ tự */}
                            <Grid item xs={12} sm={1.5}>
                              <TextField
                                fullWidth
                                type="number"
                                label="Thứ tự"
                                size="small"
                                value={spec.sortOrder}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>

                            {/* Xóa */}
                            <Grid item xs={12} sm={1.5} sx={{ textAlign: 'right' }}>
                              <IconButton color="error" onClick={() => removeProductSpec(specIndex)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button variant="outlined" onClick={addProductSpec} startIcon={<AddCircleOutlineIcon />} size="small">
            Thêm thông số
          </Button>
        </Grid>
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
                      newSkus =
                        prev.skus.length > 0 && !prev.hasVariants && prev.skus[0]
                          ? [{ ...createEmptySku(), skuCode: prev.skus[0].skuCode }]
                          : prev.skus.length === 0
                            ? [createEmptySku()]
                            : [];
                      if (newSkus.length === 0) newSkus.push(createEmptySku());
                    } else {
                      const baseSkuData = prev.skus.length > 0 ? prev.skus[0] : {};
                      newSkus = [
                        {
                          ...createEmptySku(),
                          ...baseSkuData,
                          variantSelections: {},
                          variantValueIds: []
                        }
                      ];
                      if (prev.skus.length > 0 && skuMediaFiles[0] && skuMediaFiles[0].length > 0) {
                        setMedia(skuMediaFiles[0].map((fileObj) => ({ ...fileObj, id: fileObj.id || Date.now() + Math.random() })));
                      } else if (prev.skus.length > 0 && prev.skus[0]?.mediaUrls?.length > 0) {
                        setMedia(
                          prev.skus[0].mediaUrls.map((url) => ({ url, type: getFrontendFileType(url), id: Date.now() + Math.random() }))
                        );
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
                }}
                color="primary"
              />
            }
            label="Sản phẩm có biến thể (phiên bản)"
          />
          <Alert severity={formData.hasVariants ? 'info' : 'warning'} sx={{ mt: 1, mb: 2 }}>
            {formData.hasVariants
              ? 'Sản phẩm có nhiều phiên bản. Mỗi phiên bản (SKU) sẽ có thông tin giá, kho, vận chuyển, và media riêng.'
              : 'Sản phẩm chỉ có một phiên bản duy nhất. Nhập thông tin giá, kho, media... ở bên dưới.'}
          </Alert>
        </Grid>

        {formData.hasVariants && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Cấu hình Thuộc tính & Giá trị Áp dụng
            </Typography>
            {productConfiguredVariants.map((pvc, pvcIndex) => (
              <Box key={`pvc-${pvcIndex}`} sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Grid container spacing={1} alignItems="flex-start">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      select
                      fullWidth
                      label={`Loại thuộc tính ${pvcIndex + 1}`}
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
                        <MenuItem
                          key={av.id}
                          value={av.id}
                          disabled={productConfiguredVariants.some((item, index) => index !== pvcIndex && item.variantTypeId === av.id)}
                        >
                          {av.name}
                        </MenuItem>
                      ))}
                      <MenuItem
                        value={ADD_NEW_VARIANT_TYPE_VALUE}
                        dense
                        sx={{ color: 'primary.main', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}
                      >
                        <AddCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> Tạo loại thuộc tính mới...
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {pvc.variantTypeId && (
                      <FormControl fullWidth size="small">
                        <InputLabel id={`select-values-label-${pvcIndex}`}>Chọn các giá trị sẽ dùng</InputLabel>
                        <Select
                          labelId={`select-values-label-${pvcIndex}`}
                          label="Chọn các giá trị sẽ dùng"
                          multiple
                          value={pvc.applicableValueIds}
                          onChange={(e) => {
                            let newSelectedValueIds = e.target.value;
                            if (!Array.isArray(newSelectedValueIds)) {
                              newSelectedValueIds = [newSelectedValueIds];
                            }
                            const actionItemIndex = newSelectedValueIds.indexOf(`add_new_value_for_${pvc.variantTypeId}`);
                            if (actionItemIndex > -1) {
                              newSelectedValueIds.splice(actionItemIndex, 1);
                              const currentType = availableVariants.find((av_1) => av_1.id === pvc.variantTypeId);
                              if (currentType) handleOpenAddVariantValueDialog(currentType, pvcIndex);
                            }
                            setProductConfiguredVariants((prev_1) => {
                              const updated_1 = [...prev_1];
                              updated_1[pvcIndex].applicableValueIds = newSelectedValueIds.filter(
                                (id) => id !== `add_new_value_for_${pvc.variantTypeId}` && id !== ''
                              );
                              return updated_1;
                            });
                          }}
                          renderValue={(selectedIds) => {
                            const selectedAV_1 = availableVariants.find((av_2) => av_2.id === pvc.variantTypeId);
                            if (!selectedAV_1?.values) return '';
                            return selectedIds
                              .map((id) => selectedAV_1.values.find((val) => val.id === id)?.value)
                              .filter(Boolean)
                              .join(', ');
                          }}
                        >
                          {(availableVariants.find((av_3) => av_3.id === pvc.variantTypeId)?.values || []).map((valOpt) => (
                            <MenuItem key={valOpt.id} value={valOpt.id}>
                              <Checkbox checked={pvc.applicableValueIds.includes(valOpt.id)} size="small" />
                              <ListItemText primary={valOpt.value} />
                            </MenuItem>
                          ))}
                          <MenuItem
                            value={`add_new_value_for_${pvc.variantTypeId}`}
                            dense
                            sx={{ color: 'primary.main', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}
                          >
                            <AddCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> Thêm giá trị mới...
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                    <IconButton
                      onClick={() => setProductConfiguredVariants((prev_2) => prev_2.filter((_, i) => i !== pvcIndex))}
                      color="error"
                      aria-label="Xóa dòng cấu hình thuộc tính này"
                      disabled={productConfiguredVariants.length === 1 && !pvc.variantTypeId && pvc.applicableValueIds.length === 0}
                    >
                      {' '}
                      <DeleteIcon />{' '}
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                if (
                  productConfiguredVariants.length === 0 ||
                  productConfiguredVariants[productConfiguredVariants.length - 1].variantTypeId
                ) {
                  setProductConfiguredVariants((prev_3) => [...prev_3, { variantTypeId: '', variantTypeName: '', applicableValueIds: [] }]);
                } else {
                  setFormErrors((prev) => ({ ...prev, form: 'Vui lòng hoàn tất cấu hình thuộc tính hiện tại trước khi thêm mới.' }));
                }
              }}
              disabled={availableVariants.length > 0 && productConfiguredVariants.length >= availableVariants.length}
            >
              {' '}
              + Thêm dòng cấu hình thuộc tính{' '}
            </Button>
          </Grid>
        )}

        <Grid item xs={12}>
          {!formData.hasVariants && formData.skus[0] && (
            <Box key={`sku-item-novariant-0`} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, background: '#fff' }}>
              <Typography variant="h6" gutterBottom>
                Thông tin Phiên bản duy nhất
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Mã SKU (Sản phẩm)"
                    value={formData.skus[0].skuCode || ''}
                    onChange={(e) => handleSkuChange(0, 'skuCode', e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.skuCode}
                    helperText={formErrors.skus?.[0]?.skuCode || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Giá gốc"
                    value={formatCurrencyVND(formData.skus[0].originalPrice || 0)}
                    onChange={(e) => handleSkuChange(0, 'originalPrice', e.target.value.replace(/\D/g, ''))}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.originalPrice}
                    helperText={formErrors.skus?.[0]?.originalPrice || ''}
                    InputProps={{ inputProps: { min: 0, inputMode: 'numeric' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Giá bán"
                    value={formatCurrencyVND(formData.skus[0].price || 0)}
                    onChange={(e) => handleSkuChange(0, 'price', e.target.value.replace(/\D/g, ''))}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.price}
                    helperText={formErrors.skus?.[0]?.price || ''}
                    InputProps={{ inputProps: { min: 0, inputMode: 'numeric' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Tồn kho"
                    value={formData.skus[0].stock || ''}
                    onChange={(e) => handleSkuChange(0, 'stock', e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.stock}
                    helperText={formErrors.skus?.[0]?.stock || ''}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, mt: 1, fontWeight: 'medium' }}>
                    Thông tin Vận chuyển
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Rộng (cm)"
                    value={formData.skus[0].width || ''}
                    onChange={(e) => handleSkuChange(0, 'width', e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.width}
                    helperText={formErrors.skus?.[0]?.width || ''}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cao (cm)"
                    value={formData.skus[0].height || ''}
                    onChange={(e) => handleSkuChange(0, 'height', e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.height}
                    helperText={formErrors.skus?.[0]?.height || ''}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Dài (cm)"
                    value={formData.skus[0].length || ''}
                    onChange={(e) => handleSkuChange(0, 'length', e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.length}
                    helperText={formErrors.skus?.[0]?.length || ''}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Nặng (kg)"
                    value={formData.skus[0].weight || ''}
                    onChange={(e) => handleSkuChange(0, 'weight', e.target.value)}
                    sx={{ mb: 2 }}
                    error={!!formErrors.skus?.[0]?.weight}
                    helperText={formErrors.skus?.[0]?.weight || ''}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Ảnh/Video sản phẩm
                  </Typography>
                  <FormControl fullWidth error={!!formErrors.skus?.[0]?.mediaUrls} sx={{ mb: 0 }}>
                    <MediaUpload files={media} onChange={(files) => setMedia(files)} />
                    {formErrors.skus?.[0]?.mediaUrls && !Array.isArray(formErrors.skus[0].mediaUrls) && (
                      <FormHelperText error>{formErrors.skus[0].mediaUrls}</FormHelperText>
                    )}
                    {formErrors.media && <FormHelperText error>{formErrors.media}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {formData.hasVariants && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, display: canManageVariantSkus ? 'block' : 'none' }}>
                Danh sách các Phiên bản (SKU)
              </Typography>
              <Tooltip
                title={
                  !canManageVariantSkus
                    ? 'Hoàn tất cấu hình các loại thuộc tính và chọn giá trị cho chúng trước khi thêm SKU.'
                    : 'Thêm phiên bản sản phẩm mới'
                }
              >
                <span>
                  <Button
                    onClick={addSku}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      mt: productConfiguredVariants.length === 0 && formData.skus.length === 0 ? 2 : 0,
                      display:
                        canManageVariantSkus || (productConfiguredVariants.length === 0 && formData.skus.length === 0)
                          ? 'inline-flex'
                          : 'none'
                    }}
                    disabled={(!canManageVariantSkus && productConfiguredVariants.length > 0) || formData.skus.length >= 50}
                  >
                    {' '}
                    + Thêm Phiên bản (SKU){' '}
                  </Button>
                </span>
              </Tooltip>
              {!canManageVariantSkus &&
                productConfiguredVariants.length > 0 &&
                productConfiguredVariants.some((pvc) => !pvc.variantTypeId || pvc.applicableValueIds.length === 0) && (
                  <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>
                    Vui lòng chọn đầy đủ thông tin cho tất cả các loại thuộc tính đã thêm để có thể tạo SKU.
                  </Alert>
                )}

              {canManageVariantSkus &&
                formData.skus.map((sku, i) => (
                  <Box
                    key={`sku-item-variant-${i}`}
                    sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, background: i % 2 ? '#fafafa' : '#fff' }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 'medium', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      Chi tiết cho Phiên bản {i + 1}
                      {formData.skus.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, skus: prev.skus.filter((_, si) => si !== i) }));
                            setSkuMediaFiles((prevSkuMedia) => {
                              const newSkuMedia = { ...prevSkuMedia };
                              delete newSkuMedia[i];
                              return newSkuMedia;
                            });
                          }}
                          aria-label={`Xóa Phiên bản ${i + 1}`}
                        >
                          {' '}
                          <DeleteIcon />{' '}
                        </IconButton>
                      )}
                    </Typography>
                    <Grid container spacing={2}>
                      {productConfiguredVariants
                        .filter((pvc) => pvc.variantTypeId && pvc.applicableValueIds.length > 0)
                        .map((pvc) => (
                          <Grid item xs={12} key={pvc.variantTypeId}>
                            <TextField
                              select
                              fullWidth
                              label={pvc.variantTypeName}
                              value={sku.variantSelections?.[pvc.variantTypeId] || ''}
                              onChange={(e) => {
                                const newSelections = { ...sku.variantSelections, [pvc.variantTypeId]: e.target.value };
                                handleSkuChange(i, 'variantSelections', newSelections);
                              }}
                              sx={{ mb: 1 }}
                              error={!!formErrors.skus?.[i]?.variantSelections?.[pvc.variantTypeId]}
                              helperText={formErrors.skus?.[i]?.variantSelections?.[pvc.variantTypeId]}
                            >
                              <MenuItem value="">-- Chọn {pvc.variantTypeName} --</MenuItem>
                              {availableVariants
                                .find((av) => av.id === pvc.variantTypeId)
                                ?.values.filter((val) => pvc.applicableValueIds.includes(val.id))
                                .map((valOpt) => (
                                  <MenuItem key={valOpt.id} value={valOpt.id}>
                                    {valOpt.value}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Grid>
                        ))}

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Mã SKU"
                          value={sku.skuCode || ''}
                          onChange={(e) => handleSkuChange(i, 'skuCode', e.target.value)}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[i]?.skuCode}
                          helperText={formErrors.skus?.[i]?.skuCode || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Giá gốc (biến thể)"
                          value={formatCurrencyVND(formData.skus[i]?.originalPrice || 0)}
                          onChange={(e) => handleSkuChange(i, 'originalPrice', e.target.value.replace(/\D/g, ''))}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[index]?.originalPrice}
                          helperText={formErrors.skus?.[index]?.originalPrice || ''}
                          InputProps={{ inputProps: { min: 0, inputMode: 'numeric' } }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Giá bán (biến thể)"
                          value={formatCurrencyVND(formData.skus[i]?.price || 0)}
                          onChange={(e) => handleSkuChange(i, 'price', e.target.value.replace(/\D/g, ''))}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[index]?.price}
                          helperText={formErrors.skus?.[index]?.price || ''}
                          InputProps={{ inputProps: { min: 0, inputMode: 'numeric' } }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Tồn kho"
                          value={sku.stock || ''}
                          onChange={(e) => handleSkuChange(i, 'stock', e.target.value)}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[i]?.stock}
                          helperText={formErrors.skus?.[i]?.stock || ''}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1, mt: 1, fontWeight: 'medium' }}>
                          Thông tin Vận chuyển
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Rộng (cm)"
                          value={sku.width || ''}
                          onChange={(e) => handleSkuChange(i, 'width', e.target.value)}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[i]?.width}
                          helperText={formErrors.skus?.[i]?.width || ''}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Cao (cm)"
                          value={sku.height || ''}
                          onChange={(e) => handleSkuChange(i, 'height', e.target.value)}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[i]?.height}
                          helperText={formErrors.skus?.[i]?.height || ''}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Dài (cm)"
                          value={sku.length || ''}
                          onChange={(e) => handleSkuChange(i, 'length', e.target.value)}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[i]?.length}
                          helperText={formErrors.skus?.[i]?.length || ''}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Nặng (kg)"
                          value={sku.weight || ''}
                          onChange={(e) => handleSkuChange(i, 'weight', e.target.value)}
                          sx={{ mb: 2 }}
                          error={!!formErrors.skus?.[i]?.weight}
                          helperText={formErrors.skus?.[i]?.weight || ''}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Ảnh/Video cho phiên bản này (SKU {i + 1})
                        </Typography>
                        <FormControl fullWidth error={!!formErrors.skus?.[i]?.mediaUrls} sx={{ mb: 0 }}>
                          <MediaUpload
                            key={`sku-media-${i}`}
                            files={
                              skuMediaFiles?.[i]?.map((file) => ({
                                ...file,
                                url:
                                  file.url?.startsWith('http') || file.url?.startsWith('blob:') ? file.url : `${API_BASE_URL}${file.url}`,
                                type: file.type || getFrontendFileType(file.url)
                              })) || []
                            }
                            onChange={(files) => handleMediaChangeForVariantSku(i, files)}
                          />
                          {formErrors.skus?.[i]?.mediaUrls && !Array.isArray(formErrors.skus[i].mediaUrls) && (
                            <FormHelperText error>{formErrors.skus[i].mediaUrls}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </>
          )}
        </Grid>

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

      <Dialog open={isAddVariantTypeDialogOpen} onClose={handleCloseAddVariantTypeDialog} maxWidth="xs" fullWidth disableRestoreFocus>
        <DialogTitle>Tạo Loại Thuộc Tính Mới</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Nhập tên cho loại thuộc tính mới (ví dụ: Chất liệu, Phiên bản, Dung lượng).</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-variant-type-name"
            label="Tên loại thuộc tính"
            type="text"
            fullWidth
            variant="outlined"
            value={newVariantTypeNameInput}
            onChange={(e) => setNewVariantTypeNameInput(e.target.value)}
            error={!!variantTypeDialogError}
            helperText={variantTypeDialogError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddVariantTypeDialog} disabled={isSavingVariantType}>
            Hủy
          </Button>
          <Button onClick={handleSaveNewVariantType} variant="contained" disabled={isSavingVariantType}>
            {isSavingVariantType ? <CircularProgress size={24} /> : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {currentVariantTypeForNewValue && (
        <Dialog open={isAddVariantValueDialogOpen} onClose={handleCloseAddVariantValueDialog} maxWidth="xs" fullWidth disableRestoreFocus>
          <DialogTitle>Thêm Giá Trị Mới cho "{currentVariantTypeForNewValue.name}"</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Nhập giá trị mới (ví dụ: nếu loại là "Màu sắc", nhập "Tím"; nếu là "Kích thước", nhập "XXL").
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="new-variant-value"
              label="Tên giá trị mới"
              type="text"
              fullWidth
              variant="outlined"
              value={newVariantValueInput}
              onChange={(e) => setNewVariantValueInput(e.target.value)}
              error={!!variantValueDialogError}
              helperText={variantValueDialogError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddVariantValueDialog} disabled={isSavingVariantValue}>
              Hủy
            </Button>
            <Button onClick={handleSaveNewVariantValue} variant="contained" disabled={isSavingVariantValue}>
              {isSavingVariantValue ? <CircularProgress size={24} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </form>
  );
};

export default ProductForm;
