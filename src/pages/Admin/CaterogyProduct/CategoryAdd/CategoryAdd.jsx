import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryMain from '../../CaterogyProduct';
import { toast } from 'react-toastify';
import { categoryService } from '../../../../services/admin/categoryService';
const CategoryAddd = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (data) => {
    try {
      const form = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        // ❌ Bỏ qua null/undefined thumbnail nếu chưa chọn
        if (value !== null && value !== undefined) {
          form.append(key, value);
        }
      });

      await categoryService.create(form);

      toast.success('✅ Thêm danh mục thành công');
      navigate('/admin/categories/list');
    } catch (error) {
      const res = error.response;
      if (res?.status === 400 && res.data?.field && res.data?.message) {
        setErrors(prev => ({ ...prev, [res.data.field]: res.data.message }));
      } else {
        toast.error('❌ Lỗi khi thêm danh mục');
        console.error(error);
      }
    }
  };
  return <CategoryMain onSubmit={handleSubmit} errors={errors} />;
};

export default CategoryAddd;
