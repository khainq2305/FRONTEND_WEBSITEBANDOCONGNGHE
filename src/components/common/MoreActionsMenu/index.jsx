import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';

const MoreActionsMenu = ({ onView, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {onView && <MenuItem onClick={() => { onView(); handleClose(); }}>Xem</MenuItem>}
        {onEdit && <MenuItem onClick={() => { onEdit(); handleClose(); }}>Sửa</MenuItem>}
        {onDelete && <MenuItem onClick={() => { onDelete(); handleClose(); }}>Xoá</MenuItem>}
      </Menu>
    </>
  );
};

export default MoreActionsMenu;
