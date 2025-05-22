import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress, Box
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { brandService } from '@/services/admin/brandService';

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
        await brandService.forceDelete([brandId]);
        toast.success(`Đã xoá vĩnh viễn ${itemType} "${itemName}"`);
      } else {
        await brandService.softDelete([brandId]);
        toast.success(`Đã xoá ${itemType} "${itemName}"`);
      }
      onClose();
      onSuccess();
    } catch (err) {
      console.error('Lỗi xoá:', err);
      toast.error(permanent ? 'Xoá vĩnh viễn thất bại' : 'Xoá thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs">
      <DialogTitle textAlign="center" color="error">
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center">
          <WarningAmberRoundedIcon color="error" sx={{ fontSize: 50, mb: 1 }} />
          <Typography>
            {permanent
              ? 'Bạn chắc chắn muốn xóa vĩnh viễn?'
              : 'Bạn có chắc muốn xóa mục này?'}
          </Typography>
          <Typography fontWeight="bold" color="error" mt={1}>
            {itemName}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          color={permanent ? 'error' : 'warning'}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Đang xử lý' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;