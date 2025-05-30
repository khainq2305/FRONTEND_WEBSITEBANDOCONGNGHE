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
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate, useParams } from 'react-router-dom';
import { sectionService } from '../../../../services/admin/sectionService';
import { toast } from 'react-toastify';

const SECTION_TYPES = [
  { value: 'productOnly',        label: 'Chỉ sản phẩm' },
  { value: 'productWithBanner',  label: 'Sản phẩm + Banner' },
  { value: 'productWithFilters', label: 'Sản phẩm + Bộ lọc' },
  { value: 'fullBlock',          label: 'Sản phẩm + Banner + Bộ lọc' }
];

export default function HomeSectionFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      type: SECTION_TYPES[0].value,
      orderIndex: 0,
      isActive: true,
      banners: [],
      skuIds: [],
      filters: []
    }
  });

  const selectedType = watch('type');
  const { fields: bannerFields, append: addBanner, remove: removeBanner } = useFieldArray({ control, name: 'banners' });
  const { fields: filterFields, append: addFilter, remove: removeFilter } = useFieldArray({ control, name: 'filters' });
  const watchedBanners = watch('banners');
  const watchedFilters = watch('filters');

  const [skuOptions, setSkuOptions] = useState([]);
  const [loadingSku, setLoadingSku] = useState(false);
  const [categoryOptions] = useState([{ id: 'cat1', name: 'Thời trang Nam' }, { id: 'cat2', name: 'Thời trang Nữ' }]);
  const [brandOptions]    = useState([{ id: 'brandA', name: 'Brand A' }, { id: 'brandB', name: 'Brand B' }]);
  const [loadingCategories] = useState(false);
  const [loadingBrands]     = useState(false);

  // fetch SKU list
  useEffect(() => {
    (async () => {
      setLoadingSku(true);
      try {
        const res = await sectionService.getAllSkus({ limit: 50 });
        setSkuOptions(res.data.data);
      } catch {
        setSkuOptions([]);
      } finally {
        setLoadingSku(false);
      }
    })();
  }, []);

  // fetch existing section when editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await sectionService.getDetail(id);
        const s = res.data.data;
        reset({
          title: s.title,
          type: s.type,
          orderIndex: s.orderIndex,
          isActive: s.isActive,
          banners: (s.banners || []).map(b => ({
            id: b.id,
            imageFile: null,
            previewUrl: b.imageUrl,
            existingImageUrl: b.imageUrl,
            linkValue: b.linkValue,
            linkType: b.linkType
          })),
          skuIds: (s.productHomeSections || []).map(p => p.skuId),
          filters: s.filters || []
        });
      } catch (err) {
        toast.error('Không tải được dữ liệu section');
      }
    })();
  }, [id, isEdit, reset]);

  const handleBannerImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue(`banners.${idx}.imageFile`, file, { shouldValidate: true });
    setValue(`banners.${idx}.previewUrl`, URL.createObjectURL(file));
    setValue(`banners.${idx}.existingImageUrl`, null);
  };

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('orderIndex', data.orderIndex);
    formData.append('isActive', data.isActive);

    const bannersMeta = [];
    (watchedBanners || []).forEach(b => {
      bannersMeta.push({
        id: b.id,
        linkValue: b.linkValue || '',
        linkType: b.linkType || 'url',
        existingImageUrl: b.imageFile ? null : b.existingImageUrl,
        hasNewFile: !!b.imageFile
      });
      if (b.imageFile) formData.append('bannerFiles', b.imageFile);
    });
    formData.append('bannersMetaJson', JSON.stringify(bannersMeta));
    formData.append('skuIds', JSON.stringify(data.skuIds || []));
    formData.append('filters', JSON.stringify(data.filters || []));

    try {
      const apiCall = isEdit
        ? sectionService.update(id, formData)
        : sectionService.create(formData);
      const res = await apiCall;
      toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo section thành công!');
      navigate('/admin/home-sections');
    } catch (err) {
      const srvErrs = err?.response?.data?.errors;
      if (Array.isArray(srvErrs)) {
        srvErrs.forEach(e => {
          if (e.field) setError(e.field, { type: 'server', message: e.message });
          toast.error(e.message);
        });
      } else {
        toast.error('Đã có lỗi xảy ra!');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
      <Paper sx={{ p:3, mb:3 }} elevation={2}>
        <Typography variant="h5" gutterBottom>
          {isEdit ? 'Cập nhật Khối Trang chủ' : 'Tạo mới Khối Trang chủ'}
        </Typography>
        <Stack spacing={2}>
          <TextField
   label="Tiêu đề Khối"
  fullWidth
   InputLabelProps={{ shrink: true }}       // ← bắt buộc phải có
   {...register('title', { required: 'Tiêu đề là bắt buộc' })}
  error={!!errors.title}
  helperText={errors.title?.message}
/>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Loại khối</InputLabel>
                <MUISelect {...field} label="Loại khối">
                  {SECTION_TYPES.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </MUISelect>
                {errors.type && <Typography variant="caption" color="error">{errors.type.message}</Typography>}
              </FormControl>
            )}
          />
          <TextField
            label="Thứ tự hiển thị"
            type="number"
            fullWidth
            {...register('orderIndex', { valueAsNumber:true, min:{value:0,message:'Phải ≥ 0'} })}
            error={!!errors.orderIndex}
            helperText={errors.orderIndex?.message}
          />
          <FormControlLabel
            control={<Controller name="isActive" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />}
            label="Kích hoạt khối"
          />
        </Stack>
      </Paper>

      {/* Products */}
      {(selectedType !== 'productWithBanner' && selectedType !== 'productWithFilters') || (
        <Paper sx={{ p:3, mb:3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>Sản phẩm trong khối</Typography>
          <Controller
            name="skuIds"
            control={control}
            render={({ field }) => {
              const selected = skuOptions.filter(o => field.value.includes(o.id));
              return (
                <>
                  <Autocomplete
                    multiple
                    options={skuOptions}
                    loading={loadingSku}
                    value={selected}
                    getOptionLabel={o => `${o.product?.name} (${o.skuCode})`}
                    isOptionEqualToValue={(a,b) => a.id===b.id}
                    onChange={(_, v) => field.onChange(v.map(x=>x.id))}
                    renderTags={() => null}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Chọn sản phẩm..."
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingSku && <CircularProgress size={20} />}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                  />
                  {selected.length>0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                      {selected.map(sku=>(
                        <Chip
                          key={sku.id}
                          label={`${sku.product?.name} (${sku.skuCode})`}
                          onDelete={()=> field.onChange(field.value.filter(id=>id!==sku.id))}
                        />
                      ))}
                    </Stack>
                  )}
                </>
              );
            }}
          />
        </Paper>
      )}

      {/* Banners */}
      {(selectedType === 'productWithBanner' || selectedType === 'fullBlock') && (
        <Paper sx={{ p:3, mb:3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>Quản lý Banner (Tối đa 2)</Typography>
          <Stack spacing={3}>
            {bannerFields.map((f, idx) => {
              const b = watchedBanners[idx] || {};
              const src = b.previewUrl || b.existingImageUrl;
              const inputId = `banner-upload-${idx}`;
              return (
                <Paper key={f.id} variant="outlined" sx={{ p:2, position:'relative' }}>
                  <Stack spacing={1.5}>
                    <Box
                      component="label"
                      htmlFor={inputId}
                      sx={{
                        border:'2px dashed #ccc',
                        p:2,
                        textAlign:'center',
                        cursor:'pointer',
                        minHeight:180,
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor: src?'#f9f9f9':'transparent',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: src?'#f0f0f0':'action.hover'
                        }
                      }}
                    >
                      <input
                        id={inputId}
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={e=> handleBannerImageChange(e, idx)}
                      />
                      {src
                        ? <Avatar src={src} variant="rounded" sx={{ maxHeight:100, maxWidth:'100%', mb:1, objectFit:'contain' }} />
                        : <PhotoCamera sx={{ fontSize:48, color:'text.secondary', mb:1 }} />
                      }
                      <Typography variant="caption" color="text.secondary">
                        {src ? 'Nhấn để thay ảnh' : 'Click để chọn ảnh'}
                      </Typography>
                    </Box>
                    <Controller
                      name={`banners.${idx}.linkValue`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Link (nếu có)" fullWidth size="small" sx={{ mt:1 }} />
                      )}
                    />
                  </Stack>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={()=>removeBanner(idx)}
                    sx={{ position:'absolute', top:8, right:8, bgcolor:'rgba(255,255,255,0.7)' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              );
            })}
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={()=>addBanner({ id:undefined, imageFile:null, previewUrl:null, existingImageUrl:null, linkValue:'', linkType:'url' })}
              disabled={bannerFields.length>=2}
              variant="outlined"
            >
              Thêm Banner
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Filters */}
      {(selectedType === 'productWithFilters' || selectedType === 'fullBlock') && (
        <Paper sx={{ p:3, mb:3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>Bộ lọc hiển thị</Typography>
          <Stack spacing={2}>
            {filterFields.map((f, idx)=>(
              <Paper key={f.id} variant="outlined" sx={{ p:2, position:'relative' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Controller
                    name={`filters.${idx}.type`}
                    control={control}
                    defaultValue="url"
                    render={({ field })=>(
                      <FormControl size="small" sx={{ minWidth:120 }}>
                        <InputLabel>Loại</InputLabel>
                        <MUISelect {...field} label="Loại">
                          <MenuItem value="url">URL</MenuItem>
                          <MenuItem value="category">Danh mục</MenuItem>
                          <MenuItem value="brand">Thương hiệu</MenuItem>
                        </MUISelect>
                      </FormControl>
                    )}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Label hiển thị"
                    {...register(`filters.${idx}.label`, { required:'Label là bắt buộc' })}
                    error={!!errors.filters?.[idx]?.label}
                    helperText={errors.filters?.[idx]?.label?.message}
                  />
                  {watchedFilters[idx]?.type==='url' && (
                    <TextField
                      size="small"
                      fullWidth
                      label="Giá trị (URL)"
                      {...register(`filters.${idx}.value`, { required:'Giá trị là bắt buộc' })}
                      error={!!errors.filters?.[idx]?.value}
                      helperText={errors.filters?.[idx]?.value?.message}
                    />
                  )}
                  {watchedFilters[idx]?.type==='category' && (
                    <Controller
                      name={`filters.${idx}.value`}
                      control={control}
                      rules={{ required:'Chọn danh mục' }}
                      render={({ field })=>(
                        <Autocomplete
                          options={categoryOptions}
                          size="small"
                          fullWidth
                          value={categoryOptions.find(o=>o.id===field.value)||null}
                          getOptionLabel={o=>o.name}
                          onChange={(_, v)=>field.onChange(v?.id||'')}
                          renderInput={p=>(
                            <TextField
                              {...p}
                              label="Danh mục"
                              error={!!errors.filters?.[idx]?.value}
                              helperText={errors.filters?.[idx]?.value?.message}
                            />
                          )}
                        />
                      )}
                    />
                  )}
                  {watchedFilters[idx]?.type==='brand' && (
                    <Controller
                      name={`filters.${idx}.value`}
                      control={control}
                      rules={{ required:'Chọn thương hiệu' }}
                      render={({ field })=>(
                        <Autocomplete
                          options={brandOptions}
                          size="small"
                          fullWidth
                          value={brandOptions.find(o=>o.id===field.value)||null}
                          getOptionLabel={o=>o.name}
                          onChange={(_, v)=>field.onChange(v?.id||'')}
                          renderInput={p=>(
                            <TextField
                              {...p}
                              label="Thương hiệu"
                              error={!!errors.filters?.[idx]?.value}
                              helperText={errors.filters?.[idx]?.value?.message}
                            />
                          )}
                        />
                      )}
                    />
                  )}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={()=>removeFilter(idx)}
                    sx={{ position:'absolute', top:8, right:8, bgcolor:'rgba(255,255,255,0.7)' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={()=>addFilter({ type:'url', label:'', value:'' })}
              variant="outlined"
            >
              Thêm bộ lọc
            </Button>
          </Stack>
        </Paper>
      )}

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
        <Button variant="outlined" onClick={()=>navigate('/admin/home-sections')}>
          Hủy bỏ
        </Button>
        <Button type="submit" variant="contained">
          {isEdit ? 'Cập nhật Khối' : 'Tạo mới Khối'}
        </Button>
      </Stack>
    </Box>
  );
}
