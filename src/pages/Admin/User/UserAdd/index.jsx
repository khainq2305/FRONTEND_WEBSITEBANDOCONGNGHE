import React, { useState } from 'react';
import UserForm from '../UserForm';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { createUser } from '../../../../services/admin/userService';

const UserAddPage = () => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (data) => {
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', data.fullName || '');
    formDataToSend.append('email', data.email);
    formDataToSend.append('password', data.password);
    formDataToSend.append('phone', data.phone || '');
    formDataToSend.append('dateOfBirth', data.dateOfBirth || '');
    formDataToSend.append('status', data.status || 'active'); // optional
    if (data.avatarFile) formDataToSend.append('avatar', data.avatarFile); // optional

    try {
      setFieldErrors({});
      await createUser(formDataToSend); // gọi API thật
      toast.success('Tạo tài khoản thành công!');
      navigate('/admin/users');
    } catch (err) {
      const backendErrors = err?.errors || err?.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        const errors = {};
        backendErrors.forEach((e) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors); // hiển thị lỗi ngay dưới input
      } else {
        console.error("❌ Lỗi không xác định khi tạo user:", err);
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Thêm tài khoản mới
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Trang chủ
        </Link>
        <Link component={RouterLink} to="/admin/users" underline="hover" color="inherit">
          Quản lý người dùng
        </Link>
        <Typography color="text.primary">Thêm tài khoản</Typography>
      </Breadcrumbs>
      <Divider sx={{ my: 3 }} />
      <UserForm onSubmit={handleSubmit} externalErrors={fieldErrors} />
    </Box>
  );
};

export default UserAddPage;
