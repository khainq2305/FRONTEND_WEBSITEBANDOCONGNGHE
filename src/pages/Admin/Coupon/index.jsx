import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TextField, Chip, Button, Tabs, Tab, FormControl, Select, InputLabel,
  Checkbox, IconButton, Menu, MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Breadcrumb from '../../../components/common/Breadcrumb';

import MUIPagination from '../../../components/common/Pagination';
import { couponService } from '../../../services/admin/couponService';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import LoaderAdmin from '../../../components/Admin/LoaderVip';
import HighlightText from '../../../components/Admin/HighlightText';
const formatNumber = (num) => {
  if (num === null || num === undefined || num === "") return "";
  const number = Number(num);
  if (isNaN(number)) return "";

  if (Number.isInteger(number)) {
    return number.toLocaleString('vi-VN');
  }

  return number.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};


export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryCounts, setSummaryCounts] = useState({ total: 0, active: 0, inactive: 0, deleted: 0 });

  const itemsPerPage = 10;
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const menuActions = statusFilter === 'deleted'
    ? [
      { label: 'Khôi phục', value: 'restore' },
      { label: 'Xoá vĩnh viễn', value: 'forceDelete' }
    ]
    : [{ label: 'Chuyển vào thùng rác', value: 'delete' }];

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
    setLoading(true);
    try {
      const res = await couponService.list({
        search,
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter
      });
      setCoupons(res.data.data || []);
      setTotalItems(res.data.pagination.totalItems);
      setSummaryCounts(res.data.summary || {});
      setSelectedIds([]);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách');
      console.error(err);
    } finally {
      setLoading(false);
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
      toast.error('Thao tác hàng loạt thất bại');
      console.error(err);
    }
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

  const isAllSelected = coupons.length > 0 && selectedIds.length === coupons.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(coupons.map(c => c.id));
  };

  const getDiscountLabel = (coupon) =>
    coupon.discountType === 'percent'
      ? `${formatNumber(coupon.discountValue)}%`
      : `${Number(coupon.discountValue).toLocaleString('vi-VN')}₫`;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('vi-VN') : '---';

  return (
    <Box>
      {loading && <LoaderAdmin fullscreen />}
      <Box sx={{ mb: 1 }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/admin' },
            { label: 'Mã giảm giá' }
          ]}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Danh sách mã giảm giá</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/coupons/create')}>
          Thêm Mới
        </Button>
      </Box>

      <Box sx={{ borderRadius: 2, p: 2, bgcolor: 'white', mb: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={handleTabChange}
          sx={{
            mb: 2,
            '& .MuiTabs-flexContainer': { gap: 0.4 },
            '& .MuiTab-root': {
              textTransform: 'none',
              borderRadius: '6px',
              px: 2,
              py: '4px',
              minHeight: '32px',
              fontSize: 14,
              fontWeight: 500,
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid transparent',
              '&:not(.Mui-selected):hover': {
                backgroundColor: '#f0f7ff',
                borderColor: '#d0e2ff',
              },
              '&.Mui-selected': {
                backgroundColor: '#007bff',
                color: '#fff',
                borderColor: '#007bff',
              },
            }
          }}
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <Tab label={`Tất Cả (${summaryCounts.total || 0})`} value="all" />
          <Tab label={`Hoạt Động (${summaryCounts.active || 0})`} value="active" />
          <Tab label={`Tạm Tắt (${summaryCounts.inactive || 0})`} value="inactive" />
          <Tab label={`Thùng Rác (${summaryCounts.deleted || 0})`} value="deleted" />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="bulk-action-label">Hành động hàng loạt</InputLabel>
              <Select
                labelId="bulk-action-label"
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

            <Button
              variant="contained"
              onClick={handleApplyBulkAction}
              disabled={!bulkAction || selectedIds.length === 0}
              sx={{
                minWidth: 100,
                backgroundColor: (!bulkAction || selectedIds.length === 0) ? '#f5f5f5' : '#007bff',
                color: (!bulkAction || selectedIds.length === 0) ? '#aaa' : '#fff',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: (!bulkAction || selectedIds.length === 0) ? '#f5f5f5' : '#0066d6'
                }
              }}
            >
              Áp Dụng
            </Button>
          </Box>

          <TextField
            placeholder="Tìm kiếm..."
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ minWidth: 300, ml: 'auto' }}
          />
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
                <TableCell>Đã dùng</TableCell> 
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
                  <TableCell>
                    <HighlightText text={coupon.code} highlight={search} />
                  </TableCell>
                  <TableCell>
                    {coupon.discountType === 'percent'
                      ? 'Phần trăm'
                      : coupon.discountType === 'amount'
                        ? 'Số tiền'
                        : 'Miễn phí vận chuyển'}
                  </TableCell>
                  <TableCell>{getDiscountLabel(coupon)}</TableCell>
                  <TableCell>{coupon.totalQuantity}</TableCell>
<TableCell>{coupon.usedCount}</TableCell> 

                  <TableCell>{formatDate(coupon.startTime)} - {formatDate(coupon.endTime)}</TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      color={coupon.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => openMenu(e, coupon.id)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
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
          <MenuItem onClick={() => {
            navigate(`/admin/coupons/edit/${selectedId}`);
            closeMenu();
          }}>
            Sửa
          </MenuItem>

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