import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Tooltip, Tabs, Tab, TextField,
  Select, MenuItem, FormControl, Checkbox, Menu
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

import { flashSaleService } from '../../../services/admin/flashSaleService';
import LoaderAdmin from '../../../components/Admin/LoaderVip';
import HighlightText from '../../../components/Admin/HighlightText';
import MUIPagination from '../../../components/common/Pagination';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';

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
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = data.map(row => row.id);
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
    toast.success('✅ Đã chuyển vào thùng rác');
    fetchData();
  };

  const handleRestore = async (id) => {
    const confirmed = await confirmDelete('khôi phục', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.restore(id);
    toast.success('✅ Đã khôi phục');
    fetchData();
  };

  const handleForceDelete = async (id) => {
    const confirmed = await confirmDelete('xoá vĩnh viễn', 'flash sale này');
    if (!confirmed) return;
    await flashSaleService.forceDelete(id);
    toast.success('✅ Đã xoá vĩnh viễn');
    fetchData();
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    const label = action === 'restore' ? 'khôi phục' : 'xoá vĩnh viễn';
    const confirmed = await confirmDelete(label, `${selectedIds.length} flash sale`);
    if (!confirmed) return;
    try {
      if (action === 'restore') {
        await flashSaleService.restoreMany(selectedIds);
        toast.success(`✅ Đã khôi phục ${selectedIds.length} mục`);
      } else {
        await flashSaleService.forceDeleteMany(selectedIds);
        toast.success(`✅ Đã xoá vĩnh viễn ${selectedIds.length} mục`);
      }
      fetchData();
    } catch (err) {
      toast.error('❌ Thao tác thất bại');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, tab, search]);

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={600} mb={2}>Danh sách Flash Sale</Typography>

      <Button variant="contained" onClick={() => navigate('/admin/flash-sale/create')}>
        Thêm Mới
      </Button>

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
                value=""
                onChange={(e) => handleBulkAction(e.target.value)}
                renderValue={() => 'Chọn hành động'}
              >
                <MenuItem value="" disabled>Chọn hành động</MenuItem>
                {isTrashTab ? (
                  <>
                    <MenuItem value="restore">Khôi phục</MenuItem>
                    <MenuItem value="forceDelete">Xoá vĩnh viễn</MenuItem>
                  </>
                ) : (
                  <MenuItem value="delete">Xoá</MenuItem>
                )}
              </Select>
            </FormControl>
            <Button variant="outlined" disabled={selectedIds.length === 0}>
              Áp Dụng
            </Button>
          </Box>

          <TextField
            size="small"
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                  <Checkbox
                    checked={selectedIds.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Màu nền</TableCell>
                <TableCell>Banner</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <HighlightText text={row.title} highlight={search} />
                  </TableCell>
                  <TableCell>{row.startTime} - {row.endTime}</TableCell>
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
                  <TableCell>
                    {row.bannerUrl ? (
                      <img
                        src={row.bannerUrl}
                        alt="banner"
                        style={{ width: 80, height: 'auto', borderRadius: 4 }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">Không có</Typography>
                    )}
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
                        <MenuItem onClick={() => {
                          handleMenuClose();
                          navigate(`/admin/flash-sale/edit/${row.id}`);
                        }}>
                          Sửa
                        </MenuItem>
                      )}
                      {row.deletedAt ? (
                        <>
                          <MenuItem onClick={() => {
                            handleMenuClose();
                            handleRestore(row.id);
                          }}>
                            Khôi phục
                          </MenuItem>
                          <MenuItem onClick={() => {
                            handleMenuClose();
                            handleForceDelete(row.id);
                          }}>
                            Xoá vĩnh viễn
                          </MenuItem>
                        </>
                      ) : (
                        <MenuItem onClick={() => {
                          handleMenuClose();
                          handleDelete(row.id);
                        }}>
                          Xoá
                        </MenuItem>
                      )}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
         
        </Paper>
      )}
       <MUIPagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={rowsPerPage}
            onPageChange={setPage}
          />
    </Box>
  );
};

export default FlashSaleList;
