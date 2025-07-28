import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { brandService } from '@/services/admin/brandService';
import { toast } from 'react-toastify';

const AddBrandDialog = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Tên thương hiệu không được để trống');
    try {
      setIsSubmitting(true);
      await brandService.create({ name });
      toast.success('Đã thêm thương hiệu');
      onSuccess?.();
      onClose();
      setName('');
    } catch (err) {
      toast.error('Lỗi khi thêm thương hiệu');
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
    sx={{ mt: 1.5 }} // ✅ fix chính xác
  />
</DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Hủy</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>Thêm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBrandDialog;
