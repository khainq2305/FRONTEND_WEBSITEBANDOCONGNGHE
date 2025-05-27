import { useState, useEffect } from 'react';
import Top from '@/pages/Admin/News/components/sidebar/Top';
import ArticlePage from '@/pages/Admin/News/components/table/ArticlePage';
import { newsService } from '@/services/admin/postService';
import { toast } from 'react-toastify';
import { ArticleContext } from '@/pages/Admin/News/components/Context/ArticleContext';

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
  const [counts, setCounts] = useState({
    all: 0,
    published: 0,
    draft: 0,
    trash: 0
  });
  const pageSize = 10;

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
    setCounts(res.data.counts); // ✅ cập nhật số lượng bài theo từng loại
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
          toast.success(res.data.message || 'Khôi phục thành công');
          break;
        case 'trash':
          res = await newsService.trashPost(selectedRows);
          toast.success(res.data.message || 'Đã đưa vào thùng rác');
          break;
        case 'forceDelete':
          res = await newsService.forceDelete(selectedRows);
          toast.success(res.data.message || 'Đã xóa vĩnh viễn');
          break;
        default:
          return;
      }

      await loadArticles();
      setSelectedRows([]);
    } catch (err) {
      console.error('LỖI:', err?.response?.data || err?.message || err);
      toast.error(err?.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  const handleSoftDelete = (article) => {
    newsService.trashPost([article.slug])
      .then((res) => {
        toast.success(res.data.message || 'Đã đưa bài viết vào thùng rác');
        loadArticles();
      })
      .catch((err) => {
        console.error('Lỗi xoá mềm:', err);
        toast.error(err?.response?.data?.message || 'Xoá mềm thất bại');
      });
  };
  const handleRestore = (slug) => {
  newsService.restorePost([slug])
    .then((res) => {
      toast.success(res.data.message || 'Đã khôi phục bài viết');
      loadArticles();
    })
    .catch((err) => {
      console.error('Lỗi khôi phục:', err);
      toast.error(err?.response?.data?.message || 'Khôi phục thất bại');
    });
};
const handleForceDelete = (slug) => {
  newsService.forceDelete([slug])
    .then((res) => {
      toast.success(res.data.message || 'Đã xóa bài viết vĩnh viễn');
      loadArticles();
    })
    .catch((err) => {
      console.error('Lỗi khôi phục:', err);
      toast.error(err?.response?.data?.message || 'Xóa thất bại');
    });
};
  const getActionOptions = () => {
    if (filters.status === 'trash') {
      return [
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
      ];
    } else if (filters.status === 'draft') {
      return [
        { value: 'edit', label: 'Chỉnh sửa' },
        { value: 'delete', label: 'Xoá khỏi danh sách cốt lõi' }
      ];
    } else {
      return [
        { value: 'trash', label: 'Xoá đã chọn' },
        { value: 'edit', label: 'Chỉnh sửa' }
      ];
    }
  };

  return (
    <ArticleContext.Provider value={{
      filters, setFilters,
      articles, setArticles,
      selectedRows, setSelectedRows,
      modalItem, setModalItem,
      currentPage, setCurrentPage,
      activeTab, setActiveTab,
      handleTabClick,
      handleSelectRow,
      handleSelectAll,
      handleAction,
      handleSoftDelete,
      getActionOptions,
      handleRestore,
      handleForceDelete,
      counts,
      total,
      pageSize
    }}>
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
  search={filters.search}
  onSearchChange={(v) => setFilters({ ...filters, search: v })}
  counts={counts}
/>
        <ArticlePage />
      </div>
    </ArticleContext.Provider>
  );
};

export default News;
