import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import Toastify from 'components/common/Toastify';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  brandId,
  itemName = '',
  itemType = 'mục',
  permanent = false,
  onSuccess = () => { }
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (permanent) {
        await axios.delete(`http://localhost:5000/admin/brands/${brandId}/force`);
        Toastify.success(`✅ Đã xoá vĩnh viễn ${itemType} "${itemName}"`);
      } else {
        await axios.delete(`http://localhost:5000/admin/brands/${brandId}`);
        Toastify.success(`✅ Đã xoá ${itemType} "${itemName}"`);
      }
      onClose();
      onSuccess();
    } catch (err) {
      Toastify.error(permanent ? '❌ Xoá vĩnh viễn thất bại' : '❌ Xoá thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{permanent ? 'Xác nhận xóa vĩnh viễn' : 'Xác nhận xóa'}</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn {permanent ? 'xóa vĩnh viễn' : 'xóa'} {itemType} <b>{itemName}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? 'Đang xử lý...' : (permanent ? 'Xóa vĩnh viễn' : 'Xóa')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;