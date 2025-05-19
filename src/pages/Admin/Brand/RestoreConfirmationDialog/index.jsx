import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const RestoreConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemName = '',
  itemType = 'mục'
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Khôi phục {itemType}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn khôi phục {itemType} <strong>{itemName}</strong> không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Khôi phục
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmationDialog;
