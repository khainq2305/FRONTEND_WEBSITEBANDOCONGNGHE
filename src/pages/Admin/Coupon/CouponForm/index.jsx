import React, { useEffect, useState } from "react";
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
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { couponService } from "../../../../services/admin/couponService";
import TinyEditor from "../../../../components/Admin/TinyEditor";
import { toast } from "react-toastify";

// Hàm tiện ích để định dạng số chung (không có ký hiệu tiền tệ)
// Sử dụng cho phần trăm hoặc các số lượng không phải tiền
const formatNumber = (num) => {
    if (num === null || num === undefined || num === "") return "";
    const number = Number(num);
    if (isNaN(number)) return "";
    // Định dạng số với dấu phân cách hàng nghìn theo chuẩn Việt Nam
    // và không thêm số thập phân nếu là số nguyên
    if (Number.isInteger(number)) {
        return number.toLocaleString('vi-VN');
    }
    // Giữ tối đa 2 chữ số thập phân cho số lẻ
    return number.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

// Hàm tiện ích để định dạng tiền tệ VND
// Luôn thêm ký hiệu 'đ'
const formatCurrencyVND = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "";
  }
  return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hàm để parse chuỗi (có thể đã định dạng) thành số thuần túy
// Xử lý cả dấu phân cách hàng nghìn và dấu thập phân
const parseNumber = (formattedString) => {
  if (!formattedString) return "";
  let cleanedString = String(formattedString);

  // 1. Loại bỏ tất cả các ký tự không phải số, dấu chấm (.), dấu phẩy (,)
  // Điều này loại bỏ ký hiệu tiền tệ 'đ', khoảng trắng, v.v.
  cleanedString = cleanedString.replace(/[^\d.,]/g, "");

  // 2. Trong định dạng 'vi-VN', dấu chấm '.' thường là phân cách hàng nghìn.
  // Loại bỏ tất cả các dấu chấm này trước.
  cleanedString = cleanedString.replace(/\./g, '');

  // 3. Sau đó, thay thế dấu phẩy ',' (phân cách thập phân trong 'vi-VN') bằng dấu chấm '.'
  // để Number() có thể parse đúng.
  cleanedString = cleanedString.replace(/,/g, '.');

  // Chuyển đổi chuỗi đã làm sạch thành số.
  return Number(cleanedString);
};

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      title: "",
      description: "",
      discountType: "percent",
      discountValue: "", // Khởi tạo là chuỗi rỗng
      totalQuantity: "",
      maxUsagePerUser: "",
      minOrderValue: "", // Khởi tạo là chuỗi rỗng
      maxDiscountValue: "", // Khởi tạo là chuỗi rỗng
      startTime: "",
      endTime: "",
      type: "public",
    },
  });

  const selectedType = watch("type");
  const selectedDiscountType = watch("discountType");

  const [loading, setLoading] = useState(false);
  const [applyUser, setApplyUser] = useState(false);
  const [applyProduct, setApplyProduct] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);

  // Clear maxDiscountValue if discountType is not 'percent'
  useEffect(() => {
    if (selectedDiscountType !== 'percent') {
      setValue('maxDiscountValue', '');
    }
  }, [selectedDiscountType, setValue]);

  // Handle applyUser checkbox based on coupon type:
  // If type is 'auto' or 'public', ensure applyUser is false and the checkbox for applyUser is not shown
  useEffect(() => {
    if (selectedType === "auto" || selectedType === "public") {
      setApplyUser(false); // Mặc định không áp dụng người dùng khi công khai/tự động
    }
  }, [selectedType]);

  // Fetch data for edit mode or initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          couponService.getUsers(),
          couponService.getProducts(),
        ]);

        setUserList(usersRes.data || []);
        setProductList(productsRes.data || []);

        if (isEdit) {
          const couponRes = await couponService.getById(id);
          const data = couponRes.data;

          reset({
            code: data.code || "",
            title: data.title || "",
            description: data.description || "",
            discountType: data.discountType || "percent",
            // Đảm bảo giá trị tiền tệ được chuyển thành chuỗi khi load vào form
            discountValue: data.discountValue !== null ? String(data.discountValue) : "",
            totalQuantity: data.totalQuantity || "",
            maxUsagePerUser: data.maxUsagePerUser || "",
            minOrderValue: data.minOrderValue !== null ? String(data.minOrderValue) : "",
            maxDiscountValue: data.maxDiscountValue !== null ? String(data.maxDiscountValue) : "",
            startTime: data.startTime ? data.startTime.slice(0, 16) : "",
            endTime: data.endTime ? data.endTime.slice(0, 16) : "",
            type: data.type || "public",
          });

          setApplyUser((data.userIds || []).length > 0);
          setApplyProduct((data.productIds || []).length > 0);
          setSelectedUserIds(data.userIds || []);
          setSelectedProductIds(data.productIds || []);
        }
      } catch (err) {
        console.error("Lỗi load dữ liệu form:", err);
        toast.error("Không thể tải dữ liệu cho form!");
      }
    };

    fetchData();
  }, [id, isEdit, reset]);

  // Handle form submission
  const onSubmit = async (values) => {
    setLoading(true);
    const payload = {
      ...values,
      // Chỉ gửi userIds nếu type là private VÀ checkbox applyUser được chọn
      userIds: selectedType === "private" && applyUser ? selectedUserIds : [],
      productIds: applyProduct ? selectedProductIds : [],
      // Convert string values from form fields to numbers or null before sending to backend
      discountValue: values.discountValue !== "" ? Number(values.discountValue) : null,
      minOrderValue: values.minOrderValue !== "" ? Number(values.minOrderValue) : null,
      // maxDiscountValue chỉ gửi đi nếu là 'percent' và có giá trị
      maxDiscountValue: selectedDiscountType === 'percent' && values.maxDiscountValue !== ""
        ? Number(values.maxDiscountValue)
        : null,
    };

    // This block is redundant now as maxDiscountValue logic is within payload creation
    // Keeping for understanding, but can be removed.
    if (payload.discountType !== 'percent') {
      payload.maxDiscountValue = null;
    }

    try {
      if (isEdit) {
        await couponService.update(id, payload);
        toast.success("Cập nhật mã giảm giá thành công!");
      } else {
        await couponService.create(payload);
        toast.success("Thêm mã giảm giá thành công!");
      }
      clearErrors();
      navigate("/admin/coupons");
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          const fieldName = e.field === "endTimeOrder" ? "endTime" : e.field;
          setError(fieldName, { type: "server", message: e.message });
        });
      } else {
        toast.error(err.response?.data?.message || "Đã xảy ra lỗi");
        console.error("Lỗi lưu mã:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Cập nhật" : "Thêm mới"} Mã Giảm Giá
      </Typography>
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 3,
          boxShadow: 1,
          backgroundColor: "#fff",
          mt: 2,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
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

            <Grid item xs={12} sm={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField select label="Loại coupon" {...field} fullWidth>
                    <MenuItem value="public">Công khai</MenuItem>
                    <MenuItem value="private">Chỉ định</MenuItem>
                    {/* Đã loại bỏ MenuItem value="auto" theo yêu cầu */}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
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

            <Grid item xs={12}>
              <Typography fontWeight="bold" gutterBottom>
                Mô tả chi tiết
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TinyEditor value={value} onChange={onChange} height={300} />
                )}
              />
              {errors.description && (
                <Typography color="error" variant="caption">
                  {errors.description.message}
                </Typography>
              )}
            </Grid>

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

            {/* FIELD: discountValue - Logic for formatting based on discountType */}
            <Grid item xs={12} sm={6}>
            <Controller
  name="discountValue"
  control={control}
  rules={{
    validate: (val) => {
      const number = parseNumber(val);
      if (val === "") return "Giá trị giảm là bắt buộc";
      if (selectedDiscountType === "shipping") {
        return number >= 0 || "Giá trị hỗ trợ phí ship phải ≥ 0";
      }
      if (number <= 0) return "Giá trị giảm phải > 0";
      if (selectedDiscountType === "percent" && number > 100)
        return "Phần trăm giảm không được vượt quá 100%";
      return true;
    },
  }}
  render={({ field: { onChange, onBlur, value, ref } }) => (
    <TextField
      label={
        selectedDiscountType === "shipping"
          ? "Giá trị hỗ trợ phí vận chuyển"
          : "Giá trị giảm"
      }
      value={value ?? ""} // ❗ luôn hiển thị raw string
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.,]/g, "");
        onChange(raw);
      }}
      onBlur={(e) => {
        const parsed = parseNumber(e.target.value);
        onChange(isNaN(parsed) ? "" : String(parsed));
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
                name="totalQuantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tổng số lượng"
                    type="number" // Use type="number" for basic numeric input
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

            {/* FIELD: minOrderValue - Logic for formatting */}
            <Grid item xs={12} sm={6}>
             <Controller
  name="minOrderValue"
  control={control}
  rules={{
    validate: (val) => {
      const number = parseNumber(val);
      if (val === "" || val === null || val === undefined)
        return "Giá trị đơn hàng tối thiểu là bắt buộc";
      if (isNaN(number) || number < 0) {
        return "Giá trị đơn hàng tối thiểu không hợp lệ";
      }
      return true;
    }
  }}
  render={({ field: { onChange, onBlur, value, ref } }) => (
    <TextField
      label="Giá trị đơn hàng tối thiểu"
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.,]/g, "");
        onChange(raw);
      }}
      onBlur={(e) => {
        const parsed = parseNumber(e.target.value);
        onChange(isNaN(parsed) ? "" : String(parsed));
      }}
      inputRef={ref}
      fullWidth
      error={!!errors.minOrderValue}
      helperText={errors.minOrderValue?.message}
    />
  )}
