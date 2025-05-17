import UserFormDialog from '../UserForm';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';

const UserAddPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    console.log('Tạo user:', data);
    toast.success('Đã tạo tài khoản');
    navigate('/admin/users');
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
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserAddPage;
