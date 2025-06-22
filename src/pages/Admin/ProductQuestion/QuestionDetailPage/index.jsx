import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productQuestionService } from '@/services/admin/productQuestionService';

import {
    Box,
    Typography,
    CircularProgress,
    Stack,
    Button,
    TextField,
    Chip,
    Paper,
    Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const INDENT_PX_PER_LEVEL = 24;
const BORDER_THICKNESS = '1px';
const MAX_MESSAGE_LENGTH = 150;
const REPLY_TO_SNIPPET_LENGTH = 50;

const QuestionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyContents, setReplyContents] = useState({});
    const [activeReplyInputId, setActiveReplyInputId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedMessages, setExpandedMessages] = useState(new Set());
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

    const toggleCollapse = useCallback((idToToggle) => {
        setCollapsedReplies((s) => {
            const next = new Set(s);
            if (next.has(idToToggle)) next.delete(idToToggle);
            else next.add(idToToggle);
            return next;
        });
    }, []);

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
        if (!content.trim()) {
            toast.warning('Vui lòng nhập nội dung phản hồi');
            return;
        }
        setSubmitting(true);
        try {
            // finalParentId = null khi trả lời câu hỏi gốc,
            // hoặc là parentId của tin nhắn con khi trả lời tin nhắn con
            const finalParentId = (activeReplyInputId === question.id) ? null : parentId;

            await productQuestionService.reply(id, { content, parentId: finalParentId });
            toast.success('Phản hồi thành công');
            setReplyContents((prev) => ({ ...prev, [parentId]: '' }));
            setActiveReplyInputId(null);
            // Sau khi gửi thành công, đảm bảo phản hồi mới không bị thu gọn
            setCollapsedReplies(prev => {
                const newSet = new Set(prev);
                newSet.delete(parentId); // Đảm bảo tin nhắn cha không bị thu gọn
                if (finalParentId !== null) {
                    let currentId = finalParentId;
                    while(currentId) {
                        newSet.delete(currentId);
                        const parentMsg = findReplyToMessage(currentId);
                        currentId = parentMsg ? parentMsg.parentId : null;
                    }
                }
                return newSet;
            });
            await fetchQuestion();
        } catch (err) {
            toast.error('Gửi phản hồi thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (d) => (d ? new Date(d).toLocaleString('vi-VN') : 'N/A');

    const handleToggleReplyInput = (targetId) => {
        setActiveReplyInputId((prevId) => (prevId === targetId ? null : targetId));
        if (targetId && !replyContents[targetId]) {
            setReplyContents((prev) => ({ ...prev, [targetId]: '' }));
        }
    };

    const toggleMessageExpansion = useCallback((messageId) => {
        setExpandedMessages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(messageId)) {
                newSet.delete(messageId);
            } else {
                newSet.add(messageId);
            }
            return newSet;
        });
    }, []);

    const allConversationMessages = useMemo(() => {
        const messagesMap = new Map();
        if (question) messagesMap.set(question.id, { ...question, isMainQuestion: true });
        const collectRecursive = (arr) => {
            arr.forEach(item => {
                messagesMap.set(item.id, item);
                if (item.replies) collectRecursive(item.replies);
            });
        };
        collectRecursive(answers);
        return messagesMap;
    }, [question, answers]);

    const findReplyToMessage = useCallback((messageId) => {
        return messageId ? allConversationMessages.get(messageId) : null;
    }, [allConversationMessages]);

    const ReplyToSnippet = useCallback(({ parentMessage }) => {
        if (!parentMessage) return null;
        const snippetContent = parentMessage.content.substring(0, Math.min(parentMessage.content.length, REPLY_TO_SNIPPET_LENGTH)) + '...';
        return (
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    px: 1.5, py: 1,
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    mb: 1.5,
                    border: `${BORDER_THICKNESS} solid`,
                    borderColor: 'grey.200',
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    Trả lời: "{snippetContent}"
                </Typography>
            </Box>
        );
    }, []);

    const renderMessages = useCallback(
        (arr, level = 0) =>
            (arr || []).map((msg) => {
                const showReplyInput = activeReplyInputId === msg.id;
                const isHidden = msg.isHidden;

                // LOGIC QUAN TRỌNG ĐỂ XÁC ĐỊNH TIN NHẮN CHA HIỂN THỊ TRONG SNIPPET
                let parentMessageForSnippet = null;
                // Nếu msg có parentId, tìm tin nhắn đó
                if (msg.parentId) {
                    parentMessageForSnippet = findReplyToMessage(msg.parentId);
                } else if (msg.questionId === question?.id && msg.parentId === null) {
                    // Nếu là câu trả lời cấp 1 cho câu hỏi gốc (parentId null)
                    // và questionId của nó trùng với ID câu hỏi đang xem,
                    // thì tin nhắn cha để hiển thị snippet là chính câu hỏi gốc
                    parentMessageForSnippet = question;
                }

                const shouldShowReplyToText = !!parentMessageForSnippet;


                const isExpanded = expandedMessages.has(msg.id);
                const isTooLong = msg.content.length > MAX_MESSAGE_LENGTH;
                const displayedContent = isTooLong && !isExpanded
                    ? msg.content.substring(0, MAX_MESSAGE_LENGTH) + '...'
                    : msg.content;

                // Logic thu gọn/mở rộng nhánh phản hồi
                const isReplyThreadCollapsed = collapsedReplies.has(msg.id);
                const totalDesc = descendantCounts[msg.id] || 0;


                return (
                    <Box
                        key={msg.id}
                        sx={{
                            ml: level > 0 ? `${INDENT_PX_PER_LEVEL}px` : 0,
                            mb: 2,
                            opacity: isHidden ? 0.6 : 1,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                display: level > 0 ? 'block' : 'none',
                                position: 'absolute',
                                top: 0,
                                left: `-${INDENT_PX_PER_LEVEL / 2}px`,
                                bottom: 0,
                                width: BORDER_THICKNESS,
                                bgcolor: '#A7D9F8',
                                borderRadius: '1px',
                            },
                        }}
                    >
                        {shouldShowReplyToText && <ReplyToSnippet parentMessage={parentMessageForSnippet} />}

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: '8px',
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                border: `${BORDER_THICKNESS} solid`,
                                borderColor: msg.isOfficial ? '#1CA7EC' : 'grey.200',
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                <Typography fontWeight={600} fontSize="0.9rem" color="text.primary">
                                    {msg.isOfficial ? "Admin" : msg?.user?.fullName || 'Ẩn danh'}
                                </Typography>
                                {msg.isOfficial && (
                                    <Chip
                                        label="Admin"
                                        size="small"
                                        sx={{ bgcolor: '#1CA7EC', color: 'white', fontWeight: 600, fontSize: '0.75rem', borderRadius: '4px' }}
                                    />
                                )}
                                <Typography variant="caption" color="text.secondary" ml="auto">
                                    {formatDate(msg.createdAt)}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" mb={1.5} color="text.primary">
                                {displayedContent}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {isTooLong && (
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => toggleMessageExpansion(msg.id)}
                                        sx={{ fontSize: '0.8rem', textTransform: 'none', p: 0, minWidth: 'auto', color: 'info.main' }}
                                    >
                                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                    </Button>
                                )}
                                <Button
                                    variant="text" size="small" onClick={() => handleToggleReplyInput(msg.id)}
                                    sx={{ fontSize: '0.875rem', color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'transparent' }, textTransform: 'none', p: 0, minWidth: 'auto', ml: isTooLong ? 1 : 0 }}
                                >
                                    Trả lời
                                </Button>
                                {totalDesc > 0 && (
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => toggleCollapse(msg.id)}
                                        startIcon={isReplyThreadCollapsed ? <AddIcon /> : <RemoveIcon />}
                                        sx={{ fontSize: '0.8rem', textTransform: 'none', p: 0, minWidth: 'auto', ml: 1, color: 'text.secondary' }}
                                    >
                                        {isReplyThreadCollapsed ? `Xem ${totalDesc} phản hồi` : 'Ẩn phản hồi'}
                                    </Button>
                                )}
                            </Stack>
                        </Paper>

                        {showReplyInput && (
                            <Paper
                                elevation={1}
                                sx={{
                                    mt: 1.5, ml: 2, p: 2,
                                    bgcolor: 'background.paper',
                                    border: `${BORDER_THICKNESS} solid`,
                                    borderColor: 'grey.200',
                                    borderRadius: '8px',
                                }}
                            >
                                {/* Hiển thị ReplyToSnippet ở trên TextField cho form đang mở */}
                                {activeReplyInputId && (
                                     <ReplyToSnippet parentMessage={findReplyToMessage(activeReplyInputId)} />
                                )}

                                <TextField
                                    fullWidth multiline rows={3}
                                    placeholder="Nhập phản hồi..."
                                    value={replyContents[msg.id] || ''}
                                    onChange={(e) => setReplyContents((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                                    variant="outlined"
                                    sx={{ mb: 1.5 }}
                                />
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" size="small" onClick={() => handleReply(msg.id)} disabled={submitting || !replyContents[msg.id]?.trim()}
                                        sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, textTransform: 'none' }}
                                    >
                                        {submitting ? 'Đang gửi...' : 'Gửi'}
                                    </Button>
                                    <Button variant="outlined" size="small" onClick={() => setActiveReplyInputId(null)} sx={{ textTransform: 'none' }}>
                                        Hủy
                                    </Button>
                                </Stack>
                            </Paper>
                        )}
                        {!isReplyThreadCollapsed && msg.replies?.length > 0 && (
                            <Box mt={1}>{renderMessages(msg.replies, level + 1)}</Box>
                        )}
                    </Box>
                );
            }),
        // Cập nhật dependencies cho useCallback
        [activeReplyInputId, replyContents, submitting, handleReply, findReplyToMessage,
         expandedMessages, toggleMessageExpansion, ReplyToSnippet,
         collapsedReplies, descendantCounts, toggleCollapse, question?.id, question] // Thêm question vào dependency
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center"
                sx={{ minHeight: '100vh', bgcolor: 'grey.50', width: '100vw' }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary" ml={2}>Đang tải...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh', bgcolor: 'grey.50', color: 'text.primary',
                p: { xs: 2, sm: 3, md: 6 },
                maxWidth: '100%', width: '100%', mx: 0, pb: 6
            }}
        >
            <Button
                variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}
                sx={{ mb: 3, textTransform: 'none' }}
            >
                Quay lại
            </Button>

            <Stack spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h5" fontWeight={600} color="text.primary">
                            {question?.user?.fullName || 'Ẩn danh'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {question?.user?.email || 'N/A'} - {formatDate(question?.createdAt)}
                        </Typography>
                    </Box>
                    <Chip
                        label={question?.isHidden ? "Đã ẩn" : "Hiển thị"}
                        sx={{
                            bgcolor: question?.isHidden ? 'error.main' : 'primary.main',
                            color: 'white', fontWeight: 600,
                            borderRadius: '9999px', px: 1.5, py: 0.5, fontSize: '0.75rem', height: 'auto',
                            '& .MuiChip-label': { paddingLeft: '8px', paddingRight: '8px' },
                        }}
                    />
                </Stack>

                <Paper elevation={0} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: '8px', border: `${BORDER_THICKNESS} solid`, borderColor: 'grey.200' }}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>Sản phẩm:</Typography>
                    <Typography variant="body1" color="text.primary">{question?.product?.name || 'N/A'}</Typography>
                </Paper>
            </Stack>

            <Box>
                <Typography variant="h6" fontWeight={600} mb={1.5} color="text.primary">Cuộc trò chuyện</Typography>
                <Divider sx={{ mb: 3, borderColor: 'grey.300' }} />
            </Box>

            <Paper
                elevation={1}
                sx={{
                    maxHeight: '600px', overflowY: 'auto', p: 2, borderRadius: '8px',
                    bgcolor: 'background.paper', border: `${BORDER_THICKNESS} solid`, borderColor: 'grey.200',
                }}
            >
                {answers.length > 0 && (
                    <Stack direction="row" justifyContent="flex-end" spacing={1} mb={2}>
                        <Button onClick={collapseAllReplies} size="small" variant="outlined" startIcon={<RemoveIcon />} sx={{ textTransform: 'none' }}>Ẩn tất cả</Button>
                        <Button onClick={expandAllReplies} size="small" variant="outlined" startIcon={<AddIcon />} sx={{ textTransform: 'none' }}>Hiện tất cả</Button>
                    </Stack>
                )}

                {question && (
                    <Box key={question.id} sx={{ mb: 2 }}>
                        {/* Đây là tin nhắn gốc. Hiển thị ReplyToSnippet khi form phản hồi cho nó active. */}
                        {activeReplyInputId === question.id && (
                            <ReplyToSnippet parentMessage={question} /> // Gửi question làm parent
                        )}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2, borderRadius: '8px',
                                bgcolor: 'background.paper', color: 'text.primary',
                                border: `${BORDER_THICKNESS} solid`, borderColor: 'grey.200',
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                <Typography fontWeight={600} fontSize="0.9rem">
                                    {question?.user?.fullName || 'Ẩn danh'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" ml="auto">
                                    {formatDate(question.createdAt)}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" mb={1.5} color="text.primary">
                                {question.content.length > MAX_MESSAGE_LENGTH && !expandedMessages.has(question.id)
                                    ? question.content.substring(0, MAX_MESSAGE_LENGTH) + '...'
                                    : question.content}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {question.content.length > MAX_MESSAGE_LENGTH && (
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => toggleMessageExpansion(question.id)}
                                        sx={{ fontSize: '0.8rem', textTransform: 'none', p: 0, minWidth: 'auto', color: 'info.main' }}
                                    >
                                        {expandedMessages.has(question.id) ? 'Thu gọn' : 'Xem thêm'}
                                    </Button>
                                )}
                                <Button
                                    variant="text" size="small" onClick={() => handleToggleReplyInput(question.id)}
                                    sx={{ fontSize: '0.875rem', color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'transparent' }, textTransform: 'none', p: 0, minWidth: 'auto' }}
                                >
                                    Trả lời
                                </Button>
                                {/* Nút ẩn/hiện cho tin nhắn gốc không có, vì nó là gốc */}
                            </Stack>
                        </Paper>

                        {activeReplyInputId === question.id && (
                            <Paper
                                elevation={1}
                                sx={{
                                    mt: 1.5, ml: 2, p: 2,
                                    bgcolor: 'background.paper',
                                    border: `${BORDER_THICKNESS} solid`,
                                    borderColor: 'grey.200',
                                    borderRadius: '8px',
                                }}
                            >
                                {/* Hiển thị ReplyToSnippet ở trên TextField cho form đang mở */}
                                {activeReplyInputId && (
                                     <ReplyToSnippet parentMessage={findReplyToMessage(activeReplyInputId)} />
                                )}
                                <TextField
                                    fullWidth multiline rows={3}
                                    placeholder="Nhập phản hồi..."
                                    value={replyContents[question.id] || ''}
                                    onChange={(e) => setReplyContents((prev) => ({ ...prev, [question.id]: e.target.value }))}
                                    variant="outlined"
                                    sx={{ mb: 1.5 }}
                                />
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" size="small" onClick={() => handleReply(question.id)} disabled={submitting || !replyContents[question.id]?.trim()}
                                        sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, textTransform: 'none' }}
                                    >
                                        {submitting ? 'Đang gửi...' : 'Gửi'}
                                    </Button>
                                    <Button variant="outlined" size="small" onClick={() => setActiveReplyInputId(null)} sx={{ textTransform: 'none' }}>
                                        Hủy
                                    </Button>
                                </Stack>
                            </Paper>
                        )}
                        {/* renderMessages cho các câu trả lời của câu hỏi gốc */}
                        {answers.length > 0 && (
                            <Box mt={1}>{renderMessages(answers, 1)}</Box>
                        )}
                    </Box>
                )}

                { (!question && answers.length === 0) || (question && answers.length === 0 && activeReplyInputId !== question.id) ? (
                    <Box sx={{ mt: 6, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="h3" mb={1}>💬</Typography>
                        <Typography variant="body1" color="text.secondary">Chưa có phản hồi nào.</Typography>
                    </Box>
                ) : null }
            </Paper>
        </Box>
    );
};

export default QuestionDetailPage;