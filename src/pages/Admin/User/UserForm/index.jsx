import { useState, useCallback, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Typography,
  FormHelperText,
  Avatar,
  Grid,
} from '@mui/material';
import { Trash2, PlusCircle } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

const UserForm = ({ initialData = null, onSubmit, externalErrors = {} }) => {
  const theme = useTheme();
  const [user, setUser] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    status: initialData?.status ?? 'active',
    avatarFile: null,
  });

  const [preview, setPreview] = useState(initialData?.avatar || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors(externalErrors);
  }, [externalErrors]);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const updated = { ...prev };
      if (value?.toString().trim() && updated[field]) delete updated[field];
      return updated;
    });
  };

const validateAllFields = () => {
  const newErrors = { ...externalErrors };
  if (!user.email.trim()) newErrors.email = 'Email không được để trống!';
  if (!initialData && !user.password.trim()) {
    newErrors.password = 'Mật khẩu không được để trống!';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleFileChange = (e) => {
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (file) {
      setUser((prev) => ({ ...prev, avatarFile: file }));
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, avatar: '' }));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setUser((prev) => ({ ...prev, avatarFile: null }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      onSubmit(user);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 4, border: '1px solid #e0e0e0' }}>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ và tên *"
                value={user.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                fullWidth
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email *"
                type="email"
                value={user.email}
                onChange={(e) => handleChange('email', e.target.value)}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mật khẩu *"
                type="password"
                value={user.password}
                onChange={(e) => handleChange('password', e.target.value)}
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                value={user.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày sinh"
                type="date"
                value={user.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={user.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                  <MenuItem value="pending">Đang chờ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Avatar */}
          <Box mt={2}>
            <Typography variant="body1" fontWeight={500} mb={1}>
              Ảnh đại diện <span style={{ color: theme.palette.error.main }}>*</span>
            </Typography>
            <label
              htmlFor="avatar-upload"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '150px',
                border: `2px dashed ${
                  errors.avatar ? theme.palette.error.main : theme.palette.divider
                }`,
                borderRadius: theme.shape.borderRadius,
                cursor: 'pointer',
                transition: 'border-color 0.3s, background-color 0.3s',
                backgroundColor: theme.palette.background.default,
                position: 'relative',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="avatar-upload"
              />
              <Box display="flex" flexDirection="column" alignItems="center">
                <PlusCircle size={40} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Kéo thả hoặc bấm để chọn ảnh
                </Typography>
              </Box>
            </label>
            {errors.avatar && (
              <FormHelperText error sx={{ mt: 1 }}>
                {errors.avatar}
              </FormHelperText>
            )}
            {preview && (
              <Box position="relative" mt={3} width={150} height={150}>
                <Avatar
                  src={preview}
                  alt="Avatar Preview"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: theme.shape.borderRadius,
                  }}
                  variant="rounded"
                />
                <Button
                  variant="text"
                  color="error"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveImage();
                  }}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    minWidth: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    p: 0,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3 }}>
          <Button variant="outlined" onClick={() => window.history.back()}>
            Hủy
          </Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;