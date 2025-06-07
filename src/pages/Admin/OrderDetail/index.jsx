import {
  Box, Typography, Paper, Button, Divider,
  Table, TableBody, TableRow, TableCell, TableHead,
  TextField, Grid, CircularProgress, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ordersService } from '@/services/admin/ordersService';

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Trả hàng/Hoàn tiền'
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [addressData, setAddressData] = useState(null);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await ordersService.getById(id);

        if (response && response.data && response.data.success) {
          setOrderData(response.data.data.order);
          setOrderItems(response.data.data.orderItems);
          setAddressData(response.data.data.address);
        } else {
          setError((response?.data?.message) || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Exception during fetch:', err);
        setError(err.message || 'An error occurred while fetching order data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    } else {
      setError('Invalid order ID');
      setLoading(false);
    }
  }, [id]);

  const readOnlyStyle = {
    disabled: true,
    InputProps: {
      sx: {
        color: 'text.primary',
        fontWeight: 500
      }
    }
  };

  if (loading) {
    return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return (
        <Box sx={{ p: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Quay lại</Button>
        </Box>
    );
  }

  if (!orderData) {
    return (
        <Box sx={{ p: 4 }}>
          <Typography variant="h6">Không tìm thấy đơn hàng</Typography>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Quay lại</Button>
        </Box>
    );
  }

  const totalAmount = orderData.finalPrice || orderData.totalPrice || 0;

  return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Quay lại
        </Button>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Đơn hàng #{orderData.id}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>Thông tin khách hàng</Typography>
              <TextField label="Tên khách hàng" value={addressData.fullName|| 'N/A'} fullWidth margin="dense" {...readOnlyStyle} />
              <TextField label="Số điện thoại" value={addressData.phone || 'N/A'} fullWidth margin="dense" {...readOnlyStyle} />
              <TextField label="Email" value={orderData.User?.email || 'N/A'} fullWidth margin="dense" {...readOnlyStyle} />
              <TextField label="Địa chỉ" value={addressData.fullAddress}  fullWidth margin="dense" {...readOnlyStyle} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>Thông tin đơn hàng</Typography>
              <TextField
                  label="Ngày đặt"
                  value={orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : 'N/A'}
                  fullWidth
                  margin="dense"
                  {...readOnlyStyle}
              />
              <TextField
                  label="Trạng thái"
                  value={statusLabels[orderData.status] || 'Không rõ'}
                  fullWidth
                  margin="dense"
                  {...readOnlyStyle}
              />
              {orderData.status === 'cancelled' && (
                  <TextField
                      label="Lý do hủy đơn"
                      value={orderData.cancelReason || ''}
                      fullWidth
                      multiline
                      rows={3}
                      margin="dense"
                      {...readOnlyStyle}
                      sx={{ mt: 1 }}
                  />
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom fontWeight={500}>Sản phẩm đã mua</Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Mã SKU</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.skuCode}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{parseFloat(item.price).toLocaleString()} ₫</TableCell>
                    <TableCell>{(parseFloat(item.price) * item.quantity).toLocaleString()} ₫</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="h6" fontWeight={600}>
              Tổng tiền: {parseFloat(totalAmount).toLocaleString()} ₫
            </Typography>
          </Box>
        </Paper>
      </Box>
  );
};

export default OrderDetail;