import React from 'react'
import FormPost from './components/form/FormPost'
import { newsService } from '@/services/admin/postService';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Add = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const res = await newsService.create(data); // ✅ Gán vào biến
      console.log('du lieu gui len',data)
      debugger
      toast.success(res.data.message || 'Thêm bài viết thành công');
      navigate('/admin/quan-ly-bai-viet');
    } catch (err) {
    console.error("Lỗi khi thêm bài viết:", err?.response?.data || err.message || err);
    throw err;
  }
  };

  return (
    <div>
      <FormPost onSubmit={handleSubmit} mode="add" encType="multipart/form-data"/>
    </div>
  );
};

export default Add;
