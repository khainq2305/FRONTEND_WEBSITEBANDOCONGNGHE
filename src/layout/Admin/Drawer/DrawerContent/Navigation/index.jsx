// File: Navigation.js (CẦN SỬA LẠI NHƯ SAU)

import NavItem from './NavItem';
import NavGroup from './NavGroup';
import NavCollapse from './NavCollapse'; 
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import menuItem from '../../../Aside'; 
export default function Navigation() {
const navGroups = (menuItem.items || []).map((item) => {
  if (!item || !item.type) {
    return (
      <Typography key={Math.random()} variant="h6" color="error" align="center">
        ⚠️ Invalid nav item
      </Typography>
    );
  }

  if (item.type === 'group') {
    return <NavGroup key={item.id} item={item} />;
  } else if (item.type === 'item') {
    return <NavItem key={item.id} item={item} level={1} />;
  } else if (item.type === 'collapse') {
    return <NavCollapse key={item.id} menu={item} level={1} />;
  } else {
    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        ❌ Unknown item type: {item.type}
      </Typography>
    );
  }
});


  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}