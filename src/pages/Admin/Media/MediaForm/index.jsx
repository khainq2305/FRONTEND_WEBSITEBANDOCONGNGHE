// src/components/admin/MediaForm.jsx
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Box
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MediaForm = ({ mode = 'create', initialData = {} }) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultType = query.get('type') || 'banner';

  const [formData, setFormData] = useState({
    title: '',
    type: defaultType,
    image: '',
    link: '',
    isActive: true,
    orderIndex: 1,
    ...initialData
  });

  // Nếu đang ở chế độ "create", khi URL query thay đổi thì cập nhật type
  useEffect(() => {
    if (mode === 'create') {
      setFormData((prev) => ({
        ...prev,
        type: defaultType
      }));
    }
  }, [defaultType, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📦 Dữ liệu gửi đi:', formData);
    // TODO: Gọi API thêm hoặc cập nhật
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Tiêu đề"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Loại media</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={mode === 'create' && query.get('type')}
          >
            <MenuItem value="banner">Banner</MenuItem>
            <MenuItem value="slider">Slider</MenuItem>
            <MenuItem value="popup">Popup</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Link chuyển hướng"
          name="link"
          value={formData.link}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Link ảnh"
          name="image"
          value={formData.image}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Thứ tự hiển thị"
          name="orderIndex"
          type="number"
          value={formData.orderIndex}
          onChange={handleChange}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          }
          label="Hiển thị"
        />

        <Button type="submit" variant="contained" color="primary">
          {mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Box>
    </form>
  );
};

export default MediaForm;
