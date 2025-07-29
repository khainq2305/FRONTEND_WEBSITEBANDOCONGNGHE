import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography
} from '@mui/material';
import { categoryService } from '@/services/admin/categoryService';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';


import ThumbnailUpload from '../../ThumbnailUpload';

const AddCategoryDialog = ({ open, onClose, onSuccess, categoryTree }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [error, setError] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setThumbnailError('');
    setIsLoading(true);

    if (!name.trim()) {
      setError('Tên danh mục không được bỏ trống');
      setIsLoading(false);
      return;
    }

    if (!thumbnail?.file) {
      setThumbnailError('Vui lòng chọn ảnh đại diện');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (parentId) formData.append('parentId', parentId);
      formData.append('thumbnail', thumbnail.file);

      const res = await categoryService.create(formData);
      onSuccess?.(res.data.data);
      onClose();

      // Reset form
      setName('');
      setParentId('');
      setThumbnail(null);
      setError('');
      setThumbnailError('');
    } catch (err) {
      const res = err?.response?.data;
      if (res?.field === 'name') setError(res.message);
      else if (res?.field === 'thumbnail') setThumbnailError(res.message);
      else setError('Không thể tạo danh mục');
      console.error('Lỗi thêm danh mục:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const renderCategoryOptions = (categories, level = 0, prefix = '') => {
    let options = [];
    categories.forEach((cat, index) => {
      const isLast = index === categories.length - 1;
      const currentPrefix = prefix + (isLast ? '└── ' : '├── ');
      options.push(
        <MenuItem key={cat.id} value={cat.id}>
          <span style={{ whiteSpace: 'pre' }}>{currentPrefix}</span>
          {cat.name}
        </MenuItem>
      );
      if (cat.children?.length) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        options = options.concat(renderCategoryOptions(cat.children, level + 1, newPrefix));
      }
    });
    return options;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Thêm danh mục mới</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={
            <Typography component="span">
              Tên danh mục <Typography component="span" color="error">*</Typography>
            </Typography>
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 1, mb: 2 }}
        />

        <ThumbnailUpload value={thumbnail} onChange={setThumbnail} sx={{ mb: 1.5 }} />
        {thumbnailError && (
          <Typography color="error" variant="caption" sx={{ ml: 2 }}>
            {thumbnailError}
          </Typography>
        )}

        <TextField
          select
          fullWidth
          label="Danh mục cha (nếu có)"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          sx={{ mt: 2 }}
        >
          <MenuItem value="">-- Không có (gốc) --</MenuItem>
          {renderCategoryOptions(categoryTree)}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Hủy</Button>
        <LoadingButton
          onClick={handleSubmit} l
          loading={isLoading}
          variant="contained"
        >
          Thêm
        </LoadingButton>
      </DialogActions>

    </Dialog>
  );
};

export default AddCategoryDialog;
