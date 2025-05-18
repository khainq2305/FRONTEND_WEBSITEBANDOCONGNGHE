// src/pages/Admin/News/Add.jsx
import { createContext, useContext, useState } from 'react';
import { Grid } from '@mui/material';
import Content from './components/Content';
import Sidebar from './components/Sidebar';

const AddContext = createContext();
export const useArticle = () => useContext(AddContext);

const Add = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('active');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    console.log({ title, category, status, content });
    // Gửi API tạo bài viết ở đây sau này
  };

  return (
    <AddContext.Provider
      value={{
        title, setTitle,
        category, setCategory,
        status, setStatus,
        content, setContent,
        handleSubmit
      }}
    >
      <div title="Thêm bài viết mới">
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Content />
          </Grid>
          <Grid item xs={12} md={3}>
            <Sidebar />
          </Grid>
        </Grid>
      </div>
    </AddContext.Provider>
  );
};

export default Add;
