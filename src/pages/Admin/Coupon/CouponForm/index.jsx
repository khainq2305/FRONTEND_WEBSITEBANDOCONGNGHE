// imports...
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Grid, MenuItem, TextField, Typography,
  FormControl, InputLabel, Select, Checkbox,
  FormControlLabel, Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { couponService } from '../../../../services/admin/couponService';
import TinyEditor from '../../../../components/Admin/TinyEditor';

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
  const [applyCategory, setApplyCategory] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    couponService.getUsers().then((res) => setUserList(res.data || []));
    couponService.getCategories().then((res) => setCategoryList(res.data || []));
    couponService.getProducts().then((res) => setProductList(res.data || []));
  }, []);

  useEffect(() => {
   if (selectedType === 'auto') {
  setApplyUser(false);           // auto không áp theo user
  // vẫn giữ applyProduct và applyCategory theo checkbox
} else if (selectedType === 'public') {
  setApplyUser(false);           // public cũng không áp theo user
}

  }, [selectedType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, categoriesRes] = await Promise.all([
          couponService.getUsers(),
          couponService.getProducts(),
          couponService.getCategories()
        ]);

        setUserList(usersRes.data || []);
        setProductList(productsRes.data || []);
        setCategoryList(categoriesRes.data || []);

        if (isEdit) {
          const couponRes = await couponService.getById(id);
          const data = couponRes.data;

          reset({
            code: data.code || '',
            title: data.title || '',
            description: data.description || '',
            discountType: data.discountType || 'percent',
            discountValue: data.discountValue || '',
            totalQuantity: data.totalQuantity || '',
            maxUsagePerUser: data.maxUsagePerUser || '',
            minOrderValue: data.minOrderValue || '',
            maxDiscountValue: data.maxDiscountValue || '',
            startTime: data.startTime ? data.startTime.slice(0, 16) : '',
            endTime: data.endTime ? data.endTime.slice(0, 16) : '',
            type: data.type || 'public'
          });

          setApplyUser((data.userIds || []).length > 0);
          setApplyProduct((data.productIds || []).length > 0);
          setApplyCategory((data.categoryIds || []).length > 0);
          setSelectedUserIds(data.userIds || []);
          setSelectedProductIds(data.productIds || []);
          setSelectedCategoryIds(data.categoryIds || []);
        }
      } catch (err) {
        console.error('❌ Lỗi load dữ liệu form:', err);
      }
    };

    fetchData();
  }, [id, isEdit, reset]);

  const onSubmit = async (values) => {
    setLoading(true);
    const payload = {
      ...values,
      userIds: selectedType === 'private' && applyUser ? selectedUserIds : [],
      productIds: selectedType !== 'auto' && applyProduct ? selectedProductIds : [],
      categoryIds: selectedType !== 'auto' && applyCategory ? selectedCategoryIds : []
    };

    try {
      if (isEdit) {
        await couponService.update(id, payload);
      } else {
        await couponService.create(payload);
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
        console.error('Lỗi lưu mã:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Code */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Mã Code" error={!!errors.code} helperText={errors.code?.message} fullWidth />
              )}
            />
          </Grid>

          {/* Type */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField select label="Loại coupon" {...field} fullWidth>
                  <MenuItem value="public">Công khai</MenuItem>
                  <MenuItem value="private">Chỉ định</MenuItem>
                  <MenuItem value="auto">Tự động</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* Title */}
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Tiêu đề" error={!!errors.title} helperText={errors.title?.message} fullWidth />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography fontWeight="bold" gutterBottom>Mô tả chi tiết</Typography>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TinyEditor value={value} onChange={onChange} height={300} />
              )}
            />
            {errors.description && (
              <Typography color="error" variant="caption">{errors.description.message}</Typography>
            )}
          </Grid>

          {/* Discount Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.discountType}>
              <InputLabel>Loại giảm</InputLabel>
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

          {/* Discount Value */}
          {selectedDiscountType !== 'shipping' && (
            <Grid item xs={12} sm={6}>
              <Controller
                name="discountValue"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Giá trị giảm" type="number" error={!!errors.discountValue} helperText={errors.discountValue?.message} fullWidth />
                )}
              />
            </Grid>
          )}

          {/* Total Quantity */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="totalQuantity"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Tổng số lượng" type="number" error={!!errors.totalQuantity} helperText={errors.totalQuantity?.message} fullWidth />
              )}
            />
          </Grid>

          {/* Max Usage/User */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="maxUsagePerUser"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Số lần dùng/user" type="number" error={!!errors.maxUsagePerUser} helperText={errors.maxUsagePerUser?.message} fullWidth />
              )}
            />
          </Grid>

          {/* Min Order Value */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Giá tối thiểu" type="number" error={!!errors.minOrderValue} helperText={errors.minOrderValue?.message} fullWidth />
              )}
            />
          </Grid>

          {/* Max Discount Value */}
          {selectedDiscountType !== 'shipping' && (
            <Grid item xs={12} sm={6}>
              <Controller
                name="maxDiscountValue"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Giảm tối đa" type="number" error={!!errors.maxDiscountValue} helperText={errors.maxDiscountValue?.message} fullWidth />
                )}
              />
            </Grid>
          )}

          {/* Time Range */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Bắt đầu" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth error={!!errors.startTime} helperText={errors.startTime?.message} />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Kết thúc" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth error={!!errors.endTime} helperText={errors.endTime?.message} />
              )}
            />
          </Grid>

          {/* Apply Type Checkboxes */}
        <Grid item xs={12}>
  <Typography fontWeight="bold" gutterBottom>Loại áp dụng</Typography>

  {selectedType === 'private' && (
    <FormControlLabel control={<Checkbox checked={applyUser} onChange={(e) => setApplyUser(e.target.checked)} />} label="Áp dụng theo người dùng" />
  )}

  <FormControlLabel control={<Checkbox checked={applyProduct} onChange={(e) => setApplyProduct(e.target.checked)} />} label="Áp dụng theo sản phẩm" />
  <FormControlLabel control={<Checkbox checked={applyCategory} onChange={(e) => setApplyCategory(e.target.checked)} />} label="Áp dụng theo danh mục" />
</Grid>


          {/* Autocomplete */}
          {applyUser && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={userList}
                getOptionLabel={(o) => o.fullName}
                value={userList.filter((u) => selectedUserIds.includes(u.id))}
                onChange={(e, val) => setSelectedUserIds(val.map((u) => u.id))}
                renderInput={(params) => <TextField {...params} label="Chọn người dùng" />}
                isOptionEqualToValue={(o, v) => o.id === v.id}
              />
            </Grid>
          )}

          {applyProduct && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={productList}
                getOptionLabel={(o) => o.label}
                value={productList.filter((p) => selectedProductIds.includes(p.id))}
                onChange={(e, val) => setSelectedProductIds(val.map((p) => p.id))}
                renderInput={(params) => <TextField {...params} label="Chọn sản phẩm" />}
                isOptionEqualToValue={(o, v) => o.id === v.id}
              />
            </Grid>
          )}

          {applyCategory && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={categoryList}
                getOptionLabel={(o) => o.label}
                value={categoryList.filter((c) => selectedCategoryIds.includes(c.id))}
                onChange={(e, val) => setSelectedCategoryIds(val.map((c) => c.id))}
                renderInput={(params) => <TextField {...params} label="Chọn danh mục" />}
                isOptionEqualToValue={(o, v) => o.id === v.id}
              />
            </Grid>
          )}

          {/* Submit */}
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
