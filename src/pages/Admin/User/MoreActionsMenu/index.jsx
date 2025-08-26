import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

const MoreActionsMenu = ({ user, isDeleted = false, onChangeStatus, onResetPassword, onViewDetail, onForceDelete, onView }) => {
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
        {isDeleted ? (
          <MenuItem onClick={() => handleAction(onForceDelete)}>
            <DeleteForeverIcon fontSize="small" sx={{ mr: 1 }} />
            Xoá vĩnh viễn
          </MenuItem>
        ) : (
          <>
          <MenuItem onClick={() => handleAction(() => onView(user))}>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              Bổ nhiệm
            </MenuItem>
            <MenuItem onClick={() => handleAction(() => onViewDetail(user))}>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              Xem chi tiết
            </MenuItem>
            <MenuItem onClick={() => handleAction(() => onResetPassword(user))}>
              <RestartAltIcon fontSize="small" sx={{ mr: 1 }} />
              Cấp lại mật khẩu
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default MoreActionsMenu;
