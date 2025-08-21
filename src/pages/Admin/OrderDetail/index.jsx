import {
  Box, Typography, Paper, Button, Divider,
  Table, TableBody, TableRow, TableCell, TableHead,
  TextField, Grid, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { orderService } from '../../../services/admin/orderService';
// import OrderReturnRefund from './OrderReturnRefund'; // Đã loại bỏ import này
import { toast } from 'react-toastify'; // Import toast cho thông báo

const orderStatusLabels = {
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

const getPaymentStatusLabel = (status, methodCode) => {
  if (status === 'waiting' && methodCode === 'atm') {
    return 'Chờ xác nhận chuyển khoản';
  }

  const paymentStatusLabels = {
    unpaid: 'Chưa thanh toán',
    waiting: 'Chờ thanh toán',
    processing: 'Đang đối soát',
    paid: 'Đã thanh toán',
    refunded: 'Đã hoàn tiền'
  };

  return paymentStatusLabels[status] || 'Không rõ';
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingPaymentStatus, setIsUpdatingPaymentStatus] = useState(false); // State cho nút cập nhật

  // ✅ SỬA ĐỔI QUAN TRỌNG: Thay disabled bằng readOnly trong InputProps
  const readOnlyStyle = {
    InputProps: {
      readOnly: true, // Làm cho TextField chỉ đọc, không mờ đi
      sx: {
        color: 'text.primary', // Giữ màu chữ chính
        fontWeight: 500,
        backgroundColor: 'transparent', // Đảm bảo không có màu nền xám của disabled
      }
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getById(id);
      setOrder(data.data); // ✅ GIỮ NGUYÊN: setOrder(data.data) như bạn muốn

    } catch (err) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', err);
      toast.error('Không tải được chi tiết đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Hàm xử lý khi nhấn nút "Xác nhận Đã thanh toán"
  const handleUpdatePaymentStatus = async () => {
    if (!order) return;

    try {
      setIsUpdatingPaymentStatus(true);
      // Gọi API để cập nhật trạng thái thanh toán thành 'paid'
      await orderService.updatePaymentStatus(order.id, 'paid');
      toast.success('Đã cập nhật trạng thái thanh toán thành Đã thanh toán!');
      fetchOrder(); // Tải lại dữ liệu đơn hàng để hiển thị trạng thái mới nhất
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái thanh toán:', error);
      toast.error(error.response?.data?.message || 'Cập nhật trạng thái thanh toán thất bại.');
    } finally {
      setIsUpdatingPaymentStatus(false);
    }
  };

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

  // Lấy bằng chứng chuyển khoản từ trường 'proofUrl' của đối tượng order
  const bankTransferProofUrl = order.proofUrl;

  // Kiểm tra xem đây có phải đơn hàng thanh toán thủ công và đang chờ xác thực/đối soát không
  const isManualTransfer = ['atm', 'bank_transfer', 'manual_transfer'].includes(order.paymentMethod?.code?.toLowerCase());
  const shouldShowProofAndConfirmButton = isManualTransfer && (
    order.paymentStatus === 'waiting' || // Nếu đang chờ khách hàng chuyển tiền
    order.paymentStatus === 'unpaid' ||   // Nếu là unpaid (như COD) và sau đó chuyển thành thủ công
    order.paymentStatus === 'processing'  // KHI KHÁCH HÀNG ĐÃ BẤM "TÔI ĐÃ CHUYỂN KHOẢN"
  );

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
            <TextField
              label="Trạng thái đơn hàng"
              value={orderStatusLabels[order.status] || 'Không rõ'}
              fullWidth
              margin="dense"
              {...readOnlyStyle}
            />

            <TextField
              label="Trạng thái thanh toán"
              value={getPaymentStatusLabel(order.paymentStatus, order.paymentMethod?.code)}
              fullWidth
              margin="dense"
              {...readOnlyStyle}
            />

            <TextField label="Phương thức thanh toán" value={order.paymentMethod?.name || '—'} fullWidth margin="dense" {...readOnlyStyle} />
<TextField
  label="Phương thức vận chuyển"
  value={order.shippingProvider?.name || '—'}
  fullWidth
  margin="dense"
  {...readOnlyStyle}
/>


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

            {/* ✅ SỬA ĐỔI QUAN TRỌNG: Hiển thị bằng chứng chuyển khoản và nút xác nhận gọn gàng hơn */}
            {shouldShowProofAndConfirmButton && (
              <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 2, backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Thông tin thanh toán thủ công:
                </Typography>

                {bankTransferProofUrl ? (
                  <>
                    <Typography variant="body2" mb={1}>Bằng chứng chuyển khoản:</Typography>
                    <Box sx={{ width: '100%', maxWidth: '250px', maxHeight: '200px', overflow: 'hidden', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '16px' }}>
                        <img
                            src={bankTransferProofUrl}
                            alt="Bằng chứng chuyển khoản"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain', // Đảm bảo toàn bộ ảnh hiển thị trong khung
                            }}
                        />
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Người dùng chưa tải lên bằng chứng chuyển khoản.
                  </Typography>
                )}

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleUpdatePaymentStatus}
                  disabled={isUpdatingPaymentStatus}
                  sx={{ mt: 2 }}
                >
                  {isUpdatingPaymentStatus ? <CircularProgress size={20} color="inherit" /> : 'Xác nhận Đã thanh toán'}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight={500}>Sản phẩm đã mua</Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
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
                <TableCell>{Number(item.price || 0).toLocaleString()} ₫</TableCell>
<TableCell>{(item.quantity * (item.price || 0)).toLocaleString()} ₫</TableCell>

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
      {/* Đã loại bỏ component OrderReturnRefund ở đây */}
    </Box>
  );
};

export default OrderDetail;