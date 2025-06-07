import { Menu, MenuItem } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const MoreActionsMenu = ({ anchorEl, selectedItem, onClose, onReply }) => {
  const handleReplyDetail = () => {
    if (onReply) onReply(selectedItem);
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={handleReplyDetail}>
        <ExpandMore fontSize="small" sx={{ mr: 1 }} />
        Trả lời      
        </MenuItem>
    </Menu>
  );
};

export default MoreActionsMenu;
