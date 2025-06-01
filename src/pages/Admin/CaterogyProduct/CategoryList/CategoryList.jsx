import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Chip, TextField, InputAdornment, IconButton
} from '@mui/material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImportExport, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { categoryService } from 'services/admin/categoryService';
import Pagination from 'components/common/Pagination';
import CategoryActionsMenu from '../CategoryActionsMenu.jsx';
import Checkbox from '@mui/material/Checkbox';
import BulkActions from '../BulkActions';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { DragOverlay } from '@dnd-kit/core';
import { normalizeCategoryList } from '@/utils';

const CategoryList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0, trashed: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const sensors = useSensors(useSensor(PointerSensor));

  const statusTabs = [
    { label: 'Tất cả', value: 'all', count: counts.all },
    { label: 'Hiển thị', value: 'active', count: counts.active },
    { label: 'Ẩn', value: 'inactive', count: counts.inactive },
    { label: 'Thùng rác', value: 'trashed', count: counts.trashed }
  ];

  useEffect(() => {
    const handler = debounce(() => setDebouncedSearch(search), 300);
    handler();
    return () => handler.cancel();
  }, [search]);

  const getFilteredQuery = () => {
    const query = { page, limit: itemsPerPage };

    if (debouncedSearch) query.search = debouncedSearch;

    const statusMap = {
      active: { isActive: true },
      inactive: { isActive: false },
      trashed: { isDeleted: true },
      all: { isDeleted: false }
    };

    Object.assign(query, statusMap[statusFilter] || {});

    return query;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll(getFilteredQuery());
      setData(normalizeCategoryList(res.data.data));
      setCounts(res.data?.counts || {});
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, statusFilter, itemsPerPage]);

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const allIds = data.map(i => i.id);
    const allSelected = allIds.every(id => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter(id => !allIds.includes(id)) : [...new Set([...selectedIds, ...allIds])]);
  };


  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" fontWeight="bold">Danh sách danh mục</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/categories/addd')}>Thêm danh mục</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        {statusTabs.map(tab => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
              setSelectedIds([]);
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                border: 'none'
              }
            }}
          >
            {tab.label} ({tab.count})
          </Button>

        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <BulkActions
          status={statusFilter}
          selectedIds={selectedIds}
          fetchData={fetchData}
          setSelectedIds={setSelectedIds}
        />
        <TextField
          size="small"
          placeholder="Tìm kiếm tên danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value.trimStart())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center" padding="checkbox">
                <Checkbox
                  checked={data.length > 0 && data.every(i => selectedIds.includes(i.id))}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Ảnh</TableCell>
              <TableCell align="center">Tên danh mục</TableCell>
              <TableCell align="center">Slug</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragStart={({ active }) => setActiveDragItem(data.find(i => i.id === active.id))}
              onDragEnd={async ({ active, over }) => {
                setActiveDragItem(null);
                if (!over || active.id === over.id) return;
                const newList = arrayMove(data, data.findIndex(i => i.id === active.id), data.findIndex(i => i.id === over.id));
                setData(newList);
                try {
                  await categoryService.updateOrderIndex(newList.map((item, i) => ({ id: item.id, sortOrder: i })));
                  toast.success('Đã lưu thứ tự mới');
                } catch {
                  toast.error('Không thể lưu thứ tự');
                }
              }}
            >
              <SortableContext items={data.map(i => i.id)} strategy={verticalListSortingStrategy}>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center">Đang tải...</TableCell></TableRow>
                ) : data.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center">Không có dữ liệu</TableCell></TableRow>
                ) : (
                  data.map((item, index) => (
                    <SortableRow key={item.id} id={item.id}>
                      {(attributes, listeners) => (
                        <>
                          <TableCell align="center" padding="checkbox">
                            <Checkbox checked={selectedIds.includes(item.id)} onChange={() => toggleSelectRow(item.id)} />
                          </TableCell>
                          <TableCell align="center">{(page - 1) * itemsPerPage + index + 1}</TableCell>
                          <TableCell align="center">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                            ) : (
                              <Box sx={{ width: 60, height: 60, bgcolor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.name?.[0]}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {'— '.repeat(item.level) + item.name}
                            {item.isDefault && (
                              <Typography
                                component="span"
                                sx={{
                                  ml: 1,
                                  px: 1,
                                  py: 0.3,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  borderRadius: 1,
                                  backgroundColor: 'primary.main',
                                  color: '#fff'
                                }}
                              >
                                Mặc định
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">{item.slug}</TableCell>
                          <TableCell align="center">
                            <Chip label={item.isActive ? 'Hiển thị' : 'Ẩn'} color={item.isActive ? 'success' : 'default'} size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton size="small" {...attributes} {...listeners}><ImportExport fontSize="small" /></IconButton>
                              <CategoryActionsMenu
                                item={item}
                                isTrashed={statusFilter === 'trashed'}
                                fetchData={fetchData}
                              />
                            </Box>
                          </TableCell>
                        </>
                      )}
                    </SortableRow>
                  ))
                )}
              </SortableContext>
              <DragOverlay>
                {activeDragItem && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, bgcolor: '#fff', boxShadow: 6 }}>
                    <img src={activeDragItem.thumbnail} alt="thumb" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                    <Box><Typography>{activeDragItem.name}</Typography></Box>
                  </Box>
                )}
              </DragOverlay>
            </DndContext>
          </TableBody>
        </Table>
      </TableContainer>

      {data.length > 0 && (
        <Box mt={3}>
          <Pagination
            currentPage={page}
            totalItems={counts[statusFilter] || data.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setItemsPerPage(size); setPage(1); }}
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
};

export default CategoryList;

const SortableRow = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: isDragging ? '#e3f2fd' : undefined
      }}
      hover
    >
      {children(attributes, listeners)}
    </TableRow>
  );
};
