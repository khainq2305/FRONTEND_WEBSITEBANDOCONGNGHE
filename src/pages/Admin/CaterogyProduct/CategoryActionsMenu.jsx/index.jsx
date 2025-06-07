import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useState } from 'react';

const CategoryActionsMenu = ({
  onEdit,
  onDelete,
  onRestore,
  onRestoreAll,
  onDeleteAll,
  onForceDelete,
  isTrashed
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAction = (action) => {
    handleClose();
    action && action();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {isTrashed ? (
          <>
            {onRestore && (
              <MenuItem onClick={() => handleAction(onRestore)}>
                <RestoreIcon fontSize="small" style={{ marginRight: 8 }} />
                Khôi phục
              </MenuItem>
            )}
            {onRestoreAll && (
              <MenuItem onClick={() => handleAction(onRestoreAll)}>
                <RestoreIcon fontSize="small" style={{ marginRight: 8 }} />
                Khôi phục tất cả
              </MenuItem>
            )}
            {onForceDelete && (
              <MenuItem onClick={() => handleAction(onForceDelete)}>
                <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                Xoá vĩnh viễn
              </MenuItem>
            )}
            {onDeleteAll && (
              <MenuItem onClick={() => handleAction(onDeleteAll)}>
                <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                Xoá tất cả
              </MenuItem>
            )}
          </>
        ) : (
          <>
            {onEdit && (
              <MenuItem onClick={() => handleAction(onEdit)}>
                <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                Chỉnh sửa
              </MenuItem>
            )}
            {onDelete && (
              <MenuItem onClick={() => handleAction(onDelete)}>
                <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                Chuyển vào thùng rác
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default CategoryActionsMenu;
