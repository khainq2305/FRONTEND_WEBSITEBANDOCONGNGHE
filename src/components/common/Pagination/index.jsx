import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MUIPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, onPageSizeChange }) => {
  const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
  const validPageSizes = [10, 20, 50, 100];

  const currentItemsPerPage = itemsPerPage && validPageSizes.includes(itemsPerPage) ? itemsPerPage : 10;

  const handleChange = (event, page) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <Box sx={{ position: 'relative', mt: 3, minHeight: '40px' }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: 2
        }}
      >
        <Typography fontSize={14} sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          Hiển thị:
        </Typography>
        <Select
          size="small"
          value={currentItemsPerPage}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          sx={{
            minWidth: 90,
            height: 32,
            fontSize: 13,
            '& .MuiSelect-select': {
              py: 0.5,
              px: 1.2
            }
          }}
        >
          {validPageSizes.map((size) => (
            <MenuItem key={size} value={size}>
              {size}/trang
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
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
      </Box>
    </Box>
  );
};

export default MUIPagination;
