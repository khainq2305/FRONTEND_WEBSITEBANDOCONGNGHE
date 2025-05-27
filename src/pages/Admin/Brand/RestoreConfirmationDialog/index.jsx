import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { brandService } from '@/services/admin/brandService';

const RestoreConfirmationDialog = ({
  open,
  onClose,
  brandId,
  itemName = '',
  itemType = 'mục',
  onSuccess = () => {}
}) => {
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    try {
      setLoading(true);
      await brandService.restore([brandId]);
      toast.success(`Đã khôi phục ${itemType} "${itemName}"`);
      onClose();
      onSuccess();
    } catch (err) {
      console.error('Lỗi khôi phục:', err);
      toast.error(err?.response?.data?.message || 'Khôi phục thất bại');
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
          {loading ? 'Đang khôi phục...' : 'Khôi phục'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmationDialog;
