import { createContext, useContext, useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { validatePostForm } from '@/utils/News/validatePostForm'
import Content from '@/pages/Admin/News/components/form/Content';
import Sidebar from '@/pages/Admin/News/components/sidebar/Sidebar';

const AddContext = createContext();
export const useArticle = () => useContext(AddContext);

const FormPost = ({ onSubmit, initialData, mode = 'add' }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('active');
  const [content, setContent] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [tags, setTags] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [publishAt, setPublishAt] = useState('');
  const [errors, setErrors] = useState({})
    useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || '');
      setStatus(initialData.status || 'active');
      setContent(initialData.content || '');
      setAvatar(initialData.avatar || null);
      setTags(initialData.tags || []);
      setIsScheduled(initialData.isScheduled || false);
      setPublishAt(initialData.publishAt || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
  const formData = {
    title,
    content,
    category,
    status: isScheduled ? 'scheduled' : status, // ✅ override nếu có lịch
    tags,
    avatar,
    publishAt: isScheduled ? publishAt : null,
    isScheduled
  };

  const result = validatePostForm(formData);
  if (!result.valid) {
    setErrors(result.errors);
    return;
  }

  if (onSubmit) {
    onSubmit(formData);
  }
};


  return (
    <AddContext.Provider
      value={{
        title, setTitle,
        category, setCategory,
        status, setStatus,
        content, setContent,
        avatar, setAvatar,
        tags, setTags,
        isScheduled, setIsScheduled,
        publishAt, setPublishAt,
        errors, setErrors,
        handleSubmit,
        mode
      }}
    >
      <div title="Thêm bài viết mới">
        <Grid container spacing={3}>
          <Grid item xs={12} md={9} >
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

export default FormPost;
