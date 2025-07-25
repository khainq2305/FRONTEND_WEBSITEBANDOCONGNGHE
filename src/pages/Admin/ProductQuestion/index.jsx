import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { MoreVert, Visibility, VisibilityOff } from '@mui/icons-material';
import { productQuestionService } from '@/services/admin/productQuestionService';
import Pagination from '@/components/common/Pagination';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import LoaderAdmin from '@/components/common/Loader';
import { confirmDelete } from '@/components/common/ConfirmDeleteDialog';
import HighlightText from '@/components/Admin/HighlightText';
import socket from "@/socket";


const statusTabs = [
  { value: 'all', label: 'Tất Cả' },
  { value: 'unanswered', label: 'Chờ trả lời' },
  { value: 'answered', label: 'Đã trả lời' },
  { value: 'hidden', label: 'Đã ẩn' },
];

const getStatusChip = (question) => {
  if (question.isHidden) {
    return <Chip label="Đã ẩn" color="error" size="small" />;
  }
  const hasOfficialAnswer = (question.answers || []).some(a => a.isOfficial);
  return hasOfficialAnswer
    ? <Chip label="Đã trả lời" color="success" size="small" />
    : <Chip label="Chờ trả lời" color="warning" size="small" />;
};

const ProductQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [counts, setCounts] = useState({ all: 0, unanswered: 0, answered: 0, hidden: 0 });

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming productQuestionService.getAll can handle pagination, search, and status
      // You might need to adjust your backend API or mock data to fully support this
      const res = await productQuestionService.getAll({ page, limit, search: debouncedSearch, status });
      const allQuestions = Array.isArray(res?.data) ? res.data : [];

      const processedQuestions = allQuestions.map(q => ({
        ...q,
        hasOfficialAnswer: (q.answers || []).some(a => a.isOfficial),
      }));

      // In a real application, counts would ideally come from the API
      // For now, calculate client-side based on fetched data
      // For now, these are placeholder counts if the API doesn't provide them.
      // In a real scenario, the API should return these counts for accurate filtering.
      const currentQuestionsFiltered = allQuestions.filter(q => {
        const hasOfficialAnswer = (q.answers || []).some(a => a.isOfficial);
        if (status === 'all') return true;
        if (status === 'unanswered') return !hasOfficialAnswer && !q.isHidden;
        if (status === 'answered') return hasOfficialAnswer && !q.isHidden;
        if (status === 'hidden') return q.isHidden;
        return true;
      });

      const allCount = res.data?.counts?.all || res.data?.total || allQuestions.length;
      const unansweredCount = res.data?.counts?.unanswered || processedQuestions.filter(q => !q.hasOfficialAnswer && !q.isHidden).length;
      const answeredCount = res.data?.counts?.answered || processedQuestions.filter(q => q.hasOfficialAnswer && !q.isHidden).length;
      const hiddenCount = res.data?.counts?.hidden || processedQuestions.filter(q => q.isHidden).length;


      setCounts({
        all: allCount,
        unanswered: unansweredCount,
        answered: answeredCount,
        hidden: hiddenCount,
      });

      setTotal(res?.total || allQuestions.length); // Use API's total if available
      setQuestions(processedQuestions); // Ensure this is the paginated result from API
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      toast.error("Tải danh sách câu hỏi thất bại.");
      setQuestions([]);
      setTotal(0);
      setCounts({ all: 0, unanswered: 0, answered: 0, hidden: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, debouncedSearch]);


  useEffect(() => {
    // Socket listeners for real-time updates
    socket.on("new-question", (q) => {
      toast.info("Có câu hỏi mới từ người dùng.");
      fetchQuestions(); // Re-fetch questions when a new one arrives
    });
    socket.on("new-answer", (a) => {
      toast.info("Có phản hồi mới từ khách hàng hoặc quản trị viên.");
      fetchQuestions(); // Re-fetch questions when a new answer arrives
    });
    return () => {
      // Clean up socket listeners on component unmount
      socket.off("new-question");
      socket.off("new-answer");
    };
  }, [fetchQuestions]);

  useEffect(() => {
    fetchQuestions(); // Initial fetch when component mounts or dependencies change
  }, [fetchQuestions]);


  const handleToggleQuestionVisibility = useCallback(async (questionId) => {
    setLoading(true);
    try {
      await productQuestionService.toggleQuestionVisibility(questionId);
      toast.success('Cập nhật trạng thái câu hỏi thành công');
      fetchQuestions(); // Re-fetch to update the list
    } catch {
      toast.error('Cập nhật trạng thái câu hỏi thất bại');
    } finally {
      setLoading(false);
    }
  }, [fetchQuestions]);

  const formatDate = useCallback((d) => new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).replace(',', ''), []);

  return (
    <Box sx={{ p: 2 }}>

      {loading && <LoaderAdmin fullscreen />}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Quản lý Hỏi & Đáp Sản Phẩm
        </Typography>
        {/* No direct "Add New" equivalent for Q&A from admin, so this button is removed */}
      </Box>

      <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, mb: 2 }}>
        <Box display="flex" gap={2} mb={2}>
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={status === tab.value ? 'contained' : 'text'}
              onClick={() => {
                setStatus(tab.value);
                setPage(1); // Reset page on tab change
              }}
              sx={{ borderRadius: 2, fontWeight: status === tab.value ? 600 : 400 }}
            >
              {tab.label} ({counts[tab.value] || 0})
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end', // Aligned to flex-end to match BrandList's search input
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          {/* Removed bulk actions section */}
          <TextField
            size="small"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
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
                  <TableCell align="center">{(page - 1) * limit + idx + 1}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography fontWeight={600}>{q.user?.fullName || 'Ẩn danh'}</Typography>
                      <Typography variant="caption" color="text.secondary">{q.user?.email}</Typography>
                      <Typography variant="caption" color="text.disabled" display="block">{formatDate(q.createdAt)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <HighlightText text={q.content} highlight={debouncedSearch} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {q.answers.length} {q.answers.length === 1 ? 'tin nhắn' : 'tin nhắn'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{q.product?.name}</Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(q)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedQuestion(q); }} size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  Không có kết quả phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            navigate(`/admin/product-question/${selectedQuestion?.id}`);
            setAnchorEl(null);
          }}
        >
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={async () => {
            setAnchorEl(null);
            const actionLabel = selectedQuestion?.isHidden ? 'hiện' : 'ẩn';
            if (!(await confirmDelete(actionLabel, selectedQuestion?.content))) return;
            await handleToggleQuestionVisibility(selectedQuestion?.id);
          }}
          sx={{ color: selectedQuestion?.isHidden ? 'success.main' : 'error.main' }}
        >
          {selectedQuestion?.isHidden ? (
            <>
              <Visibility fontSize="small" sx={{ mr: 1 }} /> Hiện câu hỏi
            </>
          ) : (
            <>
              <VisibilityOff fontSize="small" sx={{ mr: 1 }} /> Ẩn câu hỏi
            </>
          )}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProductQuestions;