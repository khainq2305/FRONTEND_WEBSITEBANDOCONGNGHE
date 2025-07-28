import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../ProductForm';
import { productService } from '../../../../services/admin/productService';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import { toast } from 'react-toastify';
import { Container, Typography } from '@mui/material'; 

import Breadcrumb from '../../../../components/common/Breadcrumb'; 
export default function ProductEditPage() {
  const { slug } = useParams(); 
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(slug); 
        setInitialData(res.data.data);
      } catch (err) {
        console.error('Lỗi lấy sản phẩm:', err);
        toast.error('Không thể tải dữ liệu sản phẩm');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct(); 
  }, [slug, navigate]);

 
  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      await productService.update(slug, formData);
      toast.success('Cập nhật sản phẩm thành công');
      navigate('/admin/products');
    } catch (err) {
      console.error('Lỗi cập nhật sản phẩm:', err);
      
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoaderAdmin fullscreen />;
  }

 return (
    <Container maxWidth="lg" sx={{ pt: 3, position: 'relative' }}>
      {submitting && <LoaderAdmin fullscreen />}
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Sản phẩm', href: '/admin/products' },
          { label: 'Chỉnh sửa sản phẩm' }
        ]}
      />
      <Typography variant="h5" fontWeight="bold" mb={2} mt={2}>
        Chỉnh sửa sản phẩm
      </Typography>
      <ProductForm onSubmit={handleUpdate} initialData={initialData} />
    </Container>
  );
}
