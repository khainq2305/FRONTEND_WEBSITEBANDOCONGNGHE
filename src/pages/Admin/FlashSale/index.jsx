import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, TablePagination, Tooltip,
  Tabs, Tab, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from 'react-router-dom';
import { flashSaleService } from '../../../services/admin/flashSaleService';

import toast from 'react-hot-toast';

const FlashSaleList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setPage(0);
  };

  const fetchData = async () => {
    try {
      const res = await flashSaleService.list({
        page: page + 1,
        limit: rowsPerPage,
        tab,
        search,
        categoryId: category
      });
      setData(res.data.rows);
      setTotal(res.data.count);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách Flash Sale');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.list();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Lỗi load danh mục:', err);
    }
  };

  const handleDelete = async (id) => {
    await flashSaleService.delete(id);
    toast.success('Đã chuyển vào thùng rác');
    fetchData();
  };

  const handleRestore = async (id) => {
    await flashSaleService.restore(id);
    toast.success('Đã khôi phục');
    fetchData();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, tab, search, category]);

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>Quản lý Flash Sale</Typography>

      <Button variant="contained" onClick={() => navigate('/admin/flash-sale/create')}>
        Thêm Flash Sale
      </Button>

      {/* Tabs & Filter */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Tất Cả" value="all" />
          <Tab label="Hoạt Động" value="active" />
          <Tab label="Tạm Tắt" value="inactive" />
          <Tab label="Thùng Rác" value="trash" />
        </Tabs>

        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={category}
              label="Danh mục"
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      {/* Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.startTime} - {row.endTime}</TableCell>
                <TableCell>{row.isActive ? 'Đang chạy' : 'Tạm dừng'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton onClick={() => navigate(`/admin/flash-sale/edit/${row.id}`)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {row.deletedAt ? (
                    <Tooltip title="Khôi phục">
                      <IconButton onClick={() => handleRestore(row.id)}>
                        <RestoreIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Xóa">
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};

export default FlashSaleList;
