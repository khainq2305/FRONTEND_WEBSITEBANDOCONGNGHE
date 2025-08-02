import React, { useEffect, useState } from 'react';
import { comboService } from '../../../services/admin/comboService';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Checkbox,
  Chip,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem
} from '@mui/material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { toast } from 'react-toastify';
import MoreActionsMenu from '../../../components/common/MoreActionsMenu';
import dayjs from 'dayjs';

import MUIPagination from '../../../components/common/Pagination';
import Toastify from '../../../components/common/Toastify';
import LoaderAdmin from '../../../components/common/Loader';
import HighlightText from '../../../components/Admin/HighlightText';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { API_BASE_URL } from '../../../constants/environment';

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
  const [tabCounts, setTabCounts] = useState({ all: 0, active: 0, inactive: 0, deleted: 0 });
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    comboId: null
  });

  const bulkActions =
    filter === 'deleted'
      ? [
          { value: 'restore', label: 'Khôi phục' },
          { value: 'forceDelete', label: 'Xóa vĩnh viễn' }
        ]
      : [{ value: 'delete', label: 'Chuyển vào thùng rác' }];

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchData();
  }, [filter, searchText, currentPage, itemsPerPage]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await comboService.getAll(); // comboService
      const data = res.data || [];
      const now = dayjs();
      const enriched = data.map((c) => ({
        ...c,
        isExpired: c.expiredAt ? dayjs(c.expiredAt).isBefore(now, 'day') : false
      }));

      const filtered = data.filter((c) => {
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
  all: enriched.filter(c => !c.deletedAt).length,
  active: enriched.filter(c => c.isActive && !c.deletedAt && !c.isExpired).length,
  inactive: enriched.filter(c => !c.isActive && !c.deletedAt && !c.isExpired).length,
  expired: enriched.filter(c => !c.deletedAt && c.isExpired).length,
  deleted: data.filter(c => c.deletedAt).length
});

    } catch (err) {
      console.error('Lỗi lấy combo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!(await confirmDelete('xoá', name))) return;
    setIsLoading(true);
    try {
      await comboService.softDelete(id);
      toast.success(`Đã xoá combo "${name}"`);
      fetchData();
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      console.error('❌ [LỖI KHÔI PHỤC COMBO]:', err?.response?.data || err);
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
        console.log('📤 Gửi yêu cầu xoá nhiều combo:', selectedIds);

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
    } catch (err) {
      toast.error(`Lỗi khi ${confirmText.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const SortableRow = ({ combo, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: String(combo.id) });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
      <TableRow ref={setNodeRef} style={style}>
        {children({ listeners, attributes })}
      </TableRow>
    );
  };

  const getThumbnailUrl = (thumb) => {
    if (!thumb) return '';
    return thumb.startsWith('http') ? thumb : `${API_BASE_URL}${thumb}`;
  };

  const toggleSelectAll = (checked) => setSelectedIds(checked ? combos.map((c) => c.id) : []);
  const toggleSelectOne = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <Box>
      {isLoading && <LoaderAdmin fullscreen />}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Danh sách combo</Typography>
        <Button variant="contained" onClick={() => (window.location.href = '/admin/combos/create')}>
          + Thêm combo
        </Button>
      </Box>

      {/* Tabs + Filters */}
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
              >
                {`${label} (${count})`}
              </Box>
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

      {/* Table */}
      <Paper elevation={1}>
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
              <TableCell>Tiến độ bán</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DndContext sensors={sensors} collisionDetection={closestCenter}>
              <SortableContext items={combos.map((c) => String(c.id))} strategy={verticalListSortingStrategy}>
                {combos.map((combo) => (
                  <SortableRow key={combo.id} combo={combo}>
                    {({ listeners, attributes }) => (
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedIds.includes(combo.id)} onChange={() => toggleSelectOne(combo.id)} />
                        </TableCell>
                        <TableCell>
                          <Avatar
                            variant="rounded"
                            src={getThumbnailUrl(combo.thumbnail)}
                            alt={combo.name}
                            sx={{ width: 90, height: 100, borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>
                          <HighlightText text={combo.name} highlight={searchText} />
                        </TableCell>

                        <TableCell>{Number(combo.price)?.toLocaleString()} đ</TableCell>
                        <TableCell>
                          <Chip
                            label={combo.isExpired ? 'Hết hạn' : combo.isActive ? 'Hoạt động' : 'Tạm tắt'}
                            color={combo.isExpired ? 'default' : combo.isActive ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>{combo.slug}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {combo.startAt ? dayjs(combo.startAt).format('DD/MM/YYYY') : '...'}
                            {' → '}
                            {combo.expiredAt ? dayjs(combo.expiredAt).format('DD/MM/YYYY') : '...'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {combo.sold}/{combo.quantity} ({combo.quantity > 0 ? Math.round((combo.sold / combo.quantity) * 100) : 0}%)
                            </Typography>
                            <Box sx={{ width: '100%', backgroundColor: '#eee', borderRadius: 1, height: 6, mt: 0.5 }}>
                              <Box
                                sx={{
                                  width: `${combo.quantity > 0 ? (combo.sold / combo.quantity) * 100 : 0}%`,
                                  backgroundColor: '#4caf50',
                                  height: '100%',
                                  borderRadius: 1
                                }}
                              ></Box>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              setMenuState({
                                anchorEl: e.currentTarget,
                                comboId: combo.id,
                                comboSlug: combo.slug,
                                comboName: combo.name
                              });
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </SortableRow>
                ))}
              </SortableContext>
            </DndContext>
          </TableBody>
        </Table>
      </Paper>
      <Menu
        anchorEl={menuState.anchorEl}
        open={Boolean(menuState.anchorEl)}
        onClose={() => setMenuState({ anchorEl: null, comboId: null, comboSlug: null, comboName: null })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {filter === 'deleted' ? (
          <>
            <MenuItem
              onClick={() => {
                handleRestore(menuState.comboId);
                setMenuState({ anchorEl: null, comboId: null, comboSlug: null, comboName: null });
              }}
            >
              Khôi phục
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleForceDelete(menuState.comboId);
                setMenuState({ anchorEl: null, comboId: null, comboSlug: null, comboName: null });
              }}
              sx={{ color: 'error.main' }}
            >
              Xoá vĩnh viễn
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                window.location.href = `/admin/combos/edit/${menuState.comboSlug}`;
                setMenuState({ anchorEl: null, comboId: null, comboSlug: null, comboName: null });
              }}
            >
              Sửa
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDelete(menuState.comboId, menuState.comboName);
                setMenuState({ anchorEl: null, comboId: null, comboSlug: null, comboName: null });
              }}
              sx={{ color: 'error.main' }}
            >
              Xoá
            </MenuItem>
          </>
        )}
      </Menu>
      {/* Pagination */}
      <MUIPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setItemsPerPage}
      />
    </Box>
  );
}
