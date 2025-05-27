import React, { useState } from 'react';
import {
  TextField, Button, Paper, Typography, Switch,
  FormControlLabel, Stack
} from '@mui/material';
import { sliderService } from '../../../../services/admin/sliderService';
import { useNavigate } from 'react-router-dom';

const BannerForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    altText: '',
    isActive: true
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sliderService.createBanner(form);
      if (onSuccess) onSuccess();
      else navigate('/admin/banners');
    } catch (err) {
      console.error('Lỗi khi tạo banner:', err);
    }
  };

  return (
    <Paper sx={{ p: 3}}>
      <Typography variant="h5" gutterBottom>
        Thêm Banner Mới
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Tiêu đề"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Đường dẫn ảnh (Image URL)"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Liên kết khi click (Link URL)"
            name="linkUrl"
            value={form.linkUrl}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Văn bản thay thế ảnh (alt)"
            name="altText"
            value={form.altText}
            onChange={handleChange}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
            }
            label="Kích hoạt hiển thị"
          />

          <Button variant="contained" color="primary" type="submit">
            Lưu Banner
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default BannerForm;
