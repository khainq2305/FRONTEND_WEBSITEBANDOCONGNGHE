import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const DeleteAllDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xoá tất cả mục đã chọn không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Huỷ</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Xoá</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAllDialog;
