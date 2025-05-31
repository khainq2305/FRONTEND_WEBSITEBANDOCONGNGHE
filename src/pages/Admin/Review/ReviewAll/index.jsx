import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import { useEffect, useState } from 'react';
import { reviewService } from '@/services/admin/reviewService';
import { useNavigate } from 'react-router-dom';

const ReviewAll = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await reviewService.getAll();
        setReviews(res.data.data || []);
      } catch (err) {
        console.error('Lỗi lấy tất cả đánh giá:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <Box >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Tất cả bình luận mới nhất
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Người dùng</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Trạng thái</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((c, index) => (
              <TableRow key={c.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{c.sku?.product?.name || '---'}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={c.user?.avatarUrl} />
                    {c.user?.fullName || '---'}
                  </Box>
                </TableCell>
                <TableCell>{'★'.repeat(c.rating)}</TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                  onClick={() => navigate(`/admin/reviews/all/${c.id}`)}
                >
                  {c.content.length > 20 ? c.content.slice(0, 20) + '...' : c.content}
                </TableCell>

                <TableCell>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Chip
                    label={c.isReplied ? 'đã phản hồi' : 'chưa phản hồi'}
                    size="small"
                    color={c.isReplied ? 'success' : 'warning'}
                  />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReviewAll;
