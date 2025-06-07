// src/components/admin/OrderList.jsx
import { useEffect, useState, useCallback } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip, Box,
  Menu, MenuItem, IconButton, CircularProgress, Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';
import CancelOrderDialog from './CancelOrderDialog';
import UpdateOrderStatusDialog from './UpdateOrderStatusDialog';

import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../../services/admin/orderService';

const MoreActionsMenu = ({ actions }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {actions.map((action, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              handleClose();
              action.onClick();
            }}
            sx={{ color: action.color === 'error' ? 'red' : 'inherit' }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const statusTabs = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'refunded', label: 'Trả hàng/Hoàn tiền' }
];

const OrderList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState([]);           // danh sách đơn hàng
  const [totalItems, setTotalItems] = useState(0);    // tổng số đơn hàng (cho pagination)
  const [totalPages, setTotalPages] = useState(0);    // tổng số trang (nếu server trả)
  const [loading, setLoading] = useState(false);      // loading spinner

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 5;

  // Hàm load data từ API
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await fetchOrders({
        page,
        limit: itemsPerPage,
        search,
        status
      });

      // Giả sử server trả về: { totalItems, totalPages, currentPage, data: [ ... orders ] }
      setOrders(responseData.data || []);
      setTotalItems(responseData.totalItems || 0);
      setTotalPages(responseData.totalPages || 1);
    } catch (err) {
      console.error('Lỗi fetch orders:', err);
      Toastify.error('Không tải được danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  // Gọi loadOrders mỗi khi page / search / status thay đổi
  useEffect(() => {
    setPage(1);          // reset về trang 1 khi search hoặc status đổi
  }, [search, status]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const openUpdateStatusDialog = (order) => {
    setSelectedOrder(order);
    setUpdateStatusDialogOpen(true);
  };

  const getStatusChip = (orderStatus) => {
    const map = {
      pending: ['Chờ xác nhận', 'warning'],
      confirmed: ['Đã xác nhận', 'info'],
      shipping: ['Đang giao', 'primary'],
      delivered: ['Đã giao', 'success'],
      cancelled: ['Đã hủy', 'error'],
      refunded: ['Trả hàng/Hoàn tiền', 'default']
    };
    const [label, color] = map[orderStatus] || [orderStatus, 'default'];
    return <Chip label={label} color={color} size="small" />;
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* TAB lọc theo status */}
      <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee', mb: 2 }}>
        {statusTabs.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            sx={{
              pb: 1, px: 1, cursor: 'pointer',
              borderBottom: status === tab.value ? '2px solid red' : '2px solid transparent',
              color: status === tab.value ? 'red' : 'black',
              fontWeight: status === tab.value ? 600 : 400,
              fontSize: 15
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* Search input */}
      <Box sx={{ mb: 2, width: '300px' }}>
        <SearchInput
          placeholder="Tìm mã đơn hoặc khách hàng..."
          value={search}
          onChange={setSearch}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              orders.length > 0
                ? orders.map((order, idx) => (
                    <TableRow key={order.id}>
                      <TableCell>{(page - 1) * itemsPerPage + idx + 1}</TableCell>
                      <TableCell>{order.code}</TableCell>
                      <TableCell>{order.customerName || order.customer}</TableCell>
                      <TableCell>
                        {Number(order.total).toLocaleString('vi-VN')} ₫
                      </TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell align="right">
                        <MoreActionsMenu
                          actions={[
                            {
                              label: 'Xem chi tiết',
                              onClick: () => navigate(`/admin/orders/${order.id}`)
                            },
                            {
                              label: 'Cập nhật trạng thái',
                              onClick: () => openUpdateStatusDialog(order)
                            },
                            {
                              label: 'Hủy đơn',
                              onClick: () => openCancelDialog(order),
                              color: 'error'
                            }
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary">
                        Không có đơn hàng phù hợp
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          // Nếu component Pagination của bạn hỗ trợ thay đổi số items trên trang, dùng onPageSizeChange
          onPageSizeChange={(size) => {
            // giả sử bạn muốn cho user thay đổi itemsPerPage
            // setItemsPerPage(size);
            setPage(1);
          }}
        />
      </Box>

      {/* Dialogs */}
      <CancelOrderDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        order={selectedOrder}
        onConfirm={(reason) => {
          Toastify.success(`Đã hủy đơn ${selectedOrder?.code} với lý do: ${reason}`);
          setCancelDialogOpen(false);
          loadOrders(); // refresh sau khi hủy
        }}
      />

      <UpdateOrderStatusDialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
        order={selectedOrder}
        onConfirm={(newStatus) => {
          Toastify.success(`Đã cập nhật trạng thái đơn ${selectedOrder?.code} thành "${newStatus}"`);
          setUpdateStatusDialogOpen(false);
          loadOrders(); // refresh sau khi cập nhật
        }}
      />

      <Toastify />
    </Box>
  );
};

export default OrderList;
