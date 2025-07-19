export const stripHTML = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// sau này thêm các hàm khác cũng vào đây
export const buildCategoryTree = (list, parentId = null, level = 0) =>
  list
    .filter(item => (item.parentId ?? null) === parentId)
    .map(item => ({
      ...item,
      level,
      children: buildCategoryTree(list, item.id, level + 1),
    }));

export const flattenTree = (tree) => {
  let result = [];
  tree.forEach(node => {
    result.push(node);
    if (node.children?.length > 0) {
      result = result.concat(flattenTree(node.children));
    }
  });
  return result;
};
export const normalizeCategoryList = (rawList) => {
  const tree = buildCategoryTree(rawList);
  const flat = flattenTree(tree);

  const orphanNodes = rawList.filter(item => !flat.some(f => f.id === item.id));

  const finalList = [
    ...flat,
    ...orphanNodes.map(o => ({
      ...o,
      level: o.parentId ? 1 : 0,
    })),
  ];

  return finalList;
};