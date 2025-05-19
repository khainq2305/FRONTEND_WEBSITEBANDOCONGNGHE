import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip
} from '@mui/material';
import MoreActionsMenu from '../MoreActionsMenu/MoreActionsMenu';
import { useNavigate } from 'react-router-dom'; // ✅ Đã có

// Hàm render trạng thái
const getStatusChip = (status) => {
  const map = {
    active: ['Hoạt động', 'success'],
    expired: ['Hết hạn', 'warning'],
    used: ['Đã sử dụng', 'info'],
    trash: ['Đã xóa', 'error']
  };
  const [label, color] = map[status] || [status, 'default'];
  return <Chip label={label} color={color} size="small" />;
};

// ✅ THÊM navigate vào ĐÂY
const CouponTable = ({ coupons, page, itemsPerPage, onEdit, onDelete, onView }) => {
  const navigate = useNavigate(); // ⬅️ Đặt ở đây

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <input type="checkbox" />
            </TableCell>
            <TableCell>STT</TableCell>
            <TableCell>Mã giảm giá</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Giảm giá (%)</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Ngày hết hạn</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.map((coupon, index) => (
            <TableRow key={coupon.id}>
              <TableCell padding="checkbox">
                <input type="checkbox" />
              </TableCell>
              <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.description}</TableCell>
              <TableCell>{coupon.discount}</TableCell>
              <TableCell>{getStatusChip(coupon.status)}</TableCell>
              <TableCell>{coupon.createdAt}</TableCell>
              <TableCell>{coupon.expiryDate}</TableCell>
              <TableCell>
                <MoreActionsMenu
                  actions={[
                    { label: 'Xem chi tiết', onClick: () => navigate(`/admin/coupons/${coupon.id}`) },
{ label: 'Chỉnh sửa', onClick: () => navigate(`/admin/coupons/edit/${coupon.id}`) },
                    { label: 'Xóa', onClick: () => onDelete(coupon), color: 'error' }
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CouponTable;
