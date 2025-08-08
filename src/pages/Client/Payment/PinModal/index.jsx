import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PinInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    const newValue = [...value];
    newValue[index] = val;
    onChange(newValue);

    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
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
            borderRadius: '6px',
          }}
        />
      ))}
    </div>
  );
};

const PinModal = ({ open, onClose, onSubmit }) => {
  const [pin, setPin] = useState(Array(6).fill(''));

  const handleSubmit = () => {
    const pinStr = pin.join('');
    if (pinStr.length !== 6) {
      return alert('Mã PIN phải đủ 6 số');
    }
    onSubmit(pinStr);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nhập mã PIN ví nội bộ</DialogTitle>
      <DialogContent>
        <PinInput value={pin} onChange={setPin} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleSubmit} variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PinModal;
