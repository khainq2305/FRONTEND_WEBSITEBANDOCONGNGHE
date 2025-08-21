import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, CircularProgress, Chip, Button, List, ListItem, ListItemText, Divider,
    Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { returnRefundService } from '../../../../services/admin/returnRefundService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

const statusColors = {
    pending: 'warning',
    approved: 'info',
    rejected: 'error',
    awaiting_pickup: 'warning',
    pickup_booked: 'info',
    received: 'success',
    refunded: 'default'
};
const labelMap = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    awaiting_pickup: 'Chờ gửi hàng',
    pickup_booked: 'GHN đã lấy',
    received: 'Đã nhận hàng',
    refunded: 'Đã hoàn tiền'
};
const StatusChip = ({ status }) => (
    <Chip label={labelMap[status] || status} color={statusColors[status] || 'default'} size="small" />
);

const rejectReasonsOptions = [
    { id: 'INVALID_PROOF', label: 'Bằng chứng không rõ ràng/không hợp lệ' },
    { id: 'OUT_OF_POLICY', label: 'Yêu cầu nằm ngoài chính sách đổi trả' },
    { id: 'WRONG_ITEM_RETURNED', label: 'Sản phẩm gửi về không đúng với yêu cầu' },
    { id: 'DAMAGED_BY_CUSTOMER', label: 'Sản phẩm bị lỗi do người mua' },
    { id: 'OVER_TIME_LIMIT', label: 'Đã quá thời hạn yêu cầu đổi trả' },
    { id: 'OTHER', label: 'Lý do khác (vui lòng mô tả chi tiết)' },
];

const ReturnRefundDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openReceivedDialog, setOpenReceivedDialog] = useState(false);
    const [receivedNote, setReceivedNote] = useState('');

    const [openRefundedDialog, setOpenRefundedDialog] = useState(false);
    const [refundedNote, setRefundedNote] = useState('');

    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [selectedRejectReasonOption, setSelectedRejectReasonOption] = useState('');
    const [customRejectReason, setCustomRejectReason] = useState('');
    const [rejectReasonError, setRejectReasonError] = useState(false);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await returnRefundService.getReturnDetail(id);
            if (res.data && res.data.data) {
                setDetail(res.data.data);
            } else {
                setError('Không tìm thấy chi tiết yêu cầu trả hàng.');
            }
        } catch (err) {
            console.error("Lỗi khi tải chi tiết yêu cầu:", err);
            setError('Không thể tải chi tiết yêu cầu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    // --- Hàm xử lý cho dialog "Received" (Đã nhận hàng) ---
    const handleOpenReceivedDialog = () => {
        setReceivedNote('');
        setOpenReceivedDialog(true);
    };

    const handleCloseReceivedDialog = () => {
        setOpenReceivedDialog(false);
        setReceivedNote('');
    };

    const handleConfirmReceived = async () => {
  try {
    const res = await returnRefundService.updateReturnStatus(id, {
      status: 'received',
      responseNote: receivedNote.trim() || null
    });
    console.log("✅ Update thành công:", res.data);
    handleCloseReceivedDialog();
    fetchDetail();
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật trạng thái:", err.response?.data || err.message);
    alert(err.response?.data?.message || 'Lỗi không xác định');
  }
};


    // --- Hàm xử lý cho dialog "Refunded" (Đã hoàn tiền) ---
    const handleOpenRefundedDialog = () => {
        setRefundedNote('');
        setOpenRefundedDialog(true);
    };

    const handleCloseRefundedDialog = () => {
        setOpenRefundedDialog(false);
        setRefundedNote('');
    };

    const handleConfirmRefunded = async () => {
        if (!refundedNote.trim()) {
            alert('Vui lòng nhập ghi chú hoàn tiền (mã giao dịch, số tiền...).');
            return;
        }
        console.log("📤 Gửi update status (Hoàn tiền xong):", id, 'refunded', "Ghi chú:", refundedNote);
        await returnRefundService.updateReturnStatus(id, { status: 'refunded', responseNote: refundedNote.trim() });
        handleCloseRefundedDialog();
        fetchDetail();
    };

    // --- Hàm xử lý cho dialog "Rejected" (Từ chối) trên trang chi tiết ---
    const handleOpenRejectDialog = () => {
        setSelectedRejectReasonOption('');
        setCustomRejectReason('');
        setRejectReasonError(false);
        setOpenRejectDialog(true);
    };

    const handleCloseRejectDialog = () => {
        setOpenRejectDialog(false);
        setSelectedRejectReasonOption('');
        setCustomRejectReason('');
        setRejectReasonError(false);
    };

    const handleConfirmReject = async () => {
        let finalRejectReason = '';

        if (selectedRejectReasonOption === 'OTHER') {
            finalRejectReason = customRejectReason.trim();
        } else if (selectedRejectReasonOption) {
            finalRejectReason = rejectReasonsOptions.find(opt => opt.id === selectedRejectReasonOption)?.label || '';
        }

        if (!finalRejectReason) {
            setRejectReasonError(true);
            return;
        }

        console.log("📤 Gửi update status (Từ chối):", id, 'rejected', "Lý do:", finalRejectReason);
        await returnRefundService.updateReturnStatus(id, { status: 'rejected', responseNote: finalRejectReason });

        handleCloseRejectDialog();
        fetchDetail();
    };

    // --- Hàm xử lý cho hành động "Approved" (Duyệt) không dialog ---
    const handleApproved = async () => {
        const confirmApprove = window.confirm("Bạn có chắc chắn muốn DUYỆT yêu cầu trả hàng này không? Khách hàng sẽ được thông báo để gửi hàng về.");
        if (confirmApprove) {
            console.log("📤 Gửi update status (Duyệt):", id, 'approved');
            await returnRefundService.updateReturnStatus(id, { status: 'approved', responseNote: null });
            fetchDetail();
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress /><Typography mt={2}>Đang tải chi tiết yêu cầu…</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
                <Typography variant="h6">{error}</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/admin/return-requests')}>
                    Quay lại danh sách
                </Button>
            </Box>
        );
    }

    if (!detail) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">Không tìm thấy thông tin chi tiết.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/admin/return-requests')}>
                    Quay lại danh sách
                </Button>
            </Box>
        );
    }

    let selectedItemsParsed = [];
    try {
        if (detail.selectedItems) {
            selectedItemsParsed = JSON.parse(detail.selectedItems);
        }
    } catch (e) {
        console.error("Lỗi khi parse selectedItems:", e);
    }

    return (
  <Box sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
    <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h5" gutterBottom component="h1" fontWeight="bold" mb={3}>
        Chi tiết yêu cầu trả hàng / hoàn tiền #{detail.returnCode}
      </Typography>

      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate('/admin/return-requests')}>
        &larr; Quay lại danh sách
      </Button>

      <Box sx={{ mt: 2, mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
        {detail.status === 'pending' && (
          <>
            <Button variant="contained" color="success" onClick={handleApproved}>Duyệt yêu cầu</Button>
            <Button variant="outlined" color="error" onClick={handleOpenRejectDialog}>Từ chối yêu cầu</Button>
          </>
        )}
        {['awaiting_pickup', 'pickup_booked'].includes(detail.status) && (
  <Button variant="contained" color="primary" onClick={handleOpenReceivedDialog}>Đã nhận hàng</Button>
)}
<Dialog open={openReceivedDialog} onClose={handleCloseReceivedDialog}>
  <DialogTitle>Xác nhận đã nhận hàng hoàn trả</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Bạn có chắc chắn đã nhận được hàng hoàn trả từ khách không? Nhập ghi chú nếu cần.
    </DialogContentText>
    <TextField
      fullWidth
      multiline
      rows={3}
      value={receivedNote}
      onChange={(e) => setReceivedNote(e.target.value)}
      margin="dense"
      placeholder="Ghi chú (tuỳ chọn)"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseReceivedDialog}>Huỷ</Button>
    <Button onClick={handleConfirmReceived} variant="contained" color="primary">
      Xác nhận
    </Button>
  </DialogActions>
</Dialog>

        {detail.status === 'received' && (
          <Button variant="contained" color="secondary" onClick={handleOpenRefundedDialog}>Hoàn tiền xong</Button>
        )}
      </Box>
<Dialog open={openRefundedDialog} onClose={handleCloseRefundedDialog}>
  <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Bạn xác nhận đã hoàn tiền cho khách? Vui lòng nhập mã giao dịch hoặc ghi chú.
    </DialogContentText>
    <TextField
      fullWidth
      multiline
      rows={3}
      value={refundedNote}
      onChange={(e) => setRefundedNote(e.target.value)}
      margin="dense"
      placeholder="Ghi chú hoàn tiền (mã giao dịch, số tiền...)"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseRefundedDialog}>Huỷ</Button>
    <Button onClick={handleConfirmRefunded} variant="contained" color="secondary">
      Xác nhận hoàn tiền
    </Button>
  </DialogActions>
