import ArticleFilters from '@/pages/Admin/News/components/filter/ArticleFilters';
import ArticleTable from '@/pages/Admin/News/components/table/ArticleTable';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';
import BasicModal from '@/pages/Admin/News/components/modal/Modal';
import { useArticle } from '../Context/ArticleContext';

const ArticlePage = () => {
  const { currentPage, setCurrentPage, articles, total,
    pageSize } = useArticle();

  return (
    <div style={{ padding: 20 }}>
      <ArticleFilters />
      <ArticleTable />
      <Pagination
        currentPage={currentPage}
        totalItems={total}
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
      />
      <Toastify />
      <BasicModal />
    </div>
  );
};

export default ArticlePage;
