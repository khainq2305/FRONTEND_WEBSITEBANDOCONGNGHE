import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryMain from '../../CaterogyProduct';
import { toast } from 'react-toastify';
import { categoryService } from '../../../../services/admin/categoryService';

const CategoryAdd = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (formData) => {
    try {
      await categoryService.create(formData);
      toast.success("Thêm danh mục thành công");
      navigate("/admin/categories/list");
    } catch (err) {
      if (err.response?.data?.field && err.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          [err.response.data.field]: err.response.data.message
        }));
      } else {
        toast.error("Đã xảy ra lỗi khi thêm danh mục");
      }
    }
  };

  return (
    <CategoryMain
      onSubmit={handleSubmit}
      errors={errors}
      setErrors={setErrors}
    />
  );
};

export default CategoryAdd;
