import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import { Search, MoreVert } from '@mui/icons-material';
import { productQuestionService } from '@/services/admin/productQuestionService';
import Pagination from '@/components/common/Pagination';
import Toastify from '@/components/common/Toastify';
import LoaderAdmin from '@/components/common/Loader';
import ReplyDialog from './ReplyDialog';
import QuestionDetailDialog from './QuestionDetailDialog';
import { useNavigate } from 'react-router-dom';

/** Tabs trạng thái */
const statusTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'answered', label: 'Đã trả lời' },
  { value: 'unanswered', label: 'Chưa trả lời' },
  { value: 'hidden', label: 'Đã ẩn' },      // mới
];

const ProductQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [selected, setSelected] = useState(null);  // mở ReplyDialog
  const [viewDetail, setViewDetail] = useState(null);  // mở QuestionDetailDialog
  const [replyText, setReplyText] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuQuestion, setMenuQuestion] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();

  /** Hiển thị Chip trạng thái */
  const getStatusChip = (q) => {
    if (q.isHidden) {
      return <Chip label="Đã ẩn" size="small" color="error" />;
    }
    const answered = (q.answers || []).length > 0;
    return answered
      ? <Chip label="Đã trả lời" size="small" color="success" />
      : <Chip label="Chưa trả lời" size="small" color="warning" />;
  };

  /** Lấy danh sách câu hỏi */
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await productQuestionService.getAll();
      const all = Array.isArray(res?.data) ? res.data : [];

      // Chỉ giữ các câu trả lời top-level
      const processed = all.map((q) => ({
        ...q,
        answers: (q.answers || []).filter((a) => a.parentId === null),
      }));

      // Lọc theo tab
      let filtered = processed;
      if (status === 'answered') {
        filtered = processed.filter((q) => q.answers.length > 0 && !q.isHidden);
      } else if (status === 'unanswered') {
        filtered = processed.filter((q) => q.answers.length === 0 && !q.isHidden);
      } else if (status === 'hidden') {
        filtered = processed.filter((q) => q.isHidden);
      }

      // Lọc theo ô tìm kiếm
      if (searchTerm.trim()) {
        const key = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (q) =>
            q.content.toLowerCase().includes(key) ||
            q.user?.fullName?.toLowerCase().includes(key) ||
            q.product?.name?.toLowerCase().includes(key),
        );
      }

      setTotal(filtered.length);
      const start = (page - 1) * limit;
      setQuestions(filtered.slice(start, start + limit));
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  /* gọi lại khi thay đổi page/limit/status/search */
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, status, searchTerm]);

  /* menu hành động */
  const handleMenuOpen = (e, question) => {
    setAnchorEl(e.currentTarget);
    setMenuQuestion(question);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuQuestion(null);
  };

  /* ------------------ render ------------------ */
  return (
    <Box sx={{ p: 2 }}>
      
      {loading && <LoaderAdmin fullscreen />}

      {/* Tiêu đề */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Hỏi &amp; Đáp Sản Phẩm
        </Typography>
      </Box>

      {/* Tabs + search */}
      <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, mb: 2 }}>
        <Box display="flex" gap={2} mb={2}>
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={status === tab.value ? 'contained' : 'text'}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              sx={{ borderRadius: 2, fontWeight: status === tab.value ? 600 : 400 }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm kiếm…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Bảng danh sách */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Người hỏi</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length > 0 ? (
              questions.map((q, idx) => (
                <TableRow key={q.id} hover>
                  <TableCell>{(page - 1) * limit + idx + 1}</TableCell>

                  {/* Người hỏi */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {q.user?.fullName?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{q.user?.fullName || 'Ẩn danh'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {q.user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Nội dung */}
                  <TableCell sx={{ maxWidth: 240 }}>
                    <Tooltip title={q.content} arrow placement="top">
                      <Typography noWrap>{q.content}</Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>{q.product?.name}</TableCell>
                  <TableCell>{getStatusChip(q)}</TableCell>

                  {/* Hành động */}
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, q)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {total > limit && (
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          onPageSizeChange={(val) => {
            setPage(1);
            setLimit(val);
          }}
        />
      )}

      {/* Menu hành động */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            navigate(`/admin/product-question/${menuQuestion?.id}`);
            handleMenuClose();
          }}
        >
          Xem chi tiết
        </MenuItem>
      </Menu>

      {/* Reply dialog */}
      <ReplyDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onSubmit={() => { }}
        question={selected}
        value={replyText}
        onChange={setReplyText}
      />

      {/* Detail dialog */}
      <QuestionDetailDialog
        open={Boolean(viewDetail)}
        onClose={() => setViewDetail(null)}
        question={viewDetail}
        formatDateTime={(t) => new Date(t).toLocaleString('vi-VN')}
      />
    </Box>
  );
};

export default ProductQuestions;
