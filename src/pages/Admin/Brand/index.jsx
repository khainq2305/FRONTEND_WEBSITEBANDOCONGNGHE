import { useState, useEffect } from 'react';
import {
  Box, Button, Chip, IconButton, Menu, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Select, FormControl, Checkbox, Avatar
} from '@mui/material';
import {
  MoreVert, Add, Restore, DeleteForever, ImportExport
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import Pagination from 'components/common/Pagination';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import RestoreConfirmationDialog from './RestoreConfirmationDialog';
import TrashConfirmationDialog from './TrashConfirmationDialog';
import Toastify from 'components/common/Toastify';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { brandService } from '@/services/admin/brandService';

const statusTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'published', label: 'Hiển thị' },
  { value: 'draft', label: 'Ẩn' },
  { value: 'trash', label: 'Thùng rác' }
];

const getStatusChip = (status) => {
  const map = {
    published: ['Hiển thị', 'success'],
    draft: ['Ẩn', 'warning'],
    trash: ['Thùng rác', 'error']
  };
  const [label, color] = map[status] || [status, 'default'];
  return <Chip label={label} color={color} size="small" />;
};

const bulkActions = {
  all: [{ value: 'delete', label: 'Chuyển vào thùng rác' }],
  published: [{ value: 'delete', label: 'Chuyển vào thùng rác' }],
  draft: [{ value: 'delete', label: 'Chuyển vào thùng rác' }],
  trash: [
    { value: 'restore', label: 'Khôi phục' },
    { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
  ]
};

const SortableRow = ({ brand, index, selectedIds, onSelect, onMenuOpen, page, limit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: brand.id });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
    zIndex: isDragging ? 10 : 'auto',
    background: isDragging ? '#f9fafb' : undefined,
  };

  return (
    <TableRow ref={setNodeRef} style={style} hover>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selectedIds.includes(brand.id)}
          onChange={onSelect(brand.id)}
        />
      </TableCell>
      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
      <TableCell>
        <Avatar src={brand.logoUrl} alt={brand.name} sx={{ width: 40, height: 40 }} />
      </TableCell>
      <TableCell>{brand.name}</TableCell>
      <TableCell>{brand.slug}</TableCell>
      <TableCell>{getStatusChip(brand.status)}</TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton onClick={(e) => onMenuOpen(e, brand)} size="small">
            <MoreVert />
          </IconButton>
          <IconButton {...attributes} {...listeners} size="small" sx={{ cursor: 'grab' }} title="Kéo để thay đổi vị trí">
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
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: '', isBulk: false });
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [trashDialogOpen, setTrashDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const sensors = useSensors(useSensor(PointerSensor));
  const [counts, setCounts] = useState({ all: 0, published: 0, draft: 0, trash: 0 });

  const fetchBrands = async () => {
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
    }
  };


  useEffect(() => {
    fetchBrands();
  }, [page, limit, status, debouncedSearch]);

  const handleDragEnd = async ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = brands.findIndex(b => b.id === active.id);
      const newIndex = brands.findIndex(b => b.id === over.id);
      const newBrands = arrayMove(brands, oldIndex, newIndex);
      setBrands(newBrands);
      const ordered = newBrands.map((b, index) => ({ id: b.id, orderIndex: index }));
      try {
        await brandService.updateOrderIndex(ordered);
        toast.success('Đã lưu thứ tự hiển thị');
      } catch (err) {
        toast.error('Cập nhật thứ tự thất bại');
      }
    }
  };

  const handleBulkAction = async () => {
    try {
      if (bulkAction === 'forceDelete') {
        setDeleteTarget({ id: selectedIds, name: `${selectedIds.length} thương hiệu`, isBulk: true });
        setDeleteDialogOpen(true);
        return;
      }
      if (bulkAction === 'delete') await brandService.softDelete(selectedIds);
      else if (bulkAction === 'restore') await brandService.restore(selectedIds);
      toast.success('Thao tác thành công');
      fetchBrands();
      setSelectedIds([]);
      setBulkAction('');
    } catch {
      toast.error('Thao tác thất bại');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/brands/create')}
          sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
        >
          Thêm thương hiệu
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              displayEmpty
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              renderValue={(selected) => {
                const action = bulkActions[status]?.find(a => a.value === selected);
                return action ? action.label : 'Hành động';
              }}
            >
              {bulkActions[status]?.map(action => (
                <MenuItem key={action.value} value={action.value}>{action.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={!bulkAction || selectedIds.length === 0}
            onClick={handleBulkAction}
          >
            Thực hiện
          </Button>
        </Box>

        <TextField
          size="small"
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={brands.length > 0 && brands.every(b => selectedIds.includes(b.id))}
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

      {brands.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5, fontSize: 16, fontWeight: 500, color: '#999' }}>
          Không có thương hiệu nào
        </Box>
      ) : (
        total > limit && (
          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        )
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {status === 'trash' ? (
          <>
            <MenuItem onClick={() => { setRestoreDialogOpen(true); setAnchorEl(null); }}>
              <Restore fontSize="small" sx={{ mr: 1 }} /> Khôi phục
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDeleteTarget({
                  id: selectedBrand?.id,
                  name: selectedBrand?.name,
                  isBulk: false
                });
                setDeleteDialogOpen(true);
                setAnchorEl(null);
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
            <MenuItem onClick={() => { setTrashDialogOpen(true); setAnchorEl(null); }} sx={{ color: 'error.main' }}>
              Chuyển vào thùng rác
            </MenuItem>
          </>
        )}
      </Menu>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        brandId={deleteTarget.id}
        itemName={deleteTarget.name}
        itemType="thương hiệu"
        permanent={true}
        onSuccess={() => {
          fetchBrands();
          if (deleteTarget.isBulk) {
            setSelectedIds([]);
            setBulkAction('');
          }
        }}
      />

      <RestoreConfirmationDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        brandId={selectedBrand?.id}
        itemName={selectedBrand?.name}
        itemType="thương hiệu"
        onSuccess={() => {
          fetchBrands();
          setSelectedIds([]);
        }}
      />

      <TrashConfirmationDialog
        open={trashDialogOpen}
        onClose={() => setTrashDialogOpen(false)}
        brandId={selectedBrand?.id}
        itemName={selectedBrand?.name}
        itemType="thương hiệu"
        onSuccess={() => {
          fetchBrands();
          setSelectedIds([]);
        }}
      />

      <Toastify />
    </Box>
  );
};

export default BrandList;
