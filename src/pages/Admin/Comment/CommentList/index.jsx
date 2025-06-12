import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Paper,
  CircularProgress
} from '@mui/material';
import { reviewService } from '@/services/admin/reviewService';

import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SortIcon from '@mui/icons-material/Sort';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
import PaginationComponent from 'components/common/Pagination';

const CommentList = () => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('default');
  const [searchText, setSearchText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getCommentSummary();
      if (Array.isArray(res.data?.data)) {
        setComments(res.data.data);
      } else {
        console.warn('⚠️ Dữ liệu không phải mảng:', res.data);
        setComments([]);
      }
    } catch (error) {
      console.error('❌ Lỗi khi load danh sách:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  const getFilteredData = () => {
    let filtered = [...comments];

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.productName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    switch (sortOption) {
      case 'most-commented':
        filtered.sort((a, b) => b.totalComments - a.totalComments);
        break;
      case 'highest-rating':
        filtered = filtered
          .filter((item) => item.avgRating !== null)
          .sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'lowest-rating':
        filtered = filtered
          .filter((item) => item.avgRating !== null)
          .sort((a, b) => a.avgRating - b.avgRating);
        break;
      case 'az':
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'za':
        filtered.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      default:
        break;
    }

    return filtered;
  };

  const paginatedData = getFilteredData().slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={700}>
            💬 Quản lý bình luận sản phẩm
          </Typography>
        }
      />
      <CardContent>
        <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: '#f5f7fa', borderRadius: 3 }}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            <Select
              fullWidth
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              size="small"
              displayEmpty
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
              }}
            >
              <MenuItem value="default">
                <SortIcon fontSize="small" sx={{ mr: 1 }} />
                Mặc định
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" sx={{ pl: 1, fontWeight: 500, opacity: 0.7 }}>
                  Theo số lượng
                </Typography>
              </MenuItem>
              <MenuItem value="most-commented">
                <FormatListNumberedIcon fontSize="small" sx={{ mr: 1 }} />
                Bình luận nhiều nhất
              </MenuItem>

              <MenuItem disabled>
                <Typography variant="caption" sx={{ pl: 1, fontWeight: 500, opacity: 0.7 }}>
                  Theo đánh giá
                </Typography>
              </MenuItem>
              <MenuItem value="highest-rating">
                <StarIcon fontSize="small" sx={{ mr: 1, color: '#fdd835' }} />
                Sao cao nhất
              </MenuItem>
              <MenuItem value="lowest-rating">
                <StarBorderIcon fontSize="small" sx={{ mr: 1, color: '#fdd835' }} />
                Sao thấp nhất
              </MenuItem>

              <MenuItem disabled>
                <Typography variant="caption" sx={{ pl: 1, fontWeight: 500, opacity: 0.7 }}>
                  Theo tên
                </Typography>
              </MenuItem>
              <MenuItem value="az">
                <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} />
                Tên A-Z
              </MenuItem>
              <MenuItem value="za">
                <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} />
                Tên Z-A
              </MenuItem>
            </Select>
          </Box>
        </Paper>

        {loading ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
            <Typography mt={2} fontStyle="italic" color="text.secondary">
              Đang tải dữ liệu bình luận...
            </Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="center">Ảnh</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="center">Tổng bình luận</TableCell>
                  <TableCell align="center">Sao trung bình</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <TableRow key={item.productId}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell align="center">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          width={80}
                          height={80}
                          style={{ objectFit: 'cover', borderRadius: 8 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{item.productName}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color="primary">{item.totalComments}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        {[1, 2, 3, 4, 5].map((star) =>
                          star <= Math.round(item.avgRating) ? (
                            <StarIcon key={star} fontSize="small" sx={{ color: '#fdd835' }} />
                          ) : (
                            <StarBorderIcon key={star} fontSize="small" />
                          )
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/admin/comments/${item.productId}`)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <PaginationComponent
              totalPages={Math.ceil(getFilteredData().length / rowsPerPage)}
              currentPage={page + 1}
              onChange={(value) => setPage(value - 1)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentList;
