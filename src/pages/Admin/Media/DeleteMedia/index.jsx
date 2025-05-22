// src/components/admin/DeleteMediaDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const DeleteMediaDialog = ({ open, onClose, onConfirm, mediaTitle }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xoá <strong>{mediaTitle}</strong> không? Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMediaDialog;
