import { useState, useEffect } from 'react';
import {
  Box, Button, Chip, IconButton, Menu, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Select, FormControl, Checkbox, Avatar, Typography
} from '@mui/material';
import {
  MoreVert, Restore, DeleteForever, ImportExport
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import Pagination from '@/components/common/Pagination';
import LoaderAdmin from '@/components/common/Loader';
import Toastify from '@/components/common/Toastify';
import { confirmDelete } from '@/components/common/ConfirmDeleteDialog';
import { brandService } from '@/services/admin/brandService';

const statusTabs = [
  { value: 'all', label: 'Tất Cả' },
  { value: 'published', label: 'Hoạt Động' },
  { value: 'draft', label: 'Tạm Tắt' },
  { value: 'trash', label: 'Thùng Rác' }
];

const bulkActions = {
  all: [{ value: 'delete', label: 'Chuyển vào thùng rác' }],
  published: [{ value: 'delete', label: 'Chuyển vào thùng rác' }],
  draft: [{ value: 'delete', label: 'Chuyển vào thùng rác' }],
  trash: [
    { value: 'restore', label: 'Khôi phục' },
    { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
  ]
};

const getStatusChip = (status) => {
  const map = {
    published: ['Hoạt động', 'success'],
    draft: ['Tạm tắt', 'default'],
    trash: ['Thùng rác', 'error']
  };
  const [label, color] = map[status] || [status, 'default'];
  return <Chip label={label} color={color} size="small" />;
};

const SortableRow = ({ brand, index, selectedIds, onSelect, onMenuOpen, page, limit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: brand.id });
  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
    zIndex: 1
  };

  return (
    <TableRow ref={setNodeRef} style={style} hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selectedIds.includes(brand.id)} onChange={onSelect(brand.id)} />
      </TableCell>
      <TableCell align="center">{(page - 1) * limit + index + 1}</TableCell>
      <TableCell>
        <Avatar src={brand.logoUrl} alt={brand.name} variant="rounded" sx={{ width: 64, height: 64 }} />
      </TableCell>
      <TableCell>{brand.name}</TableCell>
      <TableCell>{brand.slug}</TableCell>
      <TableCell>{getStatusChip(brand.status)}</TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton onClick={(e) => onMenuOpen(e, brand)} size="small">
            <MoreVert />
          </IconButton>
          <IconButton {...attributes} {...listeners} size="small" sx={{ cursor: 'grab' }}>
            <ImportExport fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));
  const [counts, setCounts] = useState({ all: 0, published: 0, draft: 0, trash: 0 });

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await brandService.getAll({ page, limit, search: debouncedSearch, status });
      const data = res.data?.data || [];
      const transformed = data.map(b => ({
        ...b,
        status: b.deletedAt ? 'trash' : b.isActive ? 'published' : 'draft'
      }));
      setBrands(transformed);
      setTotal(res.data?.total || 0);

      if (res.data?.counts) {
        setCounts(res.data.counts);
      }
    } catch {
      toast.error('Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBrands();
  }, [page, limit, status, debouncedSearch]);

  const handleBulkAction = async () => {
    const labels = { delete: 'chuyển vào thùng rác', restore: 'khôi phục', forceDelete: 'xoá vĩnh viễn' };
    if (!(await confirmDelete(labels[bulkAction], `${selectedIds.length} thương hiệu`))) return;

    try {
      setLoading(true);
      if (bulkAction === 'delete') await brandService.softDelete(selectedIds);
      else if (bulkAction === 'restore') await brandService.restore(selectedIds);
      else if (bulkAction === 'forceDelete') await brandService.forceDelete(selectedIds);
      toast.success('Đã thực hiện thành công');
      fetchBrands();
      setSelectedIds([]);
      setBulkAction('');
    } catch {
      toast.error('Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = brands.findIndex(b => b.id === active.id);
      const newIndex = brands.findIndex(b => b.id === over.id);
      const reordered = arrayMove(brands, oldIndex, newIndex);
      setBrands(reordered);
      const payload = reordered.map((b, i) => ({ id: b.id, orderIndex: i }));
      try {
        await brandService.updateOrderIndex(payload);
        toast.success('Đã lưu thứ tự hiển thị');
      } catch {
        toast.error('Cập nhật thứ tự thất bại');
      }
    }
  };

  const handleSelectAll = (e) => {
    const ids = brands.map(b => b.id);
    setSelectedIds(e.target.checked ? ids : []);
  };

  const handleSelectOne = (id) => (e) => {
    setSelectedIds(e.target.checked ? [...selectedIds, id] : selectedIds.filter(i => i !== id));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toastify />
      {loading && <LoaderAdmin fullscreen />}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Danh sách thương hiệu</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/brands/create')}>
          + Thêm Thương Hiệu
        </Button>

      </Box>

      <Box display="flex" gap={2} mb={2}>
        {statusTabs.map(tab => (
          <Button
            key={tab.value}
            variant={status === tab.value ? 'contained' : 'text'}
            onClick={() => {
              setStatus(tab.value);
              setSelectedIds([]);
              setBulkAction('');
            }}
            sx={{ borderRadius: 2, fontWeight: status === tab.value ? 600 : 400 }}
          >
            {tab.label} ({counts[tab.value] || 0})
          </Button>
        ))}
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small">
            <Select
              value={bulkAction}
              displayEmpty
              onChange={(e) => setBulkAction(e.target.value)}
              renderValue={(selected) => {
                const found = bulkActions[status]?.find(a => a.value === selected);
                return found ? found.label : 'Hành động hàng loạt';
              }}
            >
              {bulkActions[status]?.map(action => (
                <MenuItem key={action.value} value={action.value}>{action.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" disabled={!bulkAction || selectedIds.length === 0} onClick={handleBulkAction}>
            Áp Dụng
          </Button>
        </Box>
        <TextField
          size="small"
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchBrands()}
          sx={{ width: 250 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={brands.length > 0 && selectedIds.length === brands.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < brands.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên thương hiệu</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={brands.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <TableBody>
                {brands.map((brand, index) => (
                  <SortableRow
                    key={brand.id}
                    brand={brand}
                    index={index}
                    selectedIds={selectedIds}
                    onSelect={handleSelectOne}
                    onMenuOpen={(e, b) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedBrand(b);
                    }}
                    page={page}
                    limit={limit}
                  />
                ))}
              </TableBody>
            </SortableContext>
          </DndContext>
        </Table>
      </TableContainer>

      {total > limit && (
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          onPageSizeChange={(val) => { setPage(1); setLimit(val); }}
        />
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {status === 'trash' ? (
          <>
            <MenuItem
              onClick={async () => {
                setAnchorEl(null);
                if (!(await confirmDelete('khôi phục', selectedBrand?.name))) return;
                setLoading(true);
                await brandService.restore([selectedBrand.id]);
                toast.success('Đã khôi phục');
                fetchBrands();
              }}
            >
              <Restore fontSize="small" sx={{ mr: 1 }} /> Khôi phục
            </MenuItem>
            <MenuItem
              onClick={async () => {
                setAnchorEl(null);
                if (!(await confirmDelete('xoá vĩnh viễn', selectedBrand?.name))) return;
                setLoading(true);
                await brandService.forceDelete([selectedBrand.id]);
                toast.success('Đã xoá vĩnh viễn');
                fetchBrands();
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteForever fontSize="small" sx={{ mr: 1 }} /> Xoá vĩnh viễn
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => { navigate(`/admin/brands/edit/${selectedBrand?.id}`); setAnchorEl(null); }}>
              Chỉnh sửa
            </MenuItem>
            <MenuItem
              onClick={async () => {
                setAnchorEl(null);
                if (!(await confirmDelete('chuyển vào thùng rác', selectedBrand?.name))) return;
                setLoading(true);
                await brandService.softDelete([selectedBrand.id]);
                toast.success('Đã chuyển vào thùng rác');
                fetchBrands();
              }}
              sx={{ color: 'error.main' }}
            >
              Chuyển vào thùng rác
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default BrandList;
