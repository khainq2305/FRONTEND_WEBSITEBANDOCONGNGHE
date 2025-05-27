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
  Chip,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { couponService } from '../../../../services/admin/couponService';

export default function CouponForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
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
      endTime: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [applyUser, setApplyUser] = useState(false);
  const [applyProduct, setApplyProduct] = useState(false);
  const [applyCategory, setApplyCategory] = useState(false);

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const [userList, setUserList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);

  // Fetch options
  useEffect(() => {
    couponService.getUsers().then((res) => setUserList(res.data || []));
    couponService.getCategories().then((res) => setCategoryList(res.data || []));
    couponService.getProducts().then((res) => setProductList(res.data || []));
  }, []);

  // If editing, load existing coupon
  useEffect(() => {
    if (isEdit) {
      couponService.getById(id).then((res) => {
        const data = res.data || {};
        // Reset form
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
          startTime: data.startTime ? data.startTime.slice(0,16) : '',
          endTime: data.endTime ? data.endTime.slice(0,16) : ''
        });
        // Set application flags and selections
        setApplyUser((data.userIds || []).length > 0);
        setApplyProduct((data.productIds || []).length > 0);
        setApplyCategory((data.categoryIds || []).length > 0);
        setSelectedUserIds(data.userIds || []);
        setSelectedProductIds(data.productIds || []);
        setSelectedCategoryIds(data.categoryIds || []);
      }).catch((err) => {
        console.error('❌ Lỗi load coupon:', err);
      });
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (values) => {
    setLoading(true);
    const payload = {
      ...values,
      userIds: applyUser ? selectedUserIds : [],
      productIds: applyProduct ? selectedProductIds : [],
      categoryIds: applyCategory ? selectedCategoryIds : []
    };
    try {
      if (isEdit) {
        await couponService.update(id, payload);
      } else {
        await couponService.create(payload);
      }
      navigate('/admin/coupons');
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => setError(e.field, { type: 'server', message: e.message }));
      } else {
        console.error('❌ Lỗi lưu mã:', err);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Code */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã Code"
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Title */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tiêu đề"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả"
                  multiline
                  rows={2}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Discount Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.discountType}>
              <InputLabel>Loại giảm</InputLabel>
              <Controller
                name="discountType"
                control={control}
                defaultValue="percent"
                render={({ field }) => (
                  <Select {...field} label="Loại giảm">
                    <MenuItem value="percent">Phần trăm</MenuItem>
                    <MenuItem value="amount">Số tiền</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Discount Value */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="discountValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Giá trị giảm"
                  type="number"
                  error={!!errors.discountValue}
                  helperText={errors.discountValue?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Total Quantity */}
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

          {/* Max Usage/User */}
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

          {/* Min Order Value */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Giá tối thiểu"
                  type="number"
                  error={!!errors.minOrderValue}
                  helperText={errors.minOrderValue?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Max Discount Value */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="maxDiscountValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Giảm tối đa"
                  type="number"
                  error={!!errors.maxDiscountValue}
                  helperText={errors.maxDiscountValue?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Start Time */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bắt đầu"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                />
              )}
            />
          </Grid>

          {/* End Time */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kết thúc"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
                />
              )}
            />
          </Grid>

          {/* Apply Type Checkboxes */}
          <Grid item xs={12}>
            <Typography fontWeight="bold" gutterBottom>
              Loại áp dụng
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={applyUser} onChange={(e) => setApplyUser(e.target.checked)} />}
              label="Áp dụng theo người dùng"
            />
            <FormControlLabel
              control={<Checkbox checked={applyProduct} onChange={(e) => setApplyProduct(e.target.checked)} />}
              label="Áp dụng theo sản phẩm"
            />
            <FormControlLabel
              control={<Checkbox checked={applyCategory} onChange={(e) => setApplyCategory(e.target.checked)} />}
              label="Áp dụng theo danh mục"
            />
          </Grid>

          {/* Autocomplete Sections */}
          {applyUser && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={userList}
                getOptionLabel={(option) => option.fullName}
                value={userList.filter((u) => selectedUserIds.includes(u.id))}
                onChange={(e, v) => setSelectedUserIds(v.map((o) => o.id))}
                renderInput={(params) => <TextField {...params} label="Chọn người dùng" />}
              />
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {userList
                  .filter((u) => selectedUserIds.includes(u.id))
                  .map((u) => (
                    <Chip
                      key={u.id}
                      label={u.fullName}
                      onDelete={() => setSelectedUserIds(selectedUserIds.filter((id) => id !== u.id))}
                      size="small"
                    />
                  ))}
              </Box>
            </Grid>
          )}

          {applyProduct && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={productList}
                getOptionLabel={(option) => option.label}
                value={productList.filter((p) => selectedProductIds.includes(p.id))}
                onChange={(e, v) => setSelectedProductIds(v.map((o) => o.id))}
                renderInput={(params) => <TextField {...params} label="Chọn sản phẩm" />}
              />
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {productList
                  .filter((p) => selectedProductIds.includes(p.id))
                  .map((p) => (
                    <Chip
                      key={p.id}
                      label={p.label}
                      onDelete={() => setSelectedProductIds(selectedProductIds.filter((id) => id !== p.id))}
                      size="small"
                    />
                  ))}
              </Box>
            </Grid>
          )}

          {applyCategory && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={categoryList}
                getOptionLabel={(option) => option.label}
                value={categoryList.filter((c) => selectedCategoryIds.includes(c.id))}
                onChange={(e, v) => setSelectedCategoryIds(v.map((o) => o.id))}
                renderInput={(params) => <TextField {...params} label="Chọn danh mục" />}
              />
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categoryList
                  .filter((c) => selectedCategoryIds.includes(c.id))
                  .map((c) => (
                    <Chip
                      key={c.id}
                      label={c.label}
                      onDelete={() => setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== c.id))}
                      size="small"
                    />
                  ))}
              </Box>
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
  );
}
