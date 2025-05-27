import { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Paper, TextField, Typography,
  Divider, Avatar, FormControlLabel, Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { brandService } from '@/services/admin/brandService';
import slugify from 'slugify';

const LOCAL_KEY = 'brand-create-form';

const BrandCreatePage = () => {
  const navigate = useNavigate();
  const nameRef = useRef(null);

  const saved = JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
  const [name, setName] = useState(saved.name || '');
  const [slug, setSlug] = useState(slugify(saved.name || '', { lower: true, strict: true }));
  const [description, setDescription] = useState(saved.description || '');
  const [isActive, setIsActive] = useState(saved.isActive ?? true);
  const [orderIndex, setOrderIndex] = useState(saved.orderIndex || 0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(saved.imagePreview || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    const formData = { name, description, isActive, orderIndex, imagePreview };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(formData));
  }, [name, description, isActive, orderIndex, imagePreview]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (name || description || imageFile) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [name, description, imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận JPG, PNG, WEBP, SVG, ICO');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Dung lượng ảnh tối đa là 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    setErrors(prev => ({ ...prev, logoUrl: undefined }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(slugify(value, { lower: true, strict: true }));
    setErrors(prev => ({ ...prev, name: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Tên thương hiệu là bắt buộc' }));
      return;
    }

    if (!imageFile) {
      setErrors(prev => ({ ...prev, logoUrl: 'Vui lòng chọn logoUrl thương hiệu' }));
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name,
        slug,
        description,
        isActive,
        orderIndex,
        logoUrl: imageFile
      };

      const res = await brandService.create(payload);
      toast.success(res.data?.message || '✅ Đã tạo thương hiệu thành công');

      localStorage.removeItem(LOCAL_KEY);
      navigate('/admin/brands');
    } catch (err) {
      const msg = err?.response?.data?.message;
      const field = err?.response?.data?.field;

      if (field) {
        setErrors({ [field]: msg });
      }

      toast.error(msg || 'Tạo thương hiệu thất bại');
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
          {/* logoUrl */}
          <Box sx={{ mb: 3 }}>
            <Typography fontWeight={500} gutterBottom>
              Logo thương hiệu <span style={{ color: 'red' }}>*</span>
            </Typography>

            <Box
              onClick={() => document.getElementById('brand-image-input')?.click()}
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
                overflow: 'hidden'
              }}
            >
              <Avatar
                src={imagePreview}
                alt="logo"
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

            {errors.logoUrl && (
              <Typography variant="caption" color="error">
                {errors.logoUrl}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Click để chọn ảnh. Hỗ trợ JPG, PNG, SVG, WEBP, ICO. Tối đa 2MB.
            </Typography>
          </Box>


          {/* Name */}
          <TextField
            inputRef={nameRef}
            label="Tên thương hiệu"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          {/* OrderIndex */}
          <TextField
            label="Thứ tự (STT)"
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
            helperText="STT càng nhỏ sẽ hiển thị trước"
          />

          {/* Description */}
          <TextField
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            margin="normal"
          />

          {/* Status */}
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label={isActive ? 'Trạng thái: Hiển thị' : 'Trạng thái: Ẩn'}
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !name.trim() || !imageFile}
            >
              {loading ? 'Đang lưu...' : 'Lưu thương hiệu'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BrandCreatePage;
