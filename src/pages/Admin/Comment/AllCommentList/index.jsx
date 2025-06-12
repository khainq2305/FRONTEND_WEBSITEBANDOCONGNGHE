import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ImageList,
  ImageListItem,
  Stack,
  Divider,
  Menu,
  MenuItem,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  InputAdornment
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SearchIcon from '@mui/icons-material/Search';

import ReplyDialog from '../ReplyDialog';
import PaginationComponent from '@/components/common/Pagination';
import { reviewService } from '@/services/admin/reviewService';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'react-toastify';

const AllCommentList = () => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const { currentUser } = useUser();

  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    search: '',
    fromDate: null,
    toDate: null
  });

  const handleFilterChange = (key, value) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getActiveFilterChips = () => {
    const chips = [];
    const { status, rating, search, fromDate, toDate } = filters;

    if (status === 'replied') chips.push({ key: 'status', label: 'Đã phản hồi' });
    else if (status === 'not_replied') chips.push({ key: 'status', label: 'Chưa phản hồi' });

    if (rating !== 'all') chips.push({ key: 'rating', label: `${rating} sao` });

    if (search) chips.push({ key: 'search', label: `Từ khoá: "${search}"` });

    if (fromDate && toDate) chips.push({ key: 'dateRange', label: `Từ ${fromDate} → ${toDate}` });
    else if (fromDate) chips.push({ key: 'fromDate', label: `Từ ngày: ${fromDate}` });
    else if (toDate) chips.push({ key: 'toDate', label: `Đến ngày: ${toDate}` });

    return chips;
  };

  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [dialogReplyText, setDialogReplyText] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [totalCount, setTotalCount] = useState(0); // thêm state mới

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.list({
        page: page + 1,
        limit: rowsPerPage,
        status: filters.status !== 'all' ? filters.status : undefined,
        rating: filters.rating !== 'all' ? filters.rating : undefined,
        search: filters.search || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined
      });
      setComments(res.data?.data || []);
      setTotalCount(res.data?.pagination?.total || 0); // lấy tổng số
    } catch (error) {
      console.error('❌ Lỗi lấy bình luận có filter:', error);
      toast.error('Không thể tải danh sách bình luận.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, filters]);

  const handleReplyClick = (item) => {
    setSelectedComment(item);
    setDialogReplyText('');
    setReplyDialogOpen(true);
    setDetailOpen(false);
  };
  const handleRemoveFilter = (key) => {
    const resetValues = {
      status: 'all',
      rating: 'all',
      search: '',
      fromDate: null,
      toDate: null,
      dateRange: { fromDate: null, toDate: null }
    };

    if (key === 'dateRange') {
      setFilters((prev) => ({ ...prev, fromDate: null, toDate: null }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: resetValues[key] }));
    }
  };
  const clearAllFilters = () => {
    setFilters({
      status: 'all',
      rating: 'all',
      search: '',
      fromDate: null,
      toDate: null
    });
  };

  const handleReplySubmit = async () => {
    if (!dialogReplyText.trim()) return toast.warning('Vui lòng nhập nội dung phản hồi.');
    try {
      await reviewService.reply(selectedComment.id, {
        reply: dialogReplyText,
        repliedBy: currentUser?.fullName,
        repliedAt: new Date().toISOString()
      });
      toast.success('Phản hồi thành công!');
      setReplyDialogOpen(false);
      setSelectedComment(null);
      await fetchReviews();
    } catch {
      toast.error('Phản hồi thất bại');
    }
  };

  const paginated = comments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleViewDetail = (item) => {
    setSelectedComment(item);
    setDetailOpen(true);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleReplyFromMenu = () => {
    handleReplyClick(menuRow);
    handleMenuClose();
  };

  const handleViewDetailFromMenu = () => {
    handleViewDetail(menuRow);
    handleMenuClose();
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedComment(null);
  };

  const handleOpenImagePreview = (imgUrl) => {
    setSelectedImage(imgUrl);
    setImagePreviewOpen(true);
  };

  const handleCloseImagePreview = () => {
    setImagePreviewOpen(false);
  };

  const headerCellStyle = { fontWeight: 'bold', color: 'text.primary', backgroundColor: 'grey.100' };
  const cellStyle = { py: 1.5, px: 2, borderBottom: '1px solid rgba(224, 224, 224, 1)' };

  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          🗂️ Tất cả bình luận sản phẩm (mới nhất)
        </Typography>

        {/* BỘ LỌC */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={filters.status} label="Trạng thái" onChange={(e) => handleFilterChange('status', e.target.value)}>
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="replied">Đã phản hồi</MenuItem>
              <MenuItem value="not_replied">Chưa phản hồi</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Đánh giá</InputLabel>
            <Select value={filters.rating} label="Đánh giá" onChange={(e) => handleFilterChange('rating', e.target.value)}>
              <MenuItem value="all">Tất cả</MenuItem>
              {[5, 4, 3, 2, 1].map((val) => (
                <MenuItem key={val} value={val}>
                  {val} sao
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Từ ngày"
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            label="Đến ngày"
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => handleFilterChange('toDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {getActiveFilterChips().length > 0 && (
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              Đang lọc:
            </Typography>
            {getActiveFilterChips().map((chip, index) => (
              <Chip
                key={index}
                label={chip.label}
                color="info"
                variant="outlined"
                size="small"
                onDelete={() => handleRemoveFilter(chip.key)}
              />
            ))}
            <Button onClick={clearAllFilters} size="small" color="error" sx={{ textTransform: 'none' }}>
              Xoá tất cả
            </Button>
          </Box>
        )}

        {/* TABLE - loading */}
        {loading ? (
          <Box textAlign="center" my={5}>
            <CircularProgress />
            <Typography mt={2} color="text.secondary">
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerCellStyle}>#</TableCell>
                    <TableCell sx={headerCellStyle}>Sản phẩm</TableCell>
                    <TableCell sx={headerCellStyle}>Người dùng</TableCell>
                    <TableCell sx={headerCellStyle}>Đánh giá</TableCell>
                    <TableCell sx={headerCellStyle}>Trạng thái</TableCell>
                    <TableCell sx={headerCellStyle}>Thời gian</TableCell>
                    <TableCell sx={headerCellStyle} align="center">
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={cellStyle}>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell sx={cellStyle}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar src={item.sku?.product?.thumbnail} variant="rounded" />
                          <Typography variant="body2" fontWeight={600}>
                            {item.sku?.product?.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellStyle}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar src={item.user?.avatarUrl} />
                          <Typography variant="body2">{item.user?.fullName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellStyle}>
                        <Box display="flex">
                          {[...Array(5)].map((_, i) =>
                            i < item.rating ? (
                              <StarIcon key={i} fontSize="small" color="warning" />
                            ) : (
                              <StarBorderIcon key={i} fontSize="small" />
                            )
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={cellStyle}>
                        <Chip
                          label={item.isReplied ? 'Đã phản hồi' : 'Chưa phản hồi'}
                          color={item.isReplied ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={cellStyle}>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                      <TableCell sx={cellStyle} align="center">
                        <IconButton onClick={(e) => handleMenuOpen(e, item)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {totalCount > rowsPerPage && (
              <Box mt={3} display="flex" justifyContent="center">
                <PaginationComponent
                  totalPages={Math.ceil(totalCount / rowsPerPage)}
                  currentPage={page + 1}
                  onChange={(val) => setPage(val - 1)}
                />
              </Box>
            )}

            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={handleReplyFromMenu} disabled={menuRow?.isReplied}>
                <ReplyIcon fontSize="small" sx={{ mr: 1 }} /> Phản hồi
              </MenuItem>
              <MenuItem onClick={handleViewDetailFromMenu}>
                <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Xem chi tiết
              </MenuItem>
            </Menu>
          </>
        )}
      </CardContent>

      {selectedComment && (
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="md" fullWidth>
          <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
            <RateReviewIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chi tiết đánh giá
            </Typography>
            <IconButton onClick={handleCloseDetail} sx={{ color: 'action.active' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: { xs: 1.5, md: 3 }, backgroundColor: '#f9f9f9' }}>
            <Stack spacing={2.5}>
              <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 2, backgroundColor: 'white' }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar src={selectedComment.user?.avatarUrl} sx={{ width: 48, height: 48 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Người đánh giá
                        </Typography>
                        <Typography fontWeight={600}>{selectedComment.user?.fullName}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar src={selectedComment.sku?.product?.thumbnail} variant="rounded" sx={{ width: 48, height: 48 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Sản phẩm
                        </Typography>
                        <Typography fontWeight={600} noWrap maxWidth="250px">
                          {selectedComment.sku?.product?.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>

                  <Divider />

                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      {[...Array(5)].map((_, star) =>
                        star < selectedComment.rating ? (
                          <StarIcon key={star} color="warning" />
                        ) : (
                          <StarBorderIcon key={star} sx={{ color: 'grey.300' }} />
                        )
                      )}
                      <Typography sx={{ ml: 1, fontWeight: 'bold' }}>({selectedComment.rating}/5)</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: 'text.secondary' }}>
                      "{selectedComment.content}"
                    </Typography>
                  </Box>

                  {selectedComment.media?.length > 0 && (
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Hình ảnh đính kèm
                      </Typography>
                      <ImageList sx={{ width: '100%', mt: 1 }} cols={5} rowHeight={120} gap={8}>
                        {selectedComment.media.map((img) => (
                          <ImageListItem
                            key={img.id}
                            sx={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '8px', '&:hover img': { transform: 'scale(1.05)' } }}
                            onClick={() => handleOpenImagePreview(img.url)}
                          >
                            <img
                              src={`${img.url}?w=120&h=120&fit=crop&auto=format`}
                              srcSet={`${img.url}?w=120&h=120&fit=crop&auto=format&dpr=2 2x`}
                              alt="review media"
                              loading="lazy"
                              style={{ transition: 'transform 0.3s ease', display: 'block' }}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary" align="right">
                    Đã đăng vào: {new Date(selectedComment.createdAt).toLocaleString('vi-VN')}
                  </Typography>
                </Stack>
              </Paper>

              {/* --- KHỐI PHẢN HỒI CỦA QUẢN TRỊ VIÊN --- */}
              {selectedComment.isReplied && selectedComment.replyContent && (
                <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 2, backgroundColor: '#e3f2fd' /* Light Blue */ }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        <ReplyIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          Phản hồi từ {selectedComment.repliedBy || 'Quản trị viên'}
                        </Typography>
                        {selectedComment.repliedAt && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(selectedComment.repliedAt).toLocaleString('vi-VN')}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Typography variant="body1" sx={{ pl: '52px', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                      {selectedComment.replyContent}
                    </Typography>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
            <Button onClick={handleCloseDetail} variant="outlined" color="secondary">
              Đóng
            </Button>
            {!selectedComment.isReplied && (
              <Button onClick={() => handleReplyClick(selectedComment)} variant="contained" startIcon={<ReplyIcon />}>
                Phản hồi ngay
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={imagePreviewOpen} onClose={handleCloseImagePreview} maxWidth="md">
        <img src={selectedImage} alt="Preview" style={{ width: '100%', height: 'auto' }} />
      </Dialog>

      <ReplyDialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        onSubmit={handleReplySubmit}
        selectedComment={selectedComment}
        dialogReplyText={dialogReplyText}
        onChangeText={setDialogReplyText}
      />
    </Card>
  );
};

export default AllCommentList;
