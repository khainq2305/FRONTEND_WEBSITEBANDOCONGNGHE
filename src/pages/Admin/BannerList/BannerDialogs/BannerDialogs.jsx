// src/pages/Admin/BannerList/BannerDialogs.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const BannerDialogs = ({
  // Thêm
  openAddDialog,
  setOpenAddDialog,
  newBannerName,
  setNewBannerName,
  newBannerImage,
  setNewBannerImage,
  newBannerStatus,
  setNewBannerStatus,
  onAdd,

  // Sửa
  openEditDialog,
  setOpenEditDialog,
  editName,
  setEditName,
  editImage,
  setEditImage,
  editStatus,
  setEditStatus,
  onEditSave,

  // Xoá
  openDeleteDialog,
  setOpenDeleteDialog,
  bannerToDelete,
  onDeleteConfirm
}) => {
  return (
    <>
      {/* Add Dialog */}
  

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa banner <strong>{bannerToDelete?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={onDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BannerDialogs;
