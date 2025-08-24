import {
  Box, Typography, Paper, Button, Divider,
  Table, TableBody, TableRow, TableCell, TableHead,
  TextField, Grid, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { orderService } from '../../../services/admin/orderService';
import Breadcrumb from '../../../components/common/Breadcrumb';

import { toast } from 'react-toastify'; 
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RobotoRegular } from "../../../fonts/roboto"; // đường dẫn đúng tới file roboto.js

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
  const [isUpdatingPaymentStatus, setIsUpdatingPaymentStatus] = useState(false); 

const handleExportInvoice = () => {
  if (!order) return;

  const doc = new jsPDF("p", "mm", "a4"); // A4 dọc
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== Nhúng font Unicode (Roboto) =====
  doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto", "normal");

  // ===== HEADER (Logo + Tiêu đề) =====
  doc.addImage(
    "https://res.cloudinary.com/dzrp2hsvh/image/upload/v1753528700/system/gw0ddnjrvscavwae0yl0.png", // URL logo của bạn
    "PNG",
    14, 10, 60, 20
  );

  doc.setFontSize(18);
  doc.text("HÓA ĐƠN BÁN HÀNG", pageWidth / 2, 25, { align: "center" });

  // ===== THÔNG TIN KHÁCH HÀNG =====
  doc.setFontSize(12);
  doc.text("Thông tin khách hàng", 14, 50);

  doc.setFontSize(10);
  doc.text(`Khách hàng: ${fullName}`, 14, 58);
  doc.text(`SĐT: ${phone}`, 14, 64);
  doc.text(`Email: ${email}`, 14, 70);
  doc.text(
    `Địa chỉ: ${shipping?.streetAddress || ""}, ${shipping?.ward?.name || ""}, ${shipping?.district?.name || ""}, ${shipping?.province?.name || ""}`,
    14,
    76
  );

  // ===== THÔNG TIN ĐƠN HÀNG =====
  doc.setFontSize(12);
  doc.text("Thông tin đơn hàng", 14, 90);

  doc.setFontSize(10);
  doc.text(`Mã đơn: ${order.orderCode || order.id}`, 14, 98);
  doc.text(`Ngày đặt: ${new Date(order.createdAt).toLocaleString("vi-VN")}`, 14, 104);
  doc.text(`Trạng thái: ${orderStatusLabels[order.status] || "Không rõ"}`, 14, 110);

  // ===== BẢNG SẢN PHẨM =====
  const rows = products.map((item, idx) => [
    idx + 1,
    item.Sku?.product?.name,
    item.quantity,
    `${Number(item.price || 0).toLocaleString()} ₫`,
    `${(item.quantity * (item.price || 0)).toLocaleString()} ₫`,
  ]);

autoTable(doc, {
  head: [["#", "Sản phẩm", "SL", "Đơn giá", "Thành tiền"]],
  body: rows,
  startY: 115,
  styles: { font: "Roboto", fontStyle: "normal", fontSize: 10, halign: "center" },
  headStyles: { 
    font: "Roboto",
    fontStyle: "bold",
    fillColor: [41, 128, 185],
    textColor: 255,
    halign: "center"
  },
  columnStyles: {
    0: { halign: "center", cellWidth: 15 },
    1: { halign: "left", cellWidth: 70 },
    2: { halign: "center", cellWidth: 20 },
    3: { halign: "right", cellWidth: 40 },
    4: { halign: "right", cellWidth: 40 },
  },
  didParseCell: (data) => {
    data.cell.styles.font = "Roboto";   // ép toàn bộ cell dùng Roboto
    data.cell.styles.fontStyle = "normal";
  }
});


  // ===== TỔNG KẾT =====
  const finalY = doc.lastAutoTable.finalY + 10;
  const vat = Math.round(order.finalPrice * 0.1);
  const total = Math.round(order.finalPrice + vat);

  const marginRight = pageWidth - 20;

  doc.setFontSize(11);
  doc.text(`Tạm tính: ${Number(order.totalPrice).toLocaleString()} ₫`, marginRight, finalY, { align: "right" });
  doc.text(`Phí vận chuyển: ${Number(order.shippingFee).toLocaleString()} ₫`, marginRight, finalY + 6, { align: "right" });
  doc.text(`Giảm giá: -${Number(order.couponDiscount || 0).toLocaleString()} ₫`, marginRight, finalY + 12, { align: "right" });
  doc.text(`VAT (10%): ${vat.toLocaleString()} ₫`, marginRight, finalY + 18, { align: "right" });

  // ===== TỔNG CỘNG =====
  const totalText = `TỔNG CỘNG: ${total.toLocaleString()} ₫`;
  doc.setFontSize(14);
  doc.text(totalText, marginRight, finalY + 30, { align: "right" });

  // ===== FOOTER =====
  doc.setFontSize(10);
  doc.text("Cảm ơn quý khách đã mua hàng tại Cyberzone!", pageWidth / 2, finalY + 50, {
    align: "center",
  });

  // Xuất file
  doc.save(`invoice_${order.orderCode || order.id}.pdf`);
};

  
  const readOnlyStyle = {
    InputProps: {
      readOnly: true, 
      sx: {
        color: 'text.primary',
        fontWeight: 500,
        backgroundColor: 'transparent', 
      }
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getById(id);
      setOrder(data.data); 

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


  const handleUpdatePaymentStatus = async () => {
    if (!order) return;

    try {
      setIsUpdatingPaymentStatus(true);
     
      await orderService.updatePaymentStatus(order.id, 'paid');
      toast.success('Đã cập nhật trạng thái thanh toán thành Đã thanh toán!');
      fetchOrder(); 
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

  
  const bankTransferProofUrl = order.proofUrl;

 
  const isManualTransfer = ['atm', 'bank_transfer', 'manual_transfer'].includes(order.paymentMethod?.code?.toLowerCase());
  const shouldShowProofAndConfirmButton = isManualTransfer && (
    order.paymentStatus === 'waiting' || 
    order.paymentStatus === 'unpaid' ||   
    order.paymentStatus === 'processing'  
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
  <Breadcrumb
    items={[
      { label: 'Trang chủ', href: '/admin' },
      { label: 'Đơn hàng', href: '/admin/orders' },
    { label: `Chi tiết đơn ${order?.orderCode || id}` }

    ]}
  />

      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, mt:2 }}>
        Quay lại
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
  <Typography variant="h5" fontWeight={600}>
    Đơn hàng {order.orderCode}
  </Typography>
  <Button variant="contained" color="primary" onClick={handleExportInvoice}>
    Xuất hóa đơn PDF
  </Button>
  
</Box>


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

<TextField
  label="Mã vận đơn (GHN)"
  value={order.trackingCode || '—'}
  fullWidth
  margin="dense"
  {...readOnlyStyle}
/>

<TextField
  label="Dự kiến giao"
  value={order.shippingLeadTime ? new Date(order.shippingLeadTime).toLocaleString('vi-VN') : '—'}
  fullWidth
  margin="dense"
  {...readOnlyStyle}
/>
{order.labelUrl && (
  <>
   

   <Button
  variant="contained"
  color="secondary"
  component="a"
  href={order.labelUrl}
  download={`label_${order.trackingCode || order.id}.pdf`}
  sx={{ mt: 1 }}
>
  Tải phiếu giao hàng
</Button>

  </>
)}



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
                                objectFit: 'contain',
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
              <TableCell align="center">Số lượng</TableCell>
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
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell>{Number(item.price || 0).toLocaleString()} ₫</TableCell>
<TableCell>{(item.quantity * (item.price || 0)).toLocaleString()} ₫</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />
<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
  <Typography variant="body1" fontWeight={500}>
    Phí vận chuyển: {Number(order.shippingFee || 0).toLocaleString()} ₫
  </Typography>
</Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6" fontWeight={600}>
  Tổng tiền: {Number(order.finalPrice || (order.totalPrice + (order.shippingFee || 0))).toLocaleString()} ₫
</Typography>

        </Box>
      </Paper>
      
    </Box>
  );
};

export default OrderDetail;