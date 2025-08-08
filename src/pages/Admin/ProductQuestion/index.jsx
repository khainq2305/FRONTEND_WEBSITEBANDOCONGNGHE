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
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import Pagination from '../../../components/common/Pagination';
import HighlightText from '@/components/Admin/HighlightText';
import LoaderAdmin from '@/components/common/Loader';
import { confirmDelete } from '@/components/common/ConfirmDeleteDialog';
import { productQuestionService } from '@/services/admin/productQuestionService';
import socket from "@/constants/socket";

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
    return question.isAnswered
        ? <Chip label="Đã trả lời" color="success" size="small" />
        : <Chip label="Chờ trả lời" color="warning" size="small" />;
};

const ProductQuestions = () => {
    const navigate = useNavigate();
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

    const [counts, setCounts] = useState({ all: 0, unanswered: 0, answered: 0, hidden: 0 });
    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await productQuestionService.getAll({
                page,
                pageSize: limit,
                search: debouncedSearch,
                filter: status
            });

            // ✅ FIX: Truy cập đúng vào res.data.*
            const allQuestions = res?.data?.data || [];
            const totalItems = res?.data?.pagination?.totalItems || 0;
            const newCounts = res?.data?.counts || counts;

            setTotal(totalItems);
            setQuestions(allQuestions);
            setCounts(newCounts);
        } catch (error) {
            console.error("❌ Lỗi khi tải danh sách câu hỏi:", error);
            toast.error("Tải danh sách câu hỏi thất bại.");
            setQuestions([]);
            setTotal(0);
            setCounts({ all: 0, unanswered: 0, answered: 0, hidden: 0 });
        } finally {
            setLoading(false);
        }
    }, [page, limit, status, debouncedSearch]);


    useEffect(() => {
        socket.on("new-question", () => {
            toast.info("Có câu hỏi mới từ người dùng.");
            fetchQuestions();
        });
        socket.on("new-answer", () => {
            toast.info("Có phản hồi mới từ khách hàng hoặc quản trị viên.");
            fetchQuestions();
        });
        return () => {
            socket.off("new-question");
            socket.off("new-answer");
        };
    }, [fetchQuestions]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleToggleQuestionVisibility = useCallback(async (questionId) => {
        setLoading(true);
        try {
            await productQuestionService.toggleQuestionVisibility(questionId);
            toast.success('Cập nhật trạng thái câu hỏi thành công');
            fetchQuestions();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái câu hỏi:", error);
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
            </Box>
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
                            {tab.label} ({counts[tab.value] || 0})
                        </Button>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm câu hỏi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                            <TableCell>Nội dung câu hỏi</TableCell>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.length > 0 ? (
                            questions.map((q, index) => (
                                <TableRow key={q.id} hover>
                                    <TableCell align="center">{(page - 1) * limit + index + 1}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography fontWeight={600}>{q.user?.fullName || `#${q.userId}`}</Typography>
                                            <Typography variant="caption" color="text.secondary">{q.user?.email || ''}</Typography>
                                            <Typography variant="caption" color="text.disabled" display="block">{formatDate(q.createdAt)}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        <HighlightText text={q.content} highlight={debouncedSearch} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                            {q.product?.name || `#${q.productId}`}
                                        </Typography>
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
                        if (!(await confirmDelete(actionLabel, 'câu hỏi này'))) return;
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