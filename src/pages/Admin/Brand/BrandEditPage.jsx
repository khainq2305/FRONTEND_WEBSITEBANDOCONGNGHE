import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField, Typography, Divider, Avatar, FormControlLabel, Switch } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { brandService } from '@/services/admin/brandService';
import slugify from 'slugify';
import { useForm, Controller } from 'react-hook-form';
import TinyEditor from '@/components/Admin/TinyEditor';
import CropImageDialog from '@/components/common/CropImageDialog';
import { getCroppedImg } from '@/utils/cropImageFromFile';
import Loader from '@/components/Admin/LoaderVip';

const BrandEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState(null);

  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      description: ''
    }
  });

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await brandService.getById(id);
        const brand = res.data.data;
        setName(brand.name);
        setSlug(brand.slug || '');
        setIsActive(brand.isActive);
        setImagePreview(brand.logoUrl);
        setOrderIndex(brand.orderIndex || 0);
        setValue('description', brand.description || '');
      } catch (err) {
        toast.error('Không tìm thấy thương hiệu');
        navigate('/admin/brands');
      }
    };

    fetchBrand();
  }, [id, navigate, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận ảnh JPG, JPEG, PNG');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Dung lượng ảnh tối đa là 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageUrl(reader.result);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = ({ file, url }) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64 = reader.result;
    setImageFile(file);        
    setImagePreview(base64);    
    setErrors((prev) => ({ ...prev, logoUrl: undefined }));
  };
  reader.readAsDataURL(file);
};

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(slugify(value, { lower: true, strict: true }));
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const onSubmit = async (data) => {
    setErrors({});

    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Tên thương hiệu là bắt buộc' }));
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        slug,
        description: data.description,
        isActive,
        orderIndex
      };

      if (imageFile) {
        payload.logoUrl = imageFile;
      }

      const res = await brandService.update(id, payload);
      toast.success(res.data?.message || 'Cập nhật thương hiệu thành công');
      navigate('/admin/brands');
    } catch (err) {
      const msg = err?.response?.data?.message;
      const field = err?.response?.data?.field;

      if (field) {
        setErrors((prev) => ({ ...prev, [field]: msg }));
      }

      toast.error(msg || 'Cập nhật thương hiệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Quay lại
      </Button>
      {loading && <Loader fullscreen />}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Chỉnh sửa thương hiệu
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <Typography fontWeight={500} gutterBottom>
              Logo thương hiệu <span style={{ color: 'red' }}>*</span>
            </Typography>

            <Box
              onClick={() => document.getElementById('brand-image-input')?.click()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                width: 300,
                height: 100,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f9f9f9',
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt="logo"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
              <input id="brand-image-input" type="file" hidden accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
            </Box>

            {errors.logoUrl && (
              <Typography variant="caption" color="error">
                {errors.logoUrl}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Click để chọn ảnh. Chỉ hỗ trợ JPG, JPEG, PNG. Tối đa 5MB.
            </Typography>
          </Box>

          <TextField
            label="Tên thương hiệu"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

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

          <Controller
            name="description"
            control={control}
            render={({ field }) => <TinyEditor value={field.value} onChange={field.onChange} height={300} />}
          />

          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="primary" />}
            label={isActive ? 'Trạng thái: Hoạt động' : 'Trạng thái: Tạm tắt'}
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Cập nhật'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Crop Modal */}
      <CropImageDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={rawImageUrl}
        onCropComplete={handleCropComplete}
        cropHeight={600}
        aspectRatio={3 / 1} // 👈 tuỳ biến theo từng file
        dialogMaxWidth="md" // 👈 tuỳ chỉnh theo nội dung
      />
    </Box>
  );
};

export default BrandEditPage;
