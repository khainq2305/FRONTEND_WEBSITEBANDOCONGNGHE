// src/pages/Admin/MiniGame/SpinHistory/index.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
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
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import Pagination from '@/components/common/Pagination';
import HighlightText from '@/components/Admin/HighlightText';
import LoaderAdmin from '@/components/common/Loader';
import Toastify from '@/components/common/Toastify';
import { spinHistoryService } from '@/services/admin/spinHistoryService';

const statusTabs = [
    { value: 'all', label: 'Tất Cả' },
    { value: 'won', label: 'Đã Trúng' },
    { value: 'none_won', label: 'Không Trúng' },
];

const SpinHistoryAdminPage = () => {
    const [historyRecords, setHistoryRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [counts, setCounts] = useState({ all: 0, won: 0, none_won: 0 });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { page, limit, search: debouncedSearch };

            if (statusFilter !== 'all') {
                params.rewardId = statusFilter;
            }

            console.log("Sending params (SpinHistory index.jsx):", params);
            const res = await spinHistoryService.getAll(params);
            console.log("API Response Data (SpinHistory index.jsx):", res);

            const resultData = res || {};

            setHistoryRecords(Array.isArray(resultData.data) ? resultData.data : []);
            setTotal(resultData.total || 0);
            setCounts(resultData.counts || { all: resultData.total || 0 });

        } catch (error) {
            console.error('Lỗi khi tải lịch sử quay:', error);
            toast.error('Không thể tải lịch sử quay');
            setHistoryRecords([]);
            setTotal(0);
            setCounts({ all: 0, won: 0, none_won: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchData();
    }, [page, limit, statusFilter, debouncedSearch]);

    const getCountForTab = (tabValue) => {
        switch (tabValue) {
            case 'all': return counts.all || 0;
            case 'won': return counts.won || 0;
            case 'none_won': return counts.none_won || 0;
            default: return 0;
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {loading && <LoaderAdmin fullscreen />}
            <Toastify />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    Lịch sử quay ({counts.all})
                </Typography>
            </Box>

            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, mb: 2 }}>
                <Box display="flex" gap={2} mb={2}>
                    {statusTabs.map((tab) => (
                        <Button
                            key={tab.value}
                            variant={statusFilter === tab.value ? 'contained' : 'text'}
                            onClick={() => {
                                setStatusFilter(tab.value);
                                setPage(1);
                            }}
                            sx={{ borderRadius: 2, fontWeight: statusFilter === tab.value ? 600 : 400 }}
                        >
                            {tab.label} ({getCountForTab(tab.value)})
                        </Button>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm lịch sử quay..."
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
                            <TableCell>Người Trúng</TableCell>
                            <TableCell>Phần Thưởng</TableCell>
                            <TableCell>Thời Gian Trúng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historyRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                    Không có kết quả phù hợp
                                </TableCell>
                            </TableRow>
                        ) : (
                            historyRecords.map((record, index) => {
                                const rewardText = record.reward?.name || record.rewardName || 'Không có';

                                return (
                                    <TableRow key={record.id} hover>
                                        <TableCell align="center">{(page - 1) * limit + index + 1}</TableCell>
                                        <TableCell>{record.user?.fullName || `ID: ${record.userId}`}</TableCell>
                                        <TableCell>
                                            <HighlightText text={rewardText || ''} highlight={debouncedSearch || ''} />
                                        </TableCell>
                                        <TableCell>{new Date(record.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                );
                            })
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
        </Box>
    );
};

export default SpinHistoryAdminPage;