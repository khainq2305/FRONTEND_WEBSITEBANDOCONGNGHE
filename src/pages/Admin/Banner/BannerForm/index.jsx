import React, { useState, useEffect } from 'react';
import {
  Box, Button, Paper, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Switch, FormControlLabel, CircularProgress,
  Grid, Typography as Text
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { sliderService } from '../../../../services/admin/sliderService';
import { toast } from 'react-toastify';

const BANNER_TYPES = [
  { value: 'topbar', label: 'Banner Trên Đầu (Topbar)' },
  { value: 'slider-main', label: 'Slider Trang Chủ (Carousel)' },
  { value: 'slider-side', label: '3 Banner Nhỏ Cạnh Slider' },
  { value: 'mid-poster', label: 'Banner Ở Giữa Trang' },
  { value: 'slider-footer', label: 'Banner Cuối Trang (Footer)' }
];

const imageSizeMap = {
  'topbar': { width: 200, height: 40 },
  'slider-main': { width: 300, height: 120 },
  'slider-side': { width: 150, height: 150 },
  'mid-poster': { width: 200, height: 100 },
  'slider-footer': { width: 300, height: 80 }
};

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [type, setType] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (id) fetchBannerById();
  }, [id]);

  const fetchBannerById = async () => {
    try {
      setLoadingInit(true);
      const res = await sliderService.getById(id);
      const b = res.data.data;
      setTitle(b.title || '');
      setLinkUrl(b.linkUrl || '');
      setAltText(b.altText || '');
      setType(b.type || '');
      setDisplayOrder(b.displayOrder || 1);
      setStartDate(b.startDate ? b.startDate.slice(0, 10) : '');
      setEndDate(b.endDate ? b.endDate.slice(0, 10) : '');
      setIsActive(b.isActive);
      setImagePreviews([b.imageUrl]);
    } catch (err) {
      toast.error('Không tìm thấy banner để sửa.');
      navigate('/admin/banners');
    } finally {
      setLoadingInit(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const formData = new FormData();
      if (imageFiles.length > 0) formData.append('image', imageFiles[0]);
      formData.append('title', title);
      formData.append('linkUrl', linkUrl);
      formData.append('altText', altText);
      formData.append('type', type);
      formData.append('displayOrder', displayOrder);
      if (startDate) formData.append('startDate', startDate);
      if (endDate) formData.append('endDate', endDate);
      formData.append('isActive', isActive ? 'true' : 'false');

      if (id) {
        await sliderService.update(id, formData);
        toast.success('Cập nhật banner thành công!');
      } else {
        await sliderService.create(formData);
        toast.success('Tạo banner thành công!');
      }

      navigate('/admin/banners');
    } catch (err) {
      console.error(err);
      const backendErrors = err?.response?.data?.errors || [];
      const mapped = {};
      backendErrors.forEach((e) => (mapped[e.field] = e.message));
      setFieldErrors(mapped);
      toast.error(id ? 'Cập nhật thất bại.' : 'Tạo mới thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (id && loadingInit) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={600}>
        {id ? 'Chỉnh sửa Banner' : 'Thêm mới Banner'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="banner-image-upload">Ảnh Banner</InputLabel>
              <Box
                component="label"
                htmlFor="banner-image-upload"
                sx={{
                  mt: 1,
                  width: '100%',
                  height: 180,
                  border: '2px dashed',
                  borderColor: fieldErrors.image ? 'error.main' : 'grey.400',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  bgcolor: 'grey.50',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <input
                  id="banner-image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                <Text variant="subtitle2" color="text.secondary">
                  {type === 'homepage_slider' || type === 'homepage_side_3'
                    ? 'Kéo thả hoặc chọn nhiều ảnh'
                    : 'Kéo thả hoặc chọn 1 ảnh'}
                </Text>
              </Box>
              {fieldErrors.image && (
                <Text variant="caption" color="error">{fieldErrors.image}</Text>
              )}
              <Box mt={2} display="flex" gap={1}>
                {imagePreviews.map((src, idx) => {
                  const size = imageSizeMap[type] || { width: 100, height: 60 };
                  return (
                    <Box key={idx} sx={{ width: size.width, height: size.height, overflow: 'hidden' }}>
                      <img src={src} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  );
                })}
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Link URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                fullWidth
                error={!!fieldErrors.linkUrl}
                helperText={fieldErrors.linkUrl}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Alt Text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                fullWidth
                error={!!fieldErrors.altText}
                helperText={fieldErrors.altText}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!fieldErrors.type}>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  value={type}
                  label="Type"
                  onChange={(e) => {
                    setType(e.target.value);
                    setImageFiles([]);
                    setImagePreviews([]);
                  }}
                >
                  {BANNER_TYPES.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
                {fieldErrors.type && (
                  <Text variant="caption" color="error">{fieldErrors.type}</Text>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Display Order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                fullWidth
                error={!!fieldErrors.displayOrder}
                helperText={fieldErrors.displayOrder}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                error={!!fieldErrors.startDate}
                helperText={fieldErrors.startDate}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                error={!!fieldErrors.endDate}
                helperText={fieldErrors.endDate}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                label={isActive ? 'Hoạt động' : 'Ẩn'}
              />
            </Grid>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Lưu'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/admin/banners')} disabled={loading}>
            Hủy
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BannerForm;
