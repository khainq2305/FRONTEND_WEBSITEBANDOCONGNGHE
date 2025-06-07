import UserFormDialog from '../UserForm';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import { createUser } from '../../../../services/admin/userService';
import { useState } from 'react';

const UserAddPage = () => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: '',
      roleId: parseInt(data.roleId),
      status: data.status,
    };

    try {
      setFieldErrors({});
      await createUser(payload);
      toast.success(' Tạo tài khoản thành công!');
      navigate('/admin/users');
    } catch (err) {
      const backendErrors = err?.errors || err?.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        const errors = {};
        backendErrors.forEach(e => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors); 
      } else {
        toast.error('❌ Tạo tài khoản thất bại!');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Thêm người dùng
      </Typography>

      <Card>
        <CardContent>
          <UserFormDialog
            open={true}
            asPage
            onClose={() => navigate('/admin/users')}
            initialData={null}
            onSubmit={handleSubmit}
            errors={fieldErrors}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserAddPage;
