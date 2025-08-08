import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress
} from '@mui/material';
import { walletService } from '@/services/client/walletService';
import { toast } from 'react-toastify';

const ChangePinModal = ({ open, onClose }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePin = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      return toast.error('Vui lòng nhập đầy đủ thông tin');
    }

    if (newPin !== confirmPin) {
      return toast.error('Mã PIN xác nhận không khớp');
    }

    try {
      setLoading(true);
      await walletService.changePin({ currentPin, newPin });
      toast.success('Đổi mã PIN thành công!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi đổi mã PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đổi mã PIN</DialogTitle>
      <DialogContent className="space-y-4 mt-2">
        <TextField
          label="Mã PIN hiện tại"
          fullWidth
          type="password"
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value)}
        />
        <TextField
          label="Mã PIN mới"
          fullWidth
          type="password"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
        />
        <TextField
          label="Xác nhận mã PIN mới"
          fullWidth
          type="password"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleChangePin} disabled={loading}>
          {loading ? <CircularProgress size={18} /> : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePinModal;
