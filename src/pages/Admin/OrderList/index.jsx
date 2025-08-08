// src/components/admin/OrderList.jsx
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Box,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Typography,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';
import CancelOrderDialog from './CancelOrderDialog';
import UpdateOrderStatusDialog from './UpdateOrderStatusDialog';
import HighlightText from '../../../components/Admin/HighlightText';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../components/common/Breadcrumb';

import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../services/admin/orderService';

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

const OrderList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const [statusStats, setStatusStats] = useState([]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await orderService.getAll({
        page,
        limit: itemsPerPage,
        search,
        status,
        paymentStatus,
        startDate,
        endDate
      });

      setOrders(data.data || []);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 1);
      setStatusStats(data.statusStats || []);
    } catch (err) {
      console.error('Lỗi fetch orders:', err);
      toast.error('Không tải được danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, paymentStatus, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [search, status, paymentStatus, startDate, endDate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const statusTabs = useMemo(() => {
    const colorMap = {
      processing: '#2196f3',
      shipping: '#3f51b5',
      delivered: '#4caf50',
      completed: '#009688',
      cancelled: '#f44336',
      '': 'gray'
    };

    return statusStats.length > 0
      ? statusStats.map((s) => ({
        value: s.status,
        label: `${s.label} (${s.count})`,
        color: colorMap[s.status] || 'gray'
      }))
      : [
        {
          value: '',
          label: 'Tất cả',
          color: 'gray'
        }
      ];
  }, [statusStats]);

  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const openUpdateStatusDialog = (order) => {
    setSelectedOrder(order);
    setUpdateStatusDialogOpen(true);
  };
  const handleUpdateStatus = async (newStatus, reason = '') => {
    try {
      console.log('➡️ Gọi cập nhật trạng thái với:', selectedOrder.id, newStatus);

      await orderService.updateStatus(selectedOrder.id, {
        status: newStatus,
        cancelReason: newStatus === 'cancelled' ? reason : undefined
      });

      const statusMap = {
        processing: 'Đang xử lý',
        shipping: 'Vận chuyển',
        delivered: 'Đã giao',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
      };

      toast.success(`Đã cập nhật trạng thái đơn ${selectedOrder?.code} thành "${statusMap[newStatus] || newStatus}"`);

      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));

      setStatus(newStatus);
      setPage(1);
      setUpdateStatusDialogOpen(false);
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      const message = err?.response?.data?.message || 'Cập nhật trạng thái thất bại';
      toast.error(message);
    }
  };

  const getStatusChip = (orderStatus) => {
    const map = {
      processing: ['Đang xử lý', 'info'],
      shipping: ['Vận chuyển', 'primary'],
      delivered: ['Đã giao', 'success'],
      completed: ['Hoàn thành', 'success'],
      cancelled: ['Đã hủy', 'error'],
      refunded: ['Trả hàng/Hoàn tiền', 'default']
    };
    const [label, color] = map[orderStatus] || [orderStatus, 'default'];
    return <Chip label={label} color={color} size="small" />;
  };
  const getPaymentChip = (paymentStatus, paymentMethodCode) => {
    if (paymentStatus === 'waiting') {
      if (paymentMethodCode === 'atm') {
        return <Chip label="Chờ xác nhận chuyển khoản" color="info" size="small" />;
      }
      return <Chip label="Chờ thanh toán" color="warning" size="small" />;
    }

    const map = {
      unpaid: ['Chưa thanh toán', 'default'],
      paid: ['Đã thanh toán', 'success'],
      refunded: ['Đã hoàn tiền', 'default']
    };

    const [label, color] = map[paymentStatus] || [paymentStatus, 'default'];
    return <Chip label={label} color={color} size="small" />;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Đơn hàng' }
        ]}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          mt: 2,
          mb: 2,
          border: '1px solid #eee',
          borderRadius: 2,
          backgroundColor: '#fafafa'
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => {
            const isActive = status === tab.value;
            return (
              <Box
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                sx={{
                  cursor: 'pointer',
                  px: 2,
                  py: 1,
                  borderRadius: '28px',
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: 'center',
                  minWidth: 100, // hoặc minWidth: 100
                  backgroundColor: isActive ? tab.color : '#f5f5f5',
                  color: isActive ? '#fff' : '#333',
                  border: `1px solid ${tab.color}`,
                  transition: '0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: tab.color,
                    color: '#fff'
                  }
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5
          }}
        >
          {/* Search chiếm toàn bộ còn lại */}
          <Box sx={{ flex: 1, minWidth: '240px', height: '40px' }}>
            <SearchInput
              placeholder="Tìm mã đơn hoặc khách hàng..."
              value={search}
              onChange={setSearch}
              sx={{
                '& .MuiInputBase-root': {
                  height: '40px'
                },
                '& input': {
                  padding: '8px 14px', // tùy chỉnh nếu cần
                  fontSize: '16px'
                }
              }}
            />
          </Box>

          <Box sx={{ width: '150px' }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
          </Box>

          <Box sx={{ width: '150px' }}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
          </Box>

          <Box sx={{ width: '180px' }}>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              style={{
                width: '100%',
                height: '40px', // hoặc match với padding input
                padding: '8px',
                fontSize: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box', // đảm bảo không bị tràn padding
                appearance: 'none', // loại bỏ style mặc định trình duyệt
                WebkitAppearance: 'none', // Safari
                MozAppearance: 'none' // Firefox
              }}
            >
              <option value="">Tất cả thanh toán</option>
              <option value="waiting">Chờ thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Mã đơn</TableCell>
              <TableCell align="center">Khách hàng</TableCell>
              <TableCell align="center">SĐT</TableCell>

              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>

              <TableCell>Thanh toán</TableCell>
              <TableCell align="center">Ngày đặt</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  {' '}
                  {/* Cập nhật colSpan */}
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order, idx) => (
                <TableRow key={order.id}>
                  <TableCell align="center">{(page - 1) * itemsPerPage + idx + 1}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5
                      }}
                    >
                      <HighlightText text={order.code} highlight={search} />

                      {order.hasPendingReturn && (
                        <Tooltip title="Đơn hàng có yêu cầu trả hàng đang chờ xử lý">
                          <WarningAmberIcon color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <HighlightText text={order.customerName || order.customer} highlight={search} />
                  </TableCell>
                  <TableCell align="center">
                    <HighlightText text={order.phone || '—'} highlight={search} />
                  </TableCell>

                  <TableCell>{Number(order.total).toLocaleString('vi-VN')} ₫</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{getStatusChip(order.status)}</Box>
                  </TableCell>

                  <TableCell>{getPaymentChip(order.paymentStatus, order.paymentMethodCode)}</TableCell>

                  <TableCell align="center">{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>

                  <TableCell align="center">
                    <MoreActionsMenu
                      actions={[
                        {
                          label: 'Xem chi tiết',
                          onClick: () => navigate(`/admin/orders/${order.id}`)
                        },
                        ...(order.status !== 'cancelled' && order.status !== 'completed'
                          ? [
                            {
                              label: 'Cập nhật trạng thái',
                              onClick: () => openUpdateStatusDialog(order)
                            }
                          ]
                          : [])
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {' '}
                  {/* Cập nhật colSpan */}
                  <Typography variant="body2" color="textSecondary">
                    Không có đơn hàng phù hợp
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalItems > itemsPerPage && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(size) => {
              setPage(1);
            }}
          />
        </Box>
      )}


      <CancelOrderDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        order={selectedOrder}
        onConfirm={async (reason) => {
          try {
            await orderService.cancel(selectedOrder.id, reason);
            toast.success(`Đã hủy đơn ${selectedOrder?.code} với lý do: ${reason}`);
            setCancelDialogOpen(false);
            loadOrders();
          } catch (err) {
            console.error('Lỗi huỷ đơn:', err);
            const message = err?.response?.data?.message || 'Huỷ đơn thất bại';
            toast.error(message);
          }
        }}
      />

      <UpdateOrderStatusDialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
        order={selectedOrder}
        onConfirm={(status, reason) => handleUpdateStatus(status, reason)} // ✅ Truyền đúng cancelReason
      />
    </Box>
  );
};

export default OrderList;
