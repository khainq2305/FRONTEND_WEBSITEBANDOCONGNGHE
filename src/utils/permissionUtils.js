export const markDisabledGroups = (pages, userPermissions) => {
  return pages.map(group => {
    const hasPermission =
      !group.permission || userPermissions.includes(group.permission);

    return {
      ...group,
      disabled: !hasPermission
    };
  });
};
