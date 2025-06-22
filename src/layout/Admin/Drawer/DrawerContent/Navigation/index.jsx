import NavGroup from './NavGroup';
import NavCollapse from './NavCollapse';
import NavItem from './NavItem';
import Box from '@mui/material/Box';

import menuItem from '../../../Aside';
import useAuthStore from '@/stores/AuthStore';
import { buildVisibleMenu } from '@/utils/buildVisibleMenu';

export default function Navigation() {
  // Lấy cả ability và trạng thái loading từ store
  const ability = useAuthStore((state) => state.ability);
  const loading = useAuthStore((state) => state.loading);
  console.log('nav ability', ability)
  // ✅ BƯỚC BẢO VỆ QUAN TRỌNG NHẤT
  // Nếu store đang loading hoặc chưa có ability, không render gì cả.
  // Điều này đảm bảo buildVisibleMenu không bao giờ chạy với dữ liệu rỗng.
  if (loading || !ability) {
    // Bạn có thể trả về một component spinner quay quay ở đây nếu muốn
    return null;
  }

  // --- Chỉ khi loading=false VÀ ability đã tồn tại, code dưới đây mới được chạy ---

  const visibleMenuItems = buildVisibleMenu(menuItem.items, ability);

  const navGroups = visibleMenuItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={1} />;
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={1} />;
      default:
        return null;
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}