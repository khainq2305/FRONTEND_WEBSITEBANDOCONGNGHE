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
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import Pagination from '@/components/common/Pagination';
import LoaderAdmin from '@/components/common/Loader';
import Toastify from '@/components/common/Toastify';
import { spinHistoryService } from '@/services/admin/spinHistoryService';

const couponTypeLabels = {
    percent: 'Phần trăm',
    fixed: 'Số tiền',
    free_shipping: 'Miễn phí vận chuyển'
};

const SpinHistoryAdminPage = () => {
    const [historyRecords, setHistoryRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [couponTypeFilter, setCouponTypeFilter] = useState('all');

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [counts, setCounts] = useState({ all: 0 });

    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                search: debouncedSearch,
                couponType: couponTypeFilter
            };

            const res = await spinHistoryService.getAll(params);
            const resultData = res.data || {};

            setHistoryRecords(Array.isArray(resultData.data) ? resultData.data : []);
            setTotal(resultData.total || 0);
            setCounts({ all: resultData.counts?.all || 0 });
        } catch (error) {
            console.error('Lỗi khi tải lịch sử quay:', error);
            toast.error('Không thể tải lịch sử quay');
            setHistoryRecords([]);
            setTotal(0);
            setCounts({ all: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, debouncedSearch, couponTypeFilter]);

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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <TextField
                        label="Tìm kiếm theo tên phần thưởng"
                        size="small"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        sx={{ flex: '1 1 250px' }}
                    />

                    <FormControl sx={{ minWidth: 180 }} size="small">
                        <InputLabel id="coupon-type-select-label">Loại giảm</InputLabel>
                        <Select
                            labelId="coupon-type-select-label"
                            value={couponTypeFilter}
                            label="Loại giảm"
                            onChange={(e) => {
                                setCouponTypeFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="percent">Phần trăm</MenuItem>
                            <MenuItem value="fixed">Số tiền</MenuItem>
                            <MenuItem value="free_shipping">Miễn phí vận chuyển</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell>Người dùng</TableCell>
                            <TableCell>Thông tin quà</TableCell>
                            <TableCell>Thời gian quay</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historyRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                    Không có lịch sử quay nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            historyRecords.map((record, index) => {
                                const rewardText = (() => {
                                    if (!record.reward_id) return 'Không có phần thưởng';
                                    if (record.coupon_type) {
                                        const typeLabel = couponTypeLabels[record.coupon_type] || record.coupon_type;
                                        return `🎟 [${typeLabel}] ${record.reward_name}`;
                                    }
                                    return `🎁 ${record.reward_name}`;
                                })();

                                return (
                                    <TableRow key={record.id || `row-${Math.random()}`} hover>
                                        <TableCell align="center">{(page - 1) * limit + index + 1}</TableCell>
                                        <TableCell>{record.user?.fullName || `ID: ${record.user_id}`}</TableCell>
                                        <TableCell>{rewardText}</TableCell>
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
