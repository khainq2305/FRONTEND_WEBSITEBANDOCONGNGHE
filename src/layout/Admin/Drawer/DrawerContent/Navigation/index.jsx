import NavGroup from './NavGroup';
import NavCollapse from './NavCollapse';
import NavItem from './NavItem';
import Box from '@mui/material/Box';

import menuItem from '../../../Aside'; // Đây là nơi bạn định nghĩa menu items (pages)
import useAuthStore from '@/stores/AuthStore';
import { buildVisibleMenu } from '@/utils/buildVisibleMenu';
import Typography from '@mui/material/Typography'; // Thêm import Typography

export default function Navigation() {
  const ability = useAuthStore((state) => state.ability);
  const loading = useAuthStore((state) => state.loading);

  if (loading || !ability) {
    return null;
  }

  const visibleMenuItems = buildVisibleMenu(menuItem.items, ability); // menuItem.items là mảng pages của bạn

  const navGroupsOrItems = visibleMenuItems.map((item) => {
    switch (item.type) {
      case 'group':
        // Nếu item.type là 'group' (chứa title như "HOME", "UI COMPONENTS")
        return <NavGroup key={item.id} item={item} />;
      case 'collapse':
        // Nếu item.type là 'collapse' (như "Quản lý sản phẩm") và nó là cấp 1
        return <NavCollapse key={item.id} menu={item} level={1} />;
      case 'item':
        // Nếu item.type là 'item' (như "Thống kê") và nó là cấp 1
        return <NavItem key={item.id} item={item} level={1} />;
      default:
        // Xử lý các loại không xác định
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Unknown Root Menu Item Type
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroupsOrItems}</Box>;
}