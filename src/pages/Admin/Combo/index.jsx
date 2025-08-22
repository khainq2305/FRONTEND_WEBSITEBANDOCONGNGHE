import React, { useEffect, useState } from 'react';
import { comboService } from '../../../services/admin/comboService';
import {
  Typography,
  Box,
  Paper,
  Checkbox,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem as MuiMenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import MUIPagination from '../../../components/common/Pagination';
import LoaderAdmin from '../../../components/common/Loader';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import ComboRowItem from './ComboRowItem';
import ComboDetailDialog from './ComboDetailDialog';
import { useNavigate } from 'react-router-dom';

export default function ComboListPage() {
  const [combos, setCombos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [tabCounts, setTabCounts] = useState({ all: 0, active: 0, inactive: 0, expired: 0, deleted: 0 });
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const navigate = useNavigate();

  const bulkActions =
    filter === 'deleted'
      ? [
          { value: 'restore', label: 'Khôi phục' },
          { value: 'forceDelete', label: 'Xóa vĩnh viễn' }
        ]
      : [{ value: 'delete', label: 'Chuyển vào thùng rác' }];

  useEffect(() => {
    fetchData();
  }, [filter, searchText, currentPage, itemsPerPage]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await comboService.getAll();
      const data = res.data || [];
      const now = dayjs();
      const enriched = data.map((c) => ({
        ...c,
        isExpired: c.expiredAt ? dayjs(c.expiredAt).isBefore(now, 'day') : false,
        searchText
      }));
      const filtered = enriched.filter((c) => {
        if (filter === 'active' && (!c.isActive || c.deletedAt || c.isExpired)) return false;
        if (filter === 'inactive' && (c.isActive || c.deletedAt || c.isExpired)) return false;
        if (filter === 'deleted' && !c.deletedAt) return false;
        if (filter === 'all' && c.deletedAt) return false;
        if (filter !== 'deleted' && c.deletedAt) return false;
        if (filter === 'expired' && (!c.isExpired || c.deletedAt)) return false;
        if (searchText && !c.name?.toLowerCase().includes(searchText.toLowerCase())) return false;
        return true;
      });

      setCombos(filtered);
      setTotalItems(filtered.length);
      setTabCounts({
        all: enriched.filter((c) => !c.deletedAt).length,
        active: enriched.filter((c) => c.isActive && !c.deletedAt && !c.isExpired).length,
        inactive: enriched.filter((c) => !c.isActive && !c.deletedAt && !c.isExpired).length,
        expired: enriched.filter((c) => !c.deletedAt && c.isExpired).length,
        deleted: data.filter((c) => c.deletedAt).length
      });
    } catch (err) {
      console.error('Lỗi lấy combo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (combo) => {
    try {
      const res = await comboService.getBySlug(combo.slug); // ✅ Lấy combo có comboSkus
      setSelectedCombo(res.data); // ✅ lấy combo từ res.data
      setOpenDetailDialog(true);
    } catch (err) {
      toast.error('Lỗi lấy chi tiết combo');
      console.error('❌ Lỗi handleViewDetail:', err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!(await confirmDelete('xoá', name))) return;
    setIsLoading(true);
    try {
      await comboService.softDelete(id);
      toast.success(`Đã xoá combo "${name}"`);
      fetchData();
    } catch {
      toast.error('Lỗi xoá combo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDelete = async (id) => {
    if (!(await confirmDelete('xoá vĩnh viễn', 'combo này'))) return;
    setIsLoading(true);
    try {
      await comboService.forceDelete(id);
      toast.success('Xoá vĩnh viễn combo thành công');
      fetchData();
    } catch {
      toast.error('Lỗi xoá combo vĩnh viễn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id) => {
    setIsLoading(true);
    try {
      await comboService.restore(id);
      toast.success('Khôi phục combo thành công');
      fetchData();
    } catch {
      toast.error('Lỗi khôi phục combo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;
    const confirmText = {
      delete: 'Chuyển vào thùng rác',
      restore: 'Khôi phục',
      forceDelete: 'Xoá vĩnh viễn'
    }[bulkAction];

    if (!(await confirmDelete(confirmText, `${selectedIds.length} combo`))) return;
    setIsLoading(true);
    try {
      if (bulkAction === 'delete') {
        await comboService.softDeleteMany(selectedIds);
      } else {
        for (let id of selectedIds) {
          if (bulkAction === 'restore') await comboService.restore(id);
          else if (bulkAction === 'forceDelete') await comboService.forceDelete(id);
        }
      }
      toast.success(`Đã ${confirmText.toLowerCase()} thành công`);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error(`Lỗi khi ${confirmText.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = (checked) => setSelectedIds(checked ? combos.map((c) => c.id) : []);
  const toggleSelectOne = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <Box>
      {isLoading && <LoaderAdmin fullscreen />}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Danh sách combo</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/combos/create')}>
          + Thêm combo
        </Button>
      </Box>

      <Box sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {['all', 'active', 'inactive', 'expired', 'deleted'].map((value) => {
            const label = { all: 'Tất Cả', active: 'Hoạt Động', inactive: 'Tạm Tắt', expired: 'Hết hạn', deleted: 'Thùng Rác' }[value];
            const count = tabCounts[value] || 0;
            const isActive = filter === value;
            return (
              <Box
                key={value}
                onClick={() => setFilter(value)}
                sx={{
                  px: 2,
                  py: 0.8,
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 14,
                  bgcolor: isActive ? 'primary.main' : '',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': { bgcolor: isActive ? 'primary.dark' : '#e0e0e0' }
                }}
              >{`${label} (${count})`}</Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return <em>Áp dụng hàng loạt</em>;
                  const found = bulkActions.find((item) => item.value === selected);
                  return found ? found.label : <em>Áp dụng hàng loạt</em>;
                }}
                sx={{ backgroundColor: '#fff' }}
              >
                <MuiMenuItem disabled value="">
                  <em>Áp dụng hàng loạt</em>
                </MuiMenuItem>
                {bulkActions.map((action) => (
                  <MuiMenuItem key={action.value} value={action.value}>
                    {action.label}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="small"
              disabled={!bulkAction || !selectedIds.length}
              onClick={handleBulkAction}
              sx={{ mt: { xs: 0.5, sm: 0 } }}
            >
              Áp Dụng
            </Button>
          </Box>
          <TextField placeholder="Tìm kiếm..." size="small" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </Box>
      </Box>

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={combos.length > 0 && selectedIds.length === combos.length}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < combos.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tên combo</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Hiệu lực</TableCell>
                {/* <TableCell>Tiến độ bán</TableCell> */}
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {combos.map((combo, index) => (
                <ComboRowItem
                  key={combo.id}
                  combo={combo}
                  index={index}
                  selected={selectedIds.includes(combo.id)}
                  onSelect={toggleSelectOne}
                  onEdit={() => navigate(`/admin/combos/edit/${combo.slug}`)}
                  onDelete={handleDelete}
                  onRestore={handleRestore}
                  onForceDelete={handleForceDelete}
                  filter={filter}
                  onViewDetail={handleViewDetail} // ✅ truyền vào đây
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <MUIPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setItemsPerPage}
      />
      <ComboDetailDialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} combo={selectedCombo} />
    </Box>
  );
}
