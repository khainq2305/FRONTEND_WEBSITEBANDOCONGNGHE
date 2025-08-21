import {
    Dialog, Box, FormControl, InputLabel, Select, MenuItem,
    TextField, Button
} from '@mui/material';
import { useState, useEffect } from 'react';

const cancelReasons = [
    { value: 'Khách đổi ý', label: 'Khách đổi ý' },
    { value: 'Sản phẩm hết hàng', label: 'Sản phẩm hết hàng' },
    { value: 'Sai thông tin đặt hàng', label: 'Sai thông tin đặt hàng' },
    { value: 'other', label: 'Lý do khác' }
];

const CancelOrderDialog = ({ open, onClose, order, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');

    useEffect(() => {
        if (open) {
            setReason('');
            setCustomReason('');
        }
    }, [open]);

    const handleConfirm = () => {
        const finalReason = reason === 'other' ? customReason.trim() : reason;
        if (!finalReason) return;
        onConfirm(finalReason);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ fontSize: 20, fontWeight: 700 }}>
                        Hủy đơn hàng <span style={{ color: '#e53935' }}>{order?.code}</span>
                    </Box>
                    <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                        Hãy chọn lý do để chúng tôi cải thiện dịch vụ.
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="cancel-reason-label">Lý do hủy đơn</InputLabel>
                        <Select
                            labelId="cancel-reason-label"
                            value={reason}
                            label="Lý do hủy đơn"
                            onChange={(e) => setReason(e.target.value)}
                        >
                            {cancelReasons.map((r) => (
                                <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {reason === 'other' && (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            placeholder="Nhập lý do cụ thể..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                    <Button variant="outlined" onClick={onClose}>Đóng</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirm}
                        disabled={!reason || (reason === 'other' && !customReason.trim())}
                    >
                        Xác nhận hủy
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default CancelOrderDialog;
