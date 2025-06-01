import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmDelete } from 'components/common/ConfirmDeleteDialog';
import { categoryService } from 'services/admin/categoryService';

const CategoryActionsMenu = ({ item, isTrashed, fetchData }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleAction = async (action) => {
    handleClose();
    if (!action) return;

    switch (action) {
      case 'edit':
        navigate(`/admin/categories/edit/${item.id}`);
        break;

      case 'delete':
        if (!(await confirmDelete('chuyển vào thùng rác', item.name))) return;
        if (isTrashed) await categoryService.delete(item.id);
        else await categoryService.softDeleteMany([item.id]);
        toast.success('Đã chuyển danh mục này vào thùng rác');
        fetchData();
        break;

      case 'restore':
        await categoryService.restore(item.id);
        toast.success('Đã khôi phục danh mục');
        fetchData();
        break;

      default:
        break;
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {isTrashed ? (
          <>
            <MenuItem onClick={() => handleAction('restore')}>
              <RestoreIcon fontSize="small" style={{ marginRight: 8 }} />
              Khôi phục
            </MenuItem>
            <MenuItem onClick={() => handleAction('delete')}>
              <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
              Xoá vĩnh viễn
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleAction('edit')}>
              <EditIcon fontSize="small" style={{ marginRight: 8 }} />
              Chỉnh sửa
            </MenuItem>
            <MenuItem onClick={() => handleAction('delete')}>
              <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
              Chuyển vào thùng rác
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default CategoryActionsMenu;
