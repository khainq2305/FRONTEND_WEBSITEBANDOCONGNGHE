import {
    Box, Typography, Paper, Button, Divider,
    Table, TableBody, TableRow, TableCell, TableHead,
    TextField, Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const mockOrders = [
    {
        id: 1,
        code: 'DH001',
        customer: 'Nguyễn Văn A',
        address: '123 Lê Lợi, Quận 1, TP.HCM',
        phone: '0909123456',
        email: 'vana@example.com',
        total: 1200000,
        status: 'pending',
        date: '2025-05-14',
        reason: '',
        products: [
            { name: 'Tranh Sơn Dầu - Bình Minh', quantity: 1, price: 500000 },
            { name: 'Tranh Canvas - Cánh Đồng', quantity: 2, price: 350000 }
        ]
    },
    {
        id: 2,
        code: 'DH002',
        customer: 'Trần Thị B',
        address: '456 Nguyễn Trãi, Hà Nội',
        phone: '0987654321',
        email: 'thib@example.com',
        total: 2350000,
        status: 'cancelled',
        date: '2025-05-13',
        reason: 'Khách yêu cầu hủy đơn vì thay đổi ý định',
        products: [
            { name: 'Tranh Trừu Tượng - Giấc Mơ', quantity: 1, price: 2350000 }
        ]
    }
];

const statusLabels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    refunded: 'Trả hàng/Hoàn tiền'
};

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const order = mockOrders.find((o) => o.id === parseInt(id));
    const [form] = useState(order); // chỉ xem, không sửa

    const readOnlyStyle = {
        disabled: true,
        InputProps: {
            sx: {
                color: 'text.primary',
                fontWeight: 500
            }
        }
    };

    if (!order) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6">Không tìm thấy đơn hàng</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Quay lại</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
                Quay lại
            </Button>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Đơn hàng {form.code}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>Thông tin khách hàng</Typography>
                        <TextField label="Tên khách hàng" value={form.customer} fullWidth margin="dense" {...readOnlyStyle} />
                        <TextField label="Số điện thoại" value={form.phone} fullWidth margin="dense" {...readOnlyStyle} />
                        <TextField label="Email" value={form.email} fullWidth margin="dense" {...readOnlyStyle} />
                        <TextField label="Địa chỉ" value={form.address} fullWidth margin="dense" {...readOnlyStyle} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>Thông tin đơn hàng</Typography>
                        <TextField label="Ngày đặt" value={form.date} fullWidth margin="dense" {...readOnlyStyle} />
                        <TextField
                            label="Trạng thái"
                            value={statusLabels[form.status] || 'Không rõ'}
                            fullWidth
                            margin="dense"
                            {...readOnlyStyle}
                        />
                        {form.status === 'cancelled' && (
                            <TextField
                                label="Lý do hủy đơn"
                                value={form.reason}
                                fullWidth
                                multiline
                                rows={3}
                                margin="dense"
                                {...readOnlyStyle}
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom fontWeight={500}>Sản phẩm đã mua</Typography>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Đơn giá</TableCell>
                            <TableCell>Thành tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {form.products.map((product, index) => (
                            <TableRow key={index}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.price.toLocaleString()} ₫</TableCell>
                                <TableCell>{(product.price * product.quantity).toLocaleString()} ₫</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="h6" fontWeight={600}>
                        Tổng tiền: {form.total.toLocaleString()} ₫
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default OrderDetail;
