// src/pages/Admin/OrderList/index.jsx
import { ordersService } from 'services/admin/ordersService';
import { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip, Box,
  Menu, MenuItem, IconButton, CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';
import { toast } from 'react-toastify';
import CancelOrderDialog from './CancelOrderDialog';
import UpdateOrderStatusDialog from './UpdateOrderStatusDialog';
import { API_ENDPOINT } from 'config/apiEndpoints';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  { value: 'completed', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'refunded', label: 'Trả hàng/Hoàn tiền' }
];

const OrderList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ordersService.list({
          page,
          limit,
          status,
          search
        });

        if (response.data.success) {
          setOrders(response.data.data.orders);
          setTotalOrders(response.data.data.pagination.total);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error loading orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, status, search]);

// Add a new function to refresh orders without changing page:
  const refreshOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersService.list({
        page,
        limit,
        status,
        search
      });

      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalOrders(response.data.data.pagination.total);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error loading orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Lấy đơn hàng hiện tại để kiểm tra trạng thái
      const currentOrder = orders.find(order => order.id === orderId);

      // Ngăn chặn việc cập nhật trạng thái nếu đơn hàng đã hoàn thành hoặc đã hủy
      if (currentOrder) {
        //không được quay ngược từ 'Đã giao' về 'Đang xử lý'
        if (newStatus === 'pending' && currentOrder.status === 'completed') {
          toast.error('Không thể quay lại trạng thái "Chờ xác nhận" từ "Đã giao"');
          setUpdateStatusDialogOpen(false);
          return;
        }

        // Không cho phép hủy đơn hàng đang giao hoặc đã giao
        if (newStatus === 'cancelled' && ['shipping', 'completed'].includes(currentOrder.status)) {
          toast.error('Không thể hủy đơn hàng đang giao hoặc đã giao');
          setUpdateStatusDialogOpen(false);
          return;
        }
      }

      const response = await axios.put(`${API_ENDPOINT.admin.orders.base}${API_ENDPOINT.admin.orders.updateStatus(orderId)}`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success('Trạng thái đơn hàng đã được cập nhật');
        // Refresh order list instead of changing page
        await refreshOrders();
      } else {
        toast.error(response.data.message || 'Không thể cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái');
    } finally {
      setUpdateStatusDialogOpen(false);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      // Validate reason
      if (!reason || reason.trim() === '') {
        toast.error('Vui lòng nhập lý do hủy đơn');
        return;
      }

      // Get the current order to check status
      const currentOrder = orders.find(order => order.id === orderId);
      if (currentOrder && ['completed', 'cancelled'].includes(currentOrder.status)) {
        toast.error('Không thể hủy đơn hàng đã giao hoặc đã hủy');
        setCancelDialogOpen(false);
        return;
      }

      const response = await axios.post(`${API_ENDPOINT.admin.orders.base}/${orderId}/cancel`, {
        cancelReason: reason
      });

      if (response.data.success) {
        toast.success('Đơn hàng đã được hủy thành công');
        // Refresh order list instead of changing page
        await refreshOrders();
      } else {
        toast.error(response.data.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Đã xảy ra lỗi khi hủy đơn hàng');
    } finally {
      setCancelDialogOpen(false);
    }
  };
  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const openUpdateStatusDialog = (order) => {
    setSelectedOrder(order);
    setUpdateStatusDialogOpen(true);
  };

  const getStatusChip = (status) => {
    const map = {
      pending: ['Chờ xác nhận', 'warning'],
      confirmed: ['Đã xác nhận', 'info'],
      shipping: ['Đang giao', 'primary'],
      completed: ['Đã giao', 'success'],
      cancelled: ['Đã hủy', 'error']
    };
    const [label, color] = map[status] || [status, 'default'];
    return <Chip label={label} color={color} size="small" />;
  };

 const formatCurrency = (amount) => {
      if (!amount && amount !== 0) return '0 đ';
      return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount) + ' đ';
    };

  return (
    <Box sx={{ p: 2 }}>
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

      <Box sx={{ mb: 2 }}>
        <SearchInput
          placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
          value={search}
          onChange={setSearch}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
          {error}
        </Box>
      ) : (
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
              {orders.length > 0 ? orders.map((order, idx) => (
                <TableRow key={order.id}>
                  <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                  <TableCell>{"DH" + order.id.toString().padStart(5, '0')}</TableCell>
                  <TableCell>{order.User?.fullName || 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(order.finalPrice)}</TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell align="right">
                    <MoreActionsMenu
                        actions={[
                          { label: 'Xem chi tiết', onClick: () => navigate(`/admin/orders/${order.id}`) },
                          { label: 'Cập nhật trạng thái', onClick: () => openUpdateStatusDialog(order) },
                          ...(order.status !== 'complete' && order.status !== 'cancelled'
                              ? [{ label: 'Hủy đơn', onClick: () => openCancelDialog(order), color: 'error' }]
                              : [])
                        ]}
                    />

                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có đơn hàng phù hợp
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Pagination
        currentPage={page}
        totalItems={totalOrders}
        itemsPerPage={limit}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
      />

      <CancelOrderDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        order={selectedOrder}
        onConfirm={(reason) => handleCancelOrder(selectedOrder.id, reason)}
      />

      <UpdateOrderStatusDialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
        order={selectedOrder}
        onConfirm={(newStatus) => handleUpdateStatus(selectedOrder.id, newStatus)}
      />


    </Box>
  );
};

export default OrderList;