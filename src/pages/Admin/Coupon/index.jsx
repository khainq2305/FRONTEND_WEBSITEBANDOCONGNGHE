import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TextField, Chip, Button, Tabs, Tab, FormControl, Select, InputLabel,
  Checkbox, IconButton, Menu, MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';

import { couponService } from '../../../services/admin/couponService';
import MUIPagination from '../../../components/common/Pagination';
import { useNavigate } from 'react-router-dom';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [bulkAction, setBulkAction] = useState('');
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const menuActions = statusFilter === 'deleted'
    ? [
        { label: 'Khôi phục', value: 'restore' },
        { label: 'Xoá vĩnh viễn', value: 'forceDelete' }
      ]
    : [
        { label: 'Chuyển vào thùng rác', value: 'delete' }
      ];

  const openMenu = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.right });
    setSelectedId(id);
  };

  const closeMenu = () => {
    setMenuPosition(null);
    setSelectedId(null);
  };

  useEffect(() => {
    fetchCoupons();
  }, [search, statusFilter, currentPage]);

  const fetchCoupons = async () => {
    try {
      const res = await couponService.list({ search, page: currentPage, limit: itemsPerPage, status: statusFilter });
      setCoupons(res.data.data || []);
      setTotalItems(res.data.pagination.totalItems);
      setSelectedIds([]);
    } catch (err) {
      console.error('Lỗi khi load danh sách:', err);
    }
  };

  const handleSingleAction = async (actionType) => {
  if (!selectedId) return;
  let confirmed = false;

  try {
    if (actionType === 'delete') {
      confirmed = await confirmDelete('xoá', 'mã này');
      if (confirmed) {
        await couponService.softDelete(selectedId);
        toast.success('Đã xoá tạm thời');
      }
    } else if (actionType === 'restore') {
      confirmed = await confirmDelete('khôi phục', 'mã này');
      if (confirmed) {
        await couponService.restore(selectedId);
        toast.success('Đã khôi phục');
      }
    } else if (actionType === 'forceDelete') {
      confirmed = await confirmDelete('xoá vĩnh viễn', 'mã này');
      if (confirmed) {
        await couponService.forceDelete(selectedId);
        toast.success('Đã xoá vĩnh viễn');
      }
    }
  } catch (err) {
    toast.error('Thao tác thất bại');
    console.error(err);
  }

  closeMenu();
  fetchCoupons();
};


  const handleTabChange = (e, newValue) => {
    setStatusFilter(newValue);
    setCurrentPage(1);
    setBulkAction('');
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleBulkChange = (e) => {
    setBulkAction(e.target.value);
  };

const handleApplyBulkAction = async () => {
  if (selectedIds.length === 0) return;
  let confirmed = false;

  try {
    if (bulkAction === 'delete') {
      confirmed = await confirmDelete('xoá', 'các mã đã chọn');
      if (confirmed) {
        await couponService.softDeleteMany(selectedIds);
        toast.success('Đã xoá tạm thời các mã');
      }
    } else if (bulkAction === 'restore') {
      confirmed = await confirmDelete('khôi phục', 'các mã đã chọn');
      if (confirmed) {
        await couponService.restoreMany(selectedIds);
        toast.success('Đã khôi phục các mã');
      }
    } else if (bulkAction === 'forceDelete') {
      confirmed = await confirmDelete('xoá vĩnh viễn', 'các mã đã chọn');
      if (confirmed) {
        await couponService.forceDeleteMany(selectedIds);
        toast.success('Đã xoá vĩnh viễn các mã');
      }
    }

    if (confirmed) {
      fetchCoupons();
      setBulkAction('');
    }
  } catch (err) {
    toast.error('❌ Thao tác hàng loạt thất bại');
    console.error(err);
  }
};


  const isAllSelected = coupons.length > 0 && selectedIds.length === coupons.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(coupons.map(c => c.id));
  };

  const getDiscountLabel = (coupon) => coupon.discountType === 'percent'
    ? `${coupon.discountValue}%`
    : `${Number(coupon.discountValue).toLocaleString()}₫`;

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '---';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Danh sách mã giảm giá</Typography>

      <Box sx={{ borderRadius: 2, p: 2, bgcolor: 'white', mb: 2 }}>
        <Tabs value={statusFilter} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Tất Cả" value="all" />
          <Tab label="Hoạt Động" value="active" />
          <Tab label="Tạm Tắt" value="inactive" />
          <Tab label="Thùng Rác" value="deleted" />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="bulk-action-label">Hành động hàng loạt</InputLabel>
            <Select
  labelId="bulk-action-label"
  id="bulk-action-select"
  value={bulkAction}
  onChange={handleBulkChange}
  label="Hành động hàng loạt"
>
  {statusFilter !== 'deleted' && <MenuItem value="delete">Chuyển vào thùng rác</MenuItem>}
  {statusFilter === 'deleted' && [
    <MenuItem key="restore" value="restore">Khôi phục</MenuItem>,
    <MenuItem key="forceDelete" value="forceDelete">Xoá vĩnh viễn</MenuItem>
  ]}
</Select>

          </FormControl>

          <Button variant="contained" onClick={handleApplyBulkAction} disabled={!bulkAction || selectedIds.length === 0}>
            Áp Dụng
          </Button>

          <TextField
            placeholder="Tìm kiếm..."
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />

          <Button variant="contained" color="primary" onClick={() => navigate('/admin/coupons/add')}>
            Thêm Mới
          </Button>
        </Box>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox checked={isAllSelected} onChange={toggleSelectAll} /></TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Giảm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">Không tìm thấy mã giảm giá.</TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon, idx) => (
                <TableRow key={coupon.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(coupon.id)}
                      onChange={() => {
                        setSelectedIds(prev =>
                          prev.includes(coupon.id)
                            ? prev.filter(id => id !== coupon.id)
                            : [...prev, coupon.id]
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.discountType === 'percent' ? 'Phần trăm' : 'Số tiền'}</TableCell>
                  <TableCell>{getDiscountLabel(coupon)}</TableCell>
                  <TableCell>{coupon.usedCount}/{coupon.totalQuantity}</TableCell>
                  <TableCell>{formatDate(coupon.startTime)} - {formatDate(coupon.endTime)}</TableCell>
                  <TableCell>
                    <Chip label={coupon.isActive ? 'Hoạt động' : 'Tạm ngưng'} color={coupon.isActive ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => navigate(`/admin/coupons/edit/${coupon.id}`)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton onClick={(e) => openMenu(e, coupon.id)}><MoreVertIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {menuPosition && (
        <Menu
          open={Boolean(menuPosition)}
          onClose={closeMenu}
          anchorReference="anchorPosition"
          anchorPosition={menuPosition}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { minWidth: 180, p: 1 } }}
        >
          {menuActions.map((action) => (
            <MenuItem
              key={action.value}
              onClick={async () => {
                await handleSingleAction(action.value);
                closeMenu();
              }}
            >
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      )}

      {totalItems > itemsPerPage && (
        <MUIPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </Box>
  );
}
