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
        const postData = res.data.data;
        setPostData(postData);
        
        console.log('🔄 Loaded post data for editing:', postData);
        console.log('🔑 SEO Data from API:', postData.seoData);
        console.log('🔑 Focus keyword from SEO data:', postData.seoData?.focusKeyword);
      } catch (err) {
        console.error('Lỗi khi lấy bài viết:', err);
      }
    };

    fetchPost();
  }, [slug]);

  
  const handleSubmit = async (data) => {
  console.log('📦 Submit cập nhật:', data);
  try {
    const res = await newsService.update(slug, data);
    toast.success(res.data.message || 'Cập nhật thành công');
    
    // Navigate với state để force refresh
    navigate('/admin/quan-ly-bai-viet', { 
      state: { 
        refresh: true, 
        updatedAt: Date.now() 
      } 
    });
  } catch (err) {
    if (err.response) {
      // Lỗi từ server (có response)
      console.log("Server trả về lỗi:", err.response.data);
      console.log("Status code:", err.response.status);
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
