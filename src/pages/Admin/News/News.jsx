import { useState, useEffect } from 'react';
import ArticlePage from './components/ArticlePage';
import Top from './components/Top';

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

const handleTabClick = (statusValue) => {
  setFilters(prev => ({ ...prev, status: statusValue === 'all' ? '' : statusValue }));
  setActiveTab(statusValue);
  setCurrentPage(1);
};

  useEffect(() => {
    fetch('http://localhost:3001/articles')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error('Lỗi khi fetch dữ liệu:', err));
  }, []);



  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filtered = getFilteredArticles();
    setSelectedRows(
      selectedRows.length === filtered.length ? [] : filtered.map(item => item.id)
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
        { value: '', label: 'Chọn hành động' },
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'delete_forever', label: 'Xoá vĩnh viễn' }
      ];
    } else if (filters.status === 'core') {
      return [
        { value: '', label: 'Chọn hành động' },
        { value: 'edit', label: 'Chỉnh sửa' },
        { value: 'delete', label: 'Xoá khỏi danh sách cốt lõi' }
      ];
    } else {
      return [
        { value: '', label: 'Chọn hành động' },
        { value: 'delete', label: 'Xoá đã chọn' },
        { value: 'edit', label: 'Chỉnh sửa' }
      ];
    }
  };

  const getFilteredArticles = () => {
    return articles.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.category === '' || item.category === filters.category;

      if (filters.status === 'trash') {
        return item.deleted && matchSearch && matchCategory;
      }

      if (filters.status === 'core') {
        return !item.deleted && item.tag === 'core' && matchSearch && matchCategory;
      }

      const isNormalStatus = filters.status === '' || filters.status === 'active' || filters.status === 'inactive';
      if (isNormalStatus) {
        return !item.deleted &&
          matchSearch &&
          matchCategory &&
          (filters.status === '' || item.status === filters.status);
      }

      return false;
    });
  };

  const filteredArticles = getFilteredArticles();
  const counts = {
  all: articles.filter(a => !a.deleted).length,
  active: articles.filter(a => a.status === 'active' && !a.deleted).length,
  trash: articles.filter(a => a.deleted).length,
  core: articles.filter(a => a.tag === 'core' && !a.deleted).length
};


  return (
    <div className="space-y-4">
      <Top onTabClick={handleTabClick}
        counts={counts} activeTab={activeTab} />

      <ArticlePage
        filters={filters}
        setFilters={setFilters}
        articles={filteredArticles}
        articleList={articles} 
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onAction={handleAction}
        onDelete={handleDelete}
        onView={(row) => setModalItem(row)}
        pagination={{ currentPage, totalItems: filteredArticles.length, itemsPerPage: 5}}
        onPageChange={setCurrentPage}
        modalItem={modalItem}
        onCloseModal={() => setModalItem(null)}
        actionOptions={getActionOptions()}
      />
    </div>
  );
};

export default News;
