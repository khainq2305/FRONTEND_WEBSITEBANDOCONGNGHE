import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  TextField,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const statusTabs = [
  { value: '', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'used', label: 'Đã sử dụng' },
  { value: 'trash', label: 'Thùng rác' }
];

// Tạo mock nhiều coupon hơn để test phân trang
const mockCoupons = [
  {
    id: 1,
    code: 'SUMMER2025',
    description: 'Giảm 10% cho mùa hè',
    discount: 10,
    status: 'active',
    createdAt: '2025-05-01',
    expiryDate: '2025-08-01'
  },
  {
    id: 2,
    code: 'WELCOME5',
    description: 'Giảm 5% cho khách hàng mới',
    discount: 5,
    status: 'expired',
    createdAt: '2024-12-01',
    expiryDate: '2025-01-01'
  },
  {
    id: 3,
    code: 'VIP20',
    description: 'Giảm 20% cho khách VIP',
    discount: 20,
    status: 'used',
    createdAt: '2025-02-15',
    expiryDate: '2025-06-30'
  },
  {
    id: 4,
    code: 'TRASH10',
    description: 'Coupon bị xóa tạm thời',
    discount: 10,
    status: 'trash',
    createdAt: '2025-01-20',
    expiryDate: '2025-04-20'
  },
  // Thêm nhiều coupon hơn để test phân trang
  {
    id: 5,
    code: 'NEWYEAR2025',
    description: 'Giảm 15% dịp năm mới',
    discount: 15,
    status: 'active',
    createdAt: '2024-12-30',
    expiryDate: '2025-01-15'
  },
  {
    id: 6,
    code: 'SPRING10',
    description: 'Giảm 10% mùa xuân',
    discount: 10,
    status: 'active',
    createdAt: '2025-03-01',
    expiryDate: '2025-05-01'
  },
  {
    id: 7,
    code: 'FALL25',
    description: 'Giảm 25% mùa thu',
    discount: 25,
    status: 'used',
    createdAt: '2025-09-01',
    expiryDate: '2025-11-01'
  }
];

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

const CouponList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [coupons, setCoupons] = useState(mockCoupons);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [couponToUpdate, setCouponToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 5;

  // Filter coupons theo search + trạng thái
  const filteredCoupons = coupons.filter(
    (coupon) => coupon.code.toLowerCase().includes(search.toLowerCase()) && (status === '' || coupon.status === status)
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  // Phân trang
  const paginatedCoupons = filteredCoupons.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    // Reset về trang 1 khi search hoặc status thay đổi
    setPage(1);
  }, [search, status]);

  const getStatusChip = (status) => {
    const map = {
      active: ['Hoạt động', 'success'],
      expired: ['Hết hạn', 'warning'],
      used: ['Đã sử dụng', 'info'],
      trash: ['Thùng rác', 'error']
    };
    const [label, color] = map[status] || [status, 'default'];
    return <Chip label={label} color={color} size="small" />;
  };

  // Mở dialog cập nhật trạng thái
  const openUpdateStatusDialog = (coupon) => {
    setCouponToUpdate(coupon);
    setNewStatus(coupon.status);
    setOpenUpdateStatus(true);
  };

  const closeUpdateStatusDialog = () => {
    setOpenUpdateStatus(false);
    setCouponToUpdate(null);
  };

  const submitUpdateStatus = () => {
    setCoupons((prev) => prev.map((coupon) => (coupon.id === couponToUpdate.id ? { ...coupon, status: newStatus } : coupon)));
    toast.success(`Đã cập nhật trạng thái mã "${couponToUpdate.code}" thành "${newStatus}"`);
    closeUpdateStatusDialog();
  };

  // Xóa tạm thời (chuyển trạng thái thành trash)
  const openDeleteCouponDialog = (coupon) => {
    setCouponToDelete(coupon);
    setOpenDeleteDialog(true);
  };

  const closeDeleteCouponDialog = () => {
    setOpenDeleteDialog(false);
    setCouponToDelete(null);
  };

  const submitDeleteCoupon = () => {
    setCoupons((prev) => prev.map((coupon) => (coupon.id === couponToDelete.id ? { ...coupon, status: 'trash' } : coupon)));
    toast.success(`Đã chuyển mã "${couponToDelete.code}" vào thùng rác`);
    closeDeleteCouponDialog();
  };

  // Khôi phục coupon từ thùng rác
  const restoreCoupon = (coupon) => {
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, status: 'active' } : c)));
    toast.success(`Đã khôi phục mã "${coupon.code}"`);
  };

  // Xóa vĩnh viễn
  const permanentlyDeleteCoupon = (coupon) => {
    setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    toast.success(`Đã xóa vĩnh viễn mã "${coupon.code}"`);
  };

  // Thêm / Sửa mã giảm giá
  const openAddEditDialogFunc = (coupon = null) => {
    setEditingCoupon(coupon);
    setOpenAddEditDialog(true);
  };

  const closeAddEditDialog = () => {
    setOpenAddEditDialog(false);
    setEditingCoupon(null);
  };

  // Form state
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');

  useEffect(() => {
    if (editingCoupon) {
      setFormCode(editingCoupon.code);
      setFormDescription(editingCoupon.description);
      setFormDiscount(editingCoupon.discount.toString());
      setFormExpiryDate(editingCoupon.expiryDate);
    } else {
      setFormCode('');
      setFormDescription('');
      setFormDiscount('');
      setFormExpiryDate('');
    }
  }, [editingCoupon]);

  const submitAddEditCoupon = () => {
    if (!formCode.trim()) {
      toast.error('Mã giảm giá không được để trống');
      return;
    }
    if (!formDiscount || isNaN(Number(formDiscount)) || Number(formDiscount) <= 0) {
      toast.error('Giá trị giảm giá phải là số dương');
      return;
    }
    if (!formExpiryDate) {
      toast.error('Vui lòng chọn ngày hết hạn');
      return;
    }

    if (editingCoupon) {
      // Sửa coupon
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formCode,
                description: formDescription,
                discount: Number(formDiscount),
                expiryDate: formExpiryDate
              }
            : c
        )
      );
      toast.success('Cập nhật mã giảm giá thành công');
    } else {
      // Thêm mới coupon
      const newCoupon = {
        id: coupons.length > 0 ? Math.max(...coupons.map((c) => c.id)) + 1 : 1,
        code: formCode,
        description: formDescription,
        discount: Number(formDiscount),
        expiryDate: formExpiryDate,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success('Thêm mã giảm giá thành công');
    }
    setPage(1);
    closeAddEditDialog();
  };

  return (
    <Box sx={{ p: 2 }}>
      <ToastContainer />
      {/* Tab trạng thái */}
      <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee', mb: 2 }}>
        {statusTabs.map((tab) => {
          const count = tab.value === '' ? coupons.length : coupons.filter((c) => c.status === tab.value).length;

          return (
            <Box
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              sx={{
                pb: 1,
                px: 1,
                cursor: 'pointer',
                borderBottom: status === tab.value ? '2px solid red' : '2px solid transparent',
                color: status === tab.value ? 'red' : 'black',
                fontWeight: status === tab.value ? 600 : 400,
                fontSize: 15,
                userSelect: 'none'
              }}
            >
              {tab.label} ({count})
            </Box>
          );
        })}
      </Box>

      {/* Thanh tìm kiếm */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
          <SearchInput placeholder="Tìm mã giảm giá" value={search} onChange={(value) => setSearch(value)}
 />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openAddEditDialogFunc()}
          sx={{ ml: 2, whiteSpace: 'nowrap', height: 40, textTransform: 'none', px: 3 }}
        >
          Thêm mã giảm giá
        </Button>
      </Box>

      {/* Bảng coupon */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={150}>Mã giảm giá</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell width={100}>Giảm giá (%)</TableCell>
              <TableCell width={120}>Trạng thái</TableCell>
              <TableCell width={150}>Ngày tạo</TableCell>
              <TableCell width={150}>Ngày hết hạn</TableCell>
              <TableCell width={130}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCoupons.length > 0 ? (
              paginatedCoupons.map((coupon) => {
                const actions =
                  coupon.status === 'trash'
                    ? [
                        {
                          label: 'Khôi phục',
                          onClick: () => restoreCoupon(coupon)
                        },
                        {
                          label: 'Xóa vĩnh viễn',
                          onClick: () => permanentlyDeleteCoupon(coupon),
                          color: 'error'
                        }
                      ]
                    : [
                        {
                          label: 'Sửa trạng thái',
                          onClick: () => openUpdateStatusDialog(coupon)
                        },
                        {
                          label: 'Chỉnh sửa',
                          onClick: () => openAddEditDialogFunc(coupon)
                        },
                        {
                          label: 'Xóa',
                          onClick: () => openDeleteCouponDialog(coupon),
                          color: 'error'
                        }
                      ];

                return (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.description}</TableCell>
                    <TableCell>{coupon.discount}</TableCell>
                    <TableCell>{getStatusChip(coupon.status)}</TableCell>
                    <TableCell>{coupon.createdAt}</TableCell>
                    <TableCell>{coupon.expiryDate}</TableCell>
                    <TableCell>
                      <MoreActionsMenu actions={actions} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có mã giảm giá nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Phân trang hoạt động đúng */}
      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </Box>
      )}

      {/* Dialog cập nhật trạng thái */}
      <Dialog open={openUpdateStatus} onClose={closeUpdateStatusDialog}>
        <DialogTitle>Cập nhật trạng thái mã giảm giá</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={newStatus} label="Trạng thái" onChange={(e) => setNewStatus(e.target.value)}>
              <SelectMenuItem value="active">Hoạt động</SelectMenuItem>
              <SelectMenuItem value="expired">Hết hạn</SelectMenuItem>
              <SelectMenuItem value="used">Đã sử dụng</SelectMenuItem>
              <SelectMenuItem value="trash">Thùng rác</SelectMenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateStatusDialog}>Hủy</Button>
          <Button variant="contained" onClick={submitUpdateStatus}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xóa (chuyển vào thùng rác) */}
      <Dialog open={openDeleteDialog} onClose={closeDeleteCouponDialog}>
        <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc muốn chuyển mã "{couponToDelete?.code}" vào thùng rác không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteCouponDialog}>Hủy</Button>
          <Button variant="contained" color="error" onClick={submitDeleteCoupon}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm / sửa coupon */}
      <Dialog open={openAddEditDialog} onClose={closeAddEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCoupon ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Mã giảm giá" value={formCode} onChange={(e) => setFormCode(e.target.value)} fullWidth />
          <TextField label="Mô tả" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} fullWidth />
          <TextField label="Giảm giá (%)" type="number" value={formDiscount} onChange={(e) => setFormDiscount(e.target.value)} fullWidth />
          <TextField
            label="Ngày hết hạn"
            type="date"
            value={formExpiryDate}
            onChange={(e) => setFormExpiryDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddEditDialog}>Hủy</Button>
          <Button variant="contained" onClick={submitAddEditCoupon}>
            {editingCoupon ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CouponList;
