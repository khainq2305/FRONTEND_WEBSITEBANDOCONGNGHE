import {
  Box, Typography, Paper, Button, Divider,
  Table, TableBody, TableRow, TableCell, TableHead,
  TextField, Grid, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { orderService } from '../../../services/admin/orderService'; // ✅ Đúng đường dẫn

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Trả hàng/Hoàn tiền'
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const readOnlyStyle = {
    disabled: true,
    InputProps: {
      sx: {
        color: 'text.primary',
        fontWeight: 500
      }
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getById(id);
        setOrder(data.data);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Đang tải chi tiết đơn hàng...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Không tìm thấy đơn hàng</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Quay lại</Button>
      </Box>
    );
  }

  const fullName = order.User?.fullName || '—';
const phone = order.shippingAddress?.phone || order.User?.phone || '—';

  const email = order.User?.email || '—';
  const shipping = order.shippingAddress;
  const products = order.items || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Quay lại
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Đơn hàng {order.orderCode}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Thông tin khách hàng</Typography>
            <TextField label="Tên khách hàng" value={fullName} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField label="Số điện thoại" value={phone} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField label="Email" value={email} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField
              label="Địa chỉ"
              value={
                `${shipping?.streetAddress || ''}, ${shipping?.ward?.name || ''}, ${shipping?.district?.name || ''}, ${shipping?.province?.name || ''}`
              }
              fullWidth margin="dense" {...readOnlyStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Thông tin đơn hàng</Typography>
            <TextField label="Ngày đặt" value={new Date(order.createdAt).toLocaleString('vi-VN')} fullWidth margin="dense" {...readOnlyStyle} />
            <TextField label="Trạng thái" value={statusLabels[order.status] || 'Không rõ'} fullWidth margin="dense" {...readOnlyStyle} />
            {order.status === 'cancelled' && (
              <TextField
                label="Lý do hủy đơn"
                value={order.cancelReason || '—'}
                fullWidth multiline rows={3}
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
    <TableCell>Ảnh</TableCell> {/* ✅ thêm dòng này */}
    <TableCell>Tên sản phẩm</TableCell>
    <TableCell>Số lượng</TableCell>
    <TableCell>Đơn giá</TableCell>
    <TableCell>Thành tiền</TableCell>
  </TableRow>
</TableHead>

         <TableBody>
  {products.map((item, index) => (
    <TableRow key={index}>
      <TableCell>
        <img
          src={item.Sku?.product?.thumbnail}
          alt="product"
          style={{ width: 60, height: 60, objectFit: 'contain' }}
        />
      </TableCell>
      <TableCell>{item.Sku?.product?.name || '—'}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{Number(item.Sku?.finalPrice || item.Sku?.price || 0).toLocaleString()} ₫</TableCell>
      <TableCell>{(item.quantity * (item.Sku?.finalPrice || item.Sku?.price || 0)).toLocaleString()} ₫</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6" fontWeight={600}>
            Tổng tiền: {Number(order.totalPrice || 0).toLocaleString()} ₫
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderDetail;
