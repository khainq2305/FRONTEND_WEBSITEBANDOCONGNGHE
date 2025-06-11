// File: Navigation.js (Đã sửa)

import NavItem from './NavItem';
import NavGroup from './NavGroup';
import NavCollapse from './NavCollapse'; 
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import menuItem from '../../../Aside'; 
import { isMenuDisabled } from '@/utils/isMenuDisabled';
import useAuthStore from '@/stores/AuthStore'; // ✅ Lấy ability từ zustand

export default function Navigation() {
  const ability = useAuthStore((state) => state.ability);

const navGroups = menuItem.items.map((item) => {
  const disabled = isMenuDisabled(item, ability);

  switch (item.type) {
    case 'group':
      return <NavGroup key={item.id} item={item} disabled={disabled} />;
    case 'item':
      return <NavItem key={item.id} item={item} level={1} disabled={disabled} />;
    case 'collapse':
      return <NavCollapse key={item.id} menu={item} level={1} disabled={disabled} />;
  }
});


  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
