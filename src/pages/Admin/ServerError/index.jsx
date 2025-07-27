import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CloudOff, Refresh, Home } from '@mui/icons-material'; // Import thêm icon

const ServerError = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload(); // Tải lại trang hiện tại
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Chiếm toàn bộ chiều cao màn hình
        backgroundColor: '#f8f9fa', // Màu nền nhẹ nhàng
        p: 3,
        textAlign: 'center',
      }}
    >
      <CloudOff sx={{ fontSize: 100, color: 'error.main', mb: 2 }} /> {/* Icon lỗi server */}
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
        500 - Lỗi máy chủ
      </Typography>
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
        Đã có lỗi xảy ra ở phía máy chủ. Chúng tôi đang cố gắng khắc phục sự cố này.
        <br />Vui lòng thử lại sau ít phút hoặc quay về trang chủ.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1.1rem',
          }}
        >
          Thử lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate('/admin')} // Hoặc navigate('/') nếu trang chủ public
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1.1rem',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Quay về Trang chủ
        </Button>
      </Box>
    </Box>
  );
};

export default ServerError;