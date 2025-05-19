import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const DeleteConfirmDialog = ({ open, onClose, onConfirm, coupon }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
    <DialogContent>
      <Typography>Bạn có chắc muốn chuyển mã "{coupon?.code}" vào thùng rác không?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Hủy</Button>
      <Button variant="contained" color="error" onClick={onConfirm}>Xóa</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmDialog;
