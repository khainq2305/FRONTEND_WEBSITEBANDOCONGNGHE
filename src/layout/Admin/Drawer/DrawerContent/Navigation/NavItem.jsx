// src/components/Admin/Navigation/NavItem.js

import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import IconButton from 'components/Admin/@extended/IconButton';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

export default function NavItem({ item, level, isParents = false, setSelectedID, disabled }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { pathname } = useLocation();

  const itemTarget = item.target ? '_blank' : '_self';
   if (!item.subject && !item.action && item.allow) {
    item.subject = item.allow;
    item.action = 'read';
  }
  const isSelected = !!matchPath({ path: item?.link || item.url, end: false }, pathname);

  const itemHandler = () => {
    if (downLG) handlerDrawerOpen(false);
    if (isParents && setSelectedID) setSelectedID(item.id);
  };

  const Icon = item.icon;
  const itemIcon = Icon ? (
    <Icon
      style={{
        fontSize: drawerOpen ? '1rem' : '1.25rem',
        ...(isParents && { fontSize: 20, stroke: '1.5' })
      }}
    />
  ) : null;

  const basePadding = 21;
  const indentationStep = 28;

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <Box sx={{ position: 'relative' }}>
      <ListItemButton
          disabled={disabled}
  aria-disabled={disabled}
        component={Link}
        to={item.url}
        target={itemTarget}
        selected={isSelected}
        onClick={itemHandler}
        sx={(theme) => ({
          zIndex: 1201,
          pl: drawerOpen ? `${basePadding + (level - 1) * indentationStep}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && {
            '&:hover': {
              bgcolor: 'primary.lighter',
              ...theme.applyStyles?.('dark', { bgcolor: 'divider' })
            },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              ...theme.applyStyles?.('dark', { bgcolor: 'divider' }),
              borderRight: '2px solid',
              borderColor: 'primary.main',
              color: iconSelectedColor,
              '&:hover': {
                color: iconSelectedColor,
                bgcolor: 'primary.lighter',
                ...theme.applyStyles?.('dark', { bgcolor: 'divider' })
              }
            }
          }),
          ...(!drawerOpen && {
            '&:hover': { bgcolor: 'transparent' },
            '&.Mui-selected': {
              '&:hover': { bgcolor: 'transparent' },
              bgcolor: 'transparent'
            }
          })
        })}
      >
        {itemIcon && (
          <ListItemIcon
            sx={(theme) => ({
              minWidth: 28,
              color: isSelected ? iconSelectedColor : textColor,
              ...(drawerOpen && {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }),
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'secondary.lighter',
                  ...theme.applyStyles?.('dark', { bgcolor: 'secondary.light' })
                }
              }),
              ...(!drawerOpen &&
                isSelected && {
                  bgcolor: 'primary.lighter',
                  ...theme.applyStyles?.('dark', { bgcolor: 'primary.900' }),
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                    ...theme.applyStyles?.('dark', { bgcolor: 'primary.darker' })
                  }
                })
            })}
          >
            {itemIcon}
          </ListItemIcon>
        )}

        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography
                variant="h6"
                sx={{ color: isSelected ? iconSelectedColor : textColor }}
              >
                {item.title}
              </Typography>
            }
          />
        )}

        {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
          <Chip
            // thêm các props chip nếu có
          />
        )}
      </ListItemButton>
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.func,
  disabled: PropTypes.bool
};
