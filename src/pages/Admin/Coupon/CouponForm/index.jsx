import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { couponService } from '../../../../services/admin/couponService';
import TinyEditor from '../../../../components/Admin/TinyEditor';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../../components/common/Breadcrumb';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';

export default function CouponForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      code: '',
      title: '',
      description: '',
      discountType: 'percent',
      discountValue: '',
      totalQuantity: '',
      maxUsagePerUser: '',
      minOrderValue: '',
      maxDiscountValue: '',
      startTime: '',
      endTime: '',
      type: 'public'
    }
  });

  const selectedType = watch('type');
  const selectedDiscountType = watch('discountType');

  const [loading, setLoading] = useState(false);
  const [applyUser, setApplyUser] = useState(false);
  const [applyProduct, setApplyProduct] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    if (selectedDiscountType !== 'percent') {
      setValue('maxDiscountValue', '');
    }
  }, [selectedDiscountType, setValue]);
  useEffect(() => {
    if (selectedType === 'auto' || selectedType === 'public') {
      setApplyUser(false);
    }
  }, [selectedType]);
  useEffect(() => {
    if (!applyProduct) {
      clearErrors('productIds');
    }
  }, [applyProduct, clearErrors]);
  useEffect(() => {
    if (!applyUser) {
      clearErrors('userIds');
    }
  }, [applyUser, clearErrors]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([couponService.getUsers(), couponService.getProducts()]);

        setUserList(usersRes.data || []);
        setProductList(productsRes.data || []);

        if (isEdit) {
          const couponRes = await couponService.getById(id);
          const data = couponRes.data;

          reset({
            code: data.code || '',
            title: data.title || '',
            description: data.description || '',
            discountType: data.discountType || 'percent',

            totalQuantity: data.totalQuantity || '',
            maxUsagePerUser: data.maxUsagePerUser || '',
            discountValue: formatNumber(data.discountValue),
            minOrderValue: formatNumber(data.minOrderValue),
            maxDiscountValue: formatNumber(data.maxDiscountValue),
            startTime: data.startTime ? data.startTime.slice(0, 16) : '',
            endTime: data.endTime ? data.endTime.slice(0, 16) : '',
            type: data.type || 'public'
          });

          setApplyUser((data.userIds || []).length > 0);
          setApplyProduct((data.productIds || []).length > 0);
          setSelectedUserIds(data.userIds || []);
          setSelectedProductIds(data.productIds || []);
        }
      } catch (err) {
        console.error('Lỗi load dữ liệu form:', err);
        toast.error('Không thể tải dữ liệu cho form!');
      }
    };

    fetchData();
  }, [id, isEdit, reset]);

  const onSubmit = async (values) => {
    console.log('✅ Submit called with values:', values);
    setLoading(true);
    const payload = {
      ...values,
      type: selectedType,
      applyUser,
      applyProduct,

      userIds: selectedType === 'private' && applyUser ? selectedUserIds : [],
      productIds: applyProduct ? selectedProductIds : [],


      discountValue: values.discountValue !== '' ? parseNumber(values.discountValue) : null,
      minOrderValue: values.minOrderValue !== '' ? parseNumber(values.minOrderValue) : null,

      maxDiscountValue: selectedDiscountType === 'percent' && values.maxDiscountValue !== '' ? parseNumber(values.maxDiscountValue) : null
    };

    if (payload.discountType !== 'percent') {
      payload.maxDiscountValue = null;
    }
    if (selectedType === 'private' && applyUser && selectedUserIds.length === 0) {
      setError('userIds', { message: 'Vui lòng chọn ít nhất 1 người dùng' });
      setLoading(false); // thêm dòng này
      return;
    } else {
      clearErrors('userIds');
    }


    if (applyProduct && selectedProductIds.length === 0) {
      setError('productIds', { message: 'Vui lòng chọn ít nhất 1 sản phẩm' });
      setLoading(false); // thêm dòng này
      return;
    } else {
      clearErrors('productIds');
    }

    try {
      if (isEdit) {
        await couponService.update(id, payload);
        toast.success('Cập nhật mã giảm giá thành công!');
      } else {
        await couponService.create(payload);
        toast.success('Thêm mã giảm giá thành công!');
      }
      clearErrors();
      navigate('/admin/coupons');
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          const fieldName = e.field === 'endTimeOrder' ? 'endTime' : e.field;
          setError(fieldName, { type: 'server', message: e.message });
        });
      } else {
        toast.error(err.response?.data?.message || 'Đã xảy ra lỗi');
        console.error('Lỗi lưu mã:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoaderAdmin fullscreen />;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/admin' },
            { label: 'Mã giảm giá', href: '/admin/coupons' },
            { label: isEdit ? 'Cập nhật' : 'Thêm mới' }
          ]}
        />
      </Box>

      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Cập nhật' : 'Thêm mới'} Mã Giảm Giá
      </Typography>
      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: 2,
          p: 3,
          boxShadow: 1,
          backgroundColor: '#fff',
          mt: 2
        }}
      >
        <form
          onSubmit={handleSubmit(
            onSubmit,
            (invalidErrors) => {
              console.log('❌ Form invalid:', invalidErrors);
              toast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
            }
          )}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="code"
                control={control}
                rules={{ required: 'Mã là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        Mã Code <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    fullWidth
                  />
                )}
              />


            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Tiêu đề là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        Tiêu đề <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                  />
                )}
              />

            </Grid>

            <Grid item xs={12}>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Loại coupon là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    select
                    label={
                      <span>
                        Loại coupon <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    {...field}
                    fullWidth
                  >
                    <MenuItem value="public">Công khai</MenuItem>
                    <MenuItem value="private">Chỉ định</MenuItem>
                  </TextField>
                )}
              />

            </Grid>

            {selectedType === 'private' && (
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={userList}
                  getOptionLabel={(o) => `${o.fullName} (${o.email})`}
                  value={userList.filter((u) => selectedUserIds.includes(u.id))}
                  onChange={(e, val) => setSelectedUserIds(val.map((u) => u.id))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          Chọn người dùng <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      error={!!errors.userIds}
                      helperText={errors.userIds?.message}
                    />
                  )}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Controller
                name="totalQuantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tổng số lượng"
                    type="number"
                    error={!!errors.totalQuantity}
                    helperText={errors.totalQuantity?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="maxUsagePerUser"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Số lần dùng/user"
                    type="number"
                    error={!!errors.maxUsagePerUser}
                    helperText={errors.maxUsagePerUser?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="startTime"
                control={control}
                rules={{
                  validate: (val) => {
                    if (!val) return 'Ngày bắt đầu là bắt buộc';
                    const now = new Date();
                    const start = new Date(val);
                    if (start < now) return 'Ngày bắt đầu không được trong quá khứ';
                    return true;
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        Bắt đầu <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="endTime"
                control={control}
                rules={{
                  validate: (val) => {
                    if (!val) return 'Ngày kết thúc là bắt buộc';
                    return true;
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        Kết thúc <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.discountType}>
                <InputLabel>
                  <span>
                    Loại giảm <span style={{ color: 'red' }}>*</span>
                  </span>
                </InputLabel>

                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Loại giảm">
                      <MenuItem value="percent">Phần trăm</MenuItem>
                      <MenuItem value="amount">Số tiền</MenuItem>
                      <MenuItem value="shipping">Miễn phí vận chuyển</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="discountValue"
                control={control}
                rules={{
                  validate: (val) => {
                    const number = parseNumber(val);
                    if (val === '') return 'Giá trị giảm là bắt buộc';
                    if (selectedDiscountType === 'shipping') {
                      return number >= 0 || 'Giá trị hỗ trợ phí ship phải ≥ 0';
                    }
                    if (number <= 0) return 'Giá trị giảm phải > 0';
                    if (selectedDiscountType === 'percent' && number > 100) return 'Phần trăm giảm không được vượt quá 100%';
                    return true;
                  }
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    label={
                      <span>
                        {selectedDiscountType === 'shipping'
                          ? 'Giá trị hỗ trợ phí vận chuyển'
                          : 'Giá trị giảm'} <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    value={value ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9.,]/g, '');
                      onChange(raw);
                    }}
                    onBlur={(e) => {
                      const parsed = parseNumber(e.target.value);
                      onChange(isNaN(parsed) ? '' : String(parsed));
                    }}
                    inputRef={ref}
                    fullWidth
                    error={!!errors.discountValue}
                    helperText={errors.discountValue?.message}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <Controller
                name="minOrderValue"
                control={control}
                rules={{
                  validate: (val) => {
                    const number = parseNumber(val);
                    if (val === '' || val === null || val === undefined) return 'Giá trị đơn hàng tối thiểu là bắt buộc';
                    if (isNaN(number) || number < 0) {
                      return 'Giá trị đơn hàng tối thiểu không hợp lệ';
                    }
                    return true;
                  }
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    label={
                      <span>
                        Giá trị đơn hàng tối thiểu <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    value={value ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9.,]/g, '');
                      onChange(raw);
                    }}
                    onBlur={(e) => {
                      const parsed = parseNumber(e.target.value);
                      onChange(isNaN(parsed) ? '' : String(parsed));
                    }}
                    inputRef={ref}
                    fullWidth
                    error={!!errors.minOrderValue}
                    helperText={errors.minOrderValue?.message}
                  />
                )}
              />
            </Grid>

            {selectedDiscountType === 'percent' && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxDiscountValue"
                  control={control}
                  rules={{
                    validate: (val) => {
                      const number = parseNumber(val);
                      if (selectedDiscountType === 'percent') {
                        if (val === '' || val === null || val === undefined) return 'Giá trị giảm tối đa là bắt buộc';
                        if (isNaN(number) || number < 0) return 'Giá trị giảm tối đa không hợp lệ và phải ≥ 0';
                      }
                      return true;
                    }
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label={
                        <span>
                          Giảm tối đa <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      value={value ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9.,]/g, '');
                        onChange(raw);
                      }}
                      onBlur={(e) => {
                        const parsed = parseNumber(e.target.value);
                        onChange(isNaN(parsed) ? '' : String(parsed));
                      }}
                      inputRef={ref}
                      fullWidth
                      error={!!errors.maxDiscountValue}
                      helperText={errors.maxDiscountValue?.message}
                    />
                  )}
                />
              </Grid>


            )}



            <Grid item xs={12}>
              <Typography fontWeight="bold" gutterBottom>
                Mô tả chi tiết
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => <TinyEditor value={value} onChange={onChange} height={300} />}
              />
              {errors.description && (
                <Typography color="error" variant="caption">
                  {errors.description.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight="bold" gutterBottom>
                Điều kiện áp dụng
              </Typography>


              <FormControlLabel
                control={<Checkbox checked={applyProduct} onChange={(e) => setApplyProduct(e.target.checked)} />}
                label="Áp dụng theo sản phẩm"
              />
            </Grid>



            {applyProduct && (
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={productList}
                  getOptionLabel={(o) => o.label}
                  value={productList.filter((p) => selectedProductIds.includes(p.id))}
                  onChange={(e, val) => setSelectedProductIds(val.map((p) => p.id))}
                  renderInput={(params) =>
                  (
                    <TextField
                      {...params}
                      label={
                        <span>
                          Chọn sản phẩm <span style={{ color: 'red' }}>*</span>
                        </span>
                      }

                      fullWidth
                      error={!!errors.productIds}
                      helperText={errors.productIds?.message}

                    />
                  )
                  }
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  renderTags={() => null}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {productList
                    .filter((p) => selectedProductIds.includes(p.id))
                    .map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          bgcolor: '#f5f5f5',
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="body2">{item.label}</Typography>
                        <Button
                          size="small"
                          onClick={() => setSelectedProductIds((prev) => prev.filter((id) => id !== item.id))}
                          sx={{
                            minWidth: 0,
                            ml: 1,
                            color: '#888',
                            fontWeight: 'bold',
                            padding: '0px 6px',
                            lineHeight: 1
                          }}
                        >
                          ×
                        </Button>
                      </Box>
                    ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                {isEdit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
