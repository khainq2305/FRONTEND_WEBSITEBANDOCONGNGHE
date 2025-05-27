import React from 'react';
import CategoryMain from '@/pages/Admin/News/components/form/CategoryMain';
import { newsService } from '@/services/admin/postService';
import { newsCategoryService } from '@/services/admin/newCategoryService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
const CategoryAdd = () => {
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
  try {
    const res = await newsCategoryService.create(data);
    toast.success(res.data.message || 'Thêm danh mục thành công');
    navigate('/admin/danh-muc-bai-viet');
    console.log('du lieu la',data)
  } catch (err) {
    // console.error('Lỗi khi tạo danh mục:', err);
    toast.error(err?.response?.data?.message || 'Tạo danh mục thất bại');
  }
};

  return <CategoryMain onSubmit={handleSubmit}/>;
};

export default CategoryAdd;
