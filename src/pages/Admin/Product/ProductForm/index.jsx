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
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 

import ThumbnailUpload from '../ThumbnailUpload';
import MediaUpload from '../MediaUpload';
import TinyEditor from '../../../../components/Admin/TinyEditor';
import { variantService } // Giả sử bạn dùng service thật
  from '../../../../services/admin/variantService';
import { productService } from '../../../../services/admin/productService';
import { variantValueService } from '../../../../services/admin/variantValueService'; // THÊM DÒNG NÀY ĐẦU FILE

// --- BỎ PHẦN MOCK SERVICE NẾU BẠN DÙNG SERVICE THẬT ---
// const mockVariantService = { /* ... */ };
// const variantService = mockVariantService; 
// --- KẾT THÚC BỎ MOCK ---


const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', shortDescription: '', description: '', thumbnail: '',
    orderIndex: 0, isActive: true, hasVariants: false,
    categoryId: '', brandId: '', variants: [], skus: []
  });
  const [brandList, setBrandList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [media, setMedia] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [productConfiguredVariants, setProductConfiguredVariants] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [skuMediaFiles, setSkuMediaFiles] = useState({});

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

  const ADD_NEW_VARIANT_TYPE_VALUE = "___ADD_NEW_VARIANT_TYPE___"; // Giá trị đặc biệt cho MenuItem thêm mới


  const fetchAvailableVariants = useCallback(async (selectAfterFetch = null) => {
    setIsSavingVariantType(true); 
    setIsSavingVariantValue(true); // Có thể dùng loading chung hoặc riêng
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
              const targetIndex = pvcIndex === -1 ? prev.length -1 : pvcIndex; // Nếu là thêm mới hoàn toàn thì vào dòng cuối vừa thêm
              if (updated[targetIndex]) {
                 updated[targetIndex] = { ...updated[targetIndex], variantTypeId: newType.id, variantTypeName: newType.name, applicableValueIds: [] };
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
      console.error('❌ Lỗi lấy danh sách thuộc tính:', err);
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

  // Các useEffect khác (thumbnail, media, auto sku code, fetch categories/brands, ensure SKU) giữ nguyên
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
        .map((m) => (m.url && typeof m.url === 'string' && !m.url.startsWith('blob:') ? m.url : null))
        .filter(Boolean);
      const updatedSkus = [...formData.skus];
      if (updatedSkus[0] && JSON.stringify(updatedSkus[0].mediaUrls) !== JSON.stringify(urls)) {
        updatedSkus[0].mediaUrls = urls;
        setFormData((prev) => ({ ...prev, skus: updatedSkus }));
      }
    }
  }, [media, formData.hasVariants, formData.skus]);

  useEffect(() => {
    if (!formData.hasVariants && formData.name && formData.skus.length === 1 && !(formData.skus[0].skuCode || '').trim()) {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const suggested = `${slug}-sku`;
      handleSkuChange(0, 'skuCode', suggested);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name, formData.hasVariants]); 

  const handleMediaChangeForVariantSku = (index, files) => {
    const newSkuMediaFiles = { ...skuMediaFiles, [index]: files };
    setSkuMediaFiles(newSkuMediaFiles);
    const urls = files.map((f) => (f.url && typeof f.url === 'string' && !f.url.startsWith('blob:') ? f.url : null)).filter(Boolean);
    const updatedSkus = [...formData.skus];
    if (updatedSkus[index] && JSON.stringify(updatedSkus[index].mediaUrls) !== JSON.stringify(urls)){
        updatedSkus[index].mediaUrls = urls;
        setFormData((prev) => ({ ...prev, skus: updatedSkus }));
    }
  };

  useEffect(() => {
    productService.getCategoryTree().then((res) => setCategoryTree(res.data.data || [])).catch((err) => console.error('Error fetching category tree:', err));
    productService.getBrandList().then((res) => setBrandList(res.data.data || [])).catch((err) => console.error('Error fetching brand list:', err));
  }, []);

  useEffect(() => {
    if (!formData.hasVariants && formData.skus.length === 0) {
      addSku();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.hasVariants, formData.skus.length]);

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
    const updatedSkus = [...formData.skus];
    if (updatedSkus[index]) {
      updatedSkus[index][key] = value;
      setFormData((prev) => ({ ...prev, skus: updatedSkus }));
    }
  };

  const createEmptySku = () => ({
    skuCode: '', originalPrice: '', price: '', stock: '',
    height: '', width: '', length: '', weight: '',
    mediaUrls: [], variantValueIds: [], variantSelections: {}
  });

  const addSku = () => {
    if (!formData.hasVariants && formData.skus.length >= 1) return;
    if (formData.hasVariants && !canManageVariantSkus) {
        setFormErrors(prev => ({...prev, form: "Hoàn tất cấu hình các loại thuộc tính và chọn giá trị cho chúng trước khi thêm SKU."}));
        return;
    }
    setFormData((prev) => ({ ...prev, skus: [...prev.skus, createEmptySku()] }));
  };

  const handleOpenAddVariantTypeDialog = (pvcIndex) => {
    setTargetPvcIndexForNewType(pvcIndex);
    setNewVariantTypeNameInput('');
    setVariantTypeDialogError('');
    setIsAddVariantTypeDialogOpen(true);
  };

  const handleCloseAddVariantTypeDialog = () => {
    if (isSavingVariantType) return;
    setIsAddVariantTypeDialogOpen(false);
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
    const payload = { name: newVariantTypeNameInput.trim() };
    console.log('🔍 Payload gửi lên:', payload);

    const response = await variantService.createVariantType(payload);

    console.log('✅ API tạo loại thuộc tính thành công:', response);

    const newType = response.data.data;

    // Load lại danh sách loại thuộc tính và chọn luôn loại vừa tạo
    await fetchAvailableVariants({
      type: 'variantType',
      id: newType.id,
      pvcIndex: targetPvcIndexForNewType
    });

    handleCloseAddVariantTypeDialog();
  } catch (err) {
    console.error('❌ Lỗi tạo loại thuộc tính:', err);

    const message =
      err.response?.data?.errors?.[0]?.message ||
      err.response?.data?.message ||
      err.message ||
      'Lỗi không xác định.';

    setVariantTypeDialogError(message);
  } finally {
    setIsSavingVariantType(false);
  }
};


  const handleOpenAddVariantValueDialog = (variantType, pvcIndex) => {
    if (!variantType || !variantType.id) {
        console.error("Không thể thêm giá trị: loại thuộc tính không hợp lệ.");
        setFormErrors(prev => ({...prev, form: "Vui lòng chọn loại thuộc tính trước khi thêm giá trị mới."}));
        return;
    }
    setCurrentVariantTypeForNewValue(variantType);
    setTargetPvcIndexForNewValue(pvcIndex);
    setNewVariantValueInput('');
    setVariantValueDialogError('');
    setIsAddVariantValueDialogOpen(true);
  };

  const handleCloseAddVariantValueDialog = () => {
    if (isSavingVariantValue) return;
    setIsAddVariantValueDialogOpen(false);
    setCurrentVariantTypeForNewValue(null);
    setTargetPvcIndexForNewValue(null);
  };

  const handleSaveNewVariantValue = async () => {
    if (!currentVariantTypeForNewValue || !newVariantValueInput.trim()) {
      setVariantValueDialogError('Tên giá trị không được để trống.');
      return;
    }
    setIsSavingVariantValue(true);
    setVariantValueDialogError('');
    try {
     const response = await variantValueService.createQuick({
  variantId: currentVariantTypeForNewValue.id,
  value: newVariantValueInput.trim()
});
      const newValue = response.data.data;
      await fetchAvailableVariants({ type: 'variantValue', id: newValue.id, pvcIndex: targetPvcIndexForNewValue, variantTypeIdForNewValue: currentVariantTypeForNewValue.id });
      handleCloseAddVariantValueDialog();
    } catch (err) {
      console.error('❌ Lỗi tạo giá trị thuộc tính:', err);
      setVariantValueDialogError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || err.message || 'Lỗi không xác định.');
    } finally {
      setIsSavingVariantValue(false);
    }
  };

  const checkForDuplicateSkuVariants = (skusToTest, configuredVariantTypes) => {
    // ... (Giữ nguyên hàm này)
    const effectivelyConfiguredTypes = configuredVariantTypes.filter((cv) => cv.variantTypeId && cv.applicableValueIds.length > 0);
    if (effectivelyConfiguredTypes.length === 0 || !skusToTest || skusToTest.length < 2) {
      return { hasDuplicates: false, message: '' };
    }
    const skuVariantSignatures = new Set();
    for (let i = 0; i < skusToTest.length; i++) {
      const sku = skusToTest[i];
      const selections = sku.variantSelections || {};
      let allTypesSelected = true;
      for (const cv of effectivelyConfiguredTypes) {
        if (selections[cv.variantTypeId] === undefined || selections[cv.variantTypeId] === '') {
          allTypesSelected = false;
          break;
        }
      }
      if (!allTypesSelected) continue;
      const signature = effectivelyConfiguredTypes.map(cv => `${cv.variantTypeId}:${selections[cv.variantTypeId]}`).sort().join(',');
      if (signature && skuVariantSignatures.has(signature)) {
        const firstOccurrenceIndex = skusToTest.findIndex((s, index) => {
            if (index === i) return false;
            const sSelections = s.variantSelections || {};
            let sAllTypesSelected = true;
            for (const cv of effectivelyConfiguredTypes) { if (sSelections[cv.variantTypeId] === undefined || sSelections[cv.variantTypeId] === '') { sAllTypesSelected = false; break; } }
            if (!sAllTypesSelected) return false;
            const sSignature = effectivelyConfiguredTypes.map(cv => `${cv.variantTypeId}:${sSelections[cv.variantTypeId]}`).sort().join(',');
            return sSignature === signature;
        });
        return { hasDuplicates: true, message: `SKU ${i + 1} có tổ hợp thuộc tính giống SKU ${firstOccurrenceIndex !== -1 ? firstOccurrenceIndex + 1 : 'khác'}.` };
      }
      if (signature) skuVariantSignatures.add(signature);
    }
    return { hasDuplicates: false, message: '' };
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  let processedProductData = { ...formData };
  let currentFormErrors = {};

  // ✅ KIỂM TRA FRONTEND TRƯỚC
  if (!formData.name.trim()) currentFormErrors.name = "Tên sản phẩm không được để trống.";
  if (!formData.categoryId) currentFormErrors.categoryId = "Vui lòng chọn danh mục.";
  if (!formData.brandId) currentFormErrors.brandId = "Vui lòng chọn thương hiệu.";
  if (!thumbnail || (!thumbnail.url && !thumbnail.file)) currentFormErrors.thumbnail = "Ảnh đại diện không được để trống.";
  if (formData.orderIndex === '' || isNaN(formData.orderIndex) || Number(formData.orderIndex) < 0)
    currentFormErrors.orderIndex = "Thứ tự hiển thị phải là số không âm.";

  // SKU cơ bản
  formData.skus.forEach((sku, index) => {
    if (!sku.skuCode) {
      currentFormErrors.skus = currentFormErrors.skus || [];
      currentFormErrors.skus[index] = currentFormErrors.skus[index] || {};
      currentFormErrors.skus[index].skuCode = "Mã SKU không được để trống.";
    }
    if (!sku.originalPrice || isNaN(sku.originalPrice)) {
      currentFormErrors.skus = currentFormErrors.skus || [];
      currentFormErrors.skus[index] = currentFormErrors.skus[index] || {};
      currentFormErrors.skus[index].originalPrice = "Giá gốc phải là số và không được để trống.";
    }
    if (!sku.stock || isNaN(sku.stock)) {
      currentFormErrors.skus = currentFormErrors.skus || [];
      currentFormErrors.skus[index] = currentFormErrors.skus[index] || {};
      currentFormErrors.skus[index].stock = "Tồn kho phải là số và không được để trống.";
    }
  });

  if (Object.keys(currentFormErrors).length > 0) {
    currentFormErrors.form = "Vui lòng nhập đầy đủ thông tin bắt buộc.";
    setFormErrors(currentFormErrors);
    return;
  }

  // ✅ CHUẨN HÓA DỮ LIỆU GỬI LÊN
  processedProductData.name = formData.name.trim();
  processedProductData.orderIndex = parseInt(formData.orderIndex, 10) || 0;
  processedProductData.categoryId = Number(formData.categoryId) || null;
  processedProductData.brandId = Number(formData.brandId) || null;

  if (formData.hasVariants) {
    processedProductData.variants = productConfiguredVariants
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
      })
      .filter((v) => v.id && v.values.length > 0);
  } else {
    processedProductData.variants = [];
  }

  processedProductData.skus = formData.skus.map((sku) => {
    const newSku = {
      ...sku,
      skuCode: String(sku.skuCode || '').trim(),
      originalPrice: isNaN(Number(sku.originalPrice)) ? null : Number(sku.originalPrice),
      price: isNaN(Number(sku.price)) ? null : Number(sku.price),
      stock: isNaN(Number(sku.stock)) ? null : parseInt(sku.stock, 10),
      height: isNaN(Number(sku.height)) ? null : Number(sku.height),
      width: isNaN(Number(sku.width)) ? null : Number(sku.width),
      length: isNaN(Number(sku.length)) ? null : Number(sku.length),
      weight: isNaN(Number(sku.weight)) ? null : Number(sku.weight),
      mediaUrls: Array.isArray(sku.mediaUrls) ? sku.mediaUrls : []
    };
    if (formData.hasVariants) {
      newSku.variantValueIds = sku.variantSelections
        ? Object.values(sku.variantSelections).filter((vId) => vId !== '').map(Number)
        : [];
    } else {
      newSku.variantValueIds = [];
      newSku.variantSelections = {};
    }
    return newSku;
  });

  if (formData.hasVariants) {
    const { hasDuplicates, message } = checkForDuplicateSkuVariants(
      processedProductData.skus,
      productConfiguredVariants
    );
    if (hasDuplicates) {
      currentFormErrors.form = message;
      setFormErrors(currentFormErrors);
      return;
    }
  }

  try {
    const payload = new FormData();

    if (thumbnail?.file instanceof File) {
      payload.append('thumbnail', thumbnail.file);
      processedProductData.thumbnail = '';
    } else if (typeof thumbnail?.url === 'string' && !thumbnail.url.startsWith('blob:')) {
      processedProductData.thumbnail = thumbnail.url;
    }

    payload.append('product', JSON.stringify(processedProductData));

    if (!formData.hasVariants && media.length > 0) {
      media.forEach((m) => {
        if (m.file instanceof File) {
          payload.append('media_sku_0', m.file);
        }
      });
    }

    if (formData.hasVariants) {
      formData.skus.forEach((sku, skuIndex) => {
        const filesForThisSku = skuMediaFiles[skuIndex] || [];
        filesForThisSku.forEach((item) => {
          if (item.file instanceof File) {
            payload.append(`media_sku_${skuIndex}`, item.file);
          }
        });
      });
    }

    await onSubmit(payload);
    setFormErrors({});
  } catch (err) {
    console.error('❌ LỖI GỬI FORM:', err.response || err);
    const errorsObj = { ...currentFormErrors };
    if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
      err.response.data.errors.forEach((errorItem) => {
        if (errorItem && errorItem.field) {
          const match = errorItem.field.match(/^skus\[(\d+)\]\.(.+)$/);
          if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            if (!errorsObj.skus) errorsObj.skus = [];
            if (!errorsObj.skus[index]) errorsObj.skus[index] = {};
            errorsObj.skus[index][field] = errorItem.message;
          } else {
            errorsObj[errorItem.field] = errorItem.message;
          }
        }
      });
    } else if (err.message) {
      errorsObj.form = err.message;
    } else {
      errorsObj.form = 'Đã có lỗi không xác định xảy ra khi gửi form.';
    }
    setFormErrors(errorsObj);
  }
};


  const canManageVariantSkus =
    formData.hasVariants &&
    productConfiguredVariants.length > 0 &&
    productConfiguredVariants.every((pvc) => pvc.variantTypeId && pvc.applicableValueIds.length > 0);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        {/* Left Column: Product Info */}
        <Grid item xs={12} md={8}>
          {/* ... Tên, Mô tả ngắn, Mô tả chi tiết ... */}
          <TextField fullWidth label="Tên sản phẩm" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} error={!!formErrors.name} helperText={formErrors.name} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Mô tả ngắn</Typography>
          <TinyEditor value={formData.shortDescription} onChange={(val) => setFormData((prev) => ({ ...prev, shortDescription: val }))} height={200} />
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Mô tả chi tiết</Typography>
          <TinyEditor value={formData.description} onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))} height={300} />
        </Grid>

        {/* Right Column: Product Meta */}
        <Grid item xs={12} md={4}>
           {/* ... Thumbnail, Danh mục, Thương hiệu, Thứ tự, Trạng thái ... */}
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

        {/* Variant Toggle */}
        <Grid item xs={12}>
          {/* ... Switch và Alert cho hasVariants ... */}
          <FormControlLabel control={<Switch checked={!!formData.hasVariants} onChange={(event) => {
            const newHasVariants = event.target.checked;
            setFormData((prevFormData) => {
              let newSkus = [...prevFormData.skus];
              if (newHasVariants) { newSkus = []; } 
              else {
                const baseSkuData = newSkus.length > 0 ? { ...newSkus[0] } : {};
                newSkus = [{ ...createEmptySku(), ...baseSkuData, variantSelections: {}, variantValueIds: [] }];
              }
              return { ...prevFormData, hasVariants: newHasVariants, skus: newSkus };
            });
             if (!newHasVariants) setProductConfiguredVariants([]); 
          }} color="primary" />} label="Sản phẩm có biến thể (phiên bản)" />
          <Alert severity={formData.hasVariants ? 'info' : 'success'} sx={{ mt: 1, mb: 2 }}>
            {formData.hasVariants ? 'Sản phẩm có nhiều phiên bản. Cấu hình các loại thuộc tính & SKU bên dưới.' : 'Sản phẩm chỉ có một phiên bản. Cấu hình SKU bên dưới.'}
          </Alert>
        </Grid>

        {/* Variant Configuration Section (Types and their applicable values) */}
        {formData.hasVariants && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Cấu hình Thuộc tính & Giá trị Áp dụng
            </Typography>
            {productConfiguredVariants.map((pvc, pvcIndex) => (
              <Box key={`pvc-${pvcIndex}`} sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm> {/* TextField chiếm phần lớn không gian */}
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
                      {/* HIỂN THỊ CÁC LOẠI THUỘC TÍNH CÓ SẴN */}
                      {availableVariants.map((av) => (
                        <MenuItem
                          key={av.id}
                          value={av.id}
                          disabled={productConfiguredVariants.some(
                            (item, index) => index !== pvcIndex && item.variantTypeId === av.id
                          )}
                        >
                          {av.name}
                        </MenuItem>
                      ))}
                      {/* TÙY CHỌN THÊM MỚI LOẠI THUỘC TÍNH - NẰM TRONG DROPDOWN */}
                      <MenuItem value={ADD_NEW_VARIANT_TYPE_VALUE} dense sx={{color: "primary.main", fontStyle: "italic", display: 'flex', alignItems: 'center'}}>
                        <AddCircleOutlineIcon fontSize="small" sx={{mr:0.5}}/> Tạo loại thuộc tính mới...
                      </MenuItem>
                    </TextField>
                  </Grid>
                  {/* Grid item cho Select giá trị */}
                  <Grid item xs={12} sm> {/* TextField chiếm phần lớn không gian */}
                    {pvc.variantTypeId && ( // Chỉ hiện khi loại thuộc tính đã được chọn
                      <FormControl fullWidth size="small">
                        <InputLabel id={`select-values-label-${pvcIndex}`}>Chọn các giá trị sẽ dùng</InputLabel>
                        <Select
                          labelId={`select-values-label-${pvcIndex}`}
                          label="Chọn các giá trị sẽ dùng"
                          multiple
                          value={pvc.applicableValueIds}
                          onChange={(e) => {
                            const newSelectedValueIds = e.target.value;
                            setProductConfiguredVariants((prev) => {
                              const updated = [...prev];
                              // Xử lý nếu giá trị đặc biệt "thêm mới" được chọn (nếu có)
                              const actionItemIndex = newSelectedValueIds.indexOf(`add_new_value_for_${pvc.variantTypeId}`);
                              if (actionItemIndex > -1) {
                                newSelectedValueIds.splice(actionItemIndex, 1); // Loại bỏ item đặc biệt khỏi lựa chọn
                                const currentType = availableVariants.find(av => av.id === pvc.variantTypeId);
                                if(currentType) handleOpenAddVariantValueDialog(currentType, pvcIndex);
                              }
                              updated[pvcIndex].applicableValueIds = Array.isArray(newSelectedValueIds)
                                ? newSelectedValueIds
                                : [newSelectedValueIds].filter(Boolean);
                              return updated;
                            });
                          }}
                          renderValue={(selectedIds) => {
                            const selectedAV = availableVariants.find((av) => av.id === pvc.variantTypeId);
                            if (!selectedAV?.values) return '';
                            return selectedIds
                              .map((id) => selectedAV.values.find((val) => val.id === id)?.value)
                              .filter(Boolean)
                              .join(', ');
                          }}
                        >
                          {/* HIỂN THỊ CÁC GIÁ TRỊ CÓ SẴN CỦA LOẠI THUỘC TÍNH ĐÃ CHỌN */}
                          {(availableVariants.find((av) => av.id === pvc.variantTypeId)?.values || []).map((valOpt) => (
                            <MenuItem key={valOpt.id} value={valOpt.id}>
                              <Checkbox checked={pvc.applicableValueIds.includes(valOpt.id)} size="small"/>
                              <ListItemText primary={valOpt.value} />
                            </MenuItem>
                          ))}
                          {/* MỤC ĐỂ THÊM GIÁ TRỊ MỚI CHO LOẠI THUỘC TÍNH NÀY */}
                          <MenuItem value={`add_new_value_for_${pvc.variantTypeId}`} dense sx={{color: "primary.main", fontStyle: "italic", display: 'flex', alignItems: 'center'}}>
                              <AddCircleOutlineIcon fontSize="small" sx={{mr:0.5}}/> Thêm giá trị mới...
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item xs={12} sm="auto" sx={{ textAlign: 'right' }}>
                    <IconButton
                      onClick={() => setProductConfiguredVariants((prev) => prev.filter((_, i) => i !== pvcIndex))}
                      color="error"
                      aria-label="Xóa dòng cấu hình thuộc tính này"
                      disabled={productConfiguredVariants.length <= 1 && pvcIndex === 0 && !pvc.variantTypeId && pvc.applicableValueIds.length === 0} // logic disable nút xóa
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => setProductConfiguredVariants((prev) => [...prev, { variantTypeId: '', variantTypeName: '', applicableValueIds: [] }])}
              disabled={availableVariants.length > 0 && productConfiguredVariants.length >= availableVariants.length}
            >
              + Thêm dòng cấu hình thuộc tính
            </Button>
          </Grid>
        )}

        {/* SKU List Section */}
        <Grid item xs={12}>
           {/* ... Phần hiển thị SKU cho sản phẩm không biến thể và có biến thể (giữ nguyên như trước, đã có điều kiện canManageVariantSkus) ... */}
           {!formData.hasVariants && formData.skus.slice(0, 1).map((sku, i) => (
            <Box key={`sku-item-novariant-${i}`} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, background: '#fff' }}>
              <Typography variant="h6" gutterBottom>Thông tin chi tiết sản phẩm (SKU)</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Mã SKU (Sản phẩm)" value={sku.skuCode} onChange={(e) => handleSkuChange(i, 'skuCode', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.skuCode} helperText={formErrors.skus?.[i]?.skuCode} /></Grid>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Giá gốc" value={sku.originalPrice} onChange={(e) => handleSkuChange(i, 'originalPrice', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.originalPrice} helperText={formErrors.skus?.[i]?.originalPrice} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Giá bán" value={sku.price} onChange={(e) => handleSkuChange(i, 'price', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.price} helperText={formErrors.skus?.[i]?.price} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Tồn kho" value={sku.stock} onChange={(e) => handleSkuChange(i, 'stock', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.stock} helperText={formErrors.skus?.[i]?.stock} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Rộng (cm)" value={sku.width} onChange={(e) => handleSkuChange(i, 'width', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.width} helperText={formErrors.skus?.[i]?.width} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Cao (cm)" value={sku.height} onChange={(e) => handleSkuChange(i, 'height', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.height} helperText={formErrors.skus?.[i]?.height} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Dài (cm)" value={sku.length} onChange={(e) => handleSkuChange(i, 'length', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.length} helperText={formErrors.skus?.[i]?.length} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                <Grid item xs={12} sm={6} md={3}><TextField fullWidth type="number" label="Nặng (kg)" value={sku.weight} onChange={(e) => handleSkuChange(i, 'weight', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.weight} helperText={formErrors.skus?.[i]?.weight} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                <Grid item xs={12}><Typography variant="subtitle1" sx={{ mb: 1 }}>Ảnh/Video sản phẩm</Typography><MediaUpload files={media} onChange={setMedia} />
                  {formErrors.skus?.[0]?.mediaUrls && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{formErrors.skus[0].mediaUrls}</Typography>}
                  {formErrors.media && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{formErrors.media}</Typography>}
                </Grid>
              </Grid>
            </Box>
          ))}

          {formData.hasVariants && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, display: productConfiguredVariants.length > 0 ? 'block' : 'none' }}>
                Danh sách các Phiên bản (SKU)
              </Typography>
              <Tooltip title={!canManageVariantSkus ? "Hoàn tất cấu hình các loại thuộc tính và chọn giá trị cho chúng trước khi thêm SKU." : "Thêm phiên bản sản phẩm mới"}>
                <span> 
                  <Button 
                    onClick={addSku} 
                    variant="outlined" 
                    sx={{ mb: 2, mt: productConfiguredVariants.length === 0 ? 2 : 0, 
                          // Chỉ hiện nút Thêm SKU khi có ít nhất 1 dòng cấu hình thuộc tính đã được thêm
                          display: productConfiguredVariants.length > 0 ? 'inline-flex' : 'none' 
                        }} 
                    disabled={!canManageVariantSkus}
                  >
                    + Thêm Phiên bản (SKU)
                  </Button>
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
                    {productConfiguredVariants.map((pvc) => {
                      const fullVariantDef = availableVariants.find((av) => av.id === pvc.variantTypeId);
                      if (!fullVariantDef?.values || pvc.applicableValueIds.length === 0 || !pvc.variantTypeId) return null;
                      let dropdownOptions = (fullVariantDef.values || []).filter((val) => pvc.applicableValueIds.includes(val.id));
                      const effectivelyConfiguredTypes = productConfiguredVariants.filter(cf => cf.variantTypeId && cf.applicableValueIds.length > 0);
                      if (effectivelyConfiguredTypes.length === 1) {
                          const singleVariantTypeId = pvc.variantTypeId;
                          const valuesUsedByOtherSkus = formData.skus.filter((_, skuIndex) => skuIndex !== i).map(s => s.variantSelections?.[singleVariantTypeId]).filter(Boolean);
                          dropdownOptions = dropdownOptions.filter(opt => !valuesUsedByOtherSkus.includes(opt.id));
                      }
                      return (
                        <Grid item xs={12} sm={6} md={4} key={`sku-${i}-pvc-${pvc.variantTypeId}`}>
                          <TextField select fullWidth label={`${pvc.variantTypeName}`} value={sku.variantSelections?.[pvc.variantTypeId] || ''}
                            onChange={(e) => {
                              const updatedSkus = [...formData.skus]; const valueId = e.target.value === '' ? '' : Number(e.target.value);
                              if (!updatedSkus[i].variantSelections) updatedSkus[i].variantSelections = {};
                              if (valueId === '') { delete updatedSkus[i].variantSelections[pvc.variantTypeId]; } else { updatedSkus[i].variantSelections[pvc.variantTypeId] = valueId; }
                              updatedSkus[i].variantValueIds = Object.values(updatedSkus[i].variantSelections).filter(id => id !== '').map(id => Number(id));
                              setFormData((prev) => ({ ...prev, skus: updatedSkus }));
                            }}
                            error={!!formErrors.skus?.[i]?.variantSelections?.[pvc.variantTypeId] || !!formErrors.skus?.[i]?.[`variantValueIds`]}
                            helperText={formErrors.skus?.[i]?.variantSelections?.[pvc.variantTypeId] || formErrors.skus?.[i]?.[`variantValueIds`]}
                            required
                          >
                            <MenuItem value="">-- Chọn {pvc.variantTypeName} --</MenuItem>
                            {dropdownOptions.map((val) => (<MenuItem key={val.id} value={val.id}>{val.value}</MenuItem>))}
                          </TextField>
                        </Grid>
                      );
                    })}
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Mã SKU" value={sku.skuCode} onChange={(e) => handleSkuChange(i, 'skuCode', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.skuCode} helperText={formErrors.skus?.[i]?.skuCode} required/></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Giá gốc" value={sku.originalPrice} onChange={(e) => handleSkuChange(i, 'originalPrice', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.originalPrice} helperText={formErrors.skus?.[i]?.originalPrice} InputProps={{ inputProps: { min: 0 } }} required/></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Giá bán" value={sku.price} onChange={(e) => handleSkuChange(i, 'price', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.price} helperText={formErrors.skus?.[i]?.price} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Tồn kho" value={sku.stock} onChange={(e) => handleSkuChange(i, 'stock', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.stock} helperText={formErrors.skus?.[i]?.stock} InputProps={{ inputProps: { min: 0 } }} required/></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Rộng (cm)" value={sku.width} onChange={(e) => handleSkuChange(i, 'width', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.width} helperText={formErrors.skus?.[i]?.width} InputProps={{ inputProps: { min: 0 } }} required/></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Cao (cm)" value={sku.height} onChange={(e) => handleSkuChange(i, 'height', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.height} helperText={formErrors.skus?.[i]?.height} InputProps={{ inputProps: { min: 0 } }} required/></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Dài (cm)" value={sku.length} onChange={(e) => handleSkuChange(i, 'length', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.length} helperText={formErrors.skus?.[i]?.length} InputProps={{ inputProps: { min: 0 } }} required/></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth type="number" label="Nặng (kg)" value={sku.weight} onChange={(e) => handleSkuChange(i, 'weight', e.target.value)} sx={{ mb: 2 }} error={!!formErrors.skus?.[i]?.weight} helperText={formErrors.skus?.[i]?.weight} InputProps={{ inputProps: { min: 0 } }} required/></Grid>
                    <Grid item xs={12}><Typography variant="subtitle2" sx={{ mb: 1 }}>Ảnh/Video cho phiên bản này (SKU {i+1})</Typography>
                      <MediaUpload files={skuMediaFiles[i] || []} onChange={(files) => handleMediaChangeForVariantSku(i, files)} />
                      {formErrors.skus?.[i]?.mediaUrls && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{formErrors.skus[i].mediaUrls}</Typography>}
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" size="large">Lưu sản phẩm</Button>
          {formErrors.form && (<Alert severity="error" sx={{ mt: 2 }}>{formErrors.form}</Alert>)}
        </Grid>
      </Grid>

      {/* Dialog thêm Loại thuộc tính mới */}
      <Dialog open={isAddVariantTypeDialogOpen} onClose={handleCloseAddVariantTypeDialog} maxWidth="xs" fullWidth disableRestoreFocus>
        <DialogTitle>Tạo Loại Thuộc Tính Mới</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb:2}}>
            Nhập tên cho loại thuộc tính mới (ví dụ: Chất liệu, Phiên bản, Dung lượng).
          </DialogContentText>
          <TextField autoFocus margin="dense" id="new-variant-type-name" label="Tên loại thuộc tính" type="text" fullWidth variant="outlined" value={newVariantTypeNameInput} onChange={(e) => setNewVariantTypeNameInput(e.target.value)} error={!!variantTypeDialogError} helperText={variantTypeDialogError}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddVariantTypeDialog} disabled={isSavingVariantType}>Hủy</Button>
          <Button onClick={handleSaveNewVariantType} variant="contained" disabled={isSavingVariantType}>
            {isSavingVariantType ? <CircularProgress size={24} /> : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm Giá trị mới cho Loại thuộc tính */}
      {currentVariantTypeForNewValue && (
        <Dialog open={isAddVariantValueDialogOpen} onClose={handleCloseAddVariantValueDialog} maxWidth="xs" fullWidth disableRestoreFocus>
          <DialogTitle>Thêm Giá Trị Mới cho "{currentVariantTypeForNewValue.name}"</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{mb:2}}>
              Nhập giá trị mới (ví dụ: nếu loại là "Màu sắc", nhập "Tím"; nếu là "Kích thước", nhập "XXL").
            </DialogContentText>
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
