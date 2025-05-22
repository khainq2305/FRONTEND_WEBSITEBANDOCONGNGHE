import { useState } from 'react';
import {
  Box, Button, Paper, TextField, Typography,
  Divider, Avatar, FormControlLabel, Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Toastify from 'components/common/Toastify';
import axios from 'axios';

const BrandCreatePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      Toastify.error('Chỉ chấp nhận JPG, PNG, WEBP, SVG, ICO');
      return;
    }

    if (file.size > maxSize) {
      Toastify.error('Dung lượng ảnh tối đa là 2MB');
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return Toastify.error('Tên thương hiệu là bắt buộc');
    if (!imageFile) return Toastify.error('Vui lòng chọn logo thương hiệu');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('isActive', isActive);
      formData.append('logo', imageFile);

      const res = await axios.post('http://localhost:5000/admin/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Toastify.success(res.data?.message || `✅ Đã tạo thương hiệu "${res.data?.brand?.name}"`);
      navigate('/admin/brands');
    } catch (err) {
      Toastify.error(err?.response?.data?.message || 'Tạo thương hiệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Thêm thương hiệu mới
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography fontWeight={500} gutterBottom>
              Logo thương hiệu <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box
              onClick={() => document.getElementById('brand-image-input')?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleImageChange({ target: { files: [file] } });
              }}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                width: 100,
                height: 100,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f9f9f9'
              }}
            >
              <Avatar
                src={imageFile ? URL.createObjectURL(imageFile) : ''}
                alt="Logo"
                variant="rounded"
                sx={{ width: '100%', height: '100%' }}
              />
              <input
                id="brand-image-input"
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.webp,.svg,.ico"
                onChange={handleImageChange}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Kéo ảnh vào hoặc click để chọn. Chấp nhận JPG, PNG, SVG, WEBP. Tối đa 2MB.
            </Typography>
          </Box>

          <TextField
            label="Tên thương hiệu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label={isActive ? 'Trạng thái: Đã xuất bản' : 'Trạng thái: Bản nháp'}
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thương hiệu'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BrandCreatePage;
