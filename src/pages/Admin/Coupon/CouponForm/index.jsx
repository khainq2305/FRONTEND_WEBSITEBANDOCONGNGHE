import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { couponService } from '../../../../services/admin/couponService';
import TinyEditor from '../../../../components/Admin/TinyEditor';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../../components/common/Breadcrumb';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import { NumericFormat } from 'react-number-format';

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
      type: 'discount',
      visibility: 'public',
      applyScope: 'all',
      discountType: 'percent',
      discountValue: null,
      totalQuantity: null,
      maxUsagePerUser: null,
      minOrderValue: null,
      maxDiscountValue: null,
      startTime: '',
      endTime: '',
      isActive: true,
    }
  });

  const selectedType = watch('type');
  const selectedVisibility = watch('visibility');
  const selectedDiscountType = watch('discountType');
  const selectedApplyScope = watch('applyScope');

  const [loading, setLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);
// Dùng useEffect để theo dõi sự thay đổi của selectedType
// Dùng useEffect để theo dõi sự thay đổi của selectedType
useEffect(() => {
    if (selectedType === 'shipping') {
        clearErrors('discountValue');
        setValue('discountType', null); // Quan trọng: Đặt lại discountType
        setValue('maxDiscountValue', null); // Ẩn trường này
    } else if (selectedType === 'discount') {
        setValue('discountType', 'percent'); // Mặc định là percent
    }
}, [selectedType, setValue, clearErrors]);
  useEffect(() => {
    if (selectedDiscountType !== 'percent') {
      setValue('maxDiscountValue', null);
    }
  }, [selectedDiscountType, setValue]);

  useEffect(() => {
    if (selectedVisibility !== 'private') clearErrors('userIds');
  }, [selectedVisibility, clearErrors]);

  useEffect(() => {
    if (selectedApplyScope !== 'product') clearErrors('productIds');
  }, [selectedApplyScope, clearErrors]);
const formatToLocalDatetime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    // Trả về định dạng YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day}T${hour}:${minute}`;
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          couponService.getUsers(),
          couponService.getProducts()
        ]);

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
            isActive: data.isActive,
            totalQuantity: data.totalQuantity ?? null,
            maxUsagePerUser: data.maxUsagePerUser ?? null,
            discountValue: data.discountValue ?? null,
            minOrderValue: data.minOrderValue ?? null,
            maxDiscountValue: data.maxDiscountValue ?? null,
  startTime: formatToLocalDatetime(data.startTime),
    endTime: formatToLocalDatetime(data.endTime),
            type: data.type || 'discount',
            visibility: data.visibility || 'public',
            applyScope: data.applyScope || 'all'
          });

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
 // Thay thế toàn bộ hàm onSubmit bằng đoạn code này
