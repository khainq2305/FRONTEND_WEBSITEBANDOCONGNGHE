import React, { useEffect, useState } from 'react';
import {
    Button, Box, Typography, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, CircularProgress, Chip,
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from '@mui/material';
import { returnRefundService } from '../../../services/admin/returnRefundService';
import { useNavigate } from 'react-router-dom';

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

// Định nghĩa các lý do từ chối có sẵn (vẫn cần ở đây cho dialog từ chối)
const rejectReasonsOptions = [
    { id: 'INVALID_PROOF', label: 'Bằng chứng không rõ ràng/không hợp lệ' },
    { id: 'OUT_OF_POLICY', label: 'Yêu cầu nằm ngoài chính sách đổi trả' },
    { id: 'WRONG_ITEM_RETURNED', label: 'Sản phẩm gửi về không đúng với yêu cầu' },
    { id: 'DAMAGED_BY_CUSTOMER', label: 'Sản phẩm bị lỗi do người mua' },
    { id: 'OVER_TIME_LIMIT', label: 'Đã quá thời hạn yêu cầu đổi trả' },
    { id: 'OTHER', label: 'Lý do khác (vui lòng mô tả chi tiết)' },
];

const OrderReturnRefund = () => {
    const navigate = useNavigate();
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    // States cho dialog từ chối (vẫn giữ nguyên)
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [currentReturnIdToReject, setCurrentReturnIdToReject] = useState(null);
    const [selectedRejectReasonOption, setSelectedRejectReasonOption] = useState('');
    const [customRejectReason, setCustomRejectReason] = useState('');
    const [rejectReasonError, setRejectReasonError] = useState(false);

    const refreshLists = async () => {
        try {
            const resReturns = await returnRefundService.getReturnsByOrder(0);
            setReturns(resReturns.data.data);
            console.log('🪵 Trả hàng mới:', resReturns.data.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm mở dialog từ chối (vẫn giữ nguyên)
    const handleOpenRejectDialog = (id) => {
        setCurrentReturnIdToReject(id);
        setSelectedRejectReasonOption('');
        setCustomRejectReason('');
        setRejectReasonError(false);
        setOpenRejectDialog(true);
    };

    // Hàm đóng dialog từ chối (vẫn giữ nguyên)
    const handleCloseRejectDialog = () => {
        setOpenRejectDialog(false);
        setCurrentReturnIdToReject(null);
        setSelectedRejectReasonOption('');
        setCustomRejectReason('');
        setRejectReasonError(false);
    };

    // Hàm xử lý khi xác nhận từ chối trong dialog (vẫn giữ nguyên)
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

        console.log("📤 Gửi update status (Từ chối):", currentReturnIdToReject, 'rejected', "Lý do:", finalRejectReason);
        await returnRefundService.updateReturnStatus(currentReturnIdToReject, { status: 'rejected', responseNote: finalRejectReason });

        handleCloseRejectDialog();
        await refreshLists();
    };

    // Loại bỏ hàm handleUpdateReturn cũ và handleUpdateRefund

    const handleViewDetail = (returnId) => {
        navigate(`/admin/return-requests/${returnId}`);
    };

    useEffect(() => {
        setLoading(true);
        refreshLists();
    }, []);

    if (loading)
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress /><Typography mt={2}>Đang tải dữ liệu trả hàng/hoàn tiền…</Typography>
            </Box>
        );

    return (
        <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Danh sách yêu cầu trả hàng</Typography>
                {returns.length ? (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Mã yêu cầu</TableCell>
                                <TableCell>Mã đơn hàng</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ngày gửi</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {returns.map((it, i) => (
                                <TableRow key={it.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{it.returnCode || '—'}</TableCell>
                                    <TableCell>{it.order?.orderCode || '—'}</TableCell>
                                    <TableCell><StatusChip status={it.status} /></TableCell>
                                    <TableCell>{new Date(it.createdAt).toLocaleString('vi-VN')}</TableCell>
                                    <TableCell>
                                        {/* Chỉ có nút Xem chi tiết. Các hành động duyệt/từ chối/nhận hàng sẽ ở trang chi tiết */}
                                        <Button size="small" variant="outlined" onClick={() => handleViewDetail(it.id)}>
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : <Typography>Không có yêu cầu trả hàng nào.</Typography>}
            </Paper>

            {/* Dialog Từ Chối Yêu Cầu Trả Hàng (Giữ nguyên ở đây, vì từ chối có thể là hành động nhanh từ danh sách nếu không cần chi tiết quá) */}
            <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog}>
                <DialogTitle>Từ chối yêu cầu trả hàng</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Vui lòng chọn lý do từ chối yêu cầu trả hàng này hoặc nhập lý do khác. Lý do sẽ được gửi đến khách hàng.
                    </DialogContentText>

                    <FormControl component="fieldset" error={rejectReasonError} fullWidth>
                        <FormLabel component="legend">Chọn lý do:</FormLabel>
                        <RadioGroup
                            aria-label="reject-reason"
                            name="reject-reason-group"
                            value={selectedRejectReasonOption}
                            onChange={(e) => {
                                setSelectedRejectReasonOption(e.target.value);
                                if (e.target.value.trim() && e.target.value !== 'OTHER') {
                                    setRejectReasonError(false);
                                }
                                if (e.target.value !== 'OTHER') {
                                    setCustomRejectReason('');
                                }
                            }}
                        >
                            {rejectReasonsOptions.map((option) => (
                                <FormControlLabel
                                    key={option.id}
                                    value={option.id}
                                    control={<Radio size="small" />}
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                        {rejectReasonError && !selectedRejectReasonOption && (
                            <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                Vui lòng chọn một lý do hoặc nhập lý do khác.
                            </Typography>
                        )}
                    </FormControl>

                    {selectedRejectReasonOption === 'OTHER' && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="customRejectReason"
                            label="Mô tả lý do khác"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={customRejectReason}
                            onChange={(e) => {
                                setCustomRejectReason(e.target.value);
                                if (e.target.value.trim()) {
                                    setRejectReasonError(false);
                                }
                            }}
                            error={rejectReasonError && !customRejectReason.trim()}
                            helperText={rejectReasonError && !customRejectReason.trim() ? 'Lý do khác không được để trống' : ''}
                            sx={{ mt: 2 }}
                        />
                    )}
                     {rejectReasonError && selectedRejectReasonOption === 'OTHER' && !customRejectReason.trim() && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {rejectReasonError && !customRejectReason.trim() ? 'Vui lòng nhập lý do chi tiết.' : ''}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRejectDialog}>Hủy</Button>
                    <Button
                        onClick={handleConfirmReject}
                        disabled={
                            !selectedRejectReasonOption ||
                            (selectedRejectReasonOption === 'OTHER' && !customRejectReason.trim())
                        }
                    >
                        Xác nhận từ chối
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderReturnRefund;