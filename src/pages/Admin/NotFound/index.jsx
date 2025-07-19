import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" color="error" gutterBottom>
        404 - Không tìm thấy trang
      </Typography>
      <Typography variant="body1" mb={3}>
        Trang bạn đang tìm không tồn tại hoặc đã bị xoá.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/admin')}>
        Quay về Trang chủ
      </Button>
    </Box>
  );
};

export default NotFound;
