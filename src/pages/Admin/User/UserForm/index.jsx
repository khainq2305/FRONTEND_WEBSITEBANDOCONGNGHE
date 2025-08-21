import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputAdornment, // Để thêm icon vào TextField
} from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Icon cho Date Picker

const UserForm = ({ onSubmit, initialData = {}, errors = {} }) => {
  // Trạng thái cho các trường của biểu mẫu
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    password: initialData.password || "",
    phone: initialData.phone || "",
    dateOfBirth: initialData.dateOfBirth || "",
    roleIds: initialData.roleIds || [],
    status: initialData.status || "active",
  });

  // Trạng thái cho tệp ảnh đại diện và xem trước
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatar || null);

  // Dữ liệu giả cho vai trò (thay thế bằng dữ liệu thực từ backend của bạn)
  const availableRoles = [
    { id: 1, name: "Quản trị viên" },
    { id: 2, name: "Biên tập viên" },
    { id: 3, name: "Người xem" },
    { id: 4, name: "Khách hàng" },
  ];

  // Xử lý thay đổi đầu vào cho các trường văn bản và lựa chọn
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "roleIds") {
      const selectedValue = typeof value === 'string' ? value.split(',').map(Number) : value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Xử lý chọn tệp ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, avatarFile });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 0, // Giữ nguyên p:0 để CardContent bên ngoài kiểm soát padding
        display: "flex",
        flexDirection: "column",
        gap: 2.5, // Tăng khoảng cách giữa các phần tử để trông thoáng hơn
      }}
    >
      {/* Tên người dùng */}
      <TextField
        fullWidth
        label="Họ và tên"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        error={!!errors.fullName}
        helperText={errors.fullName}
        variant="outlined"
        InputLabelProps={{ shrink: true }} // Luôn thu nhỏ label
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px', // Bo góc nhẹ cho input
          },
        }}
      />

      {/* Email */}
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={!!errors.email}
        helperText={errors.email}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      {/* Mật khẩu */}
      <TextField
        fullWidth
        label="Mật khẩu"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        error={!!errors.password}
        helperText={errors.password}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      {/* Số điện thoại */}
      <TextField
        fullWidth
        label="Số điện thoại"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      {/* Ngày sinh */}
      <TextField
        fullWidth
        label="Ngày sinh"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
        // Thêm icon lịch vào cuối input
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarTodayIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Chọn Vai trò (Roles) */}
      <FormControl fullWidth error={!!errors.roleIds} variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      >
        <InputLabel id="role-select-label">Vai trò</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          multiple
          name="roleIds"
          value={formData.roleIds}
          onChange={handleChange}
          renderValue={(selected) =>
            selected
              .map((id) => availableRoles.find((role) => role.id === id)?.name)
              .join(", ")
          }
          label="Vai trò"
        >
          {availableRoles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              <Checkbox checked={formData.roleIds.indexOf(role.id) > -1} />
              <ListItemText primary={role.name} />
            </MenuItem>
          ))}
        </Select>
        {errors.roleIds && <Typography color="error" variant="caption">{errors.roleIds}</Typography>}
      </FormControl>

      {/* Chọn Trạng thái (Status) */}
      <FormControl fullWidth error={!!errors.status} variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      >
        <InputLabel id="status-select-label">Trạng thái</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Trạng thái"
        >
          <MenuItem value="active">Hoạt động</MenuItem>
          <MenuItem value="inactive">Không hoạt động</MenuItem>
          <MenuItem value="pending">Đang chờ</MenuItem>
        </Select>
        {errors.status && <Typography color="error" variant="caption">{errors.status}</Typography>}
      </FormControl>

      {/* Chọn ảnh đại diện */}
      <Stack spacing={1} mt={1}>
        <Typography variant="subtitle2" color="text.secondary">Ảnh đại diện</Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth // Nút full width
          sx={{
            borderRadius: '8px', // Bo góc cho nút
            py: 1.5, // Tăng padding để nút lớn hơn
            borderColor: 'primary.main', // Viền màu xanh
            color: 'primary.main', // Chữ màu xanh
            '&:hover': {
              backgroundColor: 'primary.light', // Hiệu ứng hover nhẹ
              borderColor: 'primary.main',
            },
          }}
        >
          Chọn Ảnh Đại Diện
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>

        {avatarPreview && (
          <Box mt={1} textAlign="center">
            <Avatar
              src={avatarPreview}
              alt="Ảnh đại diện"
              sx={{ width: 100, height: 100, mx: "auto", border: '2px solid #e0e0e0' }} // Thêm viền nhẹ cho avatar
            />
          </Box>
        )}
      </Stack>

      {/* Nút gửi */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          py: 1.5, // Tăng padding để nút lớn hơn
          borderRadius: '8px', // Bo góc cho nút
          fontSize: '1rem', // Tăng kích thước chữ
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)', // Đổ bóng nhẹ
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0, 123, 255, 0.3)', // Đổ bóng mạnh hơn khi hover
          },
        }}
      >
        Thêm Người Dùng
      </Button>
    </Box>
  );
};

export default UserForm;