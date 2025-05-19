import { useEffect, useState } from 'react';
import {
  Box, Button, FormControl, Select, MenuItem, InputLabel
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';

import 'react-toastify/dist/ReactToastify.css';

import StatusTabs from './StatusTabs/StatusTabs';
import CouponTable from './CouponTable/CouponTable';
import DeleteConfirmDialog from './DeleteConfirmDialog/DeleteConfirmDialog';
import { useNavigate } from 'react-router-dom';

const statusTabs = [
  { value: '', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'used', label: 'Đã sử dụng' },
  { value: 'trash', label: 'Đã xóa' }
];

const mockCoupons = [
  { id: 1, code: 'SUMMER2025', description: 'Giảm 10% cho mùa hè', discount: 10, status: 'active', createdAt: '2025-05-01', expiryDate: '2025-08-01' },
  { id: 2, code: 'WELCOME5', description: 'Giảm 5% cho khách hàng mới', discount: 5, status: 'expired', createdAt: '2024-12-01', expiryDate: '2025-01-01' },
  { id: 3, code: 'VIP20', description: 'Giảm 20% cho khách VIP', discount: 20, status: 'used', createdAt: '2025-02-15', expiryDate: '2025-06-30' },
  { id: 4, code: 'TRASH10', description: 'Coupon bị xóa tạm thời', discount: 10, status: 'trash', createdAt: '2025-01-20', expiryDate: '2025-04-20' },
  { id: 5, code: 'NEWYEAR2025', description: 'Giảm 15% dịp năm mới', discount: 15, status: 'active', createdAt: '2024-12-30', expiryDate: '2025-01-15' },
  { id: 6, code: 'SPRING10', description: 'Giảm 10% mùa xuân', discount: 10, status: 'active', createdAt: '2025-03-01', expiryDate: '2025-05-01' },
  { id: 7, code: 'FALL25', description: 'Giảm 25% mùa thu', discount: 25, status: 'used', createdAt: '2025-09-01', expiryDate: '2025-11-01' }
];

const CouponList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState([]); // mock selected rows

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: '', description: '', discount: '', expiryDate: '', status: 'active'
  });

  useEffect(() => setPage(1), [search, status]);
  useEffect(() => {
    if (editingCoupon) {
      setFormData({ ...editingCoupon, discount: editingCoupon.discount.toString() });
    } else {
      setFormData({ code: '', description: '', discount: '', expiryDate: '', status: 'active' });
    }
  }, [editingCoupon]);

  const filteredCoupons = mockCoupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) &&
    (status === '' || c.status === status)
  );

  const itemsPerPage = 10;
  const paginatedCoupons = filteredCoupons.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  // 🧠 Hành động thay đổi theo tab
  const getActionOptions = () => {
    if (status === 'trash') {
      return [
        { value: 'restore', label: 'Khôi phục' },
        { value: 'delete', label: 'Xóa vĩnh viễn' }
      ];
    }
    return [{ value: 'trash', label: 'Chuyển vào thùng rác' }];
  };

  return (
    <Box sx={{ p: 2 }}>
      <ToastContainer />

      {/* Tabs trạng thái */}
      <StatusTabs status={status} setStatus={setStatus} statusTabs={statusTabs} coupons={mockCoupons} />

      {/* Bộ lọc + tìm kiếm */}
      <Box sx={{ mt: 2, mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        {/* Dropdown Hành động */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            displayEmpty
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <MenuItem value="" disabled>Hành động</MenuItem>
            {getActionOptions().map(action => (
              <MenuItem key={action.value} value={action.value}>{action.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nút Thực hiện */}
        <Button
          variant="contained"
          size="small"
          
          onClick={() => {
            console.log('Thực hiện:', selectedAction, 'cho các ID:', selectedCoupons);
            setSelectedAction('');
            setSelectedCoupons([]);
          }}
        >
          Thực hiện
        </Button>

        {/* Dropdown Trạng thái */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="expired">Hết hạn</MenuItem>
            <MenuItem value="used">Đã sử dụng</MenuItem>
            <MenuItem value="trash">Đã xóa</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        {/* Tìm kiếm */}
        <Box sx={{ width: 250 }}>
          <SearchInput placeholder="Tìm mã giảm giá" value={search} onChange={setSearch} />
        </Box>

        {/* Nút thêm */}
        <Button
          variant="contained"
          onClick={() => navigate('/admin/coupons/add')}
          sx={{ textTransform: 'none', height: 40 }}
        >
          + Thêm mã giảm giá
        </Button>
      </Box>

      {/* Bảng */}
      <CouponTable
        coupons={paginatedCoupons}
        page={page}
        itemsPerPage={itemsPerPage}
        onDelete={(coupon) => { setCouponToDelete(coupon); setOpenDeleteDialog(true); }}
      />

      {/* Phân trang */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination currentPage={page} totalPages={totalPages || 1} onPageChange={setPage} />
      </Box>

      {/* Xác nhận xóa */}
      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => setOpenDeleteDialog(false)}
        coupon={couponToDelete}
      />
    </Box>
  );
};

export default CouponList;
