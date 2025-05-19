// src/components/admin/DeleteConfirmationDialog.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from '@mui/material';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemName = '',
  itemType = 'mục',
  permanent = false
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{permanent ? 'Xác nhận xóa vĩnh viễn' : 'Xác nhận xóa'}</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn {permanent ? 'xóa vĩnh viễn' : 'xóa'} {itemType} <b>{itemName}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          {permanent ? 'Xóa vĩnh viễn' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
