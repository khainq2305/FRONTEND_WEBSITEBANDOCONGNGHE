import { useState } from 'react';
import { Grid, Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
// import { Grid } from 'lucide-react';

const options = [
  { title: 'Xem', description: 'Cho phép xem thông tin và dữ liệu' },
  { title: 'Thêm', description: 'Cho phép tạo mới dữ liệu' },
  { title: 'Sửa', description: 'Cho phép chỉnh sửa dữ liệu hiện có' },
  { title: 'Xóa', description: 'Cho phép xóa dữ liệu' }
];

const CheckboxGroup = () => {
  const [checkedItems, setCheckedItems] = useState([]);
  const allChecked = checkedItems.length === options.length;

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setCheckedItems(options.map((opt) => opt.title)); // ✅ lấy đúng title
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheckItem = (label) => {
    setCheckedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mt: 2
      }}
    >

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Box
            sm={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Checkbox
              checked={allChecked}
              onChange={handleCheckAll}
              sx={{
                '&.Mui-checked': { color: '#000' },
                '&:hover': { backgroundColor: 'transparent' }
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Chọn tất cả
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sm={6} sx={{}}>
            <Typography variant="body2" color="text.secondary">
              Đã chọn {checkedItems.length}/4
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Các dòng quyền */}
        {options.map((opt) => (
          <Grid item xs={12} sm={6} key={opt.title}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start'
              }}
            >
              <Checkbox
                checked={checkedItems.includes(opt.title)}
                onChange={() => handleCheckItem(opt.title)}
                sx={{
                  alignSelf: 'flex-start',
                  mt: '4px',
                  '&.Mui-checked': { color: '#000' },
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {opt.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {opt.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Kết quả */}
      <Typography sx={{ mt: 2 }}>✅ Đã chọn: {checkedItems.length > 0 ? checkedItems.join(', ') : 'Không có'}</Typography>
    </Box>
  );
};

export default CheckboxGroup;
