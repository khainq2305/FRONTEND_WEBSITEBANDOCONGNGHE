import { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';

const MoreActionsMenu = ({ user, onChangeStatus, onResetPassword, onViewDetail }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const confirmAction = async (title, callback) => {
    handleClose();
    const res = await Swal.fire({
      title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    });
    if (res.isConfirmed) callback();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => {
          handleClose();
          onViewDetail(user);
        }}>
          Xem chi tiết
        </MenuItem>
        {user.status === 1 ? (
          <MenuItem onClick={() =>
            confirmAction(`Ngưng hoạt động tài khoản "${user.fullName}"?`, () =>
              onChangeStatus('inactive')
            )
          }>
            Ngưng hoạt động
          </MenuItem>
        ) : (
          <MenuItem onClick={() =>
            confirmAction(`Kích hoạt lại tài khoản "${user.fullName}"?`, () =>
              onChangeStatus('active')
            )
          }>
            Kích hoạt lại
          </MenuItem>
        )}
        <MenuItem onClick={() =>
          confirmAction(`Cấp lại mật khẩu cho "${user.fullName}"?`, () =>
            onResetPassword(user)
          )
        }>
          Cấp lại mật khẩu
        </MenuItem>
      </Menu>
    </>
  );
};

export default MoreActionsMenu;
