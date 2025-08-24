import React, { useEffect, useState, useCallback } from 'react';
import { FormControl, FormHelperText } from '@mui/material';

import { Box, Button, Grid, TextField, Typography, Switch, Paper, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';
import SkuSelectionDialog from './SkuSelectionDialog';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { flashSaleService } from '../../../../services/admin/flashSaleService';
import TinyEditor from '../../../../components/Admin/TinyEditor';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import ColorPickerField from '../../../../utils/ColorPickerField';
import FormattedNumberInput from '../../../../utils/FormattedNumberInput';
import Breadcrumb from '../../../../components/common/Breadcrumb';
import { MenuItem } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
const discountTypeOptions = [
  { label: 'Theo phần trăm', value: 'percent' },
  { label: 'Giảm cố định', value: 'amount' }
];

const FlashSaleForm = () => {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      isActive: true,
      items: [],
      orderIndex: 0,
      categories: [],
      bannerUrl: '',
      bgColor: '#FFFFFF'
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [skuOptions, setSkuOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [isSkuDialogOpen, setIsSkuDialogOpen] = useState(false);
  const initialBannerUrl = watch('bannerUrl');

  useEffect(() => {
    if (isEdit && initialBannerUrl) {
      setBannerPreview(initialBannerUrl);
    }
  }, [isEdit, initialBannerUrl]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/gif': [], 'image/webp': [] },
    multiple: false
  });

  const removeBanner = () => {
    setBannerPreview(null);
    setBannerFile(null);
  };
  const flattenCategoryTree = (tree, level = 0) => {
    return tree.reduce((acc, node) => {
      const indentation = '│   '.repeat(level) + (level > 0 ? '├─ ' : '');
      const label = `${indentation}${node.name}`;

      acc.push({ ...node, label, categoryId: node.id });
      if (node.children?.length) {
        acc = acc.concat(flattenCategoryTree(node.children, level + 1));
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [skuRes, catRes] = await Promise.all([flashSaleService.getSkus(), flashSaleService.getCategories()]);

        const skuOpts = (skuRes.data?.data || []).map((s) => ({
          ...s,
          label: `${s.productName} - ${s.skuCode} - ${formatCurrencyVND(s.originalPrice)}`
        }));
        setSkuOptions(skuOpts);

        const flatCats = flattenCategoryTree(catRes.data || []);
        console.log('Category tree gốc:', catRes.data);
        console.log('Category options sau flatten:', flatCats);
        setCategoryOptions(flatCats);

        console.log('skuOptions sau khi được set:', skuOpts);
      } catch (err) {
        console.error('Lỗi loadData:', err);
        toast.error('Lỗi tải dữ liệu SKU hoặc danh mục');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setIsInitialLoading(false);
      return;
    }

    flashSaleService
      .getById(slug)
      .then((res) => {
        const data = res.data;
        data.startTime = dayjs(data.startTime).format('YYYY-MM-DDTHH:mm');
        data.endTime = dayjs(data.endTime).format('YYYY-MM-DDTHH:mm');

        data.items = (data.flashSaleItems || []).map((item) => ({
          id: item.flashSaleSku?.id,
          skuId: item.flashSaleSku?.id,
          salePrice: item.salePrice != null ? Number(item.salePrice) : '',
          originalQuantity: item.originalQuantity ?? item.quantity,
          soldCount: (item.originalQuantity ?? item.quantity) - item.quantity,
          quantity: item.quantity,
          maxPerUser: item.maxPerUser,
          note: item.note,
          price: item.flashSaleSku?.price,         
          productName: item.flashSaleSku?.product?.name,
          skuCode: item.flashSaleSku?.skuCode,
          originalPrice: item.flashSaleSku?.originalPrice,
          stock: item.flashSaleSku?.stock
        }));

        data.categories = (data.categories || []).map((cat) => ({
          ...cat,
          categoryId: cat.category?.id,
          label: cat.category?.name,
          id: cat.category?.id
        }));
        reset(data);
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu Flash Sale!');
        navigate('/admin/flash-sale');
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  }, [slug, isEdit, navigate, reset]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('startTime', formData.startTime);
      payload.append('endTime', formData.endTime);
      payload.append('isActive', formData.isActive);
      payload.append('bgColor', formData.bgColor);
      payload.append('orderIndex', formData.orderIndex === '' || formData.orderIndex == null ? 0 : Number(formData.orderIndex));

      const itemsPayload = formData.items.map((item) => ({
        skuId: item.id,
        salePrice: item.salePrice === '' ? null : Number(item.salePrice),
        quantity: item.quantity === '' || item.quantity == null ? 0 : Number(item.quantity),
        originalQuantity: Math.max(item.originalQuantity ?? 0, Number(item.quantity)),
        maxPerUser: item.maxPerUser === '' ? null : Number(item.maxPerUser),
        note: item.note || ''
      }));

      const categoriesPayload = formData.categories.map((cat) => ({
        categoryId: cat.categoryId,
        discountType: cat.discountType || 'percent',
        discountValue: cat.discountValue === '' ? null : Number(cat.discountValue),
        maxPerUser:
          cat.maxPerUser === undefined || cat.maxPerUser === null || `${cat.maxPerUser}`.trim() === '' ? null : Number(cat.maxPerUser),
        priority: cat.priority === '' ? 0 : Number(cat.priority)
      }));

      payload.append('items', JSON.stringify(itemsPayload));
      payload.append('categories', JSON.stringify(categoriesPayload));

      if (bannerFile) {
        payload.append('bannerImage', bannerFile);
      }

      if (isEdit) {
        await flashSaleService.update(slug, payload);
        toast.success('Cập nhật thành công');
      } else {
        await flashSaleService.create(payload);
        toast.success('Tạo mới thành công');
      }
      navigate('/admin/flash-sale');
    } catch (err) {
      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        const serverErrors = err.response.data.errors;
        serverErrors.forEach((error) => {
          setError(error.field, { type: 'manual', message: error.message });
        });
        toast.error('Vui lòng kiểm tra lại các lỗi trên form.');
      } else {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu, vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemChange = (field, index, property, value) => {
    const updatedItems = [...field.value];
    updatedItems[index][property] = value;
    field.onChange(updatedItems);
  };

  if (isInitialLoading) {
    return <LoaderAdmin fullscreen />;
  }

  return (
    <Box p={2} sx={{ position: 'relative' }}>
      {isSubmitting && <LoaderAdmin fullscreen />}
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Khuyến mãi', href: '/admin/flash-sale' },
          { label: isEdit ? 'Chỉnh sửa' : 'Tạo mới' }
        ]}
      />

      <Paper sx={{ p: 3, mt: 2, opacity: isSubmitting ? 0.6 : 1 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? 'Cập nhật khuyến mãi' : 'Thêm mới khuyến mãi'}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Tên là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={
                      <span>
                        Tiêu đề <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="bgColor"
                    control={control}
                    render={({ field }) => (
                      <ColorPickerField
                        label="Màu nền"
                        value={field.value}
                        onChange={field.onChange}
                        error={!!errors.bgColor}
                        helperText={errors.bgColor?.message || 'Chọn màu hiển thị cho banner'}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="orderIndex"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Thứ tự hiển thị (STT)"
                        type="number"
                        inputProps={{ min: 0 }}
                        error={!!errors.orderIndex}
                        helperText={errors.orderIndex?.message || 'STT nhỏ sẽ hiển thị trước'}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Ảnh banner <span style={{ color: 'red' }}>*</span>
              </Typography>

              {bannerPreview ? (
                <Box sx={{ position: 'relative', border: '1px solid #ddd', borderRadius: 2, p: 1, overflow: 'hidden' }}>
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain', display: 'block' }}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                    onClick={removeBanner}
                  >
                    {' '}
                    Xóa / Đổi ảnh{' '}
                  </Button>
                </Box>
              ) : (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : errors.bannerImage ? 'error.main' : '#e0e0e0',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'action.hover' : '#fafafa',
                    transition: 'border .24s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    minHeight: 160
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography variant="h6" color="textSecondary">
                    {' '}
                    Kéo thả hoặc bấm để chọn ảnh{' '}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {' '}
                    PNG, JPG, GIF, WEBP{' '}
                  </Typography>
                </Box>
              )}
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Kích thước đề xuất: 1200px x 400px. Dung lượng nên dưới 150KB.
              </Typography>
              {errors.bannerImage && (
                <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 2 }}>
                  {' '}
                  {errors.bannerImage.message}{' '}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Mô tả chi tiết
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <TinyEditor value={field.value} onChange={field.onChange} />}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: 'Thời gian bắt đầu là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="datetime-local"
                    label={
                      <span>
                        Bắt đầu <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="endTime"
                control={control}
                rules={{
                  required: 'Thời gian kết thúc là bắt buộc',
                  validate: (value) => {
                    const startTime = watch('startTime');
                    if (dayjs(value).isBefore(dayjs(startTime))) {
                      return 'Thời gian kết thúc phải sau thời gian bắt đầu';
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="datetime-local"
                    label={
                      <span>
                        Kết thúc <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                    label="Kích hoạt Flash Sale"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Sản phẩm tham gia{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </Typography>

              <Controller
                name="items"
                control={control}
                rules={{ validate: (value) => value.length > 0 || 'Vui lòng chọn ít nhất một sản phẩm' }}
                render={({ field }) => (
                  <>
                    <FormControl fullWidth error={Boolean(errors.items) && !Array.isArray(errors.items)} sx={{ mb: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setIsSkuDialogOpen(true)}
                        sx={{
                          justifyContent: 'flex-start',
                          py: 1.25
                        }}
                      >
                        Chọn sản phẩm (SKU)
                      </Button>

                      <FormHelperText>
                        {errors.items && !Array.isArray(errors.items) ? errors.items.message : 'Chọn ít nhất một sản phẩm'}
                      </FormHelperText>
                    </FormControl>

                    <SkuSelectionDialog
                      open={isSkuDialogOpen}
                      onClose={() => setIsSkuDialogOpen(false)}
                      value={field.value.map((it) => it.id)}
                      onChange={(selectedSkus) => {
                        const updatedItems = selectedSkus.map((sku) => {
                          const existingItem = field.value.find((item) => item.id === sku.id);
                          return (
                            existingItem || {
                              id: sku.id,
                              skuId: sku.id,
                              productName: sku.productName,
                              skuCode: sku.skuCode,
                              originalPrice: sku.originalPrice,
                              stock: sku.stock,
                              salePrice: '',
                              originalQuantity: '',
                              quantity: '',
                              maxPerUser: '',
                              note: ''
                            }
                          );
                        });
                        field.onChange(updatedItems);
                      }}
                      fetchSkus={flashSaleService.getSkus}
                    />

                    <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {field.value.map((sku, index) => (
                        <Paper key={sku.id || sku.skuId} elevation={3} sx={{ p: 2 }}>
                          <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {index + 1}. {sku.productName} - {sku.skuCode} - {formatCurrencyVND(sku.originalPrice)}
                                </Typography>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => field.onChange(field.value.filter((item) => item.id !== sku.id))}
                                >
                                  Xóa
                                </Button>
                              </Box>
                            </Grid>

                            <Grid item xs={12}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
 {sku.price ? (
  <>
    {/* Giá gốc gạch ngang */}
    {sku.originalPrice && (
      <Typography
        variant="body2"
        sx={{ textDecoration: "line-through", color: "gray" }}
      >
        {formatCurrencyVND(sku.originalPrice)}
      </Typography>
    )}

    {/* Giá bán hiện tại */}
    <Typography variant="body2" color="error" fontWeight="bold">
      {formatCurrencyVND(sku.price)}
    </Typography>
  </>
) : (
  // Nếu không có price thì chỉ hiển thị originalPrice
  sku.originalPrice && (
    <Typography variant="body2" color="error" fontWeight="bold">
      {formatCurrencyVND(sku.originalPrice)}
    </Typography>
  )
)}


  {/* Đã bán */}
  {sku.soldCount != null && sku.originalQuantity != null && (
    <Typography variant="body2" color="text.secondary">
      Đã bán: <strong>{sku.soldCount}</strong> / {sku.originalQuantity} &nbsp;
      (Còn lại: <strong>{sku.originalQuantity - sku.soldCount}</strong>)
    </Typography>
  )}

  {/* Tồn kho */}
  {sku.stock != null && (
    <Typography variant="body2" color="text.secondary">
      Tồn kho: <strong>{sku.stock}</strong>
    </Typography>
  )}
</Box>

                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Controller
                                name={`items.${index}.salePrice`}
                                control={control}
                                rules={{
                                  required: 'Vui lòng nhập giá',
                                  min: { value: 1, message: 'Giá phải lớn hơn 0' },
                                  validate: (value) => Number(value) < sku.originalPrice || 'Giá sale phải nhỏ hơn giá gốc'
                                }}
                                render={({ field: priceField, fieldState }) => (
                                  <FormattedNumberInput
                                    value={priceField.value ?? ''}
                                    onChange={priceField.onChange}
                                    label="Giá sale"
                                    size="medium"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Controller
                                name={`items.${index}.quantity`}
                                control={control}
                                rules={{
                                  required: 'Số lượng là bắt buộc',
                                  validate: (value) => {
                                    const stock = Number.isFinite(Number(sku.stock)) ? Number(sku.stock) : null;
                                    if (stock !== null && Number(value) > stock) {
                                      return `Không vượt quá tồn kho (${stock})`;
                                    }
                                    return true;
                                  },
                                  min: { value: 1, message: 'Số lượng phải lớn hơn 0' }
                                }}
                                render={({ field, fieldState }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    type="number"
                                    label="Số lượng bán"
                                    size="medium"
                                    InputProps={{ inputProps: { min: 0 } }}
                                    placeholder="Mặc định 0 nếu không nhập"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Controller
                                name={`items.${index}.note`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={6}
                                    label="Ghi chú (tùy chọn)"
                                    size="small"
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Box>
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Giảm giá theo danh mục (tùy chọn)
              </Typography>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      multiple
                      options={categoryOptions.filter((opt) => !field.value.some((selected) => selected.id === opt.id))}
                      getOptionLabel={(option) => option.label}
                      value={[]}
                      onChange={(_, newValue) => {
                        const newItems = newValue.map((item) => ({
                          ...item,
                          discountType: 'percent',
                          discountValue: '',
                          maxPerUser: '',
                          priority: 0
                        }));
                        field.onChange([...field.value, ...newItems]);
                      }}
                      renderTags={() => null}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => <TextField {...params} label="Tìm và chọn danh mục áp dụng..." />}
                    />
                    <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {field.value.map((cat, index) => (
                        <Paper key={cat.id} elevation={3} sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="500">
                              {cat.label}
                            </Typography>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => field.onChange(field.value.filter((item) => item.id !== cat.id))}
                            >
                              Xóa
                            </Button>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                select
                                fullWidth
                                label="Loại giảm"
                                size="medium"
                                value={cat.discountType || 'percent'}
                                onChange={(e) => handleItemChange(field, index, 'discountType', e.target.value)}
                              >
                                {discountTypeOptions.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormattedNumberInput
                                fullWidth
                                size="medium"
                                label="Giá trị giảm"
                                value={cat.discountValue}
                                onChange={(val) => handleItemChange(field, index, 'discountValue', val)}
                                error={!!errors.categories?.[index]?.discountValue}
                                helperText={errors.categories?.[index]?.discountValue?.message}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Box>
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={isSubmitting}>
                {isSubmitting ? (isEdit ? 'Đang cập nhật...' : 'Đang tạo...') : isEdit ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default FlashSaleForm;
