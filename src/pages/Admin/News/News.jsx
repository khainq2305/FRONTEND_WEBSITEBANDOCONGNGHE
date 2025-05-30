import { useState, useEffect } from 'react';
import Top from '@/pages/Admin/News/components/sidebar/Top';
import ArticleFilters from '@/pages/Admin/News/components/filter/ArticleFilters';
import ArticleTable from '@/pages/Admin/News/components/table/ArticleTable';
import BasicModal from '@/pages/Admin/News/components/modal/Modal';
import { newsService } from '@/services/admin/postService';
import { toast } from 'react-toastify';
import MUIPagination from '@/components/common/Pagination';
import { confirmDelete } from '@/components/common/ConfirmDeleteDialog'; 
const News = () => {
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
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10); //
  const [counts, setCounts] = useState({
    all: 0,
    published: 0,
    draft: 0,
    trash: 0
  });

  const loadArticles = async () => {
    const { search, category, status } = filters;

    const params = {
      search: search || undefined,
      categoryId: category || undefined,
      status: status || undefined,
      page: currentPage,
      limit: pageSize
    };

    const res = await newsService.getAll(params);
    setArticles(res.data.data);
    setTotal(res.data.total);
    setCounts(res.data.counts);
  };

  useEffect(() => {
    loadArticles().catch(console.error);
  }, [filters, currentPage]);

  const handleTabClick = (statusValue) => {
    setFilters(prev => ({
      ...prev,
      status: statusValue === 'all' ? '' : statusValue.toString()
    }));
    setActiveTab(statusValue);
    setCurrentPage(1);
  };

  const handleSelectRow = (slug) => {
    setSelectedRows(prev =>
      prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === articles.length ? [] : articles.map(item => item.slug)
    );
  };

  const handleAction = async () => {
    try {
      let res;
      switch (filters.action) {
        case 'restore':
          res = await newsService.restorePost(selectedRows);
          break;
        case 'trash':
          res = await newsService.trashPost(selectedRows);
          break;
        case 'forceDelete':
          res = await newsService.forceDelete(selectedRows);
          break;
        default:
          return;
      }
      toast.success(res.data.message || 'Thao tác thành công');
      await loadArticles();
      setSelectedRows([]);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  const handleSoftDelete = async (article) => {
    try {
      const res = await newsService.trashPost([article.slug]);
      toast.success(res.data.message || 'Đã đưa vào thùng rác');
      await loadArticles();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xoá mềm thất bại');
    }
  };

  const handleRestore = async (slug) => {
    try {
      const res = await newsService.restorePost([slug]);
      toast.success(res.data.message || 'Đã khôi phục');
      await loadArticles();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Khôi phục thất bại');
    }
  };

  const handleForceDelete = async (slug) => {
  const confirmed = await confirmDelete('bài viết này');
  if (!confirmed) return;

  try {
    const res = await newsService.forceDelete([slug]);
    toast.success(res.data.message || 'Đã xoá vĩnh viễn');
    await loadArticles();
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Xóa thất bại');
  }
};

  const getActionOptions = () => {
    if (filters.status === 'trash') {
      return [
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
      ];
    } else {
      return [
        { value: 'trash', label: 'Xoá đã chọn' }
      ];
    }
  };

  return (
    <div className="space-y-4">
      <Top
        title="Tất cả bài viết"
        tabs={[
          { label: 'Tất cả', value: 'all' },
          { label: 'Đã xuất bản', value: 'published' },
          { label: 'Bản nháp', value: 'draft' },
          { label: 'Thùng rác', value: 'trash' }
        ]}
        activeTab={activeTab}
        onTabChange={handleTabClick}
        counts={counts}
        to="/admin/them-bai-viet-moi" 
        label="Thêm bài viết"
      />

      <div className="p-4">
        <ArticleFilters
  filters={filters}
  setFilters={setFilters}
  selectedRows={selectedRows}
  handleAction={handleAction}
  getActionOptions={getActionOptions}
/>

        <ArticleTable
  articles={articles}
  selectedRows={selectedRows}
  handleSelectRow={handleSelectRow}
  handleSelectAll={handleSelectAll}
  setModalItem={setModalItem}
  handleSoftDelete={handleSoftDelete}
  filters={filters}
  handleRestore={handleRestore}
  handleForceDelete={handleForceDelete}
  setArticles={setArticles}
  currentPage={currentPage}       // ✅ thêm dòng này
  pageSize={pageSize}   
/>
        {total > pageSize && (
  <MUIPagination
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={pageSize}
    onPageChange={setCurrentPage}
    onPageSizeChange={setPageSize}
  />
)}


        <BasicModal modalItem={modalItem} onClose={() => setModalItem(null)} />

      </div>
    </div>
  );
};

export default News;