const onSubmit = async (values) => {
    setLoading(true);

    const payload = {
        ...values,
        userIds: values.visibility === 'private' ? selectedUserIds : [],
        productIds: values.applyScope === 'product' ? selectedProductIds : [],
        
        // Sửa các dòng này để xử lý nhất quán tất cả các trường số
        discountValue: values.discountValue ?? null,
           minOrderValue: values.minOrderValue ?? 0, // <-- DÒNG BẠN CẦN SỬA
        totalQuantity: values.totalQuantity ?? null,
        maxUsagePerUser: values.maxUsagePerUser ?? null,
        maxDiscountValue: values.maxDiscountValue ?? null,
    };

    if (payload.type === "shipping") {
        payload.discountType = null;
        payload.maxDiscountValue = null;
        payload.discountValue = payload.discountValue ?? 0;
    }

    if (payload.discountType !== 'percent') {
        payload.maxDiscountValue = null;
    }

    if (values.visibility === 'private' && selectedUserIds.length === 0) {
        setError('userIds', { message: 'Vui lòng chọn ít nhất 1 người dùng' });
        setLoading(false);
        return;
    }

    if (values.applyScope === 'product' && selectedProductIds.length === 0) {
        setError('productIds', { message: 'Vui lòng chọn ít nhất 1 sản phẩm' });
        setLoading(false);
        return;
    }

    try {
        let res;
        if (isEdit) {
            res = await couponService.update(id, payload);
            toast.success('Cập nhật mã giảm giá thành công!');
        } else {
            res = await couponService.create(payload);
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

      <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 3, boxShadow: 1, backgroundColor: '#fff', mt: 2 }}>
        <form
          onSubmit={handleSubmit(onSubmit, () => {
            toast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
          })}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="code"
                control={control}
                rules={{ required: 'Mã là bắt buộc' }}
                render={({ field }) => (
                  <TextField {...field} label="Mã Code *" error={!!errors.code} helperText={errors.code?.message} fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Tiêu đề là bắt buộc' }}
                render={({ field }) => (
                  <TextField {...field} label="Tiêu đề *" error={!!errors.title} helperText={errors.title?.message} fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField select label="Loại voucher" {...field} fullWidth>
                    <MenuItem value="discount">Giảm giá</MenuItem>
                    <MenuItem value="shipping">Miễn phí vận chuyển</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="visibility"
                control={control}
                render={({ field }) => (
                  <TextField select label="Phạm vi áp dụng" {...field} fullWidth>
                    <MenuItem value="public">Công khai</MenuItem>
                    <MenuItem value="private">Chỉ định</MenuItem>
                    <MenuItem value="auto">Tự động</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {selectedVisibility === 'private' && (
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={userList}
                  getOptionLabel={(o) => `${o.fullName} (${o.email})`}
                  value={userList.filter((u) => selectedUserIds.includes(u.id))}
                  onChange={(e, val) => setSelectedUserIds(val.map((u) => u.id))}
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn người dùng *" error={!!errors.userIds} helperText={errors.userIds?.message} />
                  )}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Controller
                name="applyScope"
                control={control}
                render={({ field }) => (
                  <TextField select label="Phạm vi sản phẩm" {...field} fullWidth>
                    <MenuItem value="all">Tất cả sản phẩm</MenuItem>
                    <MenuItem value="product">Chỉ định sản phẩm</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {selectedApplyScope === 'product' && (
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={productList}
                  getOptionLabel={(o) => o.label}
                  value={productList.filter((p) => selectedProductIds.includes(p.id))}
                  onChange={(e, val) => setSelectedProductIds(val.map((p) => p.id))}
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn sản phẩm *" error={!!errors.productIds} helperText={errors.productIds?.message} />
                  )}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label="Đang hoạt động"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="totalQuantity"
                control={control}
                render={({ field }) => <NumericFormat {...field} label="Tổng số lượng" thousandSeparator="," decimalScale={0} allowNegative={false} value={field.value ?? ""} onValueChange={(values) => field.onChange(values.floatValue ?? null)} customInput={TextField} fullWidth error={!!errors.totalQuantity} helperText={errors.totalQuantity?.message} />}
              />
            </Grid>
        
<Grid item xs={12} sm={6}>
    <Controller
        name="maxUsagePerUser"
        control={control}
        render={({ field }) => (
            <NumericFormat
                {...field}
                label="Số lần dùng/user"
                thousandSeparator=","
                decimalScale={0}
                allowNegative={false}
                value={field.value ?? ""}
                onValueChange={(values) => field.onChange(values.floatValue ?? null)}
                customInput={TextField}
                fullWidth
                error={!!errors.maxUsagePerUser}
                helperText={errors.maxUsagePerUser?.message}
            />
        )}
    />
</Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: 'Ngày bắt đầu là bắt buộc' }}
                render={({ field }) => (
                  <TextField {...field} type="datetime-local" label="Bắt đầu *" InputLabelProps={{ shrink: true }} fullWidth error={!!errors.startTime} helperText={errors.startTime?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="endTime"
                control={control}
                rules={{ required: 'Ngày kết thúc là bắt buộc' }}
                render={({ field }) => (
                  <TextField {...field} type="datetime-local" label="Kết thúc *" InputLabelProps={{ shrink: true }} fullWidth error={!!errors.endTime} helperText={errors.endTime?.message} />
                )}
              />
            </Grid>

            {selectedType === 'discount' && (
              <Grid item xs={12}>
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <TextField select label="Loại giảm" {...field} fullWidth>
                      <MenuItem value="percent">Phần trăm</MenuItem>
                      <MenuItem value="amount">Số tiền</MenuItem>
                    </TextField>
                )}
              />
             </Grid>
            )}
  
<Grid item xs={12}>
    <Controller
        name="discountValue"
        control={control}
        rules={{
          validate: (value) => {
            // Nếu là loại discount, giá trị là bắt buộc và phải lớn hơn 0.
            if (selectedType === "discount") {
              if (value === null || value === undefined || value === "") {
                return "Giá trị giảm là bắt buộc";
              }
              if (Number(value) <= 0) {
                return "Giá trị giảm phải lớn hơn 0";
              }
            }
            
            // Nếu là loại shipping, giá trị có thể để trống (null) hoặc >= 0.
            if (selectedType === "shipping") {
              if (value !== null && Number(value) < 0) {
                return "Giá trị hỗ trợ phí vận chuyển phải lớn hơn hoặc bằng 0";
              }
            }
            
            return true; // Hợp lệ
          },
        }}
        render={({ field }) => (
            <NumericFormat
                {...field}
                thousandSeparator=","
               prefix={selectedType === "shipping" || selectedDiscountType === "amount" ? "₫" : ""}
                suffix={selectedDiscountType === "percent" ? "%" : ""}
                decimalScale={selectedDiscountType === "percent" ? 2 : 0}
                allowNegative={false}
                value={field.value ?? ""}
                onValueChange={(values) => field.onChange(values.floatValue ?? null)}
                customInput={TextField}
                label={
                    selectedType === "shipping"
                        ? "Giá trị hỗ trợ phí vận chuyển (để trống hoặc 0 = free ship)"
                        : "Giá trị giảm"
                }
                fullWidth
                error={!!errors.discountValue}
                helperText={errors.discountValue?.message}
            />
        )}
    />
</Grid>


{selectedType === 'discount' && selectedDiscountType === 'percent' && (
    <Grid item xs={12}>
        <Controller
            name="maxDiscountValue"
            control={control}
            render={({ field }) => (
                <NumericFormat
                    {...field}
                    thousandSeparator=","
                    prefix="₫"
                    decimalScale={0}
                    allowNegative={false}
                    value={field.value ?? ""}
                    onValueChange={(values) => field.onChange(values.floatValue ?? null)}
                    customInput={TextField}
                    label="Giảm tối đa"
                    fullWidth
                    error={!!errors.maxDiscountValue}
                    helperText={errors.maxDiscountValue?.message}
                />
            )}
        />
    </Grid>
)}


<Grid item xs={12}>
    <Controller
        name="minOrderValue"
        control={control}
        render={({ field }) => (
            <NumericFormat
                {...field}
                thousandSeparator=","
                prefix="₫"
                decimalScale={0}
                allowNegative={false}
                value={field.value ?? ""}
                onValueChange={(values) => field.onChange(values.floatValue ?? null)}
                customInput={TextField}
                label="Giá trị đơn hàng tối thiểu *"
                fullWidth
                error={!!errors.minOrderValue}
                helperText={errors.minOrderValue?.message}
            />
        )}
    />
</Grid>

            <Grid item xs={12}>
              <Typography fontWeight="bold" gutterBottom>Mô tả chi tiết</Typography>
              <Controller name="description" control={control} render={({ field }) => <TinyEditor {...field} height={300} />} />
            </Grid>

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