import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, IconButton,
  Stack, Chip, Menu, MenuItem, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { sliderService } from '../../../services/admin/sliderService';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await sliderService.getBanners();
      setBanners(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách banner:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      await sliderService.deleteBanner(id);
      fetchData();
    }
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Danh sách Banner</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/banners/create')}
        >
          Thêm Banner
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((banner, index) => (
              <TableRow key={banner.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={banner.imageUrl}
                    alt={banner.altText}
                    width={80}
                    style={{ borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>
                  <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                    {banner.linkUrl}
                  </a>
                </TableCell>
                <TableCell>
                  <Chip
                    label={banner.isActive ? 'Hiển thị' : 'Ẩn'}
                    color={banner.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, banner.id)} size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {banners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Không có banner nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu hành động */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/admin/banners/edit/${selectedId}`);
            handleMenuClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete(selectedId);
            handleMenuClose();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Xoá
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BannerList;
