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
  const limit = 10;

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

  const handleRestoreAll = async () => {
    try {
      const confirmed = window.confirm('Bạn có chắc muốn khôi phục tất cả danh mục?');
      if (!confirmed) return;
      const res = await categoryService.restoreAll();
      toast.success(res.message || 'Đã khôi phục tất cả danh mục');
      await fetchData();
    } catch (error) {
      console.error('❌ Khôi phục tất cả lỗi:', error);
      toast.error('Khôi phục tất cả thất bại');
    }
  };

  const handleForceDeleteAll = async () => {
    try {
      const confirmed = await confirmDelete('tất cả danh mục trong thùng rác');
      if (!confirmed) return;
      const res = await categoryService.forceDeleteAll();
      toast.success(res.message || 'Đã xoá vĩnh viễn tất cả danh mục');
      await fetchData();
    } catch (error) {
      console.error('❌ Xoá vĩnh viễn tất cả lỗi:', error);
      toast.error('Xoá vĩnh viễn tất cả thất bại');
    }
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
        limit,
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
  }, [page, debouncedSearch, statusFilter]);

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => navigate('/admin/categories/addd')}>
          Thêm danh mục
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, borderBottom: '1px solid #eee', mb: 1, px: 1 }}>
        {statusTabs.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
              setSelectedIds([]);
            }}
            sx={{
              pb: 1,
              px: 1.5,
              cursor: 'pointer',
              borderBottom: statusFilter === tab.value ? '2px solid red' : '2px solid transparent',
              color: statusFilter === tab.value ? 'red' : 'black',
              fontWeight: statusFilter === tab.value ? 600 : 400,
              fontSize: 15
            }}
          >
            {tab.label} ({tab.count ?? 0})
          </Box>
        ))}

      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <BulkActions

          showRestoreDelete={true}
          status={statusFilter}
          onSubmit={async (action) => {
            try {
              if (selectedIds.length === 0) {
                // Không chọn gì → chỉ xử lý trong tab thùng rác
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
                // Có mục được chọn
                if (action === 'trash') {
                  await categoryService.softDeleteMany(selectedIds);
                  toast.success('Đã chuyển vào thùng rác!');
                } else if (action === 'restore') {
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
          onChange={(e) => setSearch(e.target.value)}
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
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={data.list.length > 0 && data.list.every((item) => selectedIds.includes(item.id))}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell>STT</TableCell> {/* Đổi vị trí STT */}
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell> {/* Gộp icon kéo vào đây */}
            </TableRow>
          </TableHead>

          <TableBody>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={async ({ active, over }) => {
                if (!over || active.id === over.id) return;
                const oldIndex = data.list.findIndex((i) => i.id === active.id);
                const newIndex = data.list.findIndex((i) => i.id === over.id);
                const newList = arrayMove(data.list, oldIndex, newIndex);
                setData((prev) => ({ ...prev, list: newList }));

                const ordered = newList.map((item, index) => ({
                  id: item.id,
                  orderIndex: index
                }));
                await categoryService.updateOrderIndex(ordered);
              }}
            >
              <SortableContext items={data.list.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Đang tải...</TableCell>
                  </TableRow>
                ) : data.list.length > 0 ? (
                  data.list.map((item) => (
                    <SortableRow key={item.id} id={item.id}>
                      {(attributes, listeners) => (
                        <>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelectRow(item.id)}
                            />
                          </TableCell>

                          {/* STT */}
                          <TableCell>{item.orderIndex}</TableCell>

                          <TableCell>
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                              />
                            ) : (
                              <Typography variant="caption">Không có</Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            {item.name}
                            {item.isDefault && (
                              <Chip label="Mặc định" color="warning" size="small" sx={{ ml: 1 }} />
                            )}
                          </TableCell>

                          <TableCell>{item.slug}</TableCell>

                          <TableCell>
                            <Chip
                              label={item.isActive ? 'Hiển thị' : 'Ẩn'}
                              color={item.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>

                          {/* Gộp icon kéo + menu hành động */}
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                              <IconButton size="small" sx={{ cursor: 'grab' }} {...attributes} {...listeners}>
                                <ImportExport fontSize="small" />
                              </IconButton>
                              <CategoryActionsMenu
                                isTrashed={statusFilter === 'trashed'}
                                onEdit={() => navigate(`/admin/categories/edit/${item.id}`)}
                                onDelete={async () => {
                                  const confirmed = await confirmDelete(item.name);
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
            </DndContext>
          </TableBody>
        </Table>
      </TableContainer>

      {data.total > 0 && (
        <Box mt={3}>
          <Pagination
            currentPage={page}
            totalItems={data.total}
            itemsPerPage={limit}
            onPageChange={setPage}
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
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <TableRow ref={setNodeRef} style={style} hover>
      {children(attributes, listeners)}
    </TableRow>
  );
};
