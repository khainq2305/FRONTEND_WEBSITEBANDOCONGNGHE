// src/pages/Admin/BannerDetail/index.jsx
import {
  Box, Typography, Paper, Button, Divider,
  TextField, Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Dữ liệu banner mẫu (giống mockOrders)
const mockBanners = [
  {
    id: 1,
    code: 'BN001',
    title: 'Banner Giảm Giá Mùa Hè',
    imageUrl: 'https://th.bing.com/th/id/R.1f96a356192f7ed4f594cc9a52e9271a?rik=Q21fHQE3lx5oPA&pid=ImgRaw&r=0',
    link: 'https://example.com/sale',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'active',
    description: 'Khuyến mãi lên đến 50% cho tất cả sản phẩm mùa hè.'
  },
  {
    id: 2,
    code: 'BN002',
    title: 'Banner Sản Phẩm Mới',
    imageUrl: 'https://th.bing.com/th/id/R.1f96a356192f7ed4f594cc9a52e9271a?rik=Q21fHQE3lx5oPA&pid=ImgRaw&r=0',
    link: 'https://example.com/new-products',
    startDate: '2025-05-15',
    endDate: '2025-06-15',
    status: 'inactive',
    description: 'Giới thiệu bộ sưu tập sản phẩm mới tháng 5.'
  },
  {
    id: 3,
    code: 'BN002',
    title: 'Banner Sản Phẩm Mới',
    imageUrl: 'https://th.bing.com/th/id/R.1f96a356192f7ed4f594cc9a52e9271a?rik=Q21fHQE3lx5oPA&pid=ImgRaw&r=0',
    link: 'https://example.com/new-products',
    startDate: '2025-05-15',
    endDate: '2025-06-15',
    status: 'inactive',
    description: 'Giới thiệu bộ sưu tập sản phẩm mới tháng 5.'
  }
];

// Map trạng thái banner tương tự statusLabels
const statusLabels = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  expired: 'Đã hết hạn'
};

const BannerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const banner = mockBanners.find((b) => b.id === parseInt(id));
  const [form] = useState(banner); // Chỉ xem, không sửa

  const readOnlyStyle = {
    disabled: true,
    InputProps: {
      sx: {
        color: 'text.primary',
        fontWeight: 500
      }
    }
  };

  if (!banner) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Không tìm thấy banner</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Quay lại</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Banner {form.code}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Thông tin banner</Typography>
            <TextField label="Tiêu đề" value={form.title} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField label="Link liên kết" value={form.link} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField label="Ngày bắt đầu" value={form.startDate} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField label="Ngày kết thúc" value={form.endDate} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField
              label="Trạng thái"
              value={statusLabels[form.status] || 'Không rõ'}
              fullWidth
              margin="dense"
              {...readOnlyStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Hình ảnh banner</Typography>
            <Box
              component="img"
              src={form.imageUrl}
              alt={form.title}
              sx={{ width: '100%', borderRadius: 1, maxHeight: 200, objectFit: 'contain' }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom fontWeight={500}>Mô tả</Typography>
        <TextField
          value={form.description}
          fullWidth
          multiline
          rows={4}
          margin="dense"
          {...readOnlyStyle}
        />
      </Paper>
    </Box>
  );
};

export default BannerDetail;
