import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../../components/Admin/LoaderVip'; 
import ProductForm from '../ProductForm'; 
import { productService } from '../../../../services/admin/productService';
import Breadcrumb from '../../../../components/common/Breadcrumb';

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
    throw error;
  } finally {
    setLoading(false);
  }
};


  return (
    <Container maxWidth="lg" sx={{ pt: 3, position: 'relative' }}>
      {loading && <LoaderAdmin fullscreen />}
       <Breadcrumb
        items={[
            { label: 'Trang chủ', href: '/admin' },
          { label: 'Sản phẩm', href: '/admin/products' },
          { label: 'Thêm sản phẩm mới' }
        ]}
      />
      <Typography variant="h5" fontWeight="bold" mb={2} mt={2}>
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
