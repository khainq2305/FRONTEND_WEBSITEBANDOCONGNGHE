import { Select, MenuItem, Typography } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const SortSelect = ({ value, onChange }) => (
  <Select
    fullWidth
    value={value}
    onChange={onChange}
    size="small"
    displayEmpty
    sx={{ backgroundColor: 'white', borderRadius: 2 }}
  >
    <MenuItem value="default">
      <SortIcon fontSize="small" sx={{ mr: 1 }} /> Mặc định
    </MenuItem>
    <MenuItem disabled>
      <Typography variant="caption" sx={{ pl: 1, fontWeight: 500, opacity: 0.7 }}>
        Theo số lượng
      </Typography>
    </MenuItem>
    <MenuItem value="most-commented">
      <FormatListNumberedIcon fontSize="small" sx={{ mr: 1 }} /> Bình luận nhiều nhất
    </MenuItem>
    <MenuItem disabled>
      <Typography variant="caption" sx={{ pl: 1, fontWeight: 500, opacity: 0.7 }}>
        Theo đánh giá
      </Typography>
    </MenuItem>
    <MenuItem value="highest-rating">
      <StarIcon fontSize="small" sx={{ mr: 1, color: '#fdd835' }} /> Sao cao nhất
    </MenuItem>
    <MenuItem value="lowest-rating">
      <StarBorderIcon fontSize="small" sx={{ mr: 1, color: '#fdd835' }} /> Sao thấp nhất
    </MenuItem>
    <MenuItem disabled>
      <Typography variant="caption" sx={{ pl: 1, fontWeight: 500, opacity: 0.7 }}>
        Theo tên
      </Typography>
    </MenuItem>
    <MenuItem value="az">
      <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} /> Tên A-Z
    </MenuItem>
    <MenuItem value="za">
      <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} /> Tên Z-A
    </MenuItem>
  </Select>
);

export default SortSelect;
