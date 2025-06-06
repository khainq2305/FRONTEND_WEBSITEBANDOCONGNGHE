import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { paymentMethodService } from '../../../../services/admin/paymentMethodService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function PaymentMethodForm({ isEdit = false, isDetail = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    code: '',
    name: '',
    isActive: true,
    thumbnail: null,
  });

  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((isEdit || isDetail) && id) {
      paymentMethodService
        .getById(id)
        .then((res) => {
          setForm({ ...res.data, thumbnail: null });
          setPreview(res.data.thumbnail || '');
        })
        .catch(() => {
          toast.error('Không tìm thấy phương thức');
          navigate('/admin/payment-methods-admin');
        });
    }
  }, [isEdit, isDetail, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!isDetail) {
      setForm((prev) => ({ ...prev, [name]: value }));

      if (name === 'name' && value.trim().length > 0) {
        setErrors((prev) => ({ ...prev, name: null }));
      }
      if (name === 'code' && value.trim().length > 0) {
        setErrors((prev) => ({ ...prev, code: null }));
      }
    }
  };

  const handleToggle = () => {
    if (!isDetail) {setForm((prev) => ({ ...prev, isActive: !prev.isActive }));

    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!isDetail && file) {
      setForm((prev) => ({ ...prev, thumbnail: file }));
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, thumbnail: null }));
    }
  };


  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!isDetail && file) {
      setForm((prev) => ({ ...prev, thumbnail: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors({});

      const formData = new FormData();
      formData.append('code', form.code);
      formData.append('name', form.name);
      formData.append('isActive', form.isActive);
      if (form.thumbnail instanceof File) {
        formData.append('thumbnail', form.thumbnail);
      }

      if (isEdit) {
        await paymentMethodService.update(id, formData);
        toast.success('Cập nhật thành công');
      } else {
        await paymentMethodService.create(formData);
        toast.success('Thêm mới thành công');
      }

      navigate('/admin/payment-methods-admin');
    } catch (err) {
      const res = err.response?.data;
      if (res?.field && res?.message) {
        setErrors({ [res.field]: res.message });
      } else {
        toast.error(res?.message || 'Lỗi xử lý phương thức');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        {isDetail
          ? 'Xem chi tiết phương thức'
          : isEdit
            ? 'Cập nhật phương thức'
            : 'Thêm phương thức thanh toán'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Mã (code)"
            name="code"
            fullWidth
            value={form.code}
            onChange={handleChange}
            disabled={isEdit || isDetail}
            error={!!errors.code}
            helperText={errors.code}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Tên"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
            disabled={isDetail}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={handleToggle}
                disabled={isDetail}
              />
            }
            label="Trạng thái: Hoạt động"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography fontWeight={500} mb={1}>Thumbnail</Typography>
          <label
            htmlFor="thumbnail"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`
              flex items-center justify-center w-full h-72 px-4 transition bg-gray-50 border-2 border-dashed 
              rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50
              ${isDetail ? 'cursor-not-allowed opacity-50' : ''}
              ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
              id="thumbnail"
              disabled={isDetail}
            />
            <span className="text-gray-500 text-sm text-center">
              Kéo thả hoặc bấm để chọn ảnh từ máy
            </span>
          </label>

          {errors.thumbnail && (
            <Typography color="error" fontSize={13} mt={1}>
              {errors.thumbnail}
            </Typography>
          )}

          {preview && (
            <Box mt={2}>
              <Typography variant="caption">Xem trước:</Typography>
              <Box
                component="img"
                src={preview}
                alt="thumbnail"
                sx={{
                  mt: 1,
                  maxHeight: 150,
                  borderRadius: 2,
                  border: '1px solid #ddd',
                  p: 1,
                  backgroundColor: '#fff',
                }}
              />
            </Box>
          )}
        </Grid>

        {!isDetail && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
