// ✅ BrandList.jsx hoàn chỉnh và khớp với backend (status=published/draft/trash, phân trang, tìm kiếm, bulk, drag)

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Chip, IconButton, Menu, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Select, FormControl, Checkbox, Avatar
} from '@mui/material';
import {
  MoreVert, Add, Restore, DeleteForever
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Pagination from 'components/common/Pagination';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import RestoreConfirmationDialog from './RestoreConfirmationDialog';
import TrashConfirmationDialog from './TrashConfirmationDialog';
import Toastify from 'components/common/Toastify';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

const statusTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'trash', label: 'Thùng rác' }
];

const getStatusChip = (status) => {
  const map = {
    published: ['Đã xuất bản', 'success'],
    draft: ['Bản nháp', 'warning'],
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

const SortableRow = ({ brand, selectedIds, onSelect, onMenuOpen }) => {
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
    <TableRow ref={setNodeRef} style={style}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selectedIds.includes(brand.id)}
          onChange={onSelect(brand.id)}
        />
      </TableCell>
      <TableCell>
        <Avatar
          src={brand.logo}
          alt={brand.name}
          {...listeners}
          {...attributes}
          sx={{ cursor: 'grab' }}
        />
      </TableCell>
      <TableCell>{brand.name}</TableCell>
      <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {brand.description}
      </TableCell>
      <TableCell>{getStatusChip(brand.status)}</TableCell>
      <TableCell>{new Date(brand.createdAt).toLocaleDateString()}</TableCell>
      <TableCell align="right">
        <IconButton onClick={(e) => onMenuOpen(e, brand)} size="small">
          <MoreVert />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [trashDialogOpen, setTrashDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const itemsPerPage = 10;

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchBrands = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/brands', {
        params: {
          page,
          limit: itemsPerPage,
          search,
          status
        }
      });
      const mapped = res.data.data.map(b => ({
        ...b,
        status: b.deletedAt ? 'trash' : (b.isActive ? 'published' : 'draft')
      }));
      setBrands(mapped);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('❌ Lỗi lấy danh sách brand:', err);
      Toastify.error('Không thể tải danh sách thương hiệu');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [status, search, page]);

  const handleBulkAction = async () => {
    try {
      if (bulkAction === 'delete') {
        await Promise.all(selectedIds.map(id => axios.delete(`http://localhost:5000/admin/brands/${id}`)));
        Toastify.success('Đã chuyển vào thùng rác');
      } else if (bulkAction === 'restore') {
        await Promise.all(selectedIds.map(id => axios.patch(`http://localhost:5000/admin/brands/${id}/restore`)));
        Toastify.success('Đã khôi phục');
      } else if (bulkAction === 'forceDelete') {
        await Promise.all(selectedIds.map(id => axios.delete(`http://localhost:5000/admin/brands/${id}/force`)));
        Toastify.success('Đã xoá vĩnh viễn');
      }
      fetchBrands();
      setSelectedIds([]);
      setBulkAction('');
    } catch (err) {
      console.error('❌ Lỗi thao tác bulk:', err);
      Toastify.error('Thao tác thất bại');
    }
  };

  const handleSelectAll = (e) => {
    const ids = brands.map(b => b.id);
    setSelectedIds(e.target.checked ? ids : []);
  };

  const handleSelectOne = (id) => (e) => {
    setSelectedIds(e.target.checked
      ? [...selectedIds, id]
      : selectedIds.filter(i => i !== id));
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(search.toLowerCase()) &&
    (status === 'all' ? brand.status !== 'trash' :
      status === 'trash' ? brand.status === 'trash' :
        brand.status === status)
  );

  const paginatedBrands = filteredBrands;

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

      <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee', mb: 2, py: 1, overflowX: 'auto' }}>
        {statusTabs.map(tab => (
          <Box
            key={tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
              setSelectedIds([]);
              setBulkAction('');
            }}
            sx={{
              pb: 1,
              cursor: 'pointer',
              fontWeight: status === tab.value ? 600 : 400,
              borderBottom: status === tab.value ? '2px solid red' : '2px solid transparent',
              color: status === tab.value ? 'red' : 'black'
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
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
                  checked={paginatedBrands.length > 0 && paginatedBrands.every(b => selectedIds.includes(b.id))}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedBrands.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên thương hiệu</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {status === 'trash' ? (
              <>
                <MenuItem onClick={() => { setRestoreDialogOpen(true); setAnchorEl(null); }}>
                  <Restore fontSize="small" sx={{ mr: 1 }} /> Khôi phục
                </MenuItem>
                <MenuItem onClick={() => { setDeleteDialogOpen(true); setAnchorEl(null); }} sx={{ color: 'error.main' }}>
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
            brandId={selectedBrand?.id}
            itemName={selectedBrand?.name}
            itemType="thương hiệu"
            permanent={true}
            onSuccess={() => {
              fetchBrands();
              setSelectedIds([]);
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

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
            if (active.id !== over?.id) {
              const oldIndex = brands.findIndex(b => b.id === active.id);
              const newIndex = brands.findIndex(b => b.id === over.id);
              setBrands(arrayMove(brands, oldIndex, newIndex));
              Toastify.success('Đã sắp xếp lại thương hiệu');
            }
          }}>
            <SortableContext items={brands.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <TableBody>
                {paginatedBrands.map((brand) => (
                  <SortableRow
                    key={brand.id}
                    brand={brand}
                    selectedIds={selectedIds}
                    onSelect={handleSelectOne}
                    onMenuOpen={(e, b) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedBrand(b);
                    }}
                  />
                ))}
              </TableBody>
            </SortableContext>
          </DndContext>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={page}
        totalItems={filteredBrands.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default BrandList;
