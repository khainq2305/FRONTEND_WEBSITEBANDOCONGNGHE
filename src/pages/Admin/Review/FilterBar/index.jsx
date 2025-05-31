import { Box, TextField, InputAdornment, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const FilterBar = ({
  searchText,
  onSearchChange,
  selectedRating,
  onRatingChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      mb={3}
      flexWrap="wrap"
      sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}
    >
      <TextField
        variant="outlined"
        label="Tìm kiếm đánh giá"
        size="small"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flex: 1, minWidth: 300, backgroundColor: "white", borderRadius: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
      <Select
        size="small"
        value={selectedRating}
        onChange={(e) => onRatingChange(e.target.value)}
        displayEmpty
        sx={{ minWidth: 160, backgroundColor: "white", borderRadius: 1 }}
      >
        <MenuItem value="all">Tất cả sao</MenuItem>
        {[5, 4, 3, 2, 1].map((val) => (
          <MenuItem key={val} value={val}>
            {val} 
          </MenuItem>
        ))}
      </Select>
      <Select
        size="small"
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        displayEmpty
        sx={{ minWidth: 180, backgroundColor: "white", borderRadius: 1 }}
      >
        <MenuItem value="all">Tất cả trạng thái</MenuItem>
        <MenuItem value="replied">Đã phản hồi</MenuItem>
        <MenuItem value="not_replied">Chưa phản hồi</MenuItem>
      </Select>
    </Box>
  );
};

export default FilterBar;
