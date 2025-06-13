import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    CircularProgress,
    Stack,
    Button,
    TextField,
    Chip,
    Paper, // Thêm Paper để tạo các khối trực quan
    Divider, // Thêm Divider để ngăn cách các phần
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { productQuestionService } from '@/services/admin/productQuestionService';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const INDENT_PX_PER_LEVEL = 5;

const QuestionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyContents, setReplyContents] = useState({});
    const [activeReplyInputId, setActiveReplyInputId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [collapsedReplies, setCollapsedReplies] = useState(new Set());

    const fetchQuestion = useCallback(async () => {
        setLoading(true);
        try {
            const res = await productQuestionService.getById(id);
            if (!res?.data) throw new Error();
            setQuestion(res.data);
            setAnswers(res.data.answers || []);
        } catch (e) {
            toast.error('Không tìm thấy câu hỏi');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) fetchQuestion();
    }, [id, fetchQuestion]);

    const descendantCounts = useMemo(() => {
        const counts = {};
        const count = (arr) => (arr || []).reduce((sum, c) => sum + 1 + count(c.replies), 0);
        const walk = (arr = []) => arr.forEach((c) => {
            counts[c.id] = count(c.replies);
            walk(c.replies);
        });
        walk(answers);
        return counts;
    }, [answers]);

    const toggleCollapse = (idToToggle) =>
        setCollapsedReplies((s) => {
            const next = new Set(s);
            if (next.has(idToToggle)) next.delete(idToToggle);
            else next.add(idToToggle);
            return next;
        });

    const collapseAllReplies = useCallback(() => {
        const ids = new Set();
        const collect = (arr) => arr.forEach((a) => {
            if (a.replies?.length) ids.add(a.id);
            collect(a.replies || []);
        });
        collect(answers);
        setCollapsedReplies(ids);
    }, [answers]);

    const expandAllReplies = useCallback(() => setCollapsedReplies(new Set()), []);

    const handleReply = async (parentId) => {
        const content = replyContents[parentId] || '';
        if (!content.trim()) return toast.warning('Vui lòng nhập nội dung phản hồi');
        setSubmitting(true);
        try {
            await productQuestionService.reply(id, { content, parentId });
            toast.success('Phản hồi thành công');
            setReplyContents((prev) => ({ ...prev, [parentId]: '' }));
            setActiveReplyInputId(null);
            await fetchQuestion();
        } catch (err) {
            toast.error('Gửi phản hồi thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (d) => new Date(d).toLocaleString('vi-VN');

    const handleToggleAnswerVisibility = async (answerId) => {
        try {
            await productQuestionService.toggleVisibility(answerId);
            await fetchQuestion();
            toast.success('Cập nhật trạng thái phản hồi thành công');
        } catch {
            toast.error('Cập nhật trạng thái phản hồi thất bại');
        }
    };

    const handleToggleQuestionVisibility = async () => {
        if (!question) return;
        try {
            const res = await productQuestionService.toggleQuestionVisibility(question.id);
            setQuestion((prev) => ({ ...prev, isHidden: res.data.isHidden }));
            toast.success('Cập nhật trạng thái câu hỏi thành công');
        } catch {
            toast.error('Cập nhật trạng thái câu hỏi thất bại');
        }
    };

    const handleToggleReplyInput = (targetId) => {
        setActiveReplyInputId((prevId) => (prevId === targetId ? null : targetId));
        if (targetId && !replyContents[targetId]) {
            setReplyContents((prev) => ({ ...prev, [targetId]: '' }));
        }
    };

    const renderNestedReplies = useCallback(
        (arr, level = 0) =>
            (arr || []).map((r) => {
                const isCollapsed = collapsedReplies.has(r.id);
                const totalDesc = descendantCounts[r.id] || 0;
                const showReplyInput = activeReplyInputId === r.id;

                return (
                    <Box
                        key={r.id}
                        sx={{
                            ml: level > 0 ? INDENT_PX_PER_LEVEL : 0, // Chỉ áp dụng indent cho các cấp > 0
                            mt: 2,
                            opacity: r.isHidden ? 0.6 : 1,
                        }}
                    >
                        <Stack direction="row" spacing={2}>
                            <Avatar sx={{ bgcolor: r.isOfficial ? 'primary.main' : 'grey.500', width: 36, height: 36 }}>
                                {r?.user?.fullName?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                            <Box flex={1}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography fontWeight={600}>
                                        {r.isOfficial ? 'Quản Trị Viên' : r?.user?.fullName || 'Ẩn danh'}
                                    </Typography>
                                    {r.isOfficial && <Chip label="QTV" color="primary" size="small" sx={{ fontWeight: 600 }} />}
                                    <Typography variant="caption" color="text.secondary" ml="auto">
                                        {formatDate(r.createdAt)}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" mt={0.5}>{r.content}</Typography>
                                <Stack direction="row" spacing={1} mt={1}>
                                    <Button size="small" onClick={() => handleToggleAnswerVisibility(r.id)} color={r.isHidden ? 'success' : 'error'}>
                                        {r.isHidden ? 'Hiện' : 'Ẩn'}
                                    </Button>
                                    <Button size="small" onClick={() => handleToggleReplyInput(r.id)}>
                                        Phản hồi
                                    </Button>
                                    {totalDesc > 0 && (
                                        <Button size="small" onClick={() => toggleCollapse(r.id)} startIcon={isCollapsed ? <AddIcon /> : <RemoveIcon />}>
                                            {isCollapsed ? `Xem ${totalDesc} phản hồi` : 'Ẩn phản hồi'}
                                        </Button>
                                    )}
                                </Stack>
                                {showReplyInput && (
                                    <Box sx={{ mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            value={replyContents[r.id] || ''}
                                            onChange={(e) => setReplyContents((prev) => ({ ...prev, [r.id]: e.target.value }))}
                                            placeholder="Nhập nội dung phản hồi..."
                                        />
                                        <Stack direction="row" spacing={1} mt={1}>
                                            <Button variant="contained" onClick={() => handleReply(r.id)} disabled={submitting}>
                                                {submitting ? 'Đang gửi...' : 'Gửi'}
                                            </Button>
                                            <Button onClick={() => setActiveReplyInputId(null)}>Hủy</Button>
                                        </Stack>
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                        {!isCollapsed && r.replies?.length > 0 && (
                            <Box mt={2}>{renderNestedReplies(r.replies, level + 1)}</Box>
                        )}
                    </Box>
                );
            }),
        [collapsedReplies, descendantCounts, activeReplyInputId, replyContents, submitting, handleReply] // Thêm handleReply để tránh warning
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box p={3} sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
                Quay lại
            </Button>

            <Stack spacing={4}>
                {/* --- KHỐI CÂU HỎI VÀ FORM PHẢN HỒI --- */}
                <Paper elevation={3} sx={{ p: 3, opacity: question?.isHidden ? 0.7 : 1 }}>
                    <Typography variant="h5" fontWeight={700} mb={2}>Chi tiết câu hỏi</Typography>
                    <Stack spacing={1.5}>
                        <Typography><strong>Sản phẩm:</strong> {question?.product?.name}</Typography>
                        <Typography><strong>Người hỏi:</strong> {question?.user?.fullName || 'Ẩn danh'}</Typography>
                        <Typography variant="body2" color="text.secondary"><strong>Thời gian:</strong> {formatDate(question?.createdAt)}</Typography>
                        <Typography sx={{ mt: 1 }}><strong>Nội dung:</strong> {question?.content}</Typography>
                    </Stack>
                    <Button onClick={handleToggleQuestionVisibility} variant="contained" color={question?.isHidden ? 'success' : 'error'} sx={{ mt: 2 }}>
                        {question?.isHidden ? 'Hiện câu hỏi' : 'Ẩn câu hỏi'}
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight={700} mb={2}>Phản hồi cho câu hỏi này</Typography>
                    <TextField
                        multiline
                        fullWidth
                        rows={4}
                        value={replyContents[null] || ''}
                        onChange={(e) => setReplyContents((prev) => ({ ...prev, [null]: e.target.value }))}
                        placeholder="Nhập phản hồi của bạn..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={() => handleReply(null)} disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </Button>
                </Paper>

                {/* --- KHỐI DANH SÁCH CÁC CÂU TRẢ LỜI --- */}
                <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700}>Danh sách phản hồi ({answers.length})</Typography>
                        {answers.length > 0 && (
                            <Stack direction="row" spacing={1}>
                                <Button onClick={collapseAllReplies} size="small" variant="outlined" startIcon={<RemoveIcon />}>Ẩn tất cả</Button>
                                <Button onClick={expandAllReplies} size="small" variant="outlined" startIcon={<AddIcon />}>Hiện tất cả</Button>
                            </Stack>
                        )}
                    </Stack>
                    <Stack spacing={3}>
                        {answers.length > 0 ? answers.map((a) => (
                            // Mỗi câu trả lời gốc nằm trong một Paper riêng
                            <Paper key={a.id} elevation={2} sx={{ p: 2 }}>
                                {renderNestedReplies([a], 0)}
                            </Paper>
                        )) : (
                            <Typography color="text.secondary" fontStyle="italic">Chưa có phản hồi nào.</Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default QuestionDetailPage;