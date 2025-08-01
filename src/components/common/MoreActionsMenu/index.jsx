import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { usePermission } from '@/hooks/usePermission';

const MoreActionsMenu = ({ onView, onEdit, onDelete, subject = 'Product' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Kiểm tra quyền
  const canView = usePermission('read', subject);
  const canEdit = usePermission('update', subject);
  const canDelete = usePermission('delete', subject);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {onView && canView && (
          <MenuItem onClick={() => { onView(); handleClose(); }}>
            Chi tiết
          </MenuItem>
        )}
        {onEdit && canEdit && (
          <MenuItem onClick={() => { onEdit(); handleClose(); }}>
            Sửa
          </MenuItem>
        )}
        {onDelete && canDelete && (
          <MenuItem onClick={() => { onDelete(); handleClose(); }}>
            Xoá
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default MoreActionsMenu;
