import React from 'react'
import FormPost from './components/form/FormPost'
import { newsService } from '@/services/admin/postService';
import { useNavigate } from 'react-router';
const Add = () => {
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
  try {
    await newsService.create(data);
    // toast.success("Thêm bài viết thành công");
    // navigate('/admin/quan-ly-bai-viet');
  } catch (err) {
    console.error("Lỗi khi thêm bài viết:", err?.response?.data || err.message || err);
    // toast.error("Thêm bài viết thất bại");
  }
};


  return (
    <div><FormPost onSubmit={handleSubmit} mode="add"/></div>
  )
}

export default Add