// NavCollapse.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import NavItem from './NavItem';
import useAuthStore from '@/stores/AuthStore'; // ✅ Lấy ability từ Zustand
import { useGetMenuMaster } from 'api/menu';

export default function NavCollapse({ menu, level, }) {
  const [open, setOpen] = useState(false);
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const ability = useAuthStore((state) => state.ability);

  // ✅ Tự gán nếu có allow
  if (!menu.subject && !menu.action && menu.allow) {
    menu.subject = menu.allow;
    menu.action = 'read';
  }


  const handleClick = () => {
    setOpen(!open);
  };

  const Icon = menu.icon;
  const menuIcon = Icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : null;

  const navChildren = menu.children
  ?.map((childItem) => {
    if (!childItem.subject && !childItem.action && childItem.allow) {
      childItem.subject = childItem.allow;
      childItem.action = 'read';
    }

   // ✅ Không render nếu không có quyền

  const navChildren = menu.children?.map((childItem) => {
    switch (childItem.type) {
      case 'item':
        return <NavItem key={childItem.id} item={childItem} level={level + 1} />;
      case 'collapse':
        return <NavCollapse key={childItem.id} menu={childItem} level={level + 1} />;
      default:
        return (
          <Typography key={childItem.id} variant="h6" color="error" align="center">
            Lỗi Kiểu Mục Con
          </Typography>
        );
    }
  });

  // Define base padding and indentation step
  const basePadding = 21; // Assuming NavItem uses 16px for level 1. Adjust if different.
  const indentationStep = 28; // Your existing step

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={(theme) => ({
          // MODIFIED LINE: Adjusted padding-left calculation
          pl: drawerOpen ? `${basePadding + (level - 1) * indentationStep}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          ...(drawerOpen && {
            '&:hover': { bgcolor: 'primary.lighter', ...(theme.applyStyles ? theme.applyStyles('dark', { bgcolor: 'divider' }) : {}) },
          }),
          ...(!drawerOpen && {
            '&:hover': { bgcolor: 'transparent' },
          })
        })}
      >
        {menuIcon && (
          <ListItemIcon
            sx={{
              minWidth: drawerOpen ? 28 : 'auto',
              width: drawerOpen ? 'auto' : 36,
              height: drawerOpen ? 'auto' : 36,
              borderRadius: drawerOpen ? 0 : 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {menuIcon}
          </ListItemIcon>
        )}
        {drawerOpen && (
          <ListItemText
            primary={<Typography variant="h6">{menu.title}</Typography>}
            sx={{ my: 0 }}
          />
        )}

        {drawerOpen && (
          <RightOutlined
            style={{
              fontSize: '0.8rem',
              marginLeft: 'auto',
              transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              color: 'rgba(0, 0, 0, 0.54)'
            }}
          />
        )}
      </ListItemButton>
      {drawerOpen && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ position: 'relative', zIndex: 1 }}>
            {navChildren}
          </List>
        </Collapse>
      )}
    </>
  );
},

NavCollapse.propTypes = {
  menu: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
})}