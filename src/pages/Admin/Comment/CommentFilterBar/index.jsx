// components/CommentFilterBar.jsx
import { Box, Grid, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const CommentFilterBar = ({ filters, onChange }) => {
  const handleChange = (key) => (e) => {
    onChange(key, e.target.value);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterListIcon /> Bộ lọc & Tìm kiếm
      </Typography>
      <Grid container spacing={2}>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={filters.status} label="Trạng thái" onChange={handleChange('status')}>
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="replied">Đã phản hồi</MenuItem>
              <MenuItem value="not_replied">Chưa phản hồi</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Đánh giá</InputLabel>
            <Select value={filters.rating} label="Đánh giá" onChange={handleChange('rating')}>
              <MenuItem value="all">Tất cả</MenuItem>
              {[5, 4, 3, 2, 1].map((val) => (
                <MenuItem key={val} value={val}>{val} sao</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField size="small" fullWidth label="Từ ngày" type="date"
            value={filters.fromDate || ''} onChange={handleChange('fromDate')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField size="small" fullWidth label="Đến ngày" type="date"
            value={filters.toDate || ''} onChange={handleChange('toDate')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CommentFilterBar;
