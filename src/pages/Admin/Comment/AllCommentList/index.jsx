import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Button, Chip } from '@mui/material';
import { toast } from 'react-toastify';

import CommentFilterBar from '../CommentFilterBar';
import CommentTable from '../CommentTable';
import Pagination from '@mui/material/Pagination';
import ReplyDialog from '../ReplyDialog';
import CommentDetailDialog from '../CommentDetailDialog';

import { reviewService } from '@/services/admin/reviewService';
import { useUser } from '@/contexts/UserContext';

const AllCommentList = () => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [dialogReplyText, setDialogReplyText] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const { currentUser } = useUser() || {};

  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    search: '',
    fromDate: null,
    toDate: null
  });

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getActiveFilterChips = () => {
    const { status, rating, search, fromDate, toDate } = filters;
    const chips = [];
    if (status === 'replied') chips.push({ key: 'status', label: 'Đã phản hồi' });
    else if (status === 'not_replied') chips.push({ key: 'status', label: 'Chưa phản hồi' });
    if (rating !== 'all') chips.push({ key: 'rating', label: `${rating} sao` });
    if (search) chips.push({ key: 'search', label: `Từ khoá: "${search}"` });
    if (fromDate && toDate) chips.push({ key: 'dateRange', label: `Từ ${fromDate} → ${toDate}` });
    else if (fromDate) chips.push({ key: 'fromDate', label: `Từ ngày: ${fromDate}` });
    else if (toDate) chips.push({ key: 'toDate', label: `Đến ngày: ${toDate}` });
    return chips;
  };

  const clearAllFilters = () => {
    setFilters({ status: 'all', rating: 'all', search: '', fromDate: null, toDate: null });
  };

  const handleRemoveFilter = (key) => {
    const reset = { status: 'all', rating: 'all', search: '', fromDate: null, toDate: null };
    if (key === 'dateRange') {
      setFilters((prev) => ({ ...prev, fromDate: null, toDate: null }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: reset[key] }));
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.list({
        page,
        limit: rowsPerPage,
        status: filters.status !== 'all' ? filters.status : undefined,
        rating: filters.rating !== 'all' ? filters.rating : undefined,
        search: filters.search || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined
      });

      setComments(res.data?.data || []);
      setTotalCount(res.data?.pagination?.total || 0);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
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
  };

const handleReplySubmit = async () => {
  if (!dialogReplyText.trim()) {
    return toast.warning('Vui lòng nhập nội dung phản hồi.');
  }

  console.log('✅ currentUser:', currentUser);
  console.log('✅ currentUser.fullName:', currentUser?.fullName);
  console.log('✅ dialogReplyText:', dialogReplyText);

  try {
    await reviewService.reply(selectedComment.id, {
      reply: dialogReplyText,
      repliedBy: currentUser?.fullName
    });
    toast.success('Phản hồi thành công!');
    setReplyDialogOpen(false);
    setSelectedComment(null);
    await fetchReviews();
  } catch {
    toast.error('Phản hồi thất bại');
  }
};

  const handleViewDetail = (item) => {
    setSelectedComment(item);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedComment(null);
    setDetailOpen(false);
  };

  const handleMenuOpen = (e, row) => {
    setAnchorEl(e.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Quản lý Đánh giá & Bình luận
        </Typography>

        <CommentFilterBar filters={filters} onChange={handleFilterChange} />

        {getActiveFilterChips().length > 0 && (
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              Đang lọc:
            </Typography>
            {getActiveFilterChips().map((chip, i) => (
              <Chip
                key={i}
                label={chip.label}
                color="primary"
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

        {loading ? (
          <Box textAlign="center" my={10}>
            <CircularProgress />
            <Typography mt={2} color="text.secondary">
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : (
          <>
            <CommentTable
              comments={comments}
              page={page - 1}
              rowsPerPage={rowsPerPage}
              onReplyClick={handleReplyClick}
              onViewDetail={handleViewDetail}
              anchorEl={anchorEl}
              onMenuOpen={handleMenuOpen}
              onMenuClose={handleMenuClose}
              menuRow={menuRow}
            />
            {totalPages > 1 && (
              <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, val) => setPage(val)}
                  shape="rounded"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </>
        )}
      </CardContent>

      <ReplyDialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        onSubmit={handleReplySubmit}
        selectedComment={selectedComment}
        dialogReplyText={dialogReplyText}
        onChangeText={setDialogReplyText}
      />

      {selectedComment && (
        <CommentDetailDialog open={detailOpen} onClose={handleCloseDetail} comment={selectedComment} onReplyClick={handleReplyClick} />
      )}
    </Card>
  );
};

export default AllCommentList;
