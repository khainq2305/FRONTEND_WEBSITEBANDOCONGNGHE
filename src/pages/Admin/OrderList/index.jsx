// src/components/admin/OrderList.jsx
import { useEffect, useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper, Chip, Box,
    Menu, MenuItem, IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';
import Toastify from 'components/common/Toastify';
import CancelOrderDialog from './CancelOrderDialog';
import UpdateOrderStatusDialog from './UpdateOrderStatusDialog';

import { useNavigate } from 'react-router-dom';

const MoreActionsMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton onClick={handleOpen} size="small">
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {actions.map((action, idx) => (
                    <MenuItem
                        key={idx}
                        onClick={() => {
                            handleClose();
                            action.onClick();
                        }}
                        sx={{ color: action.color === 'error' ? 'red' : 'inherit' }}
                    >
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const statusTabs = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'refunded', label: 'Trả hàng/Hoàn tiền' }
];

const mockOrders = [
    { id: 1, code: 'DH001', customer: 'Nguyễn Văn A', total: 1200000, status: 'pending', date: '2025-05-14' },
    { id: 2, code: 'DH002', customer: 'Trần Thị B', total: 2350000, status: 'confirmed', date: '2025-05-13' },
    { id: 3, code: 'DH003', customer: 'Lê Văn C', total: 880000, status: 'shipping', date: '2025-05-12' },
    { id: 4, code: 'DH004', customer: 'Phạm Thị D', total: 1500000, status: 'delivered', date: '2025-05-10' },
    { id: 5, code: 'DH005', customer: 'Lê Thị E', total: 2100000, status: 'cancelled', date: '2025-05-09' },
    { id: 6, code: 'DH006', customer: 'Ngô Thị F', total: 990000, status: 'refunded', date: '2025-05-08' }
];

const OrderList = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const navigate = useNavigate();
    const itemsPerPage = 5;

    const filteredOrders = mockOrders.filter((order) =>
        (order.customer.toLowerCase().includes(search.toLowerCase()) ||
            order.code.toLowerCase().includes(search.toLowerCase())) &&
        (status === '' || order.status === status)
    );

    const paginatedOrders = filteredOrders.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    const openCancelDialog = (order) => {
        setSelectedOrder(order);
        setCancelDialogOpen(true);
    };

    const openUpdateStatusDialog = (order) => {
        setSelectedOrder(order);
        setUpdateStatusDialogOpen(true);
    };

    const getStatusChip = (status) => {
        const map = {
            pending: ['Chờ xác nhận', 'warning'],
            confirmed: ['Đã xác nhận', 'info'],
            shipping: ['Đang giao', 'primary'],
            delivered: ['Đã giao', 'success'],
            cancelled: ['Đã hủy', 'error'],
            refunded: ['Trả hàng/Hoàn tiền', 'default']
        };
        const [label, color] = map[status] || [status, 'default'];
        return <Chip label={label} color={color} size="small" />;
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

            <Box sx={{ mb: 2 }}>
                <SearchInput
                    placeholder="Tìm mã đơn hoặc khách hàng..."
                    value={search}
                    onChange={setSearch}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Mã đơn</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.length > 0 ? paginatedOrders.map((order, idx) => (
                            <TableRow key={order.id}>
                                <TableCell>{(page - 1) * itemsPerPage + idx + 1}</TableCell>
                                <TableCell>{order.code}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.total.toLocaleString()} ₫</TableCell>
                                <TableCell>{getStatusChip(order.status)}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell align="right">
                                    <MoreActionsMenu
                                        actions={[
                                            { label: 'Xem chi tiết', onClick: () => navigate(`/admin/orders/${order.id}`) },
                                            { label: 'Cập nhật trạng thái', onClick: () => openUpdateStatusDialog(order) },
                                            { label: 'Hủy đơn', onClick: () => openCancelDialog(order), color: 'error' }
                                        ]}
                                    />
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Không có đơn hàng phù hợp
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

      <Pagination
  currentPage={page}
  totalItems={filteredOrders.length}
  itemsPerPage={itemsPerPage}
  onPageChange={setPage}
  onPageSizeChange={(size) => {
    setItemsPerPage(size);
    setPage(1); 
  }}
/>


            <CancelOrderDialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                order={selectedOrder}
                onConfirm={(reason) => {
                    Toastify.success(`Đã hủy đơn ${selectedOrder.code} với lý do: ${reason}`);
                    setCancelDialogOpen(false);
                }}
            />

            <UpdateOrderStatusDialog
                open={updateStatusDialogOpen}
                onClose={() => setUpdateStatusDialogOpen(false)}
                order={selectedOrder}
                onConfirm={(newStatus) => {
                    Toastify.success(`Đã cập nhật trạng thái đơn ${selectedOrder.code} thành "${newStatus}"`);
                    setUpdateStatusDialogOpen(false);
                }}
            />

            <Toastify />
        </Box>
    );
};

export default OrderList;
