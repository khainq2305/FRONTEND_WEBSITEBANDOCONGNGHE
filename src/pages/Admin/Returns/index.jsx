import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
    Button, Box, Typography, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, CircularProgress, Chip,
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    TableContainer, Tooltip
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { returnRefundService } from '../../../services/admin/returnRefundService';
import { useNavigate } from 'react-router-dom';
import MUIPagination from '../../../components/common/Pagination';
import SearchInput from '../../../components/common/SearchInput';
import HighlightText from '../../../components/Admin/HighlightText';
import Breadcrumb from '../../../components/common/Breadcrumb';

const statusColors = {
    pending: 'warning',
    approved: 'info',
    rejected: 'error',
    awaiting_pickup: 'warning',
    pickup_booked: 'info',
    received: 'success',
    awaiting_dropoff: 'warning',   // thêm cái này
    refunded: 'default',
    cancelled: 'default',
    '': 'gray'
};

const labelMap = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    awaiting_pickup: 'Chờ gửi hàng',
    pickup_booked: 'Đang hoàn hàng',
    received: 'Đã nhận hàng',
      awaiting_dropoff: 'Chờ gửi hàng',  // thêm cái này
    refunded: 'Đã hoàn tiền',
    cancelled: 'Đã hủy',
    '': 'Tất cả'
};
const statusTabColors = {
    '': '#9e9e9e',
    pending: '#ffa726',
    approved: '#29b6f6',
    rejected: '#ef5350',
    awaiting_pickup: '#ffb300',
    pickup_booked: '#42a5f5',
    received: '#66bb6a',
    refunded: '#607d8b',
    cancelled: '#b0bec5'
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

const OrderReturnRefund = () => {
    const navigate = useNavigate();
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [currentReturnIdToReject, setCurrentReturnIdToReject] = useState(null);
    const [selectedRejectReasonOption, setSelectedRejectReasonOption] = useState('');
    const [customRejectReason, setCustomRejectReason] = useState('');
    const [rejectReasonError, setRejectReasonError] = useState(false);

    // Filter states
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [totalItems, setTotalItems] = useState(0);

    const [statusStats, setStatusStats] = useState([]);

    const fetchReturns = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await returnRefundService.getReturnsByOrder(0, {
                page,
                limit: itemsPerPage,
                search,
                status,
                startDate,
                endDate
            });
            setReturns(data.data || []);
            setTotalItems(data.totalItems || 0);
            setStatusStats(data.statusStats || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách:", error);
        } finally {
            setLoading(false);
        }
    }, [page, search, status, startDate, endDate]);


    useEffect(() => {
        fetchReturns();
    }, [search, status, startDate, endDate, page, fetchReturns]);
    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(1);
    };

    const handleOpenRejectDialog = (id) => {
        setCurrentReturnIdToReject(id);
        setSelectedRejectReasonOption('');
        setCustomRejectReason('');
        setRejectReasonError(false);
        setOpenRejectDialog(true);
    };

    const handleCloseRejectDialog = () => {
        setOpenRejectDialog(false);
        setCurrentReturnIdToReject(null);
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

        await returnRefundService.updateReturnStatus(currentReturnIdToReject, { status: 'rejected', responseNote: finalRejectReason });
        handleCloseRejectDialog();
        await fetchReturns();
    };

    const handleViewDetail = (returnId) => {
        navigate(`/admin/return-requests/${returnId}`);
    };

    const statusTabs = useMemo(() => {
        const allStatus = [
            { value: '', label: 'Tất cả' },
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'approved', label: 'Đã duyệt' },
            { value: 'rejected', label: 'Từ chối' },
            { value: 'awaiting_pickup', label: 'Chờ gửi hàng' },
            { value: 'pickup_booked', label: 'Đang hoàn hàng' },

            { value: 'received', label: 'Đã nhận hàng' },
            { value: 'refunded', label: 'Đã hoàn tiền' },
        ];
        const totalCount = statusStats.reduce((sum, stat) => sum + stat.count, 0);

        return allStatus.map(s => {
            const stats = statusStats.find(stat => stat.status === s.value);
            const count = stats ? stats.count : 0;
            return {
                value: s.value,
                label: `${s.label} (${s.value === '' ? totalCount : count})`,
                color: statusColors[s.value] || 'gray'
            };
        });
    }, [statusStats]);

    if (loading)
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress /><Typography mt={2}>Đang tải dữ liệu trả hàng/hoàn tiền…</Typography>
            </Box>
        );

    return (
        <Box sx={{ mt: 4 }}>
            <Breadcrumb
                items={[
                    { label: 'Trang chủ', href: '/admin' },
                    { label: 'Đơn trả hàng', href: '/admin/return-requests' }
                ]}
            />


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 4,
                    mt: 2,
                    mb: 2,
                    border: '1px solid #eee',
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                }}
            >
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {statusTabs.map((tab) => {
                        const isActive = status === tab.value;
                        return (
                            <Box
                                key={tab.value}
                                onClick={() => handleFilterChange(setStatus, tab.value)}
                                sx={{
                                    cursor: 'pointer',
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: '20px',
                                    fontSize: 13,
                                    fontWeight: isActive ? 600 : 500,
                                    textAlign: 'center',
                                    minWidth: 90,
                                    backgroundColor: isActive ? statusTabColors[tab.value] : '#f5f5f5',
                                    color: isActive ? '#fff' : '#333',
                                    border: `1px solid ${statusTabColors[tab.value]}`,
                                    transition: '0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: statusTabColors[tab.value],
                                        color: '#fff',
                                        boxShadow: `0 0 4px ${statusTabColors[tab.value]}88`
                                    }
                                }}
                            >
                                {tab.label}
                            </Box>

                        );
                    })}
                </Box>
                <Box sx={{ display: 'flex', mt: 2, alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                    <SearchInput
                        value={search}
                        onChange={(val) => handleFilterChange(setSearch, val)}
                        placeholder="Tìm kiếm mã đơn / yêu cầu"
                        sx={{ flex: 1, minWidth: '240px', height: 40 }}
                    />

                    <TextField
                        label="Từ ngày"
                        type="date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: '150px', height: 40 }}
                        value={startDate}
                        onChange={(e) => handleFilterChange(setStartDate, e.target.value)}
                    />
                    <TextField
                        label="Đến ngày"
                        type="date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: '150px', height: 40 }}
                        value={endDate}
                        onChange={(e) => handleFilterChange(setEndDate, e.target.value)}
                    />
                </Box>
            </Box>

            <TableContainer component={Paper}>
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : returns.length ? (
                            returns.map((it, i) => (
                                <TableRow key={it.id}>
                                    <TableCell>{(page - 1) * itemsPerPage + i + 1}</TableCell>
                                    <TableCell>
                                        <HighlightText text={it.returnCode || '—'} highlight={search} />
                                    </TableCell>

                                    <TableCell>
                                        <HighlightText text={it.order?.orderCode || '—'} highlight={search} />
                                    </TableCell>

                                    <TableCell><StatusChip status={it.status} /></TableCell>
                                    <TableCell>{new Date(it.createdAt).toLocaleString('vi-VN')}</TableCell>
                                    <TableCell>
                                        <Button size="small" variant="outlined" onClick={() => handleViewDetail(it.id)}>
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : <TableRow><TableCell colSpan={6} align="center"><Typography>Không có yêu cầu trả hàng nào.</Typography></TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalItems > itemsPerPage && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <MUIPagination
                        currentPage={page}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setPage}
                    />
                </Box>
            )}

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
