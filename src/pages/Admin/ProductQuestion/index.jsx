import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, TextField,
  IconButton, Chip, InputAdornment
} from '@mui/material';
import {
  ExpandMore, Reply, Search,
  Visibility, VisibilityOff
} from '@mui/icons-material';
import Toastify from 'components/common/Toastify';
import Pagination from 'components/common/Pagination';
import ReplyDialog from './ReplyDialog';
import QuestionDetailDialog from './QuestionDetailDialog';

const statusTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'answered', label: 'Đã trả lời' },
  { value: 'unanswered', label: 'Chưa trả lời' },
  { value: 'hidden', label: 'Đã ẩn' }
];

const mockQuestions = [
  {
    question_id: 1,
    product_id: 101,
    product_name: 'Smartphone X200',
    fullname: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    content: 'Sản phẩm này còn hàng không?',
    is_hidden: false,
    created_at: '2024-05-01T10:00:00Z',
    replies: []
  },
  {
    question_id: 2,
    product_id: 102,
    product_name: 'Laptop Pro 15',
    fullname: 'Trần Thị B',
    email: 'tranthib@example.com',
    content: 'Phí vận chuyển là bao nhiêu?',
    is_hidden: false,
    created_at: '2024-05-02T09:15:00Z',
    replies: [
      {
        question_id: 3,
        fullname: 'Admin',
        content: 'Phí vận chuyển là 30.000đ bạn nhé.',
        created_at: '2024-05-02T11:00:00Z',
        is_admin_reply: true
      }
    ]
  }
];

const ProductQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewDetail, setViewDetail] = useState(null);
  const [reply, setReply] = useState('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const itemsPerPage = 5;

  useEffect(() => {
    setQuestions(mockQuestions);
  }, []);

  useEffect(() => {
    let result = [...questions];
    if (searchTerm) {
      result = result.filter(q =>
        q.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (status === 'answered') {
      result = result.filter(q => q.replies.length > 0);
    } else if (status === 'unanswered') {
      result = result.filter(q => q.replies.length === 0);
    } else if (status === 'hidden') {
      result = result.filter(q => q.is_hidden);
    }
    setFilteredQuestions(result);
    setPage(1);
  }, [questions, searchTerm, status]);

  const paginated = filteredQuestions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleVisibility = (id) => {
    const updated = questions.map(q =>
      q.question_id === id ? { ...q, is_hidden: !q.is_hidden } : q
    );
    setQuestions(updated);
    Toastify.success('Đã cập nhật trạng thái câu hỏi');
  };

  const handleReply = () => {
    if (!reply.trim()) return Toastify.error('Vui lòng nhập nội dung phản hồi');
    const updated = questions.map(q => {
      if (q.question_id === selected.question_id) {
        const newReply = {
          question_id: Date.now(),
          fullname: 'Admin',
          content: reply,
          created_at: new Date().toISOString(),
          is_admin_reply: true
        };
        return { ...q, replies: [...q.replies, newReply] };
      }
      return q;
    });
    setQuestions(updated);
    setSelected(null);
    setReply('');
    Toastify.success('Đã gửi phản hồi');
  };

  const formatDateTime = (str) => new Date(str).toLocaleString('vi-VN');

  const getStatusChip = (q) => {
    if (q.is_hidden) return <Chip label="Đã ẩn" size="small" color="error" />;
    if (q.replies.length > 0) return <Chip label="Đã trả lời" size="small" color="success" />;
    return <Chip label="Chưa trả lời" size="small" color="warning" />;
  };

  return (
    <Box sx={{ p: 2 }}>
    

      <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee', mb: 2 }}>
        {statusTabs.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            sx={{
              pb: 1, px: 1, cursor: 'pointer',
              borderBottom: status === tab.value ? '2px solid red' : '2px solid transparent',
              color: status === tab.value ? 'red' : 'black',
              fontWeight: status === tab.value ? 600 : 400,
              fontSize: 15
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* Tìm kiếm và tổng câu hỏi ngang hàng */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm sản phẩm, người hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            )
          }}
          sx={{ width: 360 }}
        />
        <Typography variant="subtitle1" fontWeight={500}>
          Tổng cộng: {filteredQuestions.length} câu hỏi
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Người hỏi</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Ngày hỏi</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((q, idx) => (
              <TableRow key={q.question_id} hover>
                <TableCell>{(page - 1) * itemsPerPage + idx + 1}</TableCell>
                <TableCell><Typography fontWeight={600}>{q.product_name}</Typography></TableCell>
                <TableCell>
                  <Typography>{q.fullname}</Typography>
                  <Typography variant="caption" color="text.secondary">{q.email}</Typography>
                </TableCell>
                <TableCell>{q.content}</TableCell>
                <TableCell>{formatDateTime(q.created_at)}</TableCell>
                <TableCell>{getStatusChip(q)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => toggleVisibility(q.question_id)}>
                    {q.is_hidden ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <IconButton onClick={() => setSelected(q)}><Reply /></IconButton>
                  <IconButton onClick={() => setViewDetail(q)}><ExpandMore /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <Pagination
          currentPage={page}
          totalItems={filteredQuestions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </Box>

      <ReplyDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onSubmit={handleReply}
        question={selected}
        value={reply}
        onChange={setReply}
      />

      <QuestionDetailDialog
        open={Boolean(viewDetail)}
        onClose={() => setViewDetail(null)}
        question={viewDetail}
        formatDateTime={formatDateTime}
      />

    
    </Box>
  );
};

export default ProductQuestions;
