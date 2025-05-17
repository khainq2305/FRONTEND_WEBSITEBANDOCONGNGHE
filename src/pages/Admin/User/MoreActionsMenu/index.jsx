import { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MoreActionsMenu = ({ currentStatus, onChangeStatus, onResetPassword }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleAction = (callback) => {
    handleClose();
    callback && callback();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleAction(() => onChangeStatus(currentStatus === 'active' ? 'inactive' : 'active'))}>
          {currentStatus === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
        </MenuItem>
        <MenuItem onClick={() => handleAction(onResetPassword)}>
          Cấp lại mật khẩu
        </MenuItem>
      </Menu>
    </>
  );
};

export default MoreActionsMenu;
