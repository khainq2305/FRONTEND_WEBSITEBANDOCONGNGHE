import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Menu
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import formatDateFlexible from '../../../utils/formatCurrentDateTime';

import { flashSaleService } from '../../../services/admin/flashSaleService';
import LoaderAdmin from '../../../components/Admin/LoaderVip';
import HighlightText from '../../../components/Admin/HighlightText';
import MUIPagination from '../../../components/common/Pagination';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify'; // <-- SỬA DUY NHẤT DÒNG NÀY

const FlashSaleList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ active: 0, inactive: 0, trash: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [bulkAction, setBulkAction] = useState('');

  const isTrashTab = tab === 'trash';

  const handleMenuClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setPage(1);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = data.map((row) => row.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await flashSaleService.list({ page, limit: rowsPerPage, tab, search });
      setData(res.data.rows);
      setTotal(res.data.count);
      setStats({
        active: res.data.totalActive || 0,
        inactive: res.data.totalInactive || 0,
        trash: res.data.totalTrash || 0
      });
    } catch (err) {
      toast.error('Lỗi khi tải danh sách Flash Sale');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('xoá', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.softDelete(id);
    toast.success('Đã chuyển vào thùng rác');
    fetchData();
  };

  const handleRestore = async (id) => {
    const confirmed = await confirmDelete('khôi phục', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.restore(id);
    toast.success('Đã khôi phục');
    fetchData();
  };

  const handleForceDelete = async (id) => {
    const confirmed = await confirmDelete('xoá vĩnh viễn', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.forceDelete(id);
    toast.success('Đã xoá vĩnh viễn');
    fetchData();
  };

const handleBulkAction = async (action) => {
  if (selectedIds.length === 0) return;

  let label = '';
  let actionFunc;

  if (action === 'khoi-phuc') {
    label = 'khôi phục';
    actionFunc = () => flashSaleService.restoreMany(selectedIds);
  } else if (action === 'xoa-vinh-vien') {
    label = 'xoá vĩnh viễn';
    actionFunc = () => flashSaleService.forceDeleteMany(selectedIds);
  } else if (action === 'xoa') {
    label = 'xoá';
    actionFunc = () => flashSaleService.softDeleteMany(selectedIds);
  } else {
    return;
  }

  const confirmed = await confirmDelete(label, `${selectedIds.length} flash sale`);
  if (!confirmed) return;

  try {
    await actionFunc();
    toast.success(`Đã ${label} ${selectedIds.length} mục`);
    fetchData();
  } catch (err) {
    toast.error('Thao tác thất bại');
  }
};



  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, tab, search]);

  return (
    <Box p={2}>
     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Typography variant="h5" fontWeight={600}>
    Danh sách Flash Sale
  </Typography>

  <Button variant="contained" onClick={() => navigate('/admin/flash-sale/create')}>
    Thêm Mới
  </Button>
</Box>


      <Paper elevation={1} sx={{ p: 2, mt: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label={`Tất Cả (${total})`} value="all" />
            <Tab label={`Hoạt Động (${stats.active})`} value="active" />
            <Tab label={`Tạm Tắt (${stats.inactive})`} value="inactive" />
            <Tab label={`Thùng Rác (${stats.trash})`} value="trash" />
          </Tabs>
        </Box>

        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
  displayEmpty
  value={bulkAction}
  onChange={(e) => setBulkAction(e.target.value)}
  renderValue={() => {
    switch (bulkAction) {
      case 'khoi-phuc': return 'Đã chọn: Khôi phục';
      case 'xoa-vinh-vien': return 'Đã chọn: Xoá vĩnh viễn';
      case 'xoa': return 'Đã chọn: Xoá';
      default: return 'Chọn hành động';
    }
  }}
>
  <MenuItem value="" disabled>Chọn hành động</MenuItem>
  {isTrashTab
    ? [
        <MenuItem key="khoi-phuc" value="khoi-phuc">Khôi phục</MenuItem>,
        <MenuItem key="xoa-vinh-vien" value="xoa-vinh-vien">Xoá vĩnh viễn</MenuItem>
      ]
    : [<MenuItem key="xoa" value="xoa">Chuyển vào thùng rác</MenuItem>]
  }
</Select>

            </FormControl>
            <Button variant="outlined" disabled={selectedIds.length === 0 || !bulkAction} onClick={() => handleBulkAction(bulkAction)}>
              Áp Dụng
            </Button>
          </Box>

          <TextField size="small" placeholder="Tìm kiếm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Box>
      </Paper>

      {loading ? (
        <LoaderAdmin fullscreen={false} />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedIds.length === data.length && data.length > 0} onChange={handleSelectAll} />
                </TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Banner</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Màu nền</TableCell>

                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
         <TableBody>
  {data.length === 0 ? (
    <TableRow>
      <TableCell colSpan={9} align="center">
        <Typography variant="body1" color="text.secondary">
          Không tìm thấy kết quả phù hợp
        </Typography>
      </TableCell>
    </TableRow>
  ) : (
    data.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell padding="checkbox">
          <Checkbox checked={selectedIds.includes(row.id)} onChange={() => handleSelect(row.id)} />
        </TableCell>
        <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
        <TableCell>
    {row.bannerUrl ? (
        <img
            src={row.bannerUrl}
            alt="banner"
            style={{
                width: '150px',         // Đặt chiều rộng cố định cho thumbnail
                height: '58px',          // Đặt chiều cao cố định
                objectFit: 'cover',      // Quan trọng: Giữ tỷ lệ, cắt phần thừa
                borderRadius: '4px',     // Bo góc cho đẹp
                verticalAlign: 'middle'  // Căn ảnh ra giữa ô
            }}
        />
    ) : (
        <Typography variant="body2" color="text.secondary">
            Không có
        </Typography>
    )}
</TableCell>

        <TableCell>
          <HighlightText text={row.title} highlight={search} />
        </TableCell>

        <TableCell>
          {`${formatDateFlexible(row.startTime, { showTime: true })} - ${formatDateFlexible(row.endTime, { showTime: true })}`}
        </TableCell>

        <TableCell>{row.isActive ? 'Đang chạy' : 'Tạm dừng'}</TableCell>
        <TableCell>{row.slug}</TableCell>
        <TableCell>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '4px',
              backgroundColor: row.bgColor || '#ccc',
              border: '1px solid #999'
            }}
            title={row.bgColor}
          />
        </TableCell>

        <TableCell align="right" sx={{ minWidth: 60 }}>
          <IconButton size="small" onClick={(e) => handleMenuClick(e, row.id)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu && menuRowId === row.id}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {!row.deletedAt && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate(`/admin/flash-sale/edit/${row.slug}`);
                }}
              >
                Sửa
              </MenuItem>
            )}
            {row.deletedAt ? (
              <>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleRestore(row.id);
                  }}
                >
                  Khôi phục
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleForceDelete(row.id);
                  }}
                >
                  Xoá vĩnh viễn
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleDelete(row.id);
                }}
              >
                Xoá
              </MenuItem>
            )}
          </Menu>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

          </Table>
        </Paper>
      )}
      <MUIPagination currentPage={page} totalItems={total} itemsPerPage={rowsPerPage} onPageChange={setPage} />
    </Box>
  );
};

export default FlashSaleList;
