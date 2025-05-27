import React, { useEffect, useState } from 'react';
import CategoryContext from './components/Context/CategoryContext';
import CategoryFilters from './components/filter/CategoryFilters';
import CategoryTable from './components/table/CategoryTable';
import { newsCategoryService } from '@/services/admin/newCategoryService';
import Top from './components/sidebar/Top';
import Pagination from '@/components/common/Pagination/index';
import { toast } from 'react-toastify';

const Category = () => {
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
    category: '',
    action: ''
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({
    all: 0,
    published: 0,
    draft: 0,
    trash: 0
  });
const fetchCategories = async () => {
      try {
        const res = await newsCategoryService.getAll({
          search: filters.search,
          status: filters.status,
          page: currentPage
        });

        const raw = res.data.data || [];
        const stats = res.data.counts || {};
        const pages = res.data.totalPages || 1;

        // ✅ build cây từ dữ liệu gốc
        const tree = buildCategoryTree(raw, null);
        const flat = flattenTree(tree);

        // ✅ thêm các node mồ côi (không nằm trong cây)
        const orphanNodes = raw.filter(item => !flat.some(f => f.id === item.id));
        const finalList = [...flat, ...orphanNodes.map(o => ({ ...o, level: o.parentId ? 1 : 0 }))]; // ✅ giữ nguyên level cho orphan
        // ✅ nếu có cha mà cha mất thì vẫn gán level = 1

        setCategories(finalList);
        setCounts(stats);
        setTotalPages(pages);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };
  useEffect(() => {

    fetchCategories();
  }, [filters.search, filters.status, currentPage]);

  // ✅ xây cây từ danh sách cha-con
  const buildCategoryTree = (list, parentId = null, level = 0) =>
    list
      .filter(item => (item.parentId ?? null) === parentId)
      .map(item => ({
        ...item,
        level,
        children: buildCategoryTree(list, item.id, level + 1)
      }));

  // ✅ flatten cây thành danh sách phẳng
  const flattenTree = (tree) => {
    let result = [];
    tree.forEach(node => {
      result.push(node);
      if (node.children?.length > 0) {
        result = result.concat(flattenTree(node.children));
      }
    });
    return result;
  };

  const handleTabClick = (statusValue) => {
    setFilters(prev => ({
      ...prev,
      status: statusValue === 'all' ? '' : statusValue
    }));
    setActiveTab(statusValue);
    setCurrentPage(1);
  };

  const handleSelectRow = (slug) => {
    setSelectedRows((prev) =>
      prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === categories.length
        ? []
        : categories.map(item => item.slug)
    );
  };

  const handleSoftDelete = async (item) => {
  try {
    const res = await newsCategoryService.trashPost([item.slug]);
    toast.success(res.data.message || 'Đã đưa danh mục vào thùng rác');
    await fetchCategories(); // ✅ OK
  } catch (err) {
    console.error('Lỗi xoá mềm:', err);
    toast.error(err?.response?.data?.message || 'Xoá mềm thất bại');
  }
};

    const handleRestore = async (slug) => {
  try {
    const res = await newsCategoryService.restorePost([slug]);
    toast.success(res.data.message || 'Đã khôi phục danh mục');
    await fetchCategories();
  } catch (err) {
    console.error('Lỗi khôi phục:', err);
    toast.error(err?.response?.data?.message || 'Khôi phục thất bại');
  }
};

  const handleForceDelete = async (slug) => {
  try {
    const res = await newsCategoryService.forceDelete([slug]);
    toast.success(res.data.message || 'Đã xoá danh mục vĩnh viễn');
    await fetchCategories();
  } catch (err) {
    console.error('Lỗi xoá:', err);
    toast.error(err?.response?.data?.message || 'Xoá thất bại');
  }
};

  const handleAction = async () => {
  try {
    let res;

    switch (filters.action) {
      case 'restore':
        res = await newsCategoryService.restorePost(selectedRows);
        toast.success(res.data.message || 'Đã khôi phục danh mục');
        console.log('🪵 Slugs khôi phục:', selectedRows);
        break;

      case 'trash':
        res = await newsCategoryService.trashPost(selectedRows);
        toast.success(res.data.message || 'Đã đưa danh mục vào thùng rác');
        break;

      case 'forceDelete':
        res = await newsCategoryService.forceDelete(selectedRows);
        toast.success(res.data.message || 'Đã xoá danh mục vĩnh viễn');
        break;

      default:
        return;
    }

   // hoặc load lại dữ liệu nếu có hàm này
    setSelectedRows([]);
  } catch (err) {
    console.error('Lỗi:', err?.response?.data || err?.message || err);
    toast.error(err?.response?.data?.message || 'Đã xảy ra lỗi');
  }
};


  const getActionOptions = () => {
    return filters.status === 'trash'
      ? [
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
      ]
      : [
        { value: 'trash', label: 'Xoá đã chọn' },
        { value: 'edit', label: 'Chỉnh sửa' }
      ];
  };

  return (
    <CategoryContext.Provider
      value={{
        filters, setFilters,
        selectedRows, setSelectedRows,
        modalItem, setModalItem,
        currentPage, setCurrentPage,
        activeTab, setActiveTab,
        categories, setCategories,
        handleSelectRow,
        handleSelectAll,
        handleAction,
        getActionOptions,
        handleRestore,
        handleSoftDelete,
        handleForceDelete
      }}
    >
      <div className='mb-4'>
        <Top
          title="Tất cả danh mục"
          tabs={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Đã xuất bản', value: 'published' },
            { label: 'Bản nháp', value: 'draft' },
            { label: 'Thùng rác', value: 'trash' }
          ]}
          activeTab={activeTab}
          onTabChange={handleTabClick}
          search={filters.search}
          onSearchChange={(v) => setFilters({ ...filters, search: v })}
          counts={counts}
        />
      </div>

      <CategoryFilters />
      <CategoryTable />
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </CategoryContext.Provider>
  );
};

export default Category;
