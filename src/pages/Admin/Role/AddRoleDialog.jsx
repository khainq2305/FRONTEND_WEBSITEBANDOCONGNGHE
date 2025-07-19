import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel
} from '@mui/material';

const AddRoleDialog = ({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    canAccess: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      return alert('Vui lòng nhập tên vai trò');
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      canAccess: form.canAccess
    };
    onSubmit?.(payload); // Truyền dữ liệu lên component cha
    onClose();
    setForm({ name: '', description: '', canAccess: false });
    console.log('payload', payload);
    debugger;
  };
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        canAccess: initialData.canAccess ?? false
      });
    }
  }, [initialData]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Tên vai trò */}
          <TextField
            name="name"
            label="Tên vai trò"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Mô tả vai trò */}
          <TextField
            name="description"
            label="Mô tả vai trò"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
          {/* Checkbox quyền truy cập admin */}
          <FormControlLabel
            control={
              <Checkbox
                name="canAccess"
                checked={form.canAccess}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Quyền truy cập admin"
          />

          {/* Xem trước vai trò */}
          {form.name && form.description && (
            <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Xem trước vai trò
            </Typography>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                p: 3,
                border: '1px solid #e0e0e0',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {form.name || 'Tên vai trò'}
                </Typography>
                <Typography  variant="body2" color="text.secondary">
                  {form.description || 'Mô tả vai trò'}
                </Typography>
              </Box>
            </Box>
          </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Huỷ bỏ</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo vai trò'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoleDialog;
