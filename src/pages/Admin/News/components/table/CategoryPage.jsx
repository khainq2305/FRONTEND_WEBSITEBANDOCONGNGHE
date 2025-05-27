import React, { createContext, useContext, useState, useEffect } from 'react';
import CategoryFilters from '@/pages/Admin/News/components/filter/CategoryFilters';
import CategoryTable from '@/pages/Admin/News/components/table/CategoryTable';
import { newsCategoryService } from '@/services/admin/newCategoryService';

const CategoryContex = createContext();
export const useCategory = () => useContext(CategoryContex);

const CategoryPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    action: ''
  });
  const [articles, setArticles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
  const [postCounts, setPostCounts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [catRes, statsRes] = await Promise.all([
          newsCategoryService.getAll(),
          newsCategoryService.postCount()
        ]);

        const raw = catRes.data.data;
        const stats = statsRes.data.data;

        const tree = buildCategoryTree(raw, null);
        const flat = flattenTree(tree);

        // Gộp số bài viết vào mỗi category
        const merged = flat.map(cat => {
          const found = stats.find(s => s.id === cat.id);
          return {
            ...cat,
            postCount: found?.postCount || 0
          };
        });

        setCategories(merged);
        setPostCounts(stats);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục hoặc thống kê:', error);
      }
    };

    fetchCategories();
  }, []);

  const buildCategoryTree = (list, parentId = null, level = 0) => {
    return list
      .filter(item => (item.parentId ?? null) === parentId)
      .map(item => ({
        ...item,
        level,
        children: buildCategoryTree(list, item.id, level + 1)
      }));
  };

  const flattenTree = (tree) => {
    let result = [];
    tree.forEach(node => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children));
      }
    });
    return result;
  };

  const handleSelectRow = (slug) => {
    setSelectedRows(prev =>
      prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredArticles.length
        ? []
        : filteredArticles.map(item => item.slug)
    );
  };

  const getActionOptions = () => {
    if (filters.status === 'trash') {
      return [
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'delete_forever', label: 'Xoá vĩnh viễn' }
      ];
    } else {
      return [
        { value: 'trash', label: 'Xoá đã chọn' },
        { value: 'edit', label: 'Chỉnh sửa' }
      ];
    }
  };

  const handleAction = async () => {
    try {
      console.log('GỌI HANDLE ACTION', filters.action, selectedRows);

      switch (filters.action) {
        case 'restore':
          await newsCategoryService.restorePost(selectedRows);
          break;
        case 'trash':
          await newsCategoryService.trashPost(selectedRows);
          break;
        case 'forceDelete':
          await newsCategoryService.forceDelete(selectedRows);
          break;
        default:
          return;
      }

      setSelectedRows([]);
    } catch (err) {
      console.error('LỖI:', err?.response?.data || err?.message || err);
    }
  };

  // ✅ Lọc theo status
  const filteredArticles = categories.filter((a) =>
    !filters.status || a.status === filters.status
  );

  return (
    <CategoryContex.Provider
      value={{
        filters, setFilters,
        articles, setArticles,
        modalItem, setModalItem,
        currentPage, setCurrentPage,
        selectedRows, setSelectedRows,
        activeTab, setActiveTab,
        getActionOptions, handleSelectAll,
        filteredArticles, categories, handleSelectRow, handleAction, postCounts
      }}
    >
      <CategoryFilters />
      <CategoryTable />
    </CategoryContex.Provider>
  );
};

export default CategoryPage;