</Dialog>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Thông tin chung</Typography>
      <Divider sx={{ mb: 2 }} />
      <List dense>
        <ListItem><ListItemText primary="Mã yêu cầu:" secondary={detail.returnCode} /></ListItem>
        <ListItem><ListItemText primary="Mã đơn hàng:" secondary={detail.order?.orderCode || 'N/A'} /></ListItem>
        <ListItem><ListItemText primary="Trạng thái:" secondary={<StatusChip status={detail.status} />} /></ListItem>
        <ListItem><ListItemText primary="Ngày gửi yêu cầu:" secondary={new Date(detail.createdAt).toLocaleString('vi-VN')} /></ListItem>
        <ListItem><ListItemText primary="Ngày cập nhật cuối:" secondary={new Date(detail.updatedAt).toLocaleString('vi-VN')} /></ListItem>
        <ListItem><ListItemText primary="Phản hồi từ quản trị viên:" secondary={detail.responseNote || 'Chưa có'} /></ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Lý do và Mô tả</Typography>
      <Divider sx={{ mb: 2 }} />
      <List dense>
        <ListItem><ListItemText primary="Lý do chính:" secondary={detail.reason || 'N/A'} /></ListItem>
        <ListItem><ListItemText primary="Mô tả chi tiết (từ khách hàng):" secondary={detail.detailedReason || 'Không có'} /></ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Sản phẩm yêu cầu trả</Typography>
      <Divider sx={{ mb: 2 }} />
      {detail.order?.items?.length > 0 && detail.items?.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>SKU ID</TableCell>
              <TableCell>Tên SP</TableCell>
              <TableCell>Giá mua</TableCell>
              <TableCell>Số lượng đã mua</TableCell>
              <TableCell>Số lượng yêu cầu trả</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detail.items.map((returnItem, index) => {
              const matchedOrderItem = detail.order.items.find(o => o.skuId === returnItem.skuId);
              return (
                <TableRow key={index}>
                  <TableCell>{returnItem.skuId}</TableCell>
                  <TableCell>{returnItem.sku?.product?.name || '---'}</TableCell>
                  <TableCell>{formatCurrencyVND(matchedOrderItem?.price || 0)}</TableCell>
                  <TableCell>{matchedOrderItem?.quantity || '-'}</TableCell>
                  <TableCell>{returnItem.quantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body2" color="text.secondary">Không có sản phẩm nào được chọn để trả.</Typography>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Thông tin hoàn tiền</Typography>
      <Divider sx={{ mb: 2 }} />
      <List dense>
        <ListItem><ListItemText primary="Số tiền dự kiến hoàn lại:" secondary={formatCurrencyVND(detail.refundAmount || 0)} /></ListItem>
        {detail.bankName && detail.accountNumber && detail.accountHolderName ? (
          <>
            <ListItem><ListItemText primary="Ngân hàng:" secondary={detail.bankName} /></ListItem>
            <ListItem><ListItemText primary="Số tài khoản:" secondary={detail.accountNumber} /></ListItem>
            <ListItem><ListItemText primary="Tên chủ tài khoản:" secondary={detail.accountHolderName} /></ListItem>
          </>
        ) : (
          <ListItem>
            <ListItemText
              primary="Phương thức:"
              secondary={
                detail.order?.paymentMethod?.code?.toUpperCase() || 'Không xác định'
              }
            />
          </ListItem>
        )}
        <ListItem><ListItemText primary="Email nhận thông báo:" secondary={detail.user?.email || 'N/A'} /></ListItem>
      </List>
    </Paper>
  </Box>
);

};

export default ReturnRefundDetail;