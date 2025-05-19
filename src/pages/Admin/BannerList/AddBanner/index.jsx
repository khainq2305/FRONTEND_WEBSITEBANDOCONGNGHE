import { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddBanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: '',      // dùng để lưu đường dẫn preview
    status: 'active'
  });

  const [imageFile, setImageFile] = useState(null); // giữ file upload

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>Thêm banner</Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Tên banner"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />

          {/* File input cho ảnh */}
          <Box>
            <Typography fontSize={14} fontWeight={500} mb={1}>Ảnh banner</Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.image && (
              <Box mt={2}>
                <img src={formData.image} alt="preview" width="100%" style={{ maxHeight: 300, objectFit: 'contain', borderRadius: 8 }} />
              </Box>
            )}
          </Box>

          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              label="Trạng thái"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="active">Hiển thị</MenuItem>
              <MenuItem value="hidden">Ẩn</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => navigate('/admin/banners')}>Hủy</Button>
            <Button
              variant="contained"
              onClick={() => {
                console.log('Thêm banner:', formData);
                console.log('File ảnh đã chọn:', imageFile);
                navigate('/admin/banners');
              }}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddBanner;
