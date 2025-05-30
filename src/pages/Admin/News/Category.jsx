import React, { useEffect, useState } from 'react';
import CategoryFilters from './components/filter/CategoryFilters';
import CategoryTable from './components/table/CategoryTable';
import { newsCategoryService } from '@/services/admin/newCategoryService';
import Top from './components/sidebar/Top';
import Pagination from '@/components/common/Pagination';
import { toast } from 'react-toastify';
import { normalizeCategoryList } from '@/utils/index';
import MUIPagination from '@/components/common/Pagination';

const Category = () => {
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
    categoryId: '',
    action: '',
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
const [totalItems, setTotalItems] = useState(0); // ✅ đổi tên
  const [pageSize, setPageSize] = useState(10);

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
        categoryId: filters.categoryId,
        page: currentPage,
        limit: pageSize
      });
      
      const raw = res.data.data || [];
      const stats = res.data.counts || {};
      const total = res.data.total || 0;

      const finalList = normalizeCategoryList(raw);

      setCategories(finalList);
      setCounts(stats);
      setTotalItems(total);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };
console.log('🔍 sending filters:', filters);

  useEffect(() => {
    fetchCategories();
  }, [filters.search, filters.status, filters.categoryId, currentPage]);

  const handleTabClick = (statusValue) => {
    setFilters((prev) => ({
      ...prev,
      status: statusValue === 'all' ? '' : statusValue
    }));
    setActiveTab(statusValue);
    setCurrentPage(1);
  };

  const handleSelectRow = (slug) => {
    setSelectedRows((prev) =>
      prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === categories.length ? [] : categories.map((item) => item.slug)
    );
  };

  const handleSoftDelete = async (item) => {
    try {
      const res = await newsCategoryService.trashPost([item.slug]);
      toast.success(res.data.message || 'Đã đưa danh mục vào thùng rác');
      await fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xoá mềm thất bại');
    }
  };

  const handleForceDelete = async (slug) => {
  const confirmed = await confirmDelete('bài viết này');
  if (!confirmed) return;

  try {
      const res = await newsCategoryService.forceDelete([slug]);
      toast.success(res.data.message || 'Đã xoá danh mục vĩnh viễn');
      await fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xoá thất bại');
    }
};

  const handleRestore = async (slug) => {
    try {
      const res = await newsCategoryService.restorePost([slug]);
      toast.success(res.data.message || 'Đã khôi phục danh mục');
      await fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Khôi phục thất bại');
    }
  };


  const handleAction = async () => {
    try {
      let res;

      switch (filters.action) {
        case 'restore':
          res = await newsCategoryService.restorePost(selectedRows);
          toast.success(res.data.message || 'Đã khôi phục danh mục');
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

      await fetchCategories();
      setSelectedRows([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  const getActionOptions = () => {
    return filters.status === 'trash'
      ? [
          { value: 'restore', label: 'Khôi phục đã chọn' },
          { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
        ]
      : [{ value: 'trash', label: 'Xoá đã chọn' }];
  };

  return (
    <>
      <div className="mb-4">
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
          onSearchChange={(v) => setFilters((prev) => ({ ...prev, search: v }))}
          counts={counts}
          to="/admin/them-danh-muc-bai-viet"
          label="Thêm danh mục mới"
        />
      </div>

      <CategoryFilters
        filters={filters}
        setFilters={setFilters}
        selectedRows={selectedRows}
        handleAction={handleAction}
        getActionOptions={getActionOptions}
        categories={categories}
      />

      <CategoryTable
  filters={filters}
  selectedRows={selectedRows}
  handleSelectRow={handleSelectRow}
  handleSelectAll={handleSelectAll}
  setModalItem={setModalItem}
  handleSoftDelete={handleSoftDelete}
  handleRestore={handleRestore}
  handleForceDelete={handleForceDelete}
  categories={categories}
  setCategories={setCategories}
  currentPage={currentPage}         // ✅ thêm dòng này
  pageSize={pageSize}
/>


      {totalItems > pageSize && (
  <MUIPagination
    currentPage={currentPage}
    totalItems={totalItems}
    itemsPerPage={pageSize}
    onPageChange={setCurrentPage}
    onPageSizeChange={setPageSize}
  />
)}


    </>
  );
};

export default Category;
