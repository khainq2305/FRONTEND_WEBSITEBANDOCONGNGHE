
import pages from './page';
import { inheritAllowedRoles } from '@/utils/inheritedRoles'

const menuItems = {
  items: inheritAllowedRoles([
    ...pages,
    // ...thêm các nhóm khác nếu có
  ])
};

export default menuItems;