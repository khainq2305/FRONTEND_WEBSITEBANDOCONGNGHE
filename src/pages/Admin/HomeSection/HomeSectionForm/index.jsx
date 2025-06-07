// src/pages/Admin/HomeSectionFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Paper,
  Stack,
  FormControlLabel,
  Switch,
  Avatar,
  Chip,
  MenuItem,
  Select as MUISelect,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress, // <--- SỬA LỖI: THÊM DÒNG NÀY
  Alert             // <--- SỬA LỖI: THÊM DÒNG NÀY
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate, useParams } from 'react-router-dom';
import { sectionService } from '../../../../services/admin/sectionService';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../../constants/environment';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';

const SECTION_TYPES = [
  { value: 'productOnly', label: 'Chỉ sản phẩm' },
  { value: 'productWithBanner', label: 'Sản phẩm + Banner' }
];

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function HomeSectionFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const [isLoadingPage, setIsLoadingPage] = useState(isEdit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      type: SECTION_TYPES[0].value,
      orderIndex: 0,
      isActive: true,
      banners: [],
      productIds: []
    }
  });

  const selectedType = watch('type');
  const { fields: bannerFields, append: addBanner, remove: removeBanner } = useFieldArray({ control, name: 'banners' });
  const watchedBanners = watch('banners');

  const [productOptions, setProductOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEdit) setIsLoadingPage(true);
      setLoadingProducts(true);

      try {
        const productRes = await sectionService.getAllProducts({ limit: 1000 });
        const productList = productRes.data?.data || [];
        
        let sectionData = null;
        if (isEdit && slug) {
          const sectionRes = await sectionService.getById(slug);
          sectionData = sectionRes.data?.data;
        }

        let mergedProducts = [...productList];
        if (sectionData?.product) {
          sectionData.product.forEach(p => {
            if (p && !mergedProducts.some(existingProd => existingProd.id === p.id)) {
              mergedProducts.push(p);
            }
          });
        }
        setProductOptions(mergedProducts);

        if (isEdit && sectionData) {
          reset({
            title: sectionData.title,
            type: sectionData.type,
            orderIndex: sectionData.orderIndex,
            isActive: sectionData.isActive,
            banners: (sectionData.banners || []).map(b => ({
              id: b.id,
              imageFile: null,
              previewUrl: b.imageUrl ? getImageUrl(b.imageUrl) : null,
              existingImageUrl: b.imageUrl,
              linkValue: b.linkValue || '',
              linkType: b.linkType || 'url',
              sortOrder: b.sortOrder
            })),
            productIds: (sectionData.product || []).map(p => p.id)
          });
        } else if (!isEdit) {
            reset({
              title: '',
              type: SECTION_TYPES[0].value,
              orderIndex: 0,
              isActive: true,
              banners: [],
              productIds: []
            });
        }

      } catch (err) {
        toast.error('Lỗi khi tải dữ liệu ban đầu.');
        console.error('Error loading initial data:', err);
        setProductOptions([]);
        if (isEdit) navigate('/admin/home-sections');
      } finally {
        setLoadingProducts(false);
        if (isEdit) setIsLoadingPage(false);
      }
    };

    loadInitialData();
  }, [slug, isEdit, reset, navigate]);

  const handleBannerImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue(`banners.${idx}.imageFile`, file, { shouldValidate: true });
    setValue(`banners.${idx}.previewUrl`, URL.createObjectURL(file));
    setValue(`banners.${idx}.existingImageUrl`, null);
  };

  const onSubmit = async (data) => {
    setIsLoadingPage(true); // Kích hoạt loader
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('orderIndex', data.orderIndex);
    formData.append('isActive', data.isActive);
    formData.append('productIds', JSON.stringify(data.productIds || []));

    const bannersMeta = [];
    (watchedBanners || []).forEach((b, index) => {
      const bannerPayload = {
        id: b.id,
        linkValue: b.linkValue || '',
        linkType: b.linkType || 'url',
        existingImageUrl: b.imageFile ? null : b.existingImageUrl,
        hasNewFile: !!b.imageFile,
        fileName: b.imageFile ? b.imageFile.name : null,
        sortOrder: b.sortOrder !== undefined ? b.sortOrder : index
      };
      bannersMeta.push(bannerPayload);
      if (b.imageFile) {
        formData.append('bannerImages', b.imageFile, b.imageFile.name);
      }
    });

    formData.append('bannersMetaJson', JSON.stringify(bannersMeta));

    try {
      const apiCall = isEdit
        ? sectionService.update(slug, formData)
        : sectionService.create(formData);

      await apiCall;
      toast.success(isEdit ? 'Cập nhật Khối thành công!' : 'Tạo mới Khối thành công!');
      navigate('/admin/home-sections');
    } catch (err) {
      const srvErrs = err?.response?.data?.errors;
      const srvMsg = err?.response?.data?.message;

      if (Array.isArray(srvErrs)) {
        let generalError = '';
        srvErrs.forEach((error) => {
          if (error.field) {
            setError(error.field, { type: 'server', message: error.message });
          } else {
            generalError += `${error.message} `;
          }
        });
        if (generalError) toast.error(generalError.trim());
      } else if (srvMsg) {
        toast.error(srvMsg);
      } else {
        toast.error('Đã có lỗi xảy ra!');
      }
      console.error("Submit error:", err);
    } finally {
      setIsLoadingPage(false); // Tắt loader
    }
  };
  
  if (isLoadingPage) {
    return <LoaderAdmin fullscreen />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Typography variant="h5" gutterBottom>
          {isEdit ? 'Cập nhật Khối Trang chủ' : 'Tạo mới Khối Trang chủ'}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Tiêu đề Khối"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('title', { required: 'Tiêu đề là bắt buộc' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Loại khối là bắt buộc' }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Loại khối</InputLabel>
                <MUISelect {...field} label="Loại khối">
                  {SECTION_TYPES.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </MUISelect>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          <TextField
            label="Thứ tự hiển thị"
            type="number"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('orderIndex', { valueAsNumber: true, min: { value: 0, message: 'Thứ tự phải ≥ 0' } })}
            error={!!errors.orderIndex}
            helperText={errors.orderIndex?.message}
          />
          <FormControlLabel
            control={<Controller name="isActive" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />}
            label="Kích hoạt khối"
          />
        </Stack>
      </Paper>

      {(selectedType === 'productOnly' || selectedType === 'productWithBanner' ) && (
        <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Sản phẩm trong khối
          </Typography>
          <FormControl fullWidth error={!!errors.productIds}>
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => {
                const selectedProductObjectsFromState = productOptions.filter((o) => (field.value || []).includes(o.id));
                return (
                  <>
                    <Autocomplete
                      multiple
                      options={productOptions}
                      loading={loadingProducts}
                      value={selectedProductObjectsFromState}
                      getOptionLabel={(o) => o.name || 'Sản phẩm không tên'}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(_, newValueObjects) => field.onChange(newValueObjects.map((x) => x.id))}
                      renderTags={() => null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Chọn sản phẩm..."
                          placeholder="Tìm theo tên sản phẩm"
                          error={!!errors.productIds}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingProducts && <CircularProgress size={20} />}
                                {params.InputProps.endAdornment}
                              </>
                            )
                          }}
                        />
                      )}
                    />
                    {selectedProductObjectsFromState.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1.5}>
                        {selectedProductObjectsFromState.map((product) => (
                          <Chip
                            key={product.id}
                            avatar={<Avatar alt={product.name} src={getImageUrl(product.thumbnail)} sx={{width: 24, height: 24}} />}
                            label={product.name || 'N/A'}
                            onDelete={() => field.onChange((field.value || []).filter((id) => id !== product.id))}
                          />
                        ))}
                      </Stack>
                    )}
                  </>
                );
              }}
            />
            {errors.productIds && (
              <FormHelperText>{errors.productIds.message}</FormHelperText>
            )}
          </FormControl>
        </Paper>
      )}

      {selectedType === 'productWithBanner' && (
        <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Quản lý Banner (Tối đa 2)
          </Typography>
          {errors.banners && (
              <Alert severity="error" sx={{ mb: 2 }}>{errors.banners.message}</Alert>
          )}
          <Stack spacing={3}>
            {bannerFields.map((fieldItem, idx) => {
              const currentBannerData = watchedBanners[idx] || {};
              const imageSourceForPreview = currentBannerData.previewUrl || (currentBannerData.existingImageUrl ? getImageUrl(currentBannerData.existingImageUrl) : null);
              const inputId = `banner-upload-${idx}`;
              return (
                <Paper key={fieldItem.id} variant="outlined" sx={{ p: 2, position: 'relative' }}>
                  <Stack spacing={1.5}>
                    <Box
                      component="label"
                      htmlFor={inputId}
                      sx={{
                        border: '2px dashed #ccc', p: 2, textAlign: 'center', cursor: 'pointer',
                        minHeight: 100, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9',
                        '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' }
                      }}
                    >
                      <input id={inputId} type="file" hidden accept="image/*" onChange={(e) => handleBannerImageChange(e, idx)} />
                      <PhotoCamera sx={{ fontSize: 38, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {imageSourceForPreview ? 'Nhấn để thay đổi ảnh Banner' : 'Nhấn để chọn ảnh Banner'}
                      </Typography>
                    </Box>

                    {imageSourceForPreview && (
                      <Box sx={{ mt: 1.5, textAlign: 'center', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, color: 'text.secondary' }}>
                          Ảnh Banner hiện tại:
                        </Typography>
                        <Avatar
                          src={imageSourceForPreview}
                          variant="rounded"
                          alt={`Banner ${idx + 1}`}
                          sx={{
                            height: 120, width: 'auto', maxWidth: '100%',
                            objectFit: 'contain', display: 'inline-block'
                          }}
                        />
                      </Box>
                    )}

                    <Controller
                      name={`banners.${idx}.linkValue`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Link cho Banner (nếu có)"
                          fullWidth
                          size="small"
                          sx={{ mt: 1 }}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Stack>
                  {bannerFields.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={() => removeBanner(idx)}
                        title="Xóa banner này"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.85)',
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'error.main',
                            bgcolor: 'rgba(255, 255, 255, 1)',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Paper>
              );
            })}
            <Button
              startIcon={<AddCircleOutlineIcon />}
              
              onClick={() =>
                addBanner({
                  id: undefined,
                  imageFile: null,
                  previewUrl: null,
                  existingImageUrl: null,
                  linkValue: '',
                  linkType: 'url',
                  
                  sortOrder: bannerFields.length
                })
              }
              disabled={bannerFields.length >= 2}
              variant="outlined"
        

            >
              Thêm Banner
            </Button>
          </Stack>
        </Paper>
      )}

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
        <Button variant="outlined" onClick={() => navigate('/admin/home-sections')} disabled={isSubmitting}>
          Hủy bỏ
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isEdit ? 'Cập nhật Khối' : 'Tạo mới Khối'}
        </Button>
      </Stack>
    </Box>
  );
}