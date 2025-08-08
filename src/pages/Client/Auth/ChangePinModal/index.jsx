import React, { useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress
} from '@mui/material';
import { walletService } from '@/services/client/walletService';
import { toast } from 'react-toastify';

const PinInput = ({ label, value, onChange }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      onChange(value.map((v, i) => (i === index ? '' : v)));
      return;
    }
    const newValue = value.map((v, i) => (i === index ? val : v));
    onChange(newValue);

    if (index < 5 && val) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: 4 }}>
        {label} <span style={{ color: 'red' }}>*</span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {value.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="tel"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={{
              width: '40px',
              height: '40px',
              fontSize: '18px',
              textAlign: 'center',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ChangePinModal = ({ open, onClose }) => {
  const [currentPin, setCurrentPin] = useState(Array(6).fill(''));
  const [newPin, setNewPin] = useState(Array(6).fill(''));
  const [confirmPin, setConfirmPin] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);

  const handleChangePin = async () => {
    const currentPinStr = currentPin.join('');
    const newPinStr = newPin.join('');
    const confirmPinStr = confirmPin.join('');

    if (!currentPinStr || !newPinStr || !confirmPinStr) {
      return toast.error('Vui lòng nhập đầy đủ thông tin');
    }

    if (currentPinStr.length !== 6 || newPinStr.length !== 6 || confirmPinStr.length !== 6) {
      return toast.error('Mã PIN phải gồm 6 chữ số');
    }

    if (newPinStr !== confirmPinStr) {
      return toast.error('Mã PIN xác nhận không khớp');
    }

    try {
      setLoading(true);
      await walletService.changePin({ currentPin: currentPinStr, newPin: newPinStr });
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
      <DialogContent>
        <PinInput label="Mã PIN hiện tại" value={currentPin} onChange={setCurrentPin} />
        <PinInput label="Mã PIN mới" value={newPin} onChange={setNewPin} />
        <PinInput label="Xác nhận mã PIN mới" value={confirmPin} onChange={setConfirmPin} />
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
