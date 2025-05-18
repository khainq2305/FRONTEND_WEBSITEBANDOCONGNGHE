import { useState } from 'react';
import ArticlePage from './components/ArticlePage';

const mockArticles = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max ra mắt',
    author: 'admin@gmail.com',
    category: 'Công nghệ',
    status: 'active',
    tag: 'Apple',
    comment: 12,
    date: '2024-09-12',
    deleted: false
  },
  {
    id: 2,
    name: 'Bài đã xoá test',
    author: 'test@gmail.com',
    category: 'Xã hội',
    status: 'inactive',
    tag: 'test',
    comment: 0,
    date: '2024-01-12',
    deleted: true // 👈 chỉ bài này sẽ được hiển thị bên Trash
  }
];

const Trash = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    action: ''
  });

  const actionOptions = [
    { value: '', label: 'Chọn hành động' },
    { value: 'restore', label: 'Khôi phục' },
    { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
  ];

  const [selectedRows, setSelectedRows] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 👉 chỉ lấy bài đã bị xoá
  const filteredArticles = mockArticles.filter((item) =>
    item.deleted &&
    item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.status === '' || item.status === filters.status) &&
    (filters.category === '' || item.category === filters.category)
  );

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredArticles.length
        ? []
        : filteredArticles.map(item => item.id)
    );
  };

  const handleAction = () => {
    console.log('Trash bulk action:', filters.action, selectedRows);
    // thực hiện khôi phục / xoá vĩnh viễn tại đây
  };

  const handleDelete = (row) => {
    console.log('Xoá vĩnh viễn:', row.name);
    // hoặc hiển thị dialog xác nhận
  };

  return (
    <ArticlePage
      filters={filters}
      setFilters={setFilters}
      articles={filteredArticles}
      selectedRows={selectedRows}
      onSelectRow={handleSelectRow}
      onSelectAll={handleSelectAll}
      onAction={handleAction}
      onDelete={handleDelete}
      onView={(row) => setModalItem(row)}
      pagination={{
        currentPage,
        totalItems: filteredArticles.length,
        itemsPerPage: 5
      }}
      onPageChange={setCurrentPage}
      modalItem={modalItem}
      onCloseModal={() => setModalItem(null)}
      actionOptions={actionOptions}
    />
  );
};

export default Trash;
