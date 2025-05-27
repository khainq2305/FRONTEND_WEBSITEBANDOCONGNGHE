import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  Paper,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';
import { sliderService } from '../../../../services/admin/sliderService';
import { useNavigate } from 'react-router-dom';

const PlacementForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    type: 'slider',
    description: ''
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sliderService.createPlacement(form);
      onSuccess?.();
      navigate('/admin/placements');
    } catch (error) {
      console.error('Lỗi tạo placement:', error);
    }
  };

  return (
    <Paper sx={{ p: 3}}>
      <Typography variant="h5" gutterBottom>
        Thêm Khối Hiển Thị (Placement)
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Tên khối"
            variant="outlined"
            fullWidth
            required
            value={form.name}
            onChange={handleChange('name')}
          />

          <TextField
            label="Slug"
            variant="outlined"
            fullWidth
            required
            value={form.slug}
            onChange={handleChange('slug')}
          />

          <FormControl fullWidth>
            <InputLabel>Loại khối</InputLabel>
            <Select
              label="Loại khối"
              value={form.type}
              onChange={handleChange('type')}
            >
              <MenuItem value="slider">Slider</MenuItem>
              <MenuItem value="popup">Popup</MenuItem>
              <MenuItem value="banner">Banner</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Mô tả"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange('description')}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/admin/placements')}>
              Huỷ
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Lưu
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};

export default PlacementForm;
