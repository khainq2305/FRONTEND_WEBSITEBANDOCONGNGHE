import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Checkbox,
  Menu,
  MenuItem,
  TextField,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Toastify from '../../../components/common/Toastify';
import Loader from '../../../components/common/Loader';
import MUIPagination from '../../../components/common/Pagination';
import { toast } from 'react-toastify';
import { paymentMethodService } from '../../../services/admin/paymentMethodService';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';

export default function PaymentMethodListPage() {
  const [methods, setMethods] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuMethod, setMenuMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [searchText, currentPage, itemsPerPage, filter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await paymentMethodService.list({
        page: currentPage,
        limit: itemsPerPage,
        filter,
        search: searchText
      });

      const result = res.data;
      setMethods(result?.data || []);
      setTotalItems(result?.pagination?.totalItems || 0);
    } catch (err) {
      toast.error('Không thể tải phương thức thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOne = async (id, name) => {
    if (!(await confirmDelete('xoá vĩnh viễn', name))) return;
    try {
      await paymentMethodService.delete(id);
      toast.success(`Đã xoá "${name}"`);
      fetchData();
    } catch (err) {
      toast.error(`Xoá thất bại: ${err?.response?.data?.message || 'Lỗi không xác định'}`);
    }
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? methods.map((m) => m.id) : []);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (e, method) => {
    setMenuAnchorEl(e.currentTarget);
    setMenuMethod(method);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuMethod(null);
  };

  return (
    <Box>
      <Toastify />
      {isLoading && <Loader fullscreen />}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Phương thức thanh toán</Typography>
        <Button variant="contained" onClick={() => (window.location.href = '/admin/payment-methods-admin/create')}>
          + Thêm phương thức
        </Button>
      </Box>

      <Box
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid #eee',
          borderRadius: 2,
          bgcolor: '#fafafa'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['Tất Cả', 'Hoạt Động', 'Tạm Tắt'].map((label, i) => {
              const value = ['all', 'active', 'inactive'][i];
              const isActive = filter === value;
              return (
                <Box
                  key={value}
                  onClick={() => {
                    setFilter(value);
                    setCurrentPage(1);
                  }}
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 14,
                    bgcolor: isActive ? 'primary.main' : '',
                    color: isActive ? 'white' : 'text.primary',
                    transition: '0.2s',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : '#e0e0e0'
                    }
                  }}
                >
                  {label}
                </Box>
              );
            })}
          </Box>

          <TextField
            size="small"
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              width: { xs: '100%', sm: 250 },
              flexShrink: 0
            }}
          />
        </Box>
      </Box>


      <Paper elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === methods.length && methods.length > 0}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < methods.length}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {methods.map((item) => (
              <TableRow key={item.id}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedIds.includes(item.id)} onChange={() => toggleSelectOne(item.id)} />
                </TableCell>
                <TableCell>
                  {item.thumbnail ? (
                    <Avatar src={item.thumbnail} variant="rounded" />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Không có ảnh
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Chip
                    label={item.isActive ? 'Hoạt động' : 'Tắt'}
                    color={item.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, item)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {methods.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {menuMethod && (
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              minWidth: 160,
              mt: 1,
              p: 1
            }
          }}
        >

          <MenuItem
            onClick={() => {
              handleMenuClose();
              window.location.href = `/admin/payment-methods-admin/detail/${menuMethod.id}`;
            }}
          >
            Xem chi tiết
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              window.location.href = `/admin/payment-methods-admin/edit/${menuMethod.id}`;
            }}
          >
            Sửa
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={async () => {
              handleMenuClose();
              await handleDeleteOne(menuMethod.id, menuMethod.name);
            }}
          >
            Xoá vĩnh viễn
          </MenuItem>
        </Menu>
      )}

      {/* Phân trang */}
      {totalItems > itemsPerPage && (
        <MUIPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
}
