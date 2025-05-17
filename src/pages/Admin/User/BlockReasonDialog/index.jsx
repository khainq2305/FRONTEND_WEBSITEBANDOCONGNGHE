import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import { useState } from 'react';

const predefinedReasons = [
  'Vi phạm quy định',
  'Hoạt động bất thường',
  'Tài khoản giả mạo',
  'Khác'
];

const BlockReasonDialog = ({ open, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const isCustom = selectedReason === 'Khác';

  const handleConfirm = () => {
    const finalReason = isCustom ? customReason.trim() : selectedReason;

    if (!finalReason) return alert('Vui lòng nhập lý do');
    onConfirm(finalReason);
    onClose();
    setSelectedReason('');
    setCustomReason('');
    
  };

  return (
<Dialog
  open={open}
  onClose={onClose}
  fullWidth
  maxWidth={false} // tắt giới hạn mặc định
  PaperProps={{
    sx: {
      width: '500px',
      maxWidth: '100%' // tránh tràn màn hình nhỏ
    }
  }}
>

      <DialogTitle>Lý do khóa tài khoản</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            select
            fullWidth
            label="Chọn lý do"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            {predefinedReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>

          {isCustom && (
            <TextField
              fullWidth
              label="Nhập lý do cụ thể"
              multiline
              minRows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleConfirm}>Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockReasonDialog;
