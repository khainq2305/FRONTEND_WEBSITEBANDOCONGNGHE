import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../../components/Admin/LoaderVip'; // Điều chỉnh đường dẫn nếu khác
import ProductForm from '../ProductForm'; 
import { productService } from '../../../../services/admin/productService';

const ProductAddPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (formData) => {
  setLoading(true);
  try {
    await productService.create(formData);
    toast.success('Đã thêm sản phẩm thành công');
    navigate('/admin/products');
  } catch (error) {
    console.error('Lỗi thêm sản phẩm:', error);
    // Bắt lỗi xong, phải throw tiếp để ProductForm bắt được và hiển thị lỗi dưới input
    throw error;
  } finally {
    setLoading(false);
  }
};


  return (
    <Container maxWidth="lg" sx={{ pt: 3, position: 'relative' }}>
      {loading && <LoaderAdmin fullscreen />}
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
