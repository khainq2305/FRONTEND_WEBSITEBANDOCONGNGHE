import { useState } from 'react';
import {
  Box, Button, Paper, TextField, Typography,
  Divider, Avatar, FormControlLabel, Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Toastify from 'components/common/Toastify';

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')                       // Remove accents
    .replace(/[\u0300-\u036f]/g, '')        // Remove accents
    .replace(/[^a-z0-9 -]/g, '')            // Remove invalid chars
    .replace(/\s+/g, '-')                   // Replace spaces with -
    .replace(/-+/g, '-');                   // Collapse multiple -
};

const BrandCreatePage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      Toastify.error('Chỉ chấp nhận ảnh JPG, PNG, WEBP, SVG, ICO');
      return;
    }

    if (file.size > maxSize) {
      Toastify.error('Dung lượng ảnh tối đa là 2MB');
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Toastify.error('Tên thương hiệu là bắt buộc');
      return;
    }

    if (!slug.trim()) {
      Toastify.error('Slug là bắt buộc');
      return;
    }

    if (!imageFile) {
      Toastify.error('Vui lòng chọn logo thương hiệu');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('is_active', isActive);
    formData.append('image', imageFile);

    Toastify.success(`Đã tạo thương hiệu "${name}"`);
    navigate('/admin/brands');
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

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, width: '100%' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Thêm thương hiệu mới
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          {/* Logo upload */}
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
                bgcolor: '#f9f9f9',
                position: 'relative',
              }}
            >
              <Avatar
                src={imageFile ? URL.createObjectURL(imageFile) : ''}
                alt="Logo"
                variant="rounded"
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 2,
                  objectFit: 'contain',
                  border: imageFile ? 'none' : '1px dashed #ccc',
                }}
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
              Kéo ảnh vào hoặc click để chọn file. Chấp nhận JPG, PNG, SVG, WEBP. Tối đa 2MB.
            </Typography>
          </Box>

          {/* Tên thương hiệu */}
          <TextField
            label="Tên thương hiệu"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(generateSlug(e.target.value)); // Tự động sinh slug
            }}
            fullWidth
            required
            margin="normal"
          />

          {/* Slug */}
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            fullWidth
            required
            margin="normal"
          />

          {/* Mô tả */}
          <TextField
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            margin="normal"
          />

          {/* Trạng thái */}
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label="Hiển thị thương hiệu"
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" size="large" type="submit">
              Lưu thương hiệu
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BrandCreatePage;
