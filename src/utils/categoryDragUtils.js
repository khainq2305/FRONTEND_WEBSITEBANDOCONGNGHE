// utils/categoryDragUtils.js

/**
 * Lấy toàn bộ cây danh mục từ 1 cha (gồm cha + con + cháu...)
 */
export const getAllChildrenWithParent = (parent, rows) => {
  const result = [parent];

  const findChildren = (item) => {
    const children = rows.filter((row) => row.parentId === item.id);
    for (const child of children) {
      result.push(child);
      findChildren(child);
    }
  };

  findChildren(parent);
  return result;
};

/**
 * Xử lý kéo thả danh mục
 * @param {object} result - Thông tin kết quả drag
 * @param {array} rows - Danh sách danh mục hiện tại
 * @param {function} setCategories - Setter cập nhật danh sách
 * @param {object} toast - Toast instance (nếu có)
 */
export const handleCategoryDragEnd = (result, rows, setCategories, toast) => {
  if (!result.destination) return;

  const newRows = [...rows];
  const movedItem = newRows[result.source.index];
  const destinationIndex = result.destination.index;

  // Không cho kéo danh mục con ra khỏi vùng cha
  if (movedItem.parentId !== null) {
    const parentIndex = newRows.findIndex((r) => r.id === movedItem.parentId);
    if (destinationIndex <= parentIndex) {
      toast.warning("Không thể kéo danh mục con ra khỏi vị trí của cha.");
      return;
    }
  }

  const movedItems = getAllChildrenWithParent(movedItem, newRows);
  const remainingRows = newRows.filter(
    (row) => !movedItems.some((m) => m.id === row.id)
  );

  let destIndex = result.destination.index;
  if (destinationIndex > result.source.index) {
    destIndex -= movedItems.length;
  }

  remainingRows.splice(destIndex, 0, ...movedItems);
  setCategories(remainingRows);
};