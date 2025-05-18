import { createContext, useContext, useState, useEffect } from 'react';
import Top from './components/Top';
import ArticlePage from './components/ArticlePage';

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
    fetch('http://localhost:3000/articles')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error('Lỗi khi fetch dữ liệu:', err));
  }, []);

  const filteredArticles = articles.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchCategory = filters.category === '' || item.category === filters.category;

    if (filters.status === 'trash') return item.deleted && matchSearch && matchCategory;
    if (filters.status === 'draft') return !item.deleted && item.tag === 'draft' && matchSearch && matchCategory;

    const isNormal = ['active', 'inactive', ''].includes(filters.status);
    return isNormal && !item.deleted &&
      matchSearch &&
      matchCategory &&
      (filters.status === '' || item.status === filters.status);
  });

  const counts = {
    all: articles.filter(a => !a.deleted).length,
    active: articles.filter(a => a.status === 'active' && !a.deleted).length,
    trash: articles.filter(a => a.deleted).length,
    draft: articles.filter(a => a.tag === 'draft' && !a.deleted).length
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

  const handleAction = () => {
    console.log('Bulk action:', filters.action, selectedRows);
  };

  const handleDelete = (row) => {
    console.log('Xoá bài:', row.name);
  };

  const getActionOptions = () => {
    if (filters.status === 'trash') {
      return [
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'delete_forever', label: 'Xoá vĩnh viễn' }
      ];
    } else if (filters.status === 'draft') {
      return [
        { value: 'edit', label: 'Chỉnh sửa' },
        { value: 'delete', label: 'Xoá khỏi danh sách cốt lõi' }
      ];
    } else {
      return [
        { value: 'delete', label: 'Xoá đã chọn' },
        { value: 'edit', label: 'Chỉnh sửa' }
      ];
    }
  };

  // 3. Wrap provider nội bộ
  return (
    <ArticleContext.Provider value={{
      filters, setFilters,
      articles,
      filteredArticles,
      selectedRows, setSelectedRows,
      modalItem, setModalItem,
      currentPage, setCurrentPage,
      activeTab, setActiveTab,
      handleTabClick,
      handleSelectRow,
      handleSelectAll,
      handleAction,
      handleDelete,
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
