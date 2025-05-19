// src/components/admin/TrashConfirmationDialog.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@mui/material';

const TrashConfirmationDialog = ({ open, onClose, onConfirm, itemName, itemType = 'mục' }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Xác nhận chuyển vào thùng rác</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Bạn có chắc chắn muốn chuyển {itemType} <strong>{itemName}</strong> vào thùng rác không?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Hủy</Button>
      <Button onClick={onConfirm} color="warning" variant="contained">
        Chuyển vào thùng rác
      </Button>
    </DialogActions>
  </Dialog>
);

export default TrashConfirmationDialog;
