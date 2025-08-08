import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const PinModal = ({ open, onClose, onSubmit }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    if (pin.length !== 6) return alert('Mã PIN phải đủ 6 số');
    onSubmit(pin);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nhập mã PIN ví nội bộ</DialogTitle>
      <DialogContent>
        <TextField
          label="Mã PIN"
          type="password"
          fullWidth
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          inputProps={{ maxLength: 6 }}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleSubmit} variant="contained">Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PinModal;
