import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorOutline, Home } from '@mui/icons-material'; // Import thêm icon từ Material Icons

const NotFound = () => {
  const navigate = useNavigate();

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
      <ErrorOutline sx={{ fontSize: 100, color: 'error.main', mb: 2 }} /> {/* Icon lớn */}
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
        404 - Không tìm thấy trang
      </Typography>
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
        Rất tiếc! Trang bạn đang tìm không tồn tại hoặc đã bị xoá.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<Home />} // Thêm icon vào nút
        onClick={() => navigate('/admin')}
        sx={{
          mt: 2,
          px: 4, // Tăng padding ngang
          py: 1.5, // Tăng padding dọc
          borderRadius: 2, // Làm tròn góc hơn
          fontSize: '1.1rem', // Tăng kích thước font
          '&:hover': {
            backgroundColor: 'primary.dark', // Màu khi hover
          },
        }}
      >
        Quay về Trang chủ
      </Button>
    </Box>
  );
};

export default NotFound;