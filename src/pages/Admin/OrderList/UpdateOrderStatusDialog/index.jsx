import {
  Dialog, Box, FormControl, InputLabel, Select, MenuItem,
  Button
} from '@mui/material';
import { useState, useEffect } from 'react';

/* ---- UpdateOrderStatusDialog.jsx ---- */
const statusOptions = [
  { value: 'processing', label: 'Đang xử lý' },   // đơn mới → admin có thể chuyển tiếp
  { value: 'shipping',   label: 'Vận chuyển'   },   // từ processing
  { value: 'delivered',  label: 'Đã giao'     },   // từ shipping
  { value: 'cancelled',  label: 'Đã hủy'      }    // có thể hủy ở processing / shipping
];

/* phần còn lại giữ nguyên */


const UpdateOrderStatusDialog = ({ open, onClose, order, onConfirm }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (open && order) {
      setStatus(order.status || '');
    }
  }, [open, order]);

  const handleConfirm = () => {
    if (!status) return;
    onConfirm(status);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2, fontWeight: 'bold', fontSize: 20 }}>
          Cập nhật trạng thái đơn hàng <span style={{ color: '#1976d2' }}>{order?.code}</span>
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel id="update-status-label">Trạng thái mới</InputLabel>
          <Select
            labelId="update-status-label"
            value={status}
            label="Trạng thái mới"
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirm} disabled={!status}>
            Cập nhật
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UpdateOrderStatusDialog;
