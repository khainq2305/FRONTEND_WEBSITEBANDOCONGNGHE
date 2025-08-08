import {
  Dialog, Box, FormControl, InputLabel, Select, MenuItem,
  Button, TextField, Chip, Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const statusOptions = [
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Vận chuyển' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'completed', label: 'Hoàn thành' }, // ✅ THÊM DÒNG NÀY
  { value: 'cancelled', label: 'Đã hủy' }
];


const presetReasons = [
  'Khách yêu cầu hủy',
  'Không liên lạc được với khách',
  'Hết hàng',
  'Thông tin giao hàng không hợp lệ',
  'Lý do khác'
];

const UpdateOrderStatusDialog = ({ open, onClose, order, onConfirm }) => {
  const [status, setStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');
const [selectedReason, setSelectedReason] = useState('');
const [customReason, setCustomReason] = useState('');
const finalReason = customReason.trim() || selectedReason.trim();
const [loading, setLoading] = useState(false);
const statusOrder = ['processing', 'shipping', 'delivered', 'completed', 'cancelled'];

 useEffect(() => {
  if (open && order) {
    setStatus(order.status || '');
    setCancelReason('');
    setSelectedReason('');
    setCustomReason('');
  }
}, [open, order]);

const filteredStatusOptions = statusOptions.filter(option => {
  const currentIndex = statusOrder.indexOf(order?.status);
  const optionIndex = statusOrder.indexOf(option.value);

  // Luôn giữ lại trạng thái hiện tại (để hiển thị)
  // Và các trạng thái sau hoặc "cancelled"
  return (
    option.value === order?.status ||
    optionIndex > currentIndex ||
    option.value === 'cancelled'
  );
});


const handleConfirm = async () => {
  if (!status) return;
  if (status === 'cancelled' && !finalReason) {
    alert('Vui lòng nhập hoặc chọn lý do hủy đơn');
    return;
  }

  try {
    setLoading(true);
    await onConfirm(status, finalReason); // ⬅️ nhớ phải là async
  } finally {
    setLoading(false);
  }
};



  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2, fontWeight: 'bold', fontSize: 20 }}>
          Cập nhật trạng thái đơn <span style={{ color: '#1976d2' }}>{order?.code}</span>
        </Box>

       <FormControl fullWidth size="small" sx={{ mb: 2 }}>
  <InputLabel id="update-status-label">Trạng thái mới</InputLabel>
  <Select
    labelId="update-status-label"
    value={status}
    label="Trạng thái mới"
    onChange={(e) => {
      setStatus(e.target.value);
      if (e.target.value !== 'cancelled') {
        setCancelReason('');
      }
    }}
  >
    {filteredStatusOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
    ))}
  </Select>
</FormControl>

     {status === 'cancelled' && (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography variant="subtitle2" fontWeight={600}>
      Lý do huỷ đơn
    </Typography>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {presetReasons.map((reason) => (
        <Chip
          key={reason}
          label={reason}
          onClick={() => setSelectedReason(reason)}
          color={selectedReason === reason ? 'primary' : 'default'}
          variant={selectedReason === reason ? 'filled' : 'outlined'}
          sx={{ cursor: 'pointer' }}
        />
      ))}
    </Box>

    <TextField
      label="Hoặc nhập lý do khác"
      value={customReason}
      onChange={(e) => setCustomReason(e.target.value)}
      fullWidth
      multiline
      rows={2}
    />
  </Box>
)}


        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>Đóng</Button>
         <Button
  variant="contained"
  onClick={handleConfirm}
  disabled={!status || loading}
  startIcon={loading && <CircularProgress size={18} color="inherit" />}
>
  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
</Button>

        </Box>
      </Box>
    </Dialog>
  );
};

export default UpdateOrderStatusDialog;
