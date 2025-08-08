import React, { useState } from 'react';
import { walletService } from '@/services/client/walletService';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';
import { toast } from 'react-toastify';

const WalletPinSetupForm = () => {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      await walletService.sendPinVerification();
      toast.success('Mã xác minh đã được gửi đến email');
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi mã xác minh thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPin = async () => {
    if (!token || !pin) {
      toast.warning('Vui lòng nhập đầy đủ mã xác minh và mã PIN');
      return;
    }

    setLoading(true);
    try {
      await walletService.setPin({ token, pin });
      toast.success('Thiết lập mã PIN thành công!');
      setStep(3); // Optional: show success message
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Thiết lập mã PIN thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2} maxWidth={400} mx="auto">
      {step === 1 && (
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            Thiết lập mã PIN ví
          </Typography>
          <Typography>
            Nhấn nút bên dưới để gửi mã xác minh đến email của bạn.
          </Typography>
          <Button variant="contained" onClick={handleSendVerification} disabled={loading}>
            Gửi mã xác minh
          </Button>
        </Stack>
      )}

      {step === 2 && (
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            Xác minh email & Thiết lập PIN
          </Typography>
          <TextField
            label="Mã xác minh"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mã PIN (6 số)"
            type="password"
            inputProps={{ maxLength: 6 }}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSetPin} disabled={loading}>
            Thiết lập mã PIN
          </Button>
        </Stack>
      )}

      {step === 3 && (
        <Typography textAlign="center" color="green" mt={4}>
          🎉 Thiết lập mã PIN thành công!
        </Typography>
      )}
    </Box>
  );
};

export default WalletPinSetupForm;
