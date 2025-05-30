import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../ProductForm';
import { productService } from '../../../../services/admin/productService';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import { toast } from 'react-toastify';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(id);
        setInitialData(res.data.data);
      } catch (err) {
        console.error('Lỗi lấy sản phẩm:', err);
        toast.error('Không thể tải dữ liệu sản phẩm');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await productService.update(id, formData);
      toast.success('✅ Cập nhật sản phẩm thành công');
      navigate('/admin/products');
    } catch (err) {
      toast.error('❌ Cập nhật thất bại');
      console.error(err);
    }
  };

  if (loading) return <LoaderAdmin fullscreen />;

return <ProductForm onSubmit={handleUpdate} initialData={initialData} />

;
}
