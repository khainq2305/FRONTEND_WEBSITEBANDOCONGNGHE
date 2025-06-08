import {
  Dialog, Box, FormControl, InputLabel, Select, MenuItem,
  Button
} from '@mui/material';
import { useState, useEffect } from 'react';

const paymentStatusOptions = [
  { value: 'pending', label: 'Chờ thanh toán' },
  { value: 'success', label: 'Đã thanh toán' },
  { value: 'failed', label: 'Thanh toán thất bại' },
  { value: 'refunded', label: 'Đã hoàn tiền' }
];

const UpdateOrderPaymentStatusDialog = ({ open, onClose, transaction, onConfirm }) => {
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    if (open && transaction) {
      setPaymentStatus(transaction.status || '');
    }
  }, [open, transaction]);

  const handleConfirm = () => {
    if (!paymentStatus) return;
    onConfirm(paymentStatus);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2, fontWeight: 'bold', fontSize: 20 }}>
          Cập nhật trạng thái thanh toán {transaction?.transactionCode && (
          <span style={{ color: '#1976d2' }}>{transaction.transactionCode}</span>
        )}
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel id="update-payment-status-label">Trạng thái thanh toán mới</InputLabel>
          <Select
            labelId="update-payment-status-label"
            value={paymentStatus}
            label="Trạng thái thanh toán mới"
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            {paymentStatusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirm} disabled={!paymentStatus}>
            Cập nhật
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UpdateOrderPaymentStatusDialog;