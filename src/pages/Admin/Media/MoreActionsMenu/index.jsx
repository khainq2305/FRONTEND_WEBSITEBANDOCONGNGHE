// components/MoreActionsMenu.jsx
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';

const MoreActionsMenu = ({ actions }) => {
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
        {actions.map((action, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              action.onClick();
              handleClose();
            }}
            sx={{ color: action.color === 'error' ? 'error.main' : 'inherit' }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreActionsMenu;
