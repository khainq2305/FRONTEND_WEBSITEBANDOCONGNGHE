import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../ProductForm';
import { productService } from '../../../../services/admin/productService';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import { toast } from 'react-toastify';

export default function ProductEditPage() {
  const { slug } = useParams(); 
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Thêm state để quản lý loader khi submit
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

  // Khi user bấm “Lưu”, bật loader, cố gắng cập nhật, và nếu có lỗi thì re-throw để ProductForm bắt và hiển thị dưới input.
  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      await productService.update(slug, formData);
      toast.success('Cập nhật sản phẩm thành công');
      navigate('/admin/products');
    } catch (err) {
      console.error('Lỗi cập nhật sản phẩm:', err);
      // Bắt rồi throw tiếp để ProductForm xử lý formErrors
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoaderAdmin fullscreen />;
  }

  return (
    <>
      {submitting && <LoaderAdmin fullscreen />}
      <ProductForm onSubmit={handleUpdate} initialData={initialData} />
    </>
  );
}
