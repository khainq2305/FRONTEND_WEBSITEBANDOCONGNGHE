import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormPost from './components/FormPost';
import { newsService } from '../../../services/admin/postService';

const Edit = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await newsService.getById(id);
        setPostData(res.data.data); // ✅ Lưu res.data
        console.log(res.data.data)
      } catch (err) {
        console.error('Lỗi khi lấy bài viết:', err);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (data) => {
    console.log('📦 Submit cập nhật:', data);
    await newsService.update(id, data); // ✅ gọi update ở đây
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
