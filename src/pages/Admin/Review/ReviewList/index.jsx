import { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardContent, Table, TableHead, TableRow,
  TableCell, TableBody, Typography, Box, Button, CircularProgress, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { reviewService } from '@/services/admin/reviewService';
import SortSelect from '@/pages/Admin/Review/SortSelect';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import MUIPagination from '@/components/common/Pagination';

const ReviewList = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('default');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await reviewService.getGroupedByProduct({ page, limit, sort });

        // tim kiem o back end

        setReviews(res.data.data);
        console.log("Hello", res.data.data);
        setTotal(res.total || 0);
      } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách đánh giá:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, sort]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            💬 Quản lý đánh giá sản phẩm
          </Typography>
        }
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <SortSelect value={sort} onChange={(e) => setSort(e.target.value)} />
            <Button
  variant="contained"
  onClick={() => navigate('/admin/reviews/all')}
  startIcon={<VisibilityIcon />}
  sx={{
    whiteSpace: 'normal',
    textTransform: 'none',
    padding: '4px 20px',
    lineHeight: '1.2',
    minHeight: 'unset',
    height: 'auto',
    width: '250px',
    textAlign: 'center',
    
  }}
>
  Các bình luận<br />mới nhất
</Button>

          </Box>
        }
      />

      <CardContent>
        {loading ? (
          <Box textAlign="center" mt={4}><CircularProgress /></Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell align="center">Ảnh</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="center">Tổng đánh giá</TableCell>
                  <TableCell align="center">Sao trung bình</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.length > 0 ? (
                  reviews.map((item, index) => {
                    if (!item.sku || !item.sku.product) return null;

                    return (
                      <TableRow key={item.skuId} sx={{ height: 100 }}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell align="center">
                          <Box
                            component="img"
                            src={item.sku.product.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image'}
                            alt={item.sku.product.name}
                            width={80}
                            height={80}
                            sx={{
                              objectFit: 'cover',
                              borderRadius: 2,
                              border: '1px solid #e0e0e0',
                              backgroundColor: '#fafafa'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>{item.sku.product.name}</Typography>
                        </TableCell>
                        <TableCell align="center">{item.totalComments}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const rating = parseFloat(item.avgRating);
                              if (i + 1 <= Math.floor(rating)) {
                                return <StarIcon key={i} fontSize="small" color="warning" />;
                              } else if (i < rating) {
                                return <StarHalfIcon key={i} fontSize="small" color="warning" />;
                              } else {
                                return <StarBorderIcon key={i} fontSize="small" color="disabled" />;
                              }
                            })}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate(`/admin/reviews/${item.skuId}`)}
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <MUIPagination
              currentPage={page}
              totalItems={total}
              itemsPerPage={limit}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1); // reset về trang đầu khi đổi pageSize
              }}
            />

          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewList;
