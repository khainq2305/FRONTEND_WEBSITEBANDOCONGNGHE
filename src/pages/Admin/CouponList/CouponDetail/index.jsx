import { Box, Typography, Paper, Divider, Chip, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const mockCoupons = [
  { id: 1, code: 'SUMMER2025', description: 'Giảm 10% cho mùa hè', discount: 10, status: 'active', createdAt: '2025-05-01', expiryDate: '2025-08-01' },
  { id: 2, code: 'WELCOME5', description: 'Giảm 5% cho khách hàng mới', discount: 5, status: 'expired', createdAt: '2024-12-01', expiryDate: '2025-01-01' },
  { id: 3, code: 'VIP20', description: 'Giảm 20% cho khách VIP', discount: 20, status: 'used', createdAt: '2025-02-15', expiryDate: '2025-06-30' },
  { id: 4, code: 'TRASH10', description: 'Coupon bị xóa tạm thời', discount: 10, status: 'trash', createdAt: '2025-01-20', expiryDate: '2025-04-20' },
  { id: 5, code: 'NEWYEAR2025', description: 'Giảm 15% dịp năm mới', discount: 15, status: 'active', createdAt: '2024-12-30', expiryDate: '2025-01-15' },
  { id: 6, code: 'SPRING10', description: 'Giảm 10% mùa xuân', discount: 10, status: 'active', createdAt: '2025-03-01', expiryDate: '2025-05-01' },
  { id: 7, code: 'FALL25', description: 'Giảm 25% mùa thu', discount: 25, status: 'used', createdAt: '2025-09-01', expiryDate: '2025-11-01' }
];

const statusMap = {
  active: { label: 'Hoạt động', color: 'success' },
  expired: { label: 'Hết hạn', color: 'warning' },
  used: { label: 'Đã sử dụng', color: 'info' },
  trash: { label: 'Đã xóa', color: 'error' }
};

const CouponDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const coupon = mockCoupons.find(c => c.id.toString() === id);

  if (!coupon) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Không tìm thấy mã giảm giá.</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Quay lại</Button>
      </Box>
    );
  }

  const status = statusMap[coupon.status];

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Chi tiết mã giảm giá
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gap: 2 }}>
          <DetailRow label="Mã giảm giá" value={coupon.code} />
          <DetailRow label="Mô tả" value={coupon.description} />
          <DetailRow label="Phần trăm giảm" value={`${coupon.discount}%`} />
          <DetailRow label="Trạng thái" value={<Chip label={status.label} color={status.color} size="small" />} />
          <DetailRow label="Ngày tạo" value={coupon.createdAt} />
          <DetailRow label="Ngày hết hạn" value={coupon.expiryDate} />
        </Box>
        <Button onClick={() => navigate(-1)} sx={{ mt: 3 }} variant="outlined">
          Quay lại danh sách
        </Button>
      </Paper>
    </Box>
  );
};

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Typography sx={{ width: 150, fontWeight: 500 }}>{label}:</Typography>
    <Typography>{value}</Typography>
  </Box>
);

export default CouponDetail;
