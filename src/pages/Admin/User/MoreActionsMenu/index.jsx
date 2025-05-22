import { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const MoreActionsMenu = ({ user, currentStatus, onChangeStatus, onResetPassword, onCancelBlock }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const confirmAction = async (title, callback) => {
    handleClose();
    const result = await Swal.fire({
      title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    if (result.isConfirmed) {
      callback();
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {currentStatus === 'active' && (
          <>
            {!user.scheduledBlockAt && (
              <MenuItem onClick={() =>
                confirmAction(`Lên lịch khóa tài khoản "${user.fullName}"?`, () =>
                  onChangeStatus('inactive')
                )
              }>
                Lên lịch khóa
              </MenuItem>
            )}
            <MenuItem onClick={() =>
              confirmAction(`Khóa vĩnh viễn tài khoản "${user.fullName}"?`, () =>
                onChangeStatus('permanent')
              )
            }>
              Khóa vĩnh viễn
            </MenuItem>
          </>
        )}

        {currentStatus === 'inactive' && (
          <MenuItem onClick={() =>
            confirmAction(`Mở khóa tài khoản "${user.fullName}"?`, () =>
              onChangeStatus('active')
            )
          }>
            Mở khóa
          </MenuItem>
        )}

        <MenuItem onClick={() =>
          confirmAction(`Cấp lại mật khẩu cho "${user.fullName}"?`, () =>
            onResetPassword(user)
          )
        }>
          Cấp lại mật khẩu
        </MenuItem>

        {user.scheduledBlockAt && (
          <MenuItem onClick={() =>
            confirmAction(`Huỷ lịch khóa của "${user.fullName}"?`, () =>
              onCancelBlock(user)
            )
          }>
            Huỷ lịch khóa
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default MoreActionsMenu;
