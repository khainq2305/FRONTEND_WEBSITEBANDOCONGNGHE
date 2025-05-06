import NavItem from './NavItem';
import NavGroup from './NavGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import menuItem from '../../../Aside';

export default function Navigation() {
  const navGroups = menuItem.items.map((item) => {
    if (item.type === 'group') {
      return <NavGroup key={item.id} item={item} />;
    } else if (item.type === 'item') {
      return <NavItem key={item.id} item={item} level={1} />;
    } else {
      return (
        <Typography key={item.id} variant="h6" color="error" align="center">
          Fix - Navigation Group
        </Typography>
      );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
