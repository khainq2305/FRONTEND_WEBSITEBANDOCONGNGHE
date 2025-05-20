import ArticleFilters from './ArticleFilters';
import ArticleTable from './ArticleTable';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';
import BasicModal from './Modal';
import { useArticle } from '../News';

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
