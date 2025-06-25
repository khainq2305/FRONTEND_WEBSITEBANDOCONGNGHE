/**
 * Hàm đệ quy để lọc menu theo quyền và giữ nguyên cấu trúc nhóm.
 * @param {Array} menuItems - Mảng các mục menu gốc.
 * @param {Object} ability - Đối tượng ability từ CASL.
 * @param {number} level - Dùng để log cấp độ.
 * @returns {Array} - Mảng menu đã lọc theo quyền.
 */
export const buildVisibleMenu = (menuItems, ability, level = 0) => {
  const indent = '  '.repeat(level);
  // console.log(`📦 menuItems cấp ${level}:`, JSON.stringify(menuItems, null, 2));

  if (!ability) {
    console.warn(`${indent}❌ Không có ability → Dừng xử lý`);
    return [];
  }

  const visibleItems = menuItems.reduce((accumulator, item) => {
    // Trường hợp 1: item đơn
    if (item.type === 'item') {
      const canAccess = item.action && item.subject
        ? ability.can(item.action, item.subject)
        : true;

      if (canAccess) {
        accumulator.push(item);
      }
    }

    // Trường hợp 2: nhóm (collapse/group)
    if (
      (item.type === 'collapse' || item.type === 'group') &&
      Array.isArray(item.children) &&
      item.children !== menuItems &&               // Ngăn lặp chính menu gốc
      !item.children.includes(item)                // Ngăn nhóm chứa chính nó
    ) {
      const visibleChildren = buildVisibleMenu(item.children, ability, level + 1);

      if (visibleChildren.length > 0) {
        accumulator.push({
          ...item,
          children: visibleChildren
        });
      }
    }

    return accumulator;
  }, []);

  return visibleItems;
};
