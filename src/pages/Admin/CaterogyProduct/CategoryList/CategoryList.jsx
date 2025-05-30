import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper, Chip, TextField, InputAdornment, IconButton
} from '@mui/material';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImportExport, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { categoryService } from 'services/admin/categoryService';
import Pagination from 'components/common/Pagination';
import CategoryActionsMenu from '../CategoryActionsMenu.jsx';
import { confirmDelete } from 'components/common/ConfirmDeleteDialog';
import Checkbox from '@mui/material/Checkbox';
import BulkActions from '../BulkActions';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { DragOverlay } from '@dnd-kit/core';



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

  const statusTabs = [
    { label: 'Tất cả', value: 'all', count: counts.all },
    { label: 'Hiển thị', value: 'active', count: counts.active },
    { label: 'Ẩn', value: 'inactive', count: counts.inactive },
    { label: 'Thùng rác', value: 'trashed', count: counts.trashed }
  ];

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageIds = data.list.map((item) => item.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(
      allSelected
        ? selectedIds.filter((id) => !currentPageIds.includes(id))
        : [...new Set([...selectedIds, ...currentPageIds])]
    );
  };

  useEffect(() => {
    const handler = debounce(() => setDebouncedSearch(search), 300);

    handler();
    return () => handler.cancel();
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll({
        page,
        limit: itemsPerPage, // 👈 dùng state thay vì biến cố định
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter === 'active' && { isActive: true }),
        ...(statusFilter === 'inactive' && { isActive: false }),
        ...(statusFilter === 'trashed' && { isDeleted: true }),
        ...(statusFilter === 'all' && { isDeleted: false })
      });

      setData({
        list: res.data?.data || [],
        total: res.data?.total || 0
      });
      setCounts(res.data?.counts || {});
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, statusFilter, itemsPerPage]);


  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Danh sách danh mục
        </Typography>

        <Button variant="contained" onClick={() => navigate('/admin/categories/addd')}>
          Thêm danh mục
        </Button>
      </Box>



      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        {statusTabs.map((tab) => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? 'contained' : 'outlined'}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
              setSelectedIds([]);
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              border: statusFilter === tab.value ? undefined : 'none',
              backgroundColor: statusFilter === tab.value ? '#1976d2' : 'transparent',
              color: statusFilter === tab.value ? '#fff' : '#1976d2',
              '&:hover': {
                backgroundColor: statusFilter === tab.value ? '#1565c0' : '#e3f2fd',
                border: 'none'
              }
            }}
          >
            {tab.label}
            {typeof tab.count === 'number' && ` (${tab.count})`}
          </Button>
        ))}
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <BulkActions
          showRestoreDelete={true}
          status={statusFilter}
          onSubmit={async (action) => {
            try {
              if (selectedIds.length === 0) {
                if (statusFilter === 'trashed') {
                  if (action === 'restore') {
                    const confirmed = await confirmDelete('khôi phục tất cả danh mục');
                    if (!confirmed) return;
                    await categoryService.restoreAll();
                    toast.success('Đã khôi phục tất cả danh mục');
                  } else if (action === 'forceDelete') {
                    const confirmed = await confirmDelete('xoá vĩnh viễn tất cả danh mục trong thùng rác');
                    if (!confirmed) return;
                    await categoryService.forceDeleteAll();
                    toast.success('Đã xoá vĩnh viễn tất cả danh mục');
                  } else {
                    toast.info('Vui lòng chọn danh mục hoặc thao tác phù hợp');
                    return;
                  }
                } else {
                  toast.info('Vui lòng chọn danh mục cần thao tác');
                  return;
                }
              } else {
                if (action === 'trash') {
                  const confirmed = await confirmDelete('chuyển các danh mục đã chọn vào thùng rác');
                  if (!confirmed) return;
                  await categoryService.softDeleteMany(selectedIds);
                  toast.success('Đã chuyển vào thùng rác!');
                } else if (action === 'restore') {
                  const confirmed = await confirmDelete('khôi phục các danh mục đã chọn');
                  if (!confirmed) return;
                  await categoryService.restoreMany(selectedIds);
                  toast.success('Đã khôi phục danh mục đã chọn!');
                } else if (action === 'forceDelete') {
                  const confirmed = await confirmDelete('xoá vĩnh viễn các danh mục đã chọn');
                  if (!confirmed) return;
                  await categoryService.forceDeleteMany(selectedIds);
                  toast.success('Đã xoá vĩnh viễn danh mục đã chọn!');
                }
              }

              setSelectedIds([]);
              fetchData();
            } catch (err) {
              toast.error('Có lỗi xảy ra khi thực hiện thao tác');
              console.error(err);
            }
          }}
        />

        <TextField
          size="small"
          placeholder="Tìm kiếm tên danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value.trimStart())}  // ✅ Đã thêm trimStart()
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


      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell padding="checkbox" align="center">
                <Checkbox
                  checked={data.list.length > 0 && data.list.every((item) => selectedIds.includes(item.id))}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Ảnh</TableCell>
              <TableCell align="center">Tên</TableCell>
              <TableCell align="center">Slug</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center" sx={{ width: 120 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragStart={({ active }) => {
                const draggedItem = data.list.find(item => item.id === active.id);
                setActiveDragItem(draggedItem);
              }}
              onDragEnd={async ({ active, over }) => {
                setActiveDragItem(null);
                if (!over || active.id === over.id) return;

                const oldIndex = data.list.findIndex((i) => i.id === active.id);
                const newIndex = data.list.findIndex((i) => i.id === over.id);

                const newList = arrayMove(data.list, oldIndex, newIndex);

                setData((prev) => ({ ...prev, list: newList }));

                const ordered = newList.map((item, index) => ({
                  id: item.id,
                  sortOrder: index
                }));

                try {
                  await categoryService.updateOrderIndex(ordered);
                  toast.success('Đã lưu thứ tự hiển thị mới');
                } catch (err) {
                  toast.error('Không thể lưu thứ tự hiển thị');
                  console.error(err);
                }
              }}

            >

              <SortableContext items={data.list.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Đang tải...</TableCell>
                  </TableRow>
                ) : data.list.length > 0 ? (
                  data.list.map((item, index) => (
                    <SortableRow key={item.id} id={item.id}>
                      {(attributes, listeners) => (
                        <>
                          <TableCell padding="checkbox" align="center">
                            <Checkbox
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelectRow(item.id)}
                            />
                          </TableCell>

                          <TableCell align="center">{(page - 1) * itemsPerPage + index + 1}</TableCell>

                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.name}
                                  style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'cover',
                                    borderRadius: 4,
                                    backgroundColor: '#ccc'
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 1,
                                    bgcolor: '#ccc',
                                    color: '#fff',
                                    fontSize: 20,
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  {item.name?.[0] || '–'}
                                </Box>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell align="center">
                            {item.name}
                            {item.isDefault && (
                              <Chip label="Mặc định" color="warning" size="small" sx={{ ml: 1 }} />
                            )}
                          </TableCell>

                          <TableCell align="center">{item.slug}</TableCell>

                          <TableCell align="center">
                            <Chip
                              label={item.isActive ? 'Hiển thị' : 'Ẩn'}
                              color={item.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <IconButton
                                size="small"
                                sx={{ cursor: 'grab', p: 0.5 }}
                                {...attributes}
                                {...listeners}
                              >
                                <ImportExport fontSize="small" />
                              </IconButton>
                              <CategoryActionsMenu
                                isTrashed={statusFilter === 'trashed'}
                                onEdit={() => navigate(`/admin/categories/edit/${item.id}`)}
                                onDelete={async () => {
                                  const confirmed = await confirmDelete('chuyển vào thùng rác', item.name); // ✅ fix
                                  if (!confirmed) return;

                                  if (statusFilter === 'trashed') {
                                    await categoryService.delete(item.id);
                                    toast.success('Đã xoá vĩnh viễn');
                                  } else {
                                    await categoryService.softDeleteMany([item.id]);
                                    toast.success('Đã chuyển vào thùng rác');
                                  }

                                  fetchData();
                                }}

                                onRestore={async () => {
                                  await categoryService.restore(item.id);
                                  toast.success('Đã khôi phục danh mục');
                                  fetchData();
                                }}
                              />
                            </Box>
                          </TableCell>

                        </>
                      )}
                    </SortableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Không có dữ liệu</TableCell>
                  </TableRow>
                )}
              </SortableContext>
              <DragOverlay>
                {activeDragItem ? (
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: '#fff',
                      boxShadow: 6,
                      borderRadius: 1,
                      minWidth: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Checkbox disabled />

                    <img
                      src={activeDragItem.thumbnail}
                      alt={activeDragItem.name}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                    />

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={600}>{activeDragItem.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{activeDragItem.slug}</Typography>
                    </Box>

                    <Chip
                      label={activeDragItem.isActive ? 'Hiển thị' : 'Ẩn'}
                      color={activeDragItem.isActive ? 'success' : 'default'}
                      size="small"
                    />

                    <IconButton disabled>
                      <ImportExport fontSize="small" />
                    </IconButton>
                  </Box>
                ) : null}
              </DragOverlay>

            </DndContext>
          </TableBody>
        </Table>
      </TableContainer>

      {data.total > 0 && (
        <Box mt={3}>
          <Pagination
            currentPage={page}
            totalItems={data.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setPage(1);
            }}
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
};

export default CategoryList;

const SortableRow = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    boxSizing: 'border-box',
    display: 'table-row',
    width: '100%',
    backgroundColor: isDragging ? '#e3f2fd' : 'inherit', // nền xanh nhạt khi kéo
    opacity: isDragging ? 0.8 : 1,
    borderRadius: isDragging ? 8 : 0,
    outline: isDragging ? '2px dashed #42a5f5' : 'none', // viền dashed xanh
    outlineOffset: isDragging ? '-2px' : 0
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      hover
    >
      {children(attributes, listeners)}
    </TableRow>
  );
};
