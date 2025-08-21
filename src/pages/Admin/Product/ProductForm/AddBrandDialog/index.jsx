import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { brandService } from '@/services/admin/brandService';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const AddBrandDialog = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

const handleSubmit = async () => {
  setErrors({});
  if (!name.trim()) {
    return setErrors({ name: 'Tên thương hiệu không được để trống' });
  }

  try {
    setIsSubmitting(true);
    const res = await brandService.create({ name });

    const newBrand = res?.data?.data;
    if (!newBrand || !newBrand.id) {
      throw new Error('Không nhận được thương hiệu mới từ server');
    }

    toast.success('Đã thêm thương hiệu');
    onSuccess?.(newBrand);
    onClose();
    setName('');
  } catch (err) {
    const res = err?.response?.data;
    if (res?.field === 'name') {
      setErrors({ name: res.message });
    } else {
      toast.error(res?.message || err.message || 'Lỗi khi thêm thương hiệu');
    }
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Thêm thương hiệu mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Tên thương hiệu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mt: 1.5 }}
        />
      </DialogContent>
 <DialogActions>
  <Button onClick={onClose} disabled={isSubmitting}>Hủy</Button>
  <LoadingButton
    onClick={handleSubmit}
    loading={isSubmitting}
    variant="contained"
  >
    Thêm
  </LoadingButton>
</DialogActions>

    </Dialog>
  );
};

export default AddBrandDialog;
