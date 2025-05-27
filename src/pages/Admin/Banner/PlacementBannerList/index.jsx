import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Stack, Chip, IconButton, Menu, MenuItem, Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from 'react-router-dom';
import { sliderService } from '../../../../services/admin/sliderService';

const PlacementBannerList = () => {
  const { placementId } = useParams();
  const [items, setItems] = useState([]);
  const [anchorEls, setAnchorEls] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [placementId]);

  const fetchData = async () => {
    try {
      const res = await sliderService.getBannersByPlacement(placementId);
      setItems(res.data.data || []);
    } catch (err) {
      console.error('Lỗi lấy banner theo khối:', err);
    }
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleMenuClose = (id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xoá banner khỏi khối này?')) {
      await sliderService.deleteBannerAssignment(id);
      fetchData();
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Danh sách Banner trong Khối #{placementId}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/admin/placement-banners/${placementId}/add`)}
        >
          Gán banner vào khối
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
              <TableCell>Thứ tự</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={item.banner?.imageUrl}
                    alt={item.banner?.title}
                    width={100}
                    style={{ borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>{item.banner?.title}</TableCell>
                <TableCell>
                  <a href={item.banner?.linkUrl} target="_blank" rel="noopener noreferrer">
                    {item.banner?.linkUrl}
                  </a>
                </TableCell>
                <TableCell>{item.displayOrder}</TableCell>
                <TableCell>
                  <Chip
                    label={item.isActiveInPlacement ? 'Hiển thị' : 'Ẩn'}
                    color={item.isActiveInPlacement ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, item.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEls[item.id]}
                    open={Boolean(anchorEls[item.id])}
                    onClose={() => handleMenuClose(item.id)}
                  >
                    <MenuItem onClick={() => {
                      handleMenuClose(item.id);
                      navigate(`/admin/placement-banners/edit/${item.id}`);
                    }}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleMenuClose(item.id);
                      handleDelete(item.id);
                    }}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xoá
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có banner nào trong khối này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlacementBannerList;
