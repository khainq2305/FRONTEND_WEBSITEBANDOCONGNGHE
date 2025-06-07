import { useState, useEffect } from 'react';
import {
  Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, Avatar
} from '@mui/material';
import { Search, MoreVert, CheckCircleOutline, HelpOutline } from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';

import Toastify from '@/components/common/Toastify';
import LoaderAdmin from '@/components/common/Loader';
import Pagination from '@/components/common/Pagination';
import { productQuestionService } from '@/services/admin/productQuestionService';

const tabLabels = {
  all: 'Tất cả',
  answered: 'Đã trả lời',
  unanswered: 'Chưa trả lời'
};

const ProductQuestions = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [counts, setCounts] = useState({ all: 0, answered: 0, unanswered: 0 });
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [page, limit, status, debouncedSearch]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await productQuestionService.getAll({
        page,
        limit,
        search: debouncedSearch.trim(),
        status
      });
      const { data = [], total = 0, counts = {} } = res.data || {};
      setQuestions(data);
      setTotal(total);
      setCounts(counts);
    } catch (error) {
      Toastify.error('Lỗi khi tải dữ liệu câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toastify />
      {loading && <LoaderAdmin fullscreen />}
      <Typography variant="h6" fontWeight={600}>💬 Quản lý câu hỏi sản phẩm</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} my={2} flexWrap="wrap">
        <Box display="flex" gap={2} flexWrap="wrap">
          {Object.entries(tabLabels).map(([value, label]) => (
            <Button
              key={value}
              variant={status === value ? 'contained' : 'text'}
              onClick={() => { setStatus(value); setPage(1); }}
              sx={{ borderRadius: 2, fontWeight: status === value ? 600 : 400 }}
            >
              {label} ({counts[value] || 0})
            </Button>
          ))}
        </Box>

        <TextField
          size="small"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (<Search sx={{ color: 'gray', mr: 1 }} />)
          }}
        />
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Người hỏi</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Câu hỏi</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">...</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Không tìm thấy câu hỏi nào.</TableCell>
                </TableRow>
              ) : (
                questions.map((q, i) => {
                  const isAnswered = q.replies?.length > 0;
                  return (
                    <TableRow key={q.id} hover>
                      <TableCell>{(page - 1) * limit + i + 1}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar src={`https://i.pravatar.cc/150?u=${q.email}`} />
                          <Box>
                            <Typography fontWeight={600}>{q.fullName}</Typography>
                            <Typography variant="caption">{q.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{q.productName}</TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Tooltip title={q.content} arrow>
                          <Typography variant="body2" noWrap>
                            {q.content}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {isAnswered ? (
                          <Chip label="Đã trả lời" color="success" size="small" icon={<CheckCircleOutline fontSize="small" />} />
                        ) : (
                          <Chip
                            label="Chưa trả lời"
                            color="warning"
                            size="small"
                            icon={<HelpOutline fontSize="small" />}
                            sx={{
                              animation: 'pulse 1.5s infinite',
                              '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' },
                                '100%': { transform: 'scale(1)' }
                              }
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => navigate(`/admin/product-question/${q.id}`)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {total > limit && (
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          onPageSizeChange={(val) => { setPage(1); setLimit(val); }}
        />
      )}
    </Box>
  );
};

export default ProductQuestions;
