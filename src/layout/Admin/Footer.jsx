// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">
        &copy; Nguyễn Quốc Khải, Đoàn Thanh Thạnh, Lê Hữu Phước, Trần Thanh Hải, Nguyễn Chí Khanh, Nguyễn Lương Minh Nhựt, Đỗ Hoàng Tâm, Cô Trần Hoàng Lệ Chi
      
      </Typography>
     
    </Stack>
  );
}
