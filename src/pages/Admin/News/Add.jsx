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
      toast.success(res.data.message || 'Thêm bài viết thành công');
      navigate('/admin/quan-ly-bai-viet');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Thêm bài viết thất bại');
      console.error("Lỗi khi thêm bài viết:", err?.response?.data || err.message || err);
    }
  };

  return (
    <div>
      <FormPost onSubmit={handleSubmit} mode="add" />
    </div>
  );
};

export default Add;
