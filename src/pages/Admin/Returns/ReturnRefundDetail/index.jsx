import React, { useEffect, useState } from 'react';
import {
  Grid ,
    Box, Typography, Paper, CircularProgress, Chip, Button, List, ListItem, ListItemText, Divider,
    Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { returnRefundService } from '../../../../services/admin/returnRefundService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import Breadcrumb from '../../../../components/common/Breadcrumb';
import RejectReturnDialog from '../RejectReturnDialog';
import { confirmDelete } from '../../../../components/common/ConfirmDeleteDialog';
import { confirmAction } from '../ConfirmActionDialog';
import { toast } from 'react-toastify';

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
const reasonMap = {
  WRONG_SIZE_COLOR: 'Nhận sai kích cỡ, màu sắc, hoặc sai sản phẩm',
  NOT_AS_DESCRIBED: 'Sản phẩm khác với mô tả của shop',
  DEFECTIVE: 'Sản phẩm bị lỗi, hư hỏng, không hoạt động',
  CHANGE_MIND: 'Không còn nhu cầu mua nữa',
  ORDER_BY_MISTAKE: 'Đặt nhầm sản phẩm',
  FOUND_BETTER_PRICE: 'Tìm được sản phẩm giá tốt hơn',
  OTHER: 'Lý do khác',
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
   await returnRefundService.updateReturnStatus(id, {
  status: 'received',
  responseNote: receivedNote.trim() || null
});
toast.success('Xác nhận đã nhận hàng thành công!');

   
    handleCloseReceivedDialog();
    fetchDetail();
  } catch (err) {

    alert(err.response?.data?.message || 'Lỗi không xác định');
  }
};


    
    const handleOpenRefundedDialog = () => {
        setRefundedNote('');
        setOpenRefundedDialog(true);
    };

    const handleCloseRefundedDialog = () => {
        setOpenRefundedDialog(false);
        setRefundedNote('');
    };

    const handleConfirmRefunded = async () => {
       
       
       await returnRefundService.updateReturnStatus(id, {
  status: 'refunded',
  responseNote: refundedNote.trim()
});
toast.success('Xác nhận hoàn tiền thành công!');

        handleCloseRefundedDialog();
        fetchDetail();
    };


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

        
        await returnRefundService.updateReturnStatus(id, { status: 'rejected', responseNote: finalRejectReason });

        handleCloseRejectDialog();
        fetchDetail();
    };

   
   const handleApproved = async () => {
  const confirm = await confirmAction(
  'duyệt', // hành động
  'yêu cầu trả hàng này', // đối tượng
  'Duyệt', // nút xác nhận

);

  if (confirm) {
   await returnRefundService.updateReturnStatus(id, { status: 'approved', responseNote: null });
toast.success('Đã duyệt yêu cầu trả hàng thành công!');
fetchDetail();

  }
};
const handleConfirmReceivedSwal = async () => {
  const confirm = await confirmAction(
    'xác nhận đã nhận hàng',
    'yêu cầu trả hàng này',
    'Xác nhận'
  );

  if (confirm) {
    await returnRefundService.updateReturnStatus(id, {
      status: 'received',
      responseNote: null
    });
    toast.success('Đã xác nhận đã nhận hàng trả!');
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
    <Typography variant="h6" sx={{ mb: 2 }}>
  <Breadcrumb
    items={[
      { label: 'Trang chủ', href: '/admin' },
      { label: 'Trả hàng / Hoàn tiền', href: '/admin/return-requests' },
      { label: `Chi tiết #${detail.returnCode}` }
    ]}
  />
</Typography>

    <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate('/admin/return-requests')}>
        &larr; Quay lại danh sách
      </Button>
    <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h5" gutterBottom component="h1" fontWeight="bold" mb={3}>
        Chi tiết yêu cầu trả hàng / hoàn tiền #{detail.returnCode}
      </Typography>

      

    
<Dialog
  open={openRefundedDialog}
  onClose={handleCloseRefundedDialog}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Bạn xác nhận đã hoàn tiền cho khách?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseRefundedDialog}>Huỷ</Button>
    <Button
      onClick={handleConfirmRefunded}
      variant="contained"
      color="secondary"
    >
      Xác nhận hoàn tiền
    </Button>
  </DialogActions>
</Dialog>


      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Thông tin chung</Typography>
      <Divider sx={{ mb: 2 }} />
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <TextField
      label="Mã yêu cầu"
      value={detail.returnCode}
      fullWidth
      InputProps={{ readOnly: true }}
      size="small"
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      label="Mã đơn hàng"
      value={detail.order?.orderCode || 'N/A'}
      fullWidth
      InputProps={{ readOnly: true }}
      size="small"
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      label="Trạng thái"
      value={labelMap[detail.status]}
      fullWidth
      InputProps={{ readOnly: true }}
      size="small"
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      label="Ngày gửi yêu cầu"
      value={new Date(detail.createdAt).toLocaleString('vi-VN')}
      fullWidth
      InputProps={{ readOnly: true }}
      size="small"
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      label="Ngày cập nhật cuối"
      value={new Date(detail.updatedAt).toLocaleString('vi-VN')}
      fullWidth
      InputProps={{ readOnly: true }}
      size="small"
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      label="Phản hồi từ quản trị viên"
      value={detail.responseNote || 'Chưa có'}
      fullWidth
      multiline
      rows={2}
      InputProps={{ readOnly: true }}
      size="small"
    />
  </Grid>
