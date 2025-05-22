import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import Toastify from 'components/common/Toastify';

const RestoreConfirmationDialog = ({
  open,
  onClose,
  brandId,
  itemName = '',
  itemType = 'mục',
  onSuccess = () => { }
}) => {
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:5000/admin/brands/${brandId}/restore`);
      Toastify.success(`✅ Đã khôi phục ${itemType} "${itemName}"`);
      onClose();
      onSuccess();
    } catch (err) {
      Toastify.error('❌ Khôi phục thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Khôi phục {itemType}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn khôi phục {itemType} <strong>{itemName}</strong> không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleRestore} variant="contained" color="primary" disabled={loading}>
          {loading ? '...Đang khôi phục' : 'Khôi phục'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmationDialog;