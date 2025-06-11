// export const isMenuDisabled = (menu, userRoles = [], parentAllowedRoles = null) => {
//   // Lấy roles để check: ưu tiên menu.allowedRoles, không có thì lấy từ cha
//   const rolesToCheck = menu.allowedRoles ?? parentAllowedRoles;

//   // Nếu không có roles (cha cũng không có) → disable menu
//   if (!rolesToCheck || rolesToCheck.length === 0) return true;

//   // Nếu userRoles không có role nào trong rolesToCheck → disable menu
//   return !rolesToCheck.some(role => userRoles.includes(role));
// };

// src/utils/isMenuDisabled.js

import useAuthStore from '@/stores/AuthStore';
// import { MENU_PERMISSION_MAP } from '@/constants/menu-permissions';



export function isMenuDisabled(menuItem, parentAllow = null) {
  const ability = useAuthStore.getState().ability;

  // Ưu tiên action/subject nếu có
  const action = menuItem.action || 'read';
  const subject = menuItem.subject || parentAllow;

  if (!subject) return false; // Không có subject thì cho phép

  const result = ability?.can(action, subject);
  console.log(`[CHECK] ${menuItem.id} => ${action} ${subject} --> ${result ? '✅' : '❌'}`);
  return !result;
}