</Grid>



     

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Sản phẩm yêu cầu trả</Typography>
      <Divider sx={{ mb: 2 }} />
      {detail.order?.items?.length > 0 && detail.items?.length > 0 ? (
        <Table size="small">
        <TableHead>
  <TableRow>
   <TableCell align="center">SKU CODE</TableCell>

    <TableCell>Tên SP</TableCell>
    <TableCell>Giá mua</TableCell>
    <TableCell align="center">Số lượng đã mua</TableCell>
    <TableCell align="center">Số lượng yêu cầu trả</TableCell>
  </TableRow>
</TableHead>

          <TableBody>
            {detail.items.map((returnItem, index) => {
              const matchedOrderItem = detail.order.items.find(o => o.skuId === returnItem.skuId);
              return (
               <TableRow key={index}>
 <TableCell align="center">{returnItem.sku?.skuCode || returnItem.skuId}</TableCell>

  <TableCell>
    <Box display="flex" alignItems="center" gap={1}>
      {returnItem.sku?.thumbnail && (
        <img
          src={returnItem.sku.thumbnail}
          alt="thumb"
          style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }}
        />
      )}
      <Typography variant="body2">{returnItem.sku?.product?.name || '---'}</Typography>
    </Box>
  </TableCell>
  <TableCell>{formatCurrencyVND(matchedOrderItem?.price || 0)}</TableCell>
  <TableCell align="center">{matchedOrderItem?.quantity || '-'}</TableCell>
  <TableCell align="center">{returnItem.quantity}</TableCell>
</TableRow>

              );
            })}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body2" color="text.secondary">Không có sản phẩm nào được chọn để trả.</Typography>
      )}
       <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Lý do và Mô tả</Typography>
      <Divider sx={{ mb: 2 }} />
      <List dense>
       <ListItem>
  <ListItemText
    primary="Lý do chính:"
    secondary={reasonMap[detail.reason] || detail.reason || 'N/A'}
  />
</ListItem>

        <ListItem><ListItemText primary="Mô tả chi tiết (từ khách hàng):" secondary={detail.detailedReason || 'Không có'} /></ListItem>
      </List>
<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Thông tin bằng chứng</Typography>
<Divider sx={{ mb: 2 }} />
{detail.proofs?.length > 0 ? (
 <Box
  sx={{
    display: 'flex',
    gap: 2,
    overflowX: 'auto',
    flexWrap: 'nowrap',
    pb: 1,
  }}
>
  {detail.proofs.map((proof, idx) => (
   <Box
  key={idx}
  sx={{
    width: 100,
    height: 100,
    borderRadius: 1,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    flex: '0 0 auto',
  }}
>
  {proof.type.startsWith('image') ? (
    <img
      src={proof.url}
      alt={`proof-${idx}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  ) : (
    <video
      controls
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    >
      <source src={proof.url} type={proof.type} />
      Trình duyệt không hỗ trợ video.
    </video>
  )}
</Box>

  ))}
</Box>

) : (
  <Typography variant="body2" color="text.secondary">
    Không có bằng chứng nào được đính kèm.
  </Typography>
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
        <ListItem><ListItemText primary="Email nhận thông báo:" secondary={detail.order?.User?.email || 'N/A'}
 /></ListItem>
    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
  Hành động xử lý yêu cầu
</Typography>
<Divider sx={{ mb: 2 }} />
<Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
  {detail.status === 'pending' && (
    <>
      <Button variant="contained" color="success" onClick={handleApproved}>Duyệt yêu cầu</Button>
      <Button variant="outlined" color="error" onClick={handleOpenRejectDialog}>Từ chối yêu cầu</Button>
    </>
  )}
  {['awaiting_pickup', 'pickup_booked', 'awaiting_dropoff'].includes(detail.status) && (
  <Button
    variant="contained"
    color="primary"
    onClick={handleConfirmReceivedSwal}
  >
    Đã nhận hàng hoàn
  </Button>
)}

  {detail.status === 'received' && (
    <Button variant="contained" color="secondary" onClick={handleOpenRefundedDialog}>
      Hoàn tiền xong
    </Button>
  )}
</Box>

      </List>
    </Paper>
    <RejectReturnDialog
  open={openRejectDialog}
  onClose={handleCloseRejectDialog}
  onConfirm={handleConfirmReject}
  selectedReason={selectedRejectReasonOption}
  setSelectedReason={setSelectedRejectReasonOption}
  customReason={customRejectReason}
  setCustomReason={setCustomRejectReason}
  reasonError={rejectReasonError}
  setReasonError={setRejectReasonError}
/>

  </Box>
);

};

export default ReturnRefundDetail;