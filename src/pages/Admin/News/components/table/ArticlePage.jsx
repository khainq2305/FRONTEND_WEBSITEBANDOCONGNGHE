import ArticleFilters from '@/pages/Admin/News/components/filter/ArticleFilters';
import ArticleTable from '@/pages/Admin/News/components/table/ArticleTable';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';
import BasicModal from '@/pages/Admin/News/components/modal/Modal';
import { useArticle } from '@/pages/Admin/News/News';

const ArticlePage = () => {
  const { currentPage, setCurrentPage, filteredArticles } = useArticle();

  return (
    <div style={{ padding: 20 }}>
      <ArticleFilters />
      <ArticleTable />
      <Pagination
        currentPage={currentPage}
        totalItems={filteredArticles.length}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
      />
      <Toastify />
      <BasicModal />
    </div>
  );
};

export default ArticlePage;
