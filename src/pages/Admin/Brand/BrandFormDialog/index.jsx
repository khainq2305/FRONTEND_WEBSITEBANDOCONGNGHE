// src/components/admin/BrandFormDialog.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControlLabel, Switch
} from '@mui/material';
import { useState, useEffect } from 'react';

const BrandFormDialog = ({ open, onClose, brand, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    description: '',
    is_active: true
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        image: null,
        description: brand.description || '',
        is_active: brand.is_active !== false
      });
    } else {
      setFormData({
        name: '',
        image: null,
        description: '',
        is_active: true
      });
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleToggle = (e) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Tên thương hiệu không được để trống');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{brand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Tên thương hiệu"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Mô tả"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />
        <input
          type="file"
          accept=".jpg,.png,.webp,.svg,.ico"
          onChange={handleFileChange}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.is_active}
              onChange={handleToggle}
              name="is_active"
            />
          }
          label="Kích hoạt"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandFormDialog;
