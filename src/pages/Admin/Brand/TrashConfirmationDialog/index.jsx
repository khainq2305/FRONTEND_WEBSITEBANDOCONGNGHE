import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { brandService } from '@/services/admin/brandService';

const TrashConfirmationDialog = ({
  open,
  onClose,
  brandId,
  itemName,
  itemType = 'mục',
  onSuccess = () => {}
}) => {
  const [loading, setLoading] = useState(false);

  const handleTrash = async () => {
    if (!brandId) return;
    try {
      setLoading(true);
      await brandService.softDelete([brandId]);
      toast.success(`Đã chuyển ${itemType} "${itemName}" vào thùng rác`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Lỗi soft-delete:', err);
      toast.error(err?.response?.data?.message || 'Chuyển vào thùng rác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="trash-confirm-dialog-title"
      aria-describedby="trash-confirm-dialog-description"
    >
      <DialogTitle id="trash-confirm-dialog-title">
        Xác nhận chuyển vào thùng rác
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="trash-confirm-dialog-description">
          Bạn có chắc chắn muốn chuyển {itemType}{' '}
          <strong>{itemName}</strong> vào thùng rác không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleTrash}
          color="warning"
          variant="contained"
          disabled={loading}
          autoFocus
        >
          {loading ? 'Đang xử lý...' : 'Chuyển vào thùng rác'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrashConfirmationDialog;