import React, { useState, useEffect, useCallback } from 'react'; // <--- ADDED React import here
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
    Stack,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import { Search, ChatBubbleOutline, AccessTime, CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { productQuestionService } from '@/services/admin/productQuestionService';
import Pagination from '@/components/common/Pagination';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const statusTabs = [
    { value: 'all', label: 'Tất cả' },
    { value: 'unanswered', label: 'Chờ trả lời' },
    { value: 'answered', label: 'Đã trả lời' },
    { value: 'hidden', label: 'Đã ẩn' },
];

const ProductQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const navigate = useNavigate();

    const getStatusChip = useCallback((q) => {
        if (q.isHidden) return <Chip label="Đã ẩn" size="small" color="error" sx={{ fontWeight: 600 }} />;
        const answered = (q.answers || []).some(a => a.isOfficial);
        return answered
            ? <Chip label="Đã trả lời" size="small" color="success" sx={{ fontWeight: 600 }} />
            : <Chip label="Chờ trả lời" size="small" color="warning" sx={{ fontWeight: 600 }} />;
    }, []);

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await productQuestionService.getAll();
            const allQuestions = Array.isArray(res?.data) ? res.data : [];

            const processedQuestions = allQuestions.map(q => ({
                ...q,
                hasOfficialAnswer: (q.answers || []).some(a => a.isOfficial),
            }));

            let filtered = processedQuestions;
            if (status === 'answered') filtered = processedQuestions.filter(q => q.hasOfficialAnswer && !q.isHidden);
            else if (status === 'unanswered') filtered = processedQuestions.filter(q => !q.hasOfficialAnswer && !q.isHidden);
            else if (status === 'hidden') filtered = processedQuestions.filter(q => q.isHidden);

            if (searchTerm.trim()) {
                const key = searchTerm.toLowerCase();
                filtered = filtered.filter(q =>
                    q.content.toLowerCase().includes(key) ||
                    q.user?.fullName?.toLowerCase().includes(key) ||
                    q.product?.name?.toLowerCase().includes(key)
                );
            }

            setTotal(filtered.length);
            setQuestions(filtered.slice((page - 1) * limit, page * limit));
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            toast.error("Tải danh sách câu hỏi thất bại.");
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, status, searchTerm]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleToggleQuestionVisibility = useCallback(async (questionId) => {
        setLoading(true);
        try {
            await productQuestionService.toggleQuestionVisibility(questionId);
            toast.success('Cập nhật trạng thái câu hỏi thành công');
            await fetchQuestions();
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

    const totalQuestionsCount = total;
    const pendingQuestionsCount = questions.filter(q => !q.hasOfficialAnswer && !q.isHidden).length;
    const answeredQuestionsCount = questions.filter(q => q.hasOfficialAnswer && !q.isHidden).length;

    // renderStatCard is a helper function, needs React to be in scope
    const renderStatCard = (title, count, description, icon, bgColor, iconBgColor, iconColor, textColor, shadowColor) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                background: bgColor,
                border: `1px solid ${iconBgColor}`,
                boxShadow: shadowColor || 'none',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="body2" fontWeight={500} color={textColor || 'text.secondary'} mb={0.5}>{title}</Typography>
                    <Typography variant="h4" fontWeight={700} color={textColor || 'text.primary'}>{count}</Typography>
                </Box>
                <Box sx={{ height: 48, width: 48, bgcolor: iconBgColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {React.cloneElement(icon, { sx: { fontSize: 28, color: iconColor } })}
                </Box>
            </Box>
            <Typography variant="body2" color={textColor || 'text.secondary'} mt={2}>{description}</Typography>
        </Paper>
    );

    return (
        <Box sx={{
            width: '100%', minHeight: '100vh', bgcolor: 'background.default',
            p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center"
                    sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 9999 }}>
                    <CircularProgress size={60} />
                </Box>
            )}

            <Box sx={{ width: '100%', maxWidth: '1200px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header */}
                <Box textAlign="center" mb={3}>
                    <Typography variant="h4" fontWeight={700} mb={1} color="text.primary">Hỏi & Đáp Sản Phẩm</Typography>
                    <Typography variant="body1" color="text.secondary">Quản lý câu hỏi từ khách hàng</Typography>
                </Box>

                {/* Statistics Cards */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={3}>
                    {renderStatCard(
                        "Tổng câu hỏi", total, "Tất cả câu hỏi trong hệ thống",
                        <ChatBubbleOutline />,
                        'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
                        '#e2e8f0',
                        '#64748b',
                        'text.primary',
                        '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'
                    )}
                    {renderStatCard(
                        "Chờ trả lời", pendingQuestionsCount, "Cần xử lý ngay",
                        <AccessTime />,
                        'linear-gradient(to bottom right, #fffbeb, #fff1f2)',
                        '#fbd38d',
                        '#d97706',
                        '#d97706',
                        '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'
                    )}
                    {renderStatCard(
                        "Đã trả lời", answeredQuestionsCount, "Đã hoàn thành",
                        <CheckCircle />,
                        'linear-gradient(to bottom right, #ecfdf5, #dcfce7)',
                        '#6ee7b7',
                        '#047857',
                        '#047857',
                        '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)'
                    )}
                </Box>

                {/* Filter Tabs + Search */}
                <Paper sx={{ bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {statusTabs.map(tab => (
                                <Button
                                    key={tab.value}
                                    variant={status === tab.value ? 'contained' : 'outlined'}
                                    onClick={() => { setStatus(tab.value); setPage(1); }}
                                    size="small"
                                    sx={{
                                        borderRadius: '8px', fontWeight: 500, textTransform: 'none',
                                        borderColor: status === tab.value ? 'primary.main' : 'grey.300',
                                        color: status === tab.value ? 'white' : 'text.primary',
                                        bgcolor: status === tab.value ? 'primary.main' : 'white',
                                        '&:hover': {
                                            bgcolor: status === tab.value ? 'primary.dark' : 'grey.100',
                                            borderColor: status === tab.value ? 'primary.dark' : 'grey.400',
                                        }
                                    }}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </Box>
                        <TextField
                            size="small" placeholder="Tìm kiếm..." value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            sx={{ width: { xs: '100%', sm: 280 } }}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>),
                                sx: { borderRadius: '8px', bgcolor: 'grey.50' }
                            }}
                        />
                    </Stack>
                </Paper>

                {/* Questions Table */}
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                            <TableRow>
                                <TableCell sx={{ width: 40, borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>#</TableCell>
                                <TableCell sx={{ borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>Người hỏi</TableCell>
                                <TableCell sx={{ borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>Nội dung</TableCell>
                                <TableCell sx={{ borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>Sản phẩm</TableCell>
                                <TableCell sx={{ width: 120, borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>Trạng thái</TableCell>
                                <TableCell align="right" sx={{ width: 120, borderBottom: 'none', fontWeight: 600, color: 'text.secondary' }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.length > 0 ? (
                                questions.map((q, idx) => (
                                    <TableRow key={q.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: 500 }}>{(page - 1) * limit + idx + 1}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography fontWeight={600}>{q.user?.fullName || 'Ẩn danh'}</Typography>
                                                <Typography variant="caption" color="text.secondary">{q.user?.email}</Typography>
                                                <Typography variant="caption" color="text.disabled" display="block">{formatDate(q.createdAt)}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Tooltip title={q.content} arrow placement="top">
                                                <Typography noWrap>{q.content}</Typography>
                                            </Tooltip>
                                            <Typography variant="caption" color="text.secondary">
                                                {q.answers.length} {q.answers.length === 1 ? 'tin nhắn' : 'tin nhắn'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{q.product?.name}</Typography>
                                        </TableCell>
                                        <TableCell>{getStatusChip(q)}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                                                <Button
                                                    variant="outlined" size="small"
                                                    onClick={() => navigate(`/admin/product-question/${q.id}`)}
                                                    sx={{ textTransform: 'none', borderRadius: '8px' }}
                                                >
                                                    Xem
                                                </Button>
                                                <Tooltip title={q.isHidden ? "Hiện câu hỏi" : "Ẩn câu hỏi"} arrow>
                                                    <IconButton
                                                        size="small" color={q.isHidden ? "success" : "error"}
                                                        onClick={() => handleToggleQuestionVisibility(q.id)}
                                                    >
                                                        {q.isHidden ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        Không tìm thấy câu hỏi nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {total > limit && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            currentPage={page} totalItems={total} itemsPerPage={limit}
                            onPageChange={setPage}
                            onPageSizeChange={val => { setPage(1); setLimit(val); }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ProductQuestions;