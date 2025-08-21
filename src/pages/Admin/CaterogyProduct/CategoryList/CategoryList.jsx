import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImportExport, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import Breadcrumb from '@/components/common/Breadcrumb';

import { categoryService } from 'services/admin/categoryService';
import Pagination from 'components/common/Pagination';
import CategoryActionsMenu from '../CategoryActionsMenu.jsx';
import { confirmDelete } from 'components/common/ConfirmDeleteDialog';
import BulkActions from '../BulkActions';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import Loader from '../../../../components/Admin/LoaderVip';
import HighlightText from '../../../../components/Admin/HighlightText';

const DEFAULT_THUMBNAIL = '/images/placeholder.png';

const showToastByStatus = (err) => {
  const resData = err?.response?.data;
  const message = resData?.message || err.message || 'Có lỗi xảy ra';
  const conflicts = resData?.conflicts || null;

  const opt = { style: { whiteSpace: 'pre-line' } };

  if (conflicts) {
    let lines = [`${message}`];

    for (const [, conflictList] of Object.entries(conflicts)) {
      if (Array.isArray(conflictList)) {
        conflictList.forEach(({ name, reason }) => {
          lines.push(`- ${name}: ${reason}`);
        });
      }
    }

    toast.error(lines.join('\n'), opt);
    return;
  }

  const fallbackLines = message.split('\n').filter(Boolean);
  fallbackLines.forEach((msg) => toast.error(msg, opt));
};

const CategoryList = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [data, setData] = useState({ list: [], total: 0 });
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0, trashed: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll({
        page,
        limit: itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter === 'active' && { isActive: true }),
        ...(statusFilter === 'inactive' && { isActive: false }),
        ...(statusFilter === 'trashed' && { isDeleted: true }),
        ...(statusFilter === 'all' && { isDeleted: false }),
      });

      const flat = res.data?.data || [];
      setData({ list: flat, total: res.data?.total || 0 });
      setCounts(res.data?.counts || {});
    } catch (err) {
      showToastByStatus(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForceDelete = async (id) => {
    if (!(await confirmDelete('xoá vĩnh viễn', 'danh mục này'))) return;
    setLoading(true);
    try {
      await categoryService.forceDelete(id);
      toast.success('Đã xoá vĩnh viễn');
      fetchData();
    } catch (err) {
      showToastByStatus(err);
      setLoading(false);
    }
  };
<Breadcrumb
  items={[
    { label: 'Trang chủ', href: '/admin' },
    { label: 'Danh mục', href: '/admin/categories' },
    { label: 'Danh sách' },
  ]}
/>

  const handleSoftDelete = async (id) => {
    if (!(await confirmDelete('chuyển', 'danh mục vào thùng rác'))) return;
    setLoading(true);
    try {
      await categoryService.softDelete(id);
      toast.success('Đã chuyển vào thùng rác');
      fetchData();
    } catch (err) {
      showToastByStatus(err);
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    if (!(await confirmDelete('khôi phục', 'danh mục này'))) return;
    setLoading(true);
    try {
      await categoryService.restore(id);
      toast.success('Khôi phục thành công');
      setStatusFilter('all');
      setPage(1);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      showToastByStatus(err);
      setLoading(false);
    }
  };

  const handleBulk = async ({ value, label }) => {
    try {
      if (selectedIds.length === 0) {
        toast.info('Vui lòng chọn danh mục cần thao tác');
        return;
      }

      if (!(await confirmDelete(label.toLowerCase(), 'các danh mục đã chọn'))) return;

      setLoading(true);
      if (value === 'trash') {
        await categoryService.softDeleteMany(selectedIds);
      } else if (value === 'restore') {
        await categoryService.restoreMany(selectedIds);
      } else if (value === 'forceDelete') {
        await categoryService.forceDeleteMany(selectedIds);
      }

      toast.success('Thao tác thành công!');
      if (statusFilter === 'trashed' && value === 'restore') {
        setStatusFilter('all');
      }

      setPage(1);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      showToastByStatus(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const h = debounce(() => setDebouncedSearch(search.trim()), 300);
    h();
    return () => h.cancel();
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, statusFilter, itemsPerPage]);

  const toggleSelectRow = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () => {
    if (data.list.length === 0) return;
    const ids = data.list.map((i) => i.id);
    const allSelected = data.list.length > 0 && ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  };

  const statusTabs = [
    { label: 'Tất cả', value: 'all', count: counts.all },
    { label: 'Hiển thị', value: 'active', count: counts.active },
    { label: 'Ẩn', value: 'inactive', count: counts.inactive },
    { label: 'Thùng rác', value: 'trashed', count: counts.trashed },
  ];

  return (
    <Box sx={{ p: 2 }}>
       
      {loading && <Loader fullscreen />}
          <Breadcrumb
    items={[
      { label: 'Trang chủ', href: '/admin' },
      { label: 'Danh mục', href: '/admin/categories' },
      { label: 'Danh sách' },
    ]}
  />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 , mt: 2}}>
        <Typography variant="h4" fontWeight="bold">
          Danh sách danh mục
        </Typography>
        <Button variant="contained" onClick={() => navigate('/admin/categories/addd')}>
          Thêm danh mục
        </Button>
      </Box>

      <Box sx={{ p: 4, bgcolor: '#fff', borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          {statusTabs.map((t) => (
            <Button
              key={t.value}
              variant={statusFilter === t.value ? 'contained' : 'outlined'}
              sx={statusFilter === t.value ? { border: 'none' } : undefined}
              onClick={() => {
                setStatusFilter(t.value);
                setPage(1);
                setSelectedIds([]);
              }}
            >
              {t.label} {typeof t.count === 'number' && `(${t.count})`}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <BulkActions status={statusFilter} onSubmit={handleBulk} disabled={loading || selectedIds.length === 0} />

          <TextField
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tên danh mục..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
            disabled={loading}
          />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center" padding="checkbox" sx={{ width: '60px' }}>
                <Checkbox
                  checked={
                    data.list.length > 0 &&
                    data.list.every((i) => selectedIds.includes(i.id))
                  }
                  onChange={toggleSelectAll}
                  disabled={loading || data.list.length === 0}
                />
              </TableCell>
              <TableCell align="center" sx={{ width: '60px' }}>STT</TableCell>
              <TableCell align="center" sx={{ width: '120px' }}>Ảnh</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell sx={{ width: '20%'}}>Slug</TableCell>
              <TableCell align="center" sx={{ width: '100px' }}>Thứ tự</TableCell>
              <TableCell align="center" sx={{ width: '120px' }}>Trạng thái</TableCell>
              <TableCell align="center" sx={{ width: '150px' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragStart={({ active }) => {
                if (loading) return;
                const it = data.list.find((i) => i.id === active.id);
                if (it) setActiveDragItem(it);
              }}
              onDragEnd={async ({ active, over }) => {
                setActiveDragItem(null);
                if (loading || !over || active.id === over.id) return;

                const list = [...data.list];
                const from = list.findIndex((i) => i.id === active.id);
                const to = list.findIndex((i) => i.id === over.id);
                if (from === -1 || to === -1) return;

                const src = list[from];
                const dest = list[to];
                if (src.parentId !== dest.parentId) {
                  toast.warning('Chỉ được kéo trong cùng nhóm danh mục!');
                  return;
                }

                const moved = [src];
                if (!src.parentId) {
                  for (let i = from + 1; i < list.length; i++) {
                    if (list[i].parentId === src.id) moved.push(list[i]);
                    else if(list[i].parentId !== src.id && list[i].parentId) continue;
                    else break;
                  }
                }
                
                const remain = list.filter((i) => !moved.find(m => m.id === i.id));
                let insertAtIndex = remain.findIndex((i) => i.id === dest.id);

                const newList = [
                  ...remain.slice(0, insertAtIndex),
                  ...moved,
                  ...remain.slice(insertAtIndex),
                ];
                
                const originalList = [...data.list];
                setData({ ...data, list: newList });

                setLoading(true);
                try {
                  await categoryService.updateOrderIndex(
                    newList.map((i, idx) => ({ id: i.id, sortOrder: idx }))
                  );
                  toast.success('Đã lưu thứ tự!');
                  await fetchData(); 
                } catch (err) {
                  showToastByStatus(err);
                  setData({ ...data, list: originalList });
                } finally {
                  setLoading(false);
                }
              }}
            >
              <SortableContext
                items={data.list.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
                disabled={loading || statusFilter === 'trashed'}
              >
                {data.list.length ? (
                  data.list.map((it, idx) => (
                    <SortableRow key={it.id} id={it.id} disabled={loading || statusFilter === 'trashed'}>
                      {(attrs, lstn) => (
                        <CategoryRow
                          item={it}
                          rowIndex={(page - 1) * itemsPerPage + idx + 1}
                          attributes={attrs}
                          listeners={statusFilter !== 'trashed' ? lstn : undefined}
                          debouncedSearch={debouncedSearch}
                          onDelete={() => handleSoftDelete(it.id)}
                          onRestore={() => handleRestore(it.id)}
                          onForceDelete={() => handleForceDelete(it.id)}
                          isTrashed={statusFilter === 'trashed'}
                          selectedIds={selectedIds}
                          toggleSelectRow={toggleSelectRow}
                          loading={loading}
                        />
                      )}
                    </SortableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      Không có kết quả phù hợp.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>

              <DragOverlay>
                {activeDragItem && (
                  <Paper elevation={4} sx={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                     <Table sx={{ tableLayout: 'fixed' }}>
                        <TableBody>
                            <TableRow sx={{backgroundColor: 'rgba(240, 240, 240, 0.9)'}}>
                                <TableCell align="center" padding="checkbox" sx={{ width: '60px' }}><Checkbox checked={false} readOnly/></TableCell>
                                <TableCell align="center" sx={{ width: '60px' }}></TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                    <img
                                    src={activeDragItem.thumbnail || DEFAULT_THUMBNAIL}
                                    width={50}
                                    height={50}
                                    style={{ borderRadius: 4, objectFit: 'cover' }}
                                    alt={activeDragItem.name}
                                    />
                                </TableCell>
                                <TableCell >
                                    <Box sx={{ pl: `${(activeDragItem.label?.match(/\u2014/g)?.length || 0) * 12}px` }}>
                                        {activeDragItem.label || activeDragItem.name}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ width: '20%'}}>{activeDragItem.slug}</TableCell>
                                <TableCell align="center" sx={{ width: '100px' }}>{activeDragItem.sortOrder ?? '–'}</TableCell>
                                <TableCell align="center" sx={{ width: '120px' }}>
                                     <Chip
                                        label={activeDragItem.isActive ? 'Hiển thị' : 'Ẩn'}
                                        size="small"
                                        color={activeDragItem.isActive ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ width: '150px' }}>
                                    <IconButton><ImportExport /></IconButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                     </Table>
                  </Paper>
                )}
              </DragOverlay>
            </DndContext>
          </TableBody>
        </Table>
      </TableContainer>

      {data.total > itemsPerPage && !loading && data.list.length > 0 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            currentPage={page}
            totalItems={data.total}
            itemsPerPage={itemsPerPage}
            onPageChange={(p) => {
                setPage(p);
                setSelectedIds([]);
            }}
            onPageSizeChange={(s) => {
              setItemsPerPage(s);
              setPage(1);
              setSelectedIds([]);
            }}
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
};

export default CategoryList;

const CategoryRow = ({
  item,
  rowIndex,
  attributes = {},
  listeners = {},
  debouncedSearch = '',
  onDelete,
  onRestore,
  onForceDelete,
  isTrashed,
  selectedIds,
  toggleSelectRow,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <TableCell align="center" padding="checkbox">
        <Checkbox
          checked={selectedIds.includes(item.id)}
          onChange={() => toggleSelectRow(item.id)}
          disabled={loading}
        />
      </TableCell>

      <TableCell align="center">{rowIndex}</TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={item.thumbnail || DEFAULT_THUMBNAIL}
            alt={item.name}
            width={80}
            height={80}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ pl: `${(item.label?.match(/\u2014/g)?.length || 0) * 12}px` }}>
          <HighlightText text={item.label || item.name} highlight={debouncedSearch} />
        </Box>
      </TableCell>

      <TableCell>{item.slug}</TableCell>

      <TableCell align="center">{item.sortOrder ?? '–'}</TableCell>

      <TableCell align="center">
        {!isTrashed && (
            <Chip
            label={item.isActive ? 'Hiển thị' : 'Ẩn'}
            size="small"
            color={item.isActive ? 'success' : 'default'}
            />
        )}
      </TableCell>

      <TableCell align="center">
        {!isTrashed && (
          <IconButton {...attributes} {...listeners} disabled={loading}>
            <ImportExport />
          </IconButton>
        )}

        <CategoryActionsMenu
          isTrashed={isTrashed}
          onEdit={() => navigate(`/admin/categories/edit/${item.slug}`)}
          onDelete={onDelete}
          onRestore={onRestore}
          onForceDelete={onForceDelete}
          disabled={loading}
        />
      </TableCell>
    </>
  );
};

const SortableRow = ({ id, children, disabled }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? 'rgba(230,230,230,0.7)' : undefined,
    opacity: isDragging ? 0.9 : 1,
    display: 'table-row',
    width: '100%',
    tableLayout: 'fixed',
  };

  return (
    <TableRow
      ref={setNodeRef}
      hover={!isDragging && !disabled}
      style={style}
    >
      {children(attributes, listeners)}
    </TableRow>
  );
};