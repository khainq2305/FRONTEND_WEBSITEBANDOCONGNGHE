import ArticleFilters from './ArticleFilters';
import ArticleTable from './ArticleTable';
import BasicModal from './Modal';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';

const ArticlePage = ({
  filters = {},
  setFilters = () => {},
  articles = [],
  articleList = [],
  selectedRows = [],
  onSelectRow = () => {},
  onSelectAll = () => {},
  onAction = () => {},
  onDelete = () => {},
  onView = () => {},
  pagination = { currentPage: 1, totalItems: 0, itemsPerPage: 5 },
  onPageChange = () => {},
  modalItem = null,
  onCloseModal = () => {},
  actionOptions = []
}) => {
  return (
    <div style={{ padding: 20 }}>
      <ArticleFilters
        filters={filters}
        onFilterChange={setFilters}
        articleList={articleList} 
        selectedCount={selectedRows.length}
        onAction={onAction}
        
        actionOptions={actionOptions}
        
      />

      <ArticleTable
        rows={articles}
        selectedRows={selectedRows}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
        onView={onView}
        onDelete={onDelete}
      />

      <Pagination
        currentPage={pagination.currentPage}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={onPageChange}
      />

      <Toastify />

      <BasicModal
        open={!!modalItem}
        onClose={onCloseModal}
        title="Chi tiết bài viết"
        item={modalItem}
      />
    </div>
  );
};

export default ArticlePage;
