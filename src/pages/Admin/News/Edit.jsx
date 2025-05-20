import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormPost from './components/FormPost';
// import postService from 'services/postService'; // nếu có

const Edit = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);

  // Giả sử gọi API để lấy dữ liệu bài viết
  useEffect(() => {
    const fetchPost = async () => {
      const res = await fakeGetPostById(id); // thay bằng postService.getById(id)
      setPostData(res);
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (data) => {
    console.log('📦 Submit cập nhật:', data);
    // await postService.update(id, data);
  };

  if (!postData) return <div>Đang tải dữ liệu...</div>;

  return <FormPost initialData={postData} onSubmit={handleSubmit} mode="edit"/>;
};

export default Edit;

// 👇 tạm mock data
const fakeGetPostById = async (id) => ({
  title: 'Tiêu đề cũ',
  content: 'Nội dung bài viết cũ...',
  category: 'congnghe',
  status: 'active',
  tags: ['react', 'vite'],
  avatar: null,
  isScheduled: false,
  publishAt: ''
});
