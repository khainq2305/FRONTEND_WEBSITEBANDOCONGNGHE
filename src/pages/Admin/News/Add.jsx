// src/pages/Admin/News/Add.jsx
import { useState } from 'react';
import { Grid } from '@mui/material';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
 // dùng nếu có, hoặc <div>


const Add = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('active');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    console.log({ title, category, status, content });
    // TODO: Gửi API
  };

  return (
    <div title="Thêm bài viết mới">
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Content content={content} setContent={setContent} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Sidebar
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            onSubmit={handleSubmit}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Add;
