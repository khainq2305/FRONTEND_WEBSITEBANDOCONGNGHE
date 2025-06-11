// utils/inheritRoles.js

export function inheritAllowedRoles(menuItems, parentRoles = null) {
  return menuItems.map(item => {
    const roles = item.allowedRoles ?? parentRoles;

    const newItem = {
      ...item,
      allowedRoles: roles
    };

    if (item.children) {
      newItem.children = inheritAllowedRoles(item.children, roles);
    }

    return newItem;
  });
}
