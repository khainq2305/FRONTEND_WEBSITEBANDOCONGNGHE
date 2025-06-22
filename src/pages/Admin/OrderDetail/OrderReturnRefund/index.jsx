// src/components/admin/OrderReturnRefund.jsx
import React, { useEffect, useState } from 'react';
import {
  Button,
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { orderService } from '../../../../services/admin/orderService';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error'
};

const StatusChip = ({ status }) => {
  const color = statusColors[status] || 'default';
  const labelMap = {
    pending: 'Đang chờ xử lý',
    approved: 'Đã chấp thuận',
    rejected: 'Từ chối'
  };
  return <Chip label={labelMap[status] || status} color={color} size="small" />;
};

const OrderReturnRefund = () => {
  const { id: orderId } = useParams();
  const [returns, setReturns] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
const handleUpdateReturn = async (id, newStatus) => {
  const label = newStatus === 'approved' ? 'Duyệt' : 'Từ chối';
  const responseNote = prompt(`Nhập phản hồi khi ${label} yêu cầu trả hàng:`);

  if (responseNote === null) return; // User cancel

  try {
    await orderService.updateReturnStatus(id, { status: newStatus, responseNote });

    // Gọi lại API để refresh danh sách trả hàng
    const res = await orderService.getReturnByOrder(orderId);
    setReturns(res.data.data);
  } catch (error) {
    console.error('❌ Lỗi cập nhật yêu cầu trả hàng:', error);
    alert('Không thể cập nhật yêu cầu trả hàng');
  }
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          orderService.getReturnByOrder(orderId),
          orderService.getRefundByOrder(orderId)
        ]);
        setReturns(res1.data.data);
        setRefunds(res2.data.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trả hàng/hoàn tiền:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Trả hàng */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Yêu cầu trả hàng</Typography>
        {returns.length > 0 ? (
          <Table size="small">
<TableHead>
  <TableRow>
    <TableCell>STT</TableCell>
    <TableCell>Lý do</TableCell>
    <TableCell>Mô tả chi tiết</TableCell> {/* ✅ mới */}
    <TableCell>Ảnh</TableCell> {/* ✅ mới */}
    <TableCell>Video</TableCell> {/* ✅ mới */}
    <TableCell>Trạng thái</TableCell>
    <TableCell>Phản hồi</TableCell>
    <TableCell>Ngày gửi</TableCell>
    <TableCell>Hành động</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {returns.map((item, index) => (
    <TableRow key={item.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{item.reason}</TableCell>
      <TableCell>{item.detailedReason || '—'}</TableCell>

      {/* Hiển thị ảnh chứng cứ */}
      <TableCell>
        {item.evidenceImages ? item.evidenceImages.split(',').map((url, idx) => (
          <img key={idx} src={url.trim()} alt={`evidence-${idx}`} style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 4 }} />
        )) : '—'}
      </TableCell>

      {/* Hiển thị video chứng cứ */}
      <TableCell>
        {item.evidenceVideos ? item.evidenceVideos.split(',').map((url, idx) => (
          <video key={idx} src={url.trim()} controls style={{ width: 60, height: 40, marginRight: 4 }} />
        )) : '—'}
      </TableCell>

      <TableCell><StatusChip status={item.status} /></TableCell>
      <TableCell>{item.responseNote || '—'}</TableCell>
      <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
      <TableCell>
        {item.status === 'pending' && (
          <>
            <Button
              color="success"
              size="small"
              onClick={() => handleUpdateReturn(item.id, 'approved')}
              sx={{ mr: 1 }}
            >
              Duyệt
            </Button>
            <Button
              color="error"
              size="small"
              onClick={() => handleUpdateReturn(item.id, 'rejected')}
            >
              Từ chối
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>


          </Table>
        ) : <Typography>Không có yêu cầu trả hàng.</Typography>}
      </Paper>

      {/* Hoàn tiền */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Yêu cầu hoàn tiền</Typography>
        {refunds.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Lý do</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Phản hồi</TableCell>
                <TableCell>Ngày gửi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refunds.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell><StatusChip status={item.status} /></TableCell>
                  <TableCell>{item.responseNote || '—'}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : <Typography>Không có yêu cầu hoàn tiền.</Typography>}
      </Paper>
    </Box>
  );
};

export default OrderReturnRefund;
