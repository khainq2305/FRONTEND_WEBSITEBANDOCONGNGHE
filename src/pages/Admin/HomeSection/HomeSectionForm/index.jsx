import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Box, TextField, Button, Typography, IconButton, Paper, Stack,
  FormControlLabel, Switch, Avatar, Chip, Checkbox,
  MenuItem, Select as MUISelect, FormControl, InputLabel // Thêm cho Filter Type
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Icon cho nút upload
import { sectionService } from '../../../../services/admin/sectionService';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

const checkboxIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxCheckedIcon = <CheckBoxIcon fontSize="small" />;

const HomeSectionFormPage = ({ initialData = null, onSuccess }) => {
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors: formErrors } } = useForm({
    defaultValues: {
      title: '',
      orderIndex: 0,
      isActive: true,
      banners: [], // Mỗi banner: { imageFile: null, previewUrl: null, existingImageUrl: null, linkValue: '' }
      skuIds: [],
      filters: [] // Mỗi filter: { type: 'url', label: '', value: '' }
    }
  });

  const { fields: bannerFields, append: addBanner, remove: removeBanner } = useFieldArray({
    control,
    name: 'banners'
  });

  const { fields: filterFields, append: addFilter, remove: removeFilter } = useFieldArray({
    control,
    name: 'filters'
  });

  // Watch giá trị của mảng filters để cập nhật UI tương ứng với type
  const watchedFilters = watch('filters');

  const [skuOptions, setSkuOptions] = useState([]);
  const [loadingSku, setLoadingSku] = useState(false);
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');

  // --- States và functions cho Category và Brand (cho Filters) ---
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [brandOptions, setBrandOptions] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  const fetchSkus = async () => {
    try {
      setLoadingSku(true);
      const res = await sectionService.getAllSkus();
      setSkuOptions(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách SKU:', error);
      setSkuOptions([]);
    } finally {
      setLoadingSku(false);
    }
  };

  // TODO: Bạn cần tạo các hàm này trong sectionService và cập nhật endpoint
  const fetchCategoriesForFilter = async () => {
    // setLoadingCategories(true);
    // try {
    //   // const res = await sectionService.getAllCategoriesForFilter(); // Ví dụ
    //   // setCategoryOptions(Array.isArray(res.data?.data) ? res.data.data : []);
    //   setCategoryOptions([{ id: 1, name: 'Danh mục mẫu 1' }, { id: 2, name: 'Danh mục mẫu 2' }]); // Dữ liệu mẫu
    // } catch (error) {
    //   console.error('Lỗi lấy danh mục cho filter:', error);
    // } finally {
    //   setLoadingCategories(false);
    // }
    console.log('Đang tải danh mục (chức năng mẫu)...');
     setCategoryOptions([{ id: 'cat1', name: 'Thời trang Nam' }, { id: 'cat2', name: 'Thời trang Nữ' }]); // Dữ liệu mẫu
  };

  const fetchBrandsForFilter = async () => {
    // setLoadingBrands(true);
    // try {
    //   // const res = await sectionService.getAllBrandsForFilter(); // Ví dụ
    //   // setBrandOptions(Array.isArray(res.data?.data) ? res.data.data : []);
    //    setBrandOptions([{ id: 1, name: 'Thương hiệu mẫu 1' }, { id: 2, name: 'Thương hiệu mẫu 2' }]); // Dữ liệu mẫu
    // } catch (error) {
    //   console.error('Lỗi lấy thương hiệu cho filter:', error);
    // } finally {
    //   setLoadingBrands(false);
    // }
    console.log('Đang tải thương hiệu (chức năng mẫu)...');
    setBrandOptions([{ id: 'brandA', name: 'Brand A' }, { id: 'brandB', name: 'Brand B' }]); // Dữ liệu mẫu
  };


  useEffect(() => {
    fetchSkus();
    fetchCategoriesForFilter(); // Gọi để lấy danh sách category
    fetchBrandsForFilter();     // Gọi để lấy danh sách brand
  }, []);

  useEffect(() => {
    if (initialData) {
      const formattedBanners = (initialData.banners || []).map(b => ({
        imageFile: null,
        previewUrl: null, // Preview sẽ được tạo nếu có file mới
        existingImageUrl: b.imageUrl || null, // Giả sử initialData có imageUrl
        linkValue: b.linkValue || ''
      }));
      reset({
        ...initialData,
        banners: formattedBanners,
        skuIds: initialData.skuIds || [],
        filters: initialData.filters || [],
        isActive: initialData.isActive ?? true,
      });
    } else {
      reset({
        title: '',
        orderIndex: 0,
        isActive: true,
        banners: [{ imageFile: null, previewUrl: null, existingImageUrl: null, linkValue: '' }], // Khởi tạo với 1 banner trống
        skuIds: [],
        filters: [{ type: 'url', label: '', value: '' }] // Khởi tạo với 1 filter URL trống
      });
    }
  }, [initialData, reset]);

  const handleBannerImageChange = (event, bannerIndex) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(`banners.${bannerIndex}.imageFile`, file);
      setValue(`banners.${bannerIndex}.previewUrl`, URL.createObjectURL(file));
      setValue(`banners.${bannerIndex}.existingImageUrl`, null); // Xóa ảnh cũ nếu chọn ảnh mới
    }
  };


  const onSubmit = async (data) => {
    // QUAN TRỌNG: Khi có file, bạn cần gửi FormData
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('orderIndex', String(data.orderIndex));
    formData.append('isActive', String(data.isActive));

    // Xử lý banners
    (data.banners || []).forEach((banner, index) => {
      formData.append(`banners[${index}][linkValue]`, banner.linkValue || '');
      if (banner.imageFile instanceof File) {
        formData.append(`banners[${index}][image]`, banner.imageFile);
      } else if (banner.existingImageUrl) {
        // Nếu backend hỗ trợ việc giữ lại ảnh cũ qua URL, bạn có thể gửi nó
        // Hoặc logic update ở backend sẽ không thay đổi ảnh nếu không có file mới.
        formData.append(`banners[${index}][existingImageUrl]`, banner.existingImageUrl);
      }
      // Nếu không có imageFile và không có existingImageUrl, backend có thể hiểu là xóa ảnh (tùy logic)
    });
     // Đảm bảo gửi mảng rỗng nếu không có banner nào
    if (!data.banners || data.banners.length === 0) {
        formData.append('banners', JSON.stringify([]));
    }


    // Xử lý skuIds (gửi dưới dạng JSON string nếu backend không xử lý mảng object trực tiếp từ FormData)
    const validSkuIds = Array.isArray(data.skuIds) ? data.skuIds.filter(id => id != null && String(id).trim() !== '') : [];
    formData.append('skuIds', JSON.stringify(validSkuIds));

    // Xử lý filters (tương tự)
    const validFilters = (data.filters || []).filter(f => f.label && f.value);
    formData.append('filters', JSON.stringify(validFilters));

    console.log('Submitting FormData:', formData);
    // for (var pair of formData.entries()) { // Dùng để debug FormData
    //     console.log(pair[0]+ ', ' + pair[1]);
    // }

    try {
      const res = initialData
        ? await sectionService.update(initialData.id, formData) // Service phải xử lý FormData
        : await sectionService.create(formData); // Service phải xử lý FormData

      onSuccess?.(res?.data?.section || {});
    } catch (error) {
      console.error('❌ Lỗi lưu khối:', error);
      // Xử lý lỗi, ví dụ hiển thị thông báo cho người dùng
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Thông tin chung</Typography>
        <Stack spacing={2}>
          <TextField /* ... Tiêu đề ... */
            label="Tiêu đề"
            fullWidth
            {...register('title', { required: 'Tiêu đề là bắt buộc' })}
            error={!!formErrors.title}
            helperText={formErrors.title?.message}
          />
          <TextField /* ... Thứ tự hiển thị ... */
            label="Thứ tự hiển thị"
            type="number"
            fullWidth
            {...register('orderIndex', { valueAsNumber: true, validate: v => v >= 0 || "Thứ tự phải lớn hơn hoặc bằng 0"})}
            error={!!formErrors.orderIndex}
            helperText={formErrors.orderIndex?.message}
          />
          <FormControlLabel /* ... Khối hoạt động ... */
            control={<Switch {...register('isActive')} />}
            label="Khối hoạt động"
          />
        </Stack>
      </Paper>

      {/* Banners --- CÓ THAY ĐỔI */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Banner (Tối đa 2 banner)</Typography>
        <Stack spacing={2}>
          {bannerFields.map((field, idx) => {
            const currentBanner = watch(`banners.${idx}`); // Lấy giá trị hiện tại của banner để hiển thị preview
            const previewSrc = currentBanner?.previewUrl || currentBanner?.existingImageUrl;
            return (
              <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Button
                        variant="outlined"
                        component="label" // Cho phép input type="file" hoạt động với Button
                        startIcon={<PhotoCamera />}
                      >
                        Chọn ảnh Banner
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleBannerImageChange(e, idx)}
                        />
                      </Button>
                     {previewSrc && (
                        <Avatar
                          src={previewSrc}
                          alt={`Banner ${idx + 1} preview`}
                          variant="rounded"
                          sx={{ width: 100, height: 56, objectFit: 'contain' }}
                        />
                      )}
                  </Box>
                  <Controller
                    name={`banners.${idx}.linkValue`}
                    control={control}
                    defaultValue={field.linkValue || ''}
                    render={({ field: linkField }) => (
                      <TextField
                        {...linkField}
                        label="Link cho Banner (nếu có)"
                        fullWidth
                        size="small"
                      />
                    )}
                  />

                </Stack>
                <IconButton onClick={() => removeBanner(idx)} color="error" sx={{ mt: 1, float: 'right' }}>
                  <DeleteIcon />
                </IconButton>
                 <Box sx={{clear: 'both'}} /> {/* Clear float */}
              </Paper>
            );
          })}
          <Button
            variant="outlined"
            onClick={() => addBanner({ imageFile: null, previewUrl: null, existingImageUrl: null, linkValue: '' })}
            startIcon={<AddCircleOutlineIcon />}
            disabled={bannerFields.length >= 2}
          >
            Thêm Banner
          </Button>
        </Stack>
      </Paper>

      {/* SKU - Chọn nhiều, hiển thị danh sách đã chọn BÊN DƯỚI */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Sản phẩm</Typography>
        <Controller /* ... Autocomplete cho SKU ... */
          name="skuIds"
          control={control}
          render={({ field: { onChange: onChangeRHFSelectedSkuIds, value: rHFSelectedSkuIds = [] }, fieldState: { error: fieldError } }) => {
            const selectedSkuObjects = skuOptions.filter(opt => rHFSelectedSkuIds.includes(opt.id));
            return (
              <>
                <Autocomplete
                  multiple
                  fullWidth
                  options={skuOptions.filter(opt => !rHFSelectedSkuIds.includes(opt.id))}
                  loading={loadingSku}
                  value={[]}
                  getOptionLabel={(option) => option?.product?.name ? `${option.product.name} (${option.skuCode})` : (option?.id ? `SKU ID: ${option.id}`: '')}
                  isOptionEqualToValue={(option, currentVal) => option.id === currentVal.id}
                  onChange={(event, newlySelectedObjectsFromDropdown) => {
                    const currentSelectedIdsSet = new Set(rHFSelectedSkuIds);
                    newlySelectedObjectsFromDropdown.forEach(obj => currentSelectedIdsSet.add(obj.id));
                    onChangeRHFSelectedSkuIds(Array.from(currentSelectedIdsSet));
                    setAutocompleteInputValue('');
                  }}
                  inputValue={autocompleteInputValue}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input') setAutocompleteInputValue(newInputValue);
                    else if (reason === 'clear' && event) setAutocompleteInputValue('');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Thêm sản phẩm..."
                      variant="outlined"
                      error={!!fieldError}
                      helperText={fieldError?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSku ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  renderTags={() => null}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} key={option.id}>
                      <Checkbox icon={checkboxIcon} checkedIcon={checkboxCheckedIcon} style={{ marginRight: 8 }} checked={selected}/>
                      {option.product?.imageUrl && (<Avatar src={option.product.imageUrl} alt={option.product?.name} sx={{ width: 32, height: 32, marginRight: 1 }} variant="rounded"/>)}
                      <Stack>
                        <Typography variant="subtitle2">{option.product?.name || 'Chưa có tên SP'}</Typography>
                        <Typography variant="caption" color="text.secondary">SKU: {option.skuCode || 'N/A'}</Typography>
                      </Stack>
                    </li>
                  )}
                  noOptionsText="Không tìm thấy hoặc đã chọn"
                  loadingText="Đang tải..."
                  disableCloseOnSelect
                />
                {rHFSelectedSkuIds.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 1.5, mt: 2, background: (theme) => theme.palette.action.hover }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>Sản phẩm đã chọn ({rHFSelectedSkuIds.length}):</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedSkuObjects.map((skuObject) => (
                        <Chip
                          key={skuObject.id}
                          avatar={skuObject.product?.imageUrl ? <Avatar src={skuObject.product.imageUrl} alt={skuObject.product?.name} /> : undefined}
                          label={`${skuObject.product?.name || 'Chưa có tên SP'} (${skuObject.skuCode || 'N/A'})`}
                          onDelete={() => {
                            const newSelectedIds = rHFSelectedSkuIds.filter(id => id !== skuObject.id);
                            onChangeRHFSelectedSkuIds(newSelectedIds);
                          }}
                          color="primary"
                          variant="filled"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                )}
              </>
            );
          }}
        />
      </Paper>

      {/* Filters --- CÓ THAY ĐỔI */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Bộ lọc</Typography>
        <Stack spacing={2}>
          {filterFields.map((field, idx) => (
            <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
                <Controller
                  name={`filters.${idx}.type`}
                  control={control}
                  defaultValue={'url'}
                  render={({ field: typeField }) => (
                    <FormControl fullWidth sx={{minWidth: 150, mb: {xs: 2, sm: 0}}}>
                      <InputLabel>Loại bộ lọc</InputLabel>
                      <MUISelect
                        {...typeField}
                        label="Loại bộ lọc"
                        onChange={(e) => {
                          typeField.onChange(e.target.value);
                          setValue(`filters.${idx}.value`, ''); // Reset giá trị khi đổi type
                        }}
                      >
                        <MenuItem value="url">URL tùy chỉnh</MenuItem>
                        <MenuItem value="category">Danh mục sản phẩm</MenuItem>
                        <MenuItem value="brand">Thương hiệu</MenuItem>
                      </MUISelect>
                    </FormControl>
                  )}
                />
                <TextField
                  label="Tên hiển thị bộ lọc (Label)"
                  fullWidth
                  {...register(`filters.${idx}.label`, { required: "Label là bắt buộc"})}
                  error={!!formErrors.filters?.[idx]?.label}
                  helperText={formErrors.filters?.[idx]?.label?.message}
                />
                {watchedFilters?.[idx]?.type === 'url' && (
                  <TextField
                    label="Giá trị (URL)"
                    fullWidth
                    {...register(`filters.${idx}.value`, { required: "Giá trị URL là bắt buộc"})}
                    error={!!formErrors.filters?.[idx]?.value}
                    helperText={formErrors.filters?.[idx]?.value?.message}
                  />
                )}
                {watchedFilters?.[idx]?.type === 'category' && (
                  <Controller
                    name={`filters.${idx}.value`}
                    control={control}
                    rules={{ required: "Vui lòng chọn danh mục"}}
                    render={({ field: catValueField, fieldState: { error: catError } }) => (
                      <Autocomplete
                        fullWidth
                        options={categoryOptions} // Bạn cần fetch và set state này
                        loading={loadingCategories}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value} // value ở đây là ID
                        value={categoryOptions.find(opt => opt.id === catValueField.value) || null}
                        onChange={(e, newValue) => catValueField.onChange(newValue ? newValue.id : '')}
                        renderInput={(params) => (
                          <TextField {...params} label="Chọn danh mục" error={!!catError} helperText={catError?.message} />
                        )}
                      />
                    )}
                  />
                )}
                {watchedFilters?.[idx]?.type === 'brand' && (
                   <Controller
                    name={`filters.${idx}.value`}
                    control={control}
                    rules={{ required: "Vui lòng chọn thương hiệu"}}
                    render={({ field: brandValueField, fieldState: { error: brandError } }) => (
                      <Autocomplete
                        fullWidth
                        options={brandOptions} // Bạn cần fetch và set state này
                        loading={loadingBrands}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        value={brandOptions.find(opt => opt.id === brandValueField.value) || null}
                        onChange={(e, newValue) => brandValueField.onChange(newValue ? newValue.id : '')}
                        renderInput={(params) => (
                          <TextField {...params} label="Chọn thương hiệu" error={!!brandError} helperText={brandError?.message} />
                        )}
                      />
                    )}
                  />
                )}
                <IconButton onClick={() => removeFilter(idx)} color="error" sx={{ mt: {xs: 1, sm: 0}}}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Paper>
          ))}
          <Button
            variant="outlined"
            onClick={() => addFilter({ type: 'url', label: '', value: '' })}
            startIcon={<AddCircleOutlineIcon />}
          >
            Thêm bộ lọc
          </Button>
        </Stack>
      </Paper>

      <Box mt={3}>
        <Button type="submit" variant="contained" color="primary" fullWidth size="large">
          {initialData ? 'Cập nhật khối' : 'Tạo mới khối'}
        </Button>
      </Box>
    </Box>
  );
};

export default HomeSectionFormPage;