import { createContext, useContext, useState, useEffect } from 'react';
import Top from '@/pages/Admin/News/components/sidebar/Top';
import ArticlePage from '@/pages/Admin/News/components/table/ArticlePage';
import { newsService } from '@/services/admin/postService';

// 1. Tạo context
const ArticleContext = createContext();
export const useArticle = () => useContext(ArticleContext);

const News = () => {
  // 2. Khai báo state và logic ngay trong News
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

  useEffect(() => {
    newsService.getAll()
      .then(res => {
        setArticles(res.data.data);
        console.log(res.data.data)
      })
      .catch(err => {
        console.error('Lỗi lấy bài viết:', err);
      });
  }, []);

  const filteredArticles = articles.filter(item => {
    const title = (item.title || '').toLowerCase();
    const search = (filters.search || '').toLowerCase();
    const matchSearch = search === '' || title.includes(search);

    const matchCategory =
      filters.category === '' || item.categoryId === parseInt(filters.category);

    const status = item.status || '';
    const fStatus = filters.status || '';

    const isNormal = ['active', 'inactive', 'published', ''].includes(fStatus);

    const match =
      (fStatus === 'trash' && item.deletedAt && matchSearch && matchCategory) ||
      (fStatus === 'draft' && !item.deletedAt && status === 'draft' && matchSearch && matchCategory) ||
      (isNormal && !item.deletedAt && matchSearch && matchCategory && (fStatus === '' || status === fStatus));

    // console.log({
    //   id: item.id,
    //   title: item.title,
    //   matchSearch,
    //   matchCategory,
    //   status,
    //   fStatus,
    //   isNormal,
    //   match
    // });

    return match;
  });


  const counts = {
    all: articles.filter(a => !a.deletedAt).length, // tất cả chưa xóa
    published: articles.filter(a => a.status === 'published' && !a.deletedAt).length,
    draft: articles.filter(a => a.status === 'draft' && !a.deletedAt).length,
    trash: articles.filter(a => a.deletedAt).length // bài đã bị xóa mềm
  };


  const handleTabClick = (statusValue) => {
    setFilters(prev => ({ ...prev, status: statusValue === 'all' ? '' : statusValue }));
    setActiveTab(statusValue);
    setCurrentPage(1);
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredArticles.length ? [] : filteredArticles.map(item => item.id)
    );
    
  };

  const handleAction = async () => {
  try {
    console.log('GỌI HANDLE ACTION', filters.action, selectedRows);

    switch (filters.action) {
      case 'restore':
        await newsService.restorePost(selectedRows);
        break;

      case 'trash':
        console.log('GỌI TRASH POST với IDs:', selectedRows);
        await newsService.trashPost(selectedRows);
        break;
      case 'forceDelete':
        console.log('Đang định xóa',selectedRows)
        await newsService.forceDelete(selectedRows);
        break;

      default:
        return;
    }

    const res = await newsService.getAll();
    setArticles(res.data.data);
    setSelectedRows([]);
  } catch (err) {
    console.error('LỖI:', err?.response?.data || err?.message || err);
  }
};



  const handleSoftDelete = (article) => {
  const res = newsService.trashPost([article.id]); // <-- dùng `id` thật

  if (!res || !res.then) {
    console.error('trashPost không trả về Promise:', res);
    // toast.error('Không thể xoá bài viết – API bị lỗi');
    return;
  }

  res.then(() => {
    // toast.success('Đã đưa vào thùng rác');
    newsService.getAll().then(res => setArticles(res.data.data));
  }).catch(err => ('Lỗi xoá mềm'));
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

  // 3. Wrap provider nội bộ
  return (
    <ArticleContext.Provider value={{
      filters, setFilters,
      articles, setArticles,
      filteredArticles,
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
      counts
    }}>
      <div className="space-y-4">
        <Top />
        <ArticlePage />
      </div>
    </ArticleContext.Provider>
  );
};

export default News;
