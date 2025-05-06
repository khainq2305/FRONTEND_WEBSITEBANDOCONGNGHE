import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const MUIPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, page) => {
    if (page === currentPage) return;           // Không làm gì nếu chọn lại trang hiện tại
    if (page < 1 || page > totalPages) return;  // Không cho vượt giới hạn
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
