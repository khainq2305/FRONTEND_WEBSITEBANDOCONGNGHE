// src/components/admin/OrderReturnRefund.jsx
import React, { useEffect, useState } from 'react';
import {
  Button, Box, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, CircularProgress, Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { orderService } from '../../../../services/admin/orderService';

/* ────────── MÀU & NHÃN ────────── */
const statusColors = {
  pending        : 'warning',
  approved       : 'info',
  rejected       : 'error',
  awaiting_pickup: 'warning',
  pickup_booked  : 'info',
  received       : 'success',
  refunded       : 'default'
};
const labelMap = {
  pending        : 'Chờ duyệt',
  approved       : 'Đã duyệt',
  rejected       : 'Từ chối',
  awaiting_pickup: 'Chờ gửi hàng',
  pickup_booked  : 'GHN đã lấy',
  received       : 'Đã nhận hàng',
  refunded       : 'Đã hoàn tiền'
};
const StatusChip = ({ status }) => (
  <Chip label={labelMap[status] || status} color={statusColors[status] || 'default'} size="small" />
);
/* ──────────────────────────────── */

const OrderReturnRefund = () => {
  const { id: orderId } = useParams();
  const [returns, setReturns]   = useState([]);
  const [refunds, setRefunds]   = useState([]);
  const [loading, setLoading]   = useState(true);

  /* ------------ API helpers ------------ */
  const refreshLists = async () => {
    const [r1, r2] = await Promise.all([
      orderService.getReturnByOrder(orderId),
      orderService.getRefundByOrder(orderId)
    ]);
    setReturns(r1.data.data);
    setRefunds(r2.data.data);
  };

  const handleUpdateReturn = async (id, status) => {
    const action = {approved:'Duyệt',rejected:'Từ chối',received:'Đã nhận hàng'}[status]||status;
    const note   = prompt(`Nhập phản hồi khi ${action}:`) ?? undefined;
    if (note === undefined) return;

    await orderService.updateReturnStatus(id,{status,responseNote:note});
    await refreshLists();
  };

  const handleUpdateRefund = async (id) => {
    const note = prompt('Ghi chú (mã giao dịch, số tiền, ...):') ?? undefined;
    if (note === undefined) return;
    await orderService.updateRefundStatus(id,{status:'refunded',responseNote:note});
    await refreshLists();
  };
  /* ------------------------------------- */

  useEffect(() => {
    setLoading(true);
    refreshLists().finally(()=>setLoading(false));
  }, [orderId]);

  if (loading)
    return (
      <Box sx={{p:4,textAlign:'center'}}>
        <CircularProgress/><Typography mt={2}>Đang tải dữ liệu…</Typography>
      </Box>
    );

  return (
    <Box sx={{ mt:4 }}>
      {/* ================= RETURN ================= */}
      <Paper sx={{ p:2, mb:4 }}>
        <Typography variant="h6" gutterBottom>Yêu cầu trả hàng</Typography>
        {returns.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell><TableCell>Lý do</TableCell>
                <TableCell>Mô tả</TableCell><TableCell>Ảnh</TableCell>
                <TableCell>Video</TableCell><TableCell>Trạng thái</TableCell>
                <TableCell>Phản hồi</TableCell><TableCell>Ngày gửi</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returns.map((it, i)=>(
                <TableRow key={it.id}>
                  <TableCell>{i+1}</TableCell>
                  <TableCell>{it.reason}</TableCell>
                  <TableCell>{it.detailedReason||'—'}</TableCell>
                  <TableCell>
                    {it.evidenceImages ? it.evidenceImages.split(',').map((u,k)=>(
                      <img key={k} src={u.trim()} alt="" style={{width:40,height:40,objectFit:'cover',marginRight:4}}/>
                    )):'—'}
                  </TableCell>
                  <TableCell>
                    {it.evidenceVideos ? it.evidenceVideos.split(',').map((u,k)=>(
                      <video key={k} src={u.trim()} controls style={{width:60,height:40,marginRight:4}}/>
                    )):'—'}
                  </TableCell>
                  <TableCell><StatusChip status={it.status}/></TableCell>
                  <TableCell>{it.responseNote||'—'}</TableCell>
                  <TableCell>{new Date(it.createdAt).toLocaleString('vi-VN')}</TableCell>
                  <TableCell>
                    {it.status==='pending' && (
                      <>
                        <Button size="small" color="success" sx={{mr:1}}
                                onClick={()=>handleUpdateReturn(it.id,'approved')}>Duyệt</Button>
                        <Button size="small" color="error"
                                onClick={()=>handleUpdateReturn(it.id,'rejected')}>Từ chối</Button>
                      </>
                    )}
                    {['awaiting_pickup','pickup_booked'].includes(it.status) && (
                      <Button size="small" color="primary"
                              onClick={()=>handleUpdateReturn(it.id,'received')}>Đã nhận hàng</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ):<Typography>Không có yêu cầu trả hàng.</Typography>}
      </Paper>

      {/* ================= REFUND ================= */}
      <Paper sx={{ p:2 }}>
        <Typography variant="h6" gutterBottom>Yêu cầu hoàn tiền</Typography>
        {refunds.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell><TableCell>Lý do</TableCell>
                <TableCell>Trạng thái</TableCell><TableCell>Phản hồi</TableCell>
                <TableCell>Ngày gửi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refunds.map((rf,i)=>(
                <TableRow key={rf.id}>
                  <TableCell>{i+1}</TableCell>
                  <TableCell>{rf.reason}</TableCell>
                  <TableCell>
                    <StatusChip status={rf.status}/>
                    {rf.status==='pending' && (
                      <Button size="small" color="primary" sx={{ml:1}}
                              onClick={()=>handleUpdateRefund(rf.id)}>Hoàn tiền xong</Button>
                    )}
                  </TableCell>
                  <TableCell>{rf.responseNote||'—'}</TableCell>
                  <TableCell>{new Date(rf.createdAt).toLocaleString('vi-VN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ):<Typography>Không có yêu cầu hoàn tiền.</Typography>}
      </Paper>
    </Box>
  );
};

export default OrderReturnRefund;
