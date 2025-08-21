import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const MUIPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleChange = (event, page) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <Stack spacing={2} alignItems="center" mt={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        variant="outlined"
        siblingCount={1}
        boundaryCount={1}
      />
    </Stack>
  );
};

export default MUIPagination;
