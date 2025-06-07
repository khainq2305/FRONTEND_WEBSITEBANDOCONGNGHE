import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { productQuestionService } from '@/services/admin/productQuestionService';

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [collapsed, setCollapsed] = useState({});

  const currentAdminId = 13;
  const currentAdminEmail = 'nhutnlmpc08486@gmail.com';

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return `${Math.floor(diff / 604800)} tuần trước`;
  };

  const fetchDetail = async () => {
    try {
      const res = await productQuestionService.getById(questionId);
      const { data } = res.data;
      const repliesData = Array.isArray(data.replies) ? data.replies : [];
      const replyMap = new Map();
      repliesData.forEach((r) => replyMap.set(r.id, r));

      const repliesWithReplyTo = repliesData.map((r) =>
        r.replyToId != null && r.replyToId !== data.id
          ? { ...r, replyTo: replyMap.get(r.replyToId) || null }
          : { ...r, replyTo: null }
      );

      setQuestion(data);
      setReplies(repliesWithReplyTo);
    } catch (err) {
      toast.error('Không thể tải chi tiết câu hỏi');
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [questionId]);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleSend = async () => {
    if (!reply.trim() || sending || cooldown > 0) return;
    setSending(true);

    try {
      let replyToId = null;
      if (replyingTo && replyingTo.id !== question.id) replyToId = replyingTo.id;

      const numericQuestionId = parseInt(questionId, 10);
      const res = await productQuestionService.reply({
        questionId: numericQuestionId,
        content: reply.trim(),
        replyToId,
        userId: currentAdminId
      });

      const returned = res.data.data;
      const newReply = {
        ...returned,
        fullName: 'Quản Trị Viên',
        email: currentAdminEmail,
        isAdminReply: true,
        createdAt: new Date().toISOString(),
        replyToId,
        replyTo: replyToId ? replyingTo : null
      };

      setReplies((prev) => [newReply, ...prev]);
      setReply('');
      setReplyingTo(null);
      setCooldown(5);
      toast.success('Đã gửi');
    } catch (err) {
      toast.error('Gửi phản hồi thất bại');
    } finally {
      setSending(false);
    }
  };

  const renderReplyInput = (level) => (
    <Box mt={1} pl={level * 4}>
      <Box display="flex" gap={1}>
        <TextField
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={cooldown > 0 ? `Chờ ${cooldown} giây...` : 'Nhập phản hồi...'}
          fullWidth
          multiline
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8f9fa'
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!reply.trim() || sending || cooldown > 0}
          sx={{ textTransform: 'none', borderRadius: 2, height: '56px' }}
        >
          {sending ? <CircularProgress size={20} color="inherit" /> : 'Gửi'}
        </Button>
      </Box>
    </Box>
  );

  const sortedReplies = React.useMemo(
    () => [...replies].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [replies]
  );

  const hasChildren = (id) => sortedReplies.some((r) => r.replyToId === id);

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderReplies = (parentId, level = 1) =>
    sortedReplies
      .filter((r) => (parentId === question.id ? r.replyToId == null : r.replyToId === parentId))
      .map((msg) => (
        <Box key={msg.id} mt={2} pl={level * 4}>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Avatar sx={{ bgcolor: msg.isAdminReply ? '#d32f2f' : '#1976d2', width: 40, height: 40 }}>
              {msg.isAdminReply ? 'Q' : msg.fullName?.[0] || 'U'}
            </Avatar>
            <Box flexGrow={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontWeight={600}>{msg.isAdminReply ? 'Quản Trị Viên' : msg.fullName}</Typography>
                <Typography variant="caption" color="text.secondary">{formatTime(msg.createdAt)}</Typography>
              </Box>
              <Typography sx={{ mt: 0.5 }}>{msg.content}</Typography>
              <Box display="flex" gap={2} mt={1}>
                {!msg.isAdminReply && (
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                    onClick={() => setReplyingTo(replyingTo?.id === msg.id ? null : msg)}
                  >
                    Phản hồi
                  </Typography>
                )}
                {hasChildren(msg.id) && (
                  <Typography
                    sx={{
                      color: 'gray',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                    onClick={() => toggleCollapse(msg.id)}
                  >
                    {collapsed[msg.id] ? 'Hiện bình luận con' : 'Ẩn bình luận con'}
                  </Typography>
                )}
              </Box>
              {replyingTo?.id === msg.id && renderReplyInput(level + 1)}
            </Box>
          </Box>
          {!collapsed[msg.id] && renderReplies(msg.id, level + 1)}
        </Box>
      ));

  return (
    <Box className="w-full bg-gray-100 py-10 px-4">
      <Box className="bg-white rounded-xl shadow max-w-screen-lg mx-auto p-4 sm:p-6 md:p-10">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Quay lại
        </Button>

        <Typography variant="h5" fontWeight="bold" mb={3}>
          Chi tiết câu hỏi
        </Typography>

        {!question ? (
          <Typography>Đang tải...</Typography>
        ) : (
          <Stack spacing={3}>
            <Box>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                  {question.fullName?.[0] || 'U'}
                </Avatar>
                <Box flexGrow={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight={600}>{question.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatTime(question.createdAt)}</Typography>
                  </Box>
                  <Typography sx={{ mt: 0.5 }}>{question.content}</Typography>
                  <Box display="flex" gap={2} mt={1}>
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                      onClick={() => setReplyingTo(replyingTo?.id === question.id ? null : question)}
                    >
                      Phản hồi
                    </Typography>
                    {hasChildren(question.id) && (
                      <Typography
                        sx={{
                          color: 'gray',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                        onClick={() => toggleCollapse(question.id)}
                      >
                        {collapsed[question.id] ? 'Hiện bình luận con' : 'Ẩn bình luận con'}
                      </Typography>
                    )}
                  </Box>
                  {replyingTo?.id === question.id && renderReplyInput(1)}
                </Box>
              </Box>
              {!collapsed[question.id] && renderReplies(question.id)}
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default QuestionDetailPage;
