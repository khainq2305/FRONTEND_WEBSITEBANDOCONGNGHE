import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import Toastify from 'components/common/Toastify';

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
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/admin/brands/${brandId}`);
      Toastify.success(`✅ Đã chuyển ${itemType} "${itemName}" vào thùng rác`);

      // Gọi thành công xong thì reload trước, đóng sau
      onSuccess();     // 👉 Gọi fetchBrands + reset trang
      onClose();       // 👉 Đóng dialog sau khi cập nhật UI xong
    } catch (err) {
      Toastify.error('❌ Chuyển vào thùng rác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận chuyển vào thùng rác</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn chuyển {itemType} <strong>{itemName}</strong> vào thùng rác không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleTrash} color="warning" variant="contained" disabled={loading}>
          {loading ? '...Đang xử lý' : 'Chuyển vào thùng rác'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrashConfirmationDialog;
