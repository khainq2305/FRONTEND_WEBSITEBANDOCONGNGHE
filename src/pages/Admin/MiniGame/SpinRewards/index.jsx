// src/pages/Admin/MiniGame/SpinRewards/index.jsx
import { useState, useEffect } from 'react';
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
    FormControl,
    Select,
    Checkbox
} from '@mui/material';
import { Edit, Delete, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import Pagination from '@/components/common/Pagination';
import HighlightText from '@/components/Admin/HighlightText';
import LoaderAdmin from '@/components/common/Loader';
import Toastify from '@/components/common/Toastify';
import { confirmDelete } from '@/components/common/ConfirmDeleteDialog';
import { spinRewardService } from '@/services/admin/spinRewardService';

const statusTabs = [
    { value: 'all', label: 'Tất Cả' },
    { value: 'active', label: 'Hoạt Động' },
    { value: 'inactive', label: 'Tạm Tắt' }
];

const bulkActions = {
    all: [{ value: 'delete', label: 'Xóa' }],
    active: [{ value: 'delete', label: 'Xóa' }],
    inactive: [{ value: 'delete', label: 'Xóa' }]
};

const getStatusChip = (isActive) => {
    return isActive ? ['Hoạt động', 'success'] : ['Tạm tắt', 'default'];
};

const SpinRewardAdminPage = () => {
    const navigate = useNavigate();
    const [rewards, setRewards] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [selectedReward, setSelectedReward] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { page, limit, search: debouncedSearch, status };
            const res = await spinRewardService.getAll(params);
            const data = res.data || [];
            setRewards(Array.isArray(data) ? data : []);
            setTotal(res.total || 0);
            setCounts(res.counts || { all: 0, active: 0, inactive: 0 });
        } catch (error) {
            console.error('Error fetching spin rewards:', error);
            toast.error('Không thể tải danh sách phần thưởng');
            setRewards([]);
            setTotal(0);
            setCounts({ all: 0, active: 0, inactive: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, status, debouncedSearch]);

    const handleDelete = async (id) => {
        if (!(await confirmDelete('xoá', 'phần thưởng này'))) return;
        setLoading(true);
        try {
            await spinRewardService.remove(id);
            toast.success('Đã xoá phần thưởng thành công!');
            fetchData();
        } catch (error) {
            console.error('Lỗi khi xoá phần thưởng:', error);
            toast.error('Lỗi xoá phần thưởng');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedIds.length === 0) return;
        const labels = { delete: 'xoá' };
        if (!(await confirmDelete(labels[bulkAction], `${selectedIds.length} phần thưởng`))) return;

        setLoading(true);
        try {
            if (bulkAction === 'delete') {
                await Promise.all(selectedIds.map((id) => spinRewardService.remove(id)));
                toast.success(`Đã xoá ${selectedIds.length} phần thưởng.`);
            }
            fetchData();
            setSelectedIds([]);
            setBulkAction('');
        } catch (err) {
            console.error('Lỗi khi thực hiện hành động hàng loạt:', err);
            toast.error('Thao tác hàng loạt thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        const ids = rewards.map((r) => r.id);
        setSelectedIds(e.target.checked ? ids : []);
    };

    const handleSelectOne = (id) => (e) => {
        setSelectedIds(e.target.checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));
    };

    const handleMenuOpen = (event, reward) => {
        setAnchorEl(event.currentTarget);
        setSelectedReward(reward);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReward(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            {loading && <LoaderAdmin fullscreen />}


            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    Danh sách phần thưởng ({counts.all})
                </Typography>
                <Button variant="contained" onClick={() => navigate('/admin/spin-rewards/create')}>
                    + Thêm phần thưởng
                </Button>
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
                                setSelectedIds([]);
                                setBulkAction('');
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
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl size="small">
                            <Select
                                value={bulkAction}
                                displayEmpty
                                onChange={(e) => setBulkAction(e.target.value)}
                                renderValue={(selected) => {
                                    const found = bulkActions[status]?.find((a) => a.value === selected);
                                    return found ? found.label : 'Hành động hàng loạt';
                                }}
                            >
                                {bulkActions[status]?.map((action) => (
                                    <MenuItem key={action.value} value={action.value}>
                                        {action.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            disabled={!bulkAction || selectedIds.length === 0}
                            onClick={handleBulkAction}
                        >
                            Áp Dụng
                        </Button>
                    </Box>

                    <TextField
                        size="small"
                        placeholder="Tìm kiếm phần thưởng..."
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
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={rewards.length > 0 && selectedIds.length === rewards.length}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < rewards.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell align="center">STT</TableCell>
                            <TableCell>Tên phần thưởng</TableCell>
                            <TableCell>Mã Coupon</TableCell>
                            <TableCell>Tỷ lệ (%)</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rewards.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                    Không có kết quả phù hợp
                                </TableCell>
                            </TableRow>
                        ) : (
                            rewards.map((reward, index) => {
                                const [statusLabel, statusColor] = getStatusChip(reward.isActive);

                                return (
                                    <TableRow key={reward.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedIds.includes(reward.id)}
                                                onChange={handleSelectOne(reward.id)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">{(page - 1) * limit + index + 1}</TableCell>
                                        <TableCell>
                                            <HighlightText text={reward.name || ''} highlight={debouncedSearch || ''} />
                                        </TableCell>
                                        <TableCell>{reward.coupon?.code || 'Không có'}</TableCell>
                                        <TableCell>{(reward.probability * 100).toFixed(0)}%</TableCell>
                                        <TableCell>
                                            <Chip label={statusLabel} color={statusColor} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <IconButton onClick={(e) => handleMenuOpen(e, reward)} size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
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

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem
                    onClick={() => {
                        if (!selectedReward) return;
                        navigate(`/admin/spin-rewards/edit/${selectedReward.id}`);
                        handleMenuClose();
                    }}
                >
                    <Edit fontSize="small" sx={{ mr: 1 }} />
                    Chỉnh sửa
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (!selectedReward) return;
                        handleDelete(selectedReward.id);
                        handleMenuClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Delete fontSize="small" sx={{ mr: 1 }} />
                    Xóa
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default SpinRewardAdminPage;
