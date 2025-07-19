import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Checkbox
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
  const [confirmChecked, setConfirmChecked] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const ids = Array.isArray(brandId) ? brandId : [brandId];

    try {
      if (permanent) {
        await brandService.forceDelete(ids);
        toast.success(`Đã xoá vĩnh viễn ${itemType}: "${itemName}"`);
      } else {
        await brandService.softDelete(ids);
        toast.success(`Đã chuyển ${itemType} "${itemName}" vào thùng rác`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Lỗi xoá:', err);

      if (
        err?.response?.data?.error?.includes('foreign key') ||
        err?.response?.data?.message?.includes('foreign key')
      ) {
        toast.error(
          `Không thể xoá ${itemType} vì đang được sử dụng trong dữ liệu khác`
        );
      } else {
        toast.error(permanent ? 'Xoá vĩnh viễn thất bại' : 'Xoá thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs">
      <DialogTitle textAlign="center" color="error">
        {permanent ? 'Xác nhận xoá vĩnh viễn' : 'Xác nhận xoá'}
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center">
          <WarningAmberRoundedIcon color="error" sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="body1">
            {permanent
              ? 'Bạn chắc chắn muốn xoá vĩnh viễn các mục sau?'
              : 'Bạn có chắc muốn xoá các mục sau?'}
          </Typography>
          <Typography fontWeight="bold" color="error" mt={1}>
            {itemName}
          </Typography>

          {permanent && (
            <Box
              mt={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Checkbox
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                disabled={loading}
              />
              <Typography variant="body2">
                Tôi xác nhận muốn xoá vĩnh viễn
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Huỷ
        </Button>
        <Button
          onClick={handleDelete}
          color={permanent ? 'error' : 'warning'}
          variant="contained"
          disabled={loading || (permanent && !confirmChecked)}
          startIcon={loading && <CircularProgress size={20} />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
