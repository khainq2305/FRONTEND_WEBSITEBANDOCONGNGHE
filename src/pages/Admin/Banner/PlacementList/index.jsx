import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Chip,
  IconButton, Menu, MenuItem, Button, Stack
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { useNavigate } from 'react-router-dom';
import { sliderService } from '../../../../services/admin/sliderService';

const PlacementList = () => {
  const [placements, setPlacements] = useState([]);
  const [anchorEls, setAnchorEls] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    sliderService.getPlacements().then(res => {
      setPlacements(res.data.data || []);
    });
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleMenuClose = (id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'slider': return 'primary';
      case 'popup': return 'error';
      case 'banner': return 'success';
      default: return 'default';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xoá khối này?')) {
      await sliderService.deletePlacement(id);
      fetchData();
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Danh sách Vị trí hiển thị (Placements)</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/placements/create')}
        >
          Thêm khối hiển thị
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {placements.map((p, index) => (
              <TableRow key={p.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.slug}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>
                  <Chip label={p.type} color={getTypeColor(p.type)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, p.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEls[p.id]}
                    open={Boolean(anchorEls[p.id])}
                    onClose={() => handleMenuClose(p.id)}
                  >
                    <MenuItem onClick={() => {
                      handleMenuClose(p.id);
                      navigate(`/admin/placements/edit/${p.id}`);
                    }}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      Chỉnh sửa
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleMenuClose(p.id);
                      handleDelete(p.id);
                    }}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      Xoá
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleMenuClose(p.id);
                      navigate(`/admin/placement-banners/${p.id}/banners`);
                    }}>
                      <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                      Gán banner
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
            {placements.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Không có dữ liệu.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlacementList;
