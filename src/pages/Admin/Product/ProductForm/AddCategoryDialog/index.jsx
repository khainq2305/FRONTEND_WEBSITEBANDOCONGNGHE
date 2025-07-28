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
import { categoryService } from '../../../../../services/admin/categoryService';

const AddCategoryDialog = ({ open, onClose, onSuccess, categoryTree }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Tên danh mục không được bỏ trống');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (parentId) formData.append('parentId', parentId);

      await categoryService.create(formData);
      onSuccess && onSuccess();
      onClose();
      setName('');
      setParentId('');
      setError('');
    } catch (err) {
      console.error('Lỗi thêm danh mục:', err);
      setError('Không thể tạo danh mục');
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
          label="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 1, mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Danh mục cha (nếu có)"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <MenuItem value="">-- Không có (gốc) --</MenuItem>
          {renderCategoryOptions(categoryTree)}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">Thêm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
