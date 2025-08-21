import React, { useState } from 'react';
import UserForm from '../UserForm'; // Đảm bảo đường dẫn đúng
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
// import { createUser } from '../../../../services/admin/userService'; // Giữ nguyên import này nếu bạn có service

const UserAddPage = () => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (data) => {
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', data.fullName);
    formDataToSend.append('email', data.email);
    formDataToSend.append('password', data.password);
    formDataToSend.append('phone', data.phone || '');
    formDataToSend.append('dateOfBirth', data.dateOfBirth || ''); // Thêm ngày sinh
    if (data.avatarFile) {
      formDataToSend.append('avatar', data.avatarFile);
    }
    // Chuyển đổi mảng roleIds thành chuỗi JSON để gửi đi
    formDataToSend.append('roleIds', JSON.stringify(data.roleIds));
    formDataToSend.append('status', data.status);

    try {
      setFieldErrors({});
      // await createUser(formDataToSend); // Bỏ comment dòng này khi bạn có service thực tế
      console.log('Dữ liệu gửi đi:', Object.fromEntries(formDataToSend.entries()));
      console.log('File ảnh:', data.avatarFile);
      toast.success('Tạo tài khoản thành công!');
      navigate('/admin/users'); // Chuyển hướng sau khi thành công
    } catch (err) {
      const backendErrors = err?.errors || err?.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        const errors = {};
        backendErrors.forEach((e) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors);
      } else {
        toast.error('❌ Tạo tài khoản thất bại!');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3, width: '100%' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Thêm tài khoản
      </Typography>

      <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}> {/* Thêm style cho Card */}
        <CardContent>
          <UserForm
            onSubmit={handleSubmit}
            errors={fieldErrors}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserAddPage;