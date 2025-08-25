import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import FormPost from '@/pages/Admin/News/components/form/FormPost';
import { newsService } from '@/services/admin/postService';
import { toast } from 'react-toastify';

const Edit = () => {
  const { slug } = useParams();
  const [postData, setPostData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await newsService.getBySlug(slug);
        setPostData(res.data.data); // ✅ Lưu res.data
        console.log(res.data.data)
      } catch (err) {
        console.error('Lỗi khi lấy bài viết:', err);
      }
    };

    fetchPost();
  }, [slug]);

  
  const handleSubmit = async (data) => {
  try {
    const res = await newsService.update(slug, data);
    toast.success(res.data.message || 'Cập nhật thành công');
    navigate('/admin/quan-ly-bai-viet');
  } catch (err) {
    console.log('lỗi', err)
    if (err.response) {
    } else if (err.request) {
      // Request gửi đi nhưng không nhận được phản hồi
      console.log("Không có phản hồi từ server:", err.request);
    } else {
      // Lỗi khi setup request
      console.log("Lỗi khác:", err.message);
    }
  }
};


  if (!postData) return <div>Đang tải dữ liệu...</div>;

  return (
    <FormPost
      initialData={postData}  // ✅ truyền data vào form
      onSubmit={handleSubmit}
      mode="edit"
    />
  );
};

export default Edit;
