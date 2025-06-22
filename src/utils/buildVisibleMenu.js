/**
 * Hàm đệ quy để xây dựng cây menu có thêm log chi tiết để debug.
 * @param {Array} menuItems - Mảng các mục menu gốc.
 * @param {Object} ability - Đối tượng ability từ CASL.
 * @param {number} level - Cấp độ đệ quy, dùng để thụt lề log cho dễ đọc.
 * @returns {Array} - Mảng các mục menu đã được lọc.
 */
export const buildVisibleMenu = (menuItems, ability, level = 0) => {
  const indent = '  '.repeat(level); // Tạo khoảng thụt lề cho log
  // console.log('ability la:',ability)
  // console.log(`${indent}%c▶️ Bắt đầu xử lý menu cấp ${level}`, 'color: #9E9E9E;', `(có ${menuItems.length} mục)`);

  if (!ability) {
    // console.log(`${indent}%c❌ LỖI: Không tìm thấy đối tượng 'ability'. Dừng lại.`, 'color: red; font-weight: bold;');
    return [];
  }

  const visibleItems = menuItems.reduce((accumulator, item) => {
    // console.log(`${indent}  - Đang xử lý mục: %c${item.id}`, 'font-weight: bold; color: #1E88E5;');

    // --- Trường hợp 1: Mục menu là một item đơn lẻ ---
    if (item.type === 'item') {
      const requiredPermission = `[${item.action}, ${item.subject}]`;
      const canAccess = ability.can(item.action, item.subject);

      if (canAccess) {
        // console.log(`${indent}    %c✅ CHO PHÉP%c - Quyền ${requiredPermission} hợp lệ.`, 'color: green; font-weight: bold;', 'color: initial;');
      accumulator.push(item);
       }
      // // else {
      //   console.log(`${indent}    %c❌ TỪ CHỐI%c - Yêu cầu quyền ${requiredPermission} nhưng không có.`, 'color: red; font-weight: bold;', 'color: initial;');
      // }
    }

    // --- Trường hợp 2: Mục menu là một nhóm (collapse/group) ---
    if ((item.type === 'collapse' || item.type === 'group') && item.children) {
      // console.log(`${indent}  %c↪️ Mục là nhóm, bắt đầu xử lý các mục con...`, 'color: #8E44AD;');
      
      // Đệ quy để xử lý các mục con
      const visibleChildren = buildVisibleMenu(item.children, ability, level + 1);

      //chỉ giữ lại nhóm cha nếu nó còn ít nhất 1 con được hiển thị
      if (visibleChildren.length > 0) {
        // console.log(`${indent}  %c👍 GIỮ LẠI NHÓM%c vì có ${visibleChildren.length} mục con hợp lệ.`, 'color: blue; font-weight: bold;', 'color: initial;');
        accumulator.push({ ...item, children: visibleChildren });
      } 
      // else {
      //   console.log(`${indent}  %c🗑️ LOẠI BỎ NHÓM%c vì không có mục con nào hợp lệ.`, 'color: #F39C12; font-weight: bold;', 'color: initial;');
      // }
    }

    return accumulator;
  }, []);

  // console.log(`${indent}%c◀️ Kết thúc xử lý menu cấp ${level}`, 'color: #9E9E9E;', `=> Trả về ${visibleItems.length} mục hợp lệ.`);
  return visibleItems;
};