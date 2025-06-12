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
import HighlightText from '../../../components/Admin/HighlightText';

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

const statusTabs = [
  { value: '', label: 'Tất cả', color: 'gray' },
  { value: 'pending', label: 'Chờ xác nhận', color: '#ff9800' },     // cam
  { value: 'confirmed', label: 'Đã xác nhận', color: '#2196f3' },   // xanh dương
  { value: 'shipping', label: 'Đang giao', color: '#3f51b5' },      // tím
  { value: 'delivered', label: 'Đã giao', color: '#4caf50' },       // xanh lá
  { value: 'cancelled', label: 'Đã hủy', color: '#f44336' },        // đỏ
  { value: 'refunded', label: 'Trả hàng/Hoàn tiền', color: '#9e9e9e' } // xám
];


const OrderList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const loadOrders = useCallback(async () => {
  setLoading(true);
  try {
  const { data } = await orderService.getAll({
  page,
  limit: itemsPerPage,
  search,
  status
});

setOrders(data.data || []);
setTotalItems(data.totalItems || 0);
setTotalPages(data.totalPages || 1);

  } catch (err) {
    console.error('Lỗi fetch orders:', err);
    Toastify.error('Không tải được danh sách đơn hàng');
  } finally {
    setLoading(false);
  }
}, [page, search, status]);


  useEffect(() => {
    setPage(1);
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
    <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 2,
    mb: 2,
    border: '1px solid #eee',
    borderRadius: 2,
    backgroundColor: '#fafafa'
  }}
>
  {/* Tabs lọc trạng thái */}
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
    {statusTabs.map((tab) => (
      <Box
        key={tab.value}
        onClick={() => setStatus(tab.value)}
        sx={{
          cursor: 'pointer',
          px: 2,
          py: 1,
          borderRadius: '20px',
          fontSize: 14,
          fontWeight: 500,
          backgroundColor: status === tab.value ? tab.color : '#f5f5f5',
          color: status === tab.value ? '#fff' : '#333',
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
    ))}
  </Box>

  {/* Ô tìm kiếm */}
  <Box sx={{ width: '300px' }}>
    <SearchInput
      placeholder="Tìm mã đơn hoặc khách hàng..."
      value={search}
      onChange={setSearch}
    />
  </Box>
</Box>


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
                    <TableCell><HighlightText text={order.code} highlight={search} /></TableCell>

                      <TableCell><HighlightText text={order.customerName || order.customer} highlight={search} /></TableCell>

                      <TableCell>
                        {Number(order.total).toLocaleString('vi-VN')} ₫
                      </TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell>
  {new Date(order.createdAt).toLocaleString('vi-VN')}
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

      <CancelOrderDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        order={selectedOrder}
        onConfirm={(reason) => {
          Toastify.success(`Đã hủy đơn ${selectedOrder?.code} với lý do: ${reason}`);
          setCancelDialogOpen(false);
          loadOrders();
        }}
      />

      <UpdateOrderStatusDialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
        order={selectedOrder}
        onConfirm={(newStatus) => {
          Toastify.success(`Đã cập nhật trạng thái đơn ${selectedOrder?.code} thành "${newStatus}"`);
          setUpdateStatusDialogOpen(false);
          loadOrders();
        }}
      />
    </Box>
  );
};

export default OrderList;
