import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import ProductForm from '../ProductForm'; // Form riêng dùng lại cho Add/Edit
import { productService } from '../../../../services/admin/productService';

const ProductAddPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await productService.create(formData);
      toast.success('✅ Đã thêm sản phẩm thành công');
      navigate('/admin/products');
    } catch (error) {
      toast.error('❌ Lỗi khi thêm sản phẩm');
      console.error('Lỗi thêm sản phẩm:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Thêm sản phẩm mới
      </Typography>

      <Card>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductAddPage;