/>

            </Grid>

            {/* FIELD: maxDiscountValue - Only shown for 'percent' type */}
            {selectedDiscountType === 'percent' && (
              <Grid item xs={12} sm={6}>
               <Controller
  name="maxDiscountValue"
  control={control}
  rules={{
    validate: (val) => {
      const number = parseNumber(val);
      if (val === "" || val === null || val === undefined) return true;
      if (isNaN(number) || number < 0) {
        return "Giá trị giảm tối đa không hợp lệ và phải ≥ 0";
      }
      return true;
    }
  }}
  render={({ field: { onChange, onBlur, value, ref } }) => (
    <TextField
      label="Giảm tối đa"
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.,]/g, "");
        onChange(raw);
      }}
      onBlur={(e) => {
        const parsed = parseNumber(e.target.value);
        onChange(isNaN(parsed) ? "" : String(parsed));
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

            <Grid item xs={12}>
              <Typography fontWeight="bold" gutterBottom>
                Điều kiện áp dụng
              </Typography>

              {/* Checkbox "Áp dụng theo người dùng" chỉ hiển thị khi selectedType là "private" */}
              {selectedType === "private" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={applyUser}
                      onChange={(e) => setApplyUser(e.target.checked)}
                    />
                  }
                  label="Áp dụng theo người dùng"
                />
              )}

              {/* Checkbox "Áp dụng theo sản phẩm" luôn hiển thị */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applyProduct}
                    onChange={(e) => setApplyProduct(e.target.checked)}
                  />
                }
                label="Áp dụng theo sản phẩm"
              />
            </Grid>

            {/* Autocomplete "Chọn người dùng" chỉ hiển thị khi selectedType là "private" VÀ applyUser được chọn */}
            {applyUser && selectedType === "private" && (
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={userList}
                  getOptionLabel={(o) => `${o.fullName} (${o.email})`}
                  value={userList.filter((u) => selectedUserIds.includes(u.id))}
                  onChange={(e, val) =>
                    setSelectedUserIds(val.map((u) => u.id))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn người dùng" />
                  )}
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
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn sản phẩm" fullWidth />
                  )}
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
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">{item.label}</Typography>
                        <Button
                          size="small"
                          onClick={() =>
                            setSelectedProductIds((prev) =>
                              prev.filter((id) => id !== item.id)
                            )
                          }
                          sx={{
                            minWidth: 0,
                            ml: 1,
                            color: "#888",
                            fontWeight: "bold",
                            padding: "0px 6px",
                            lineHeight: 1,
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
                {isEdit ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
