import { useState } from 'react';
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

const statusTabs = [
  { value: 'all', label: 'Tất cả', count: 197 },
  { value: 'published', label: 'Đã xuất bản', count: 192 },
  { value: 'draft', label: 'Bản nháp', count: 5 },
  { value: 'trash', label: 'Thùng rác', count: 1 }
];

const mockBrands = [
  { id: 1, name: 'Nike', slug: 'nike', description: 'Thương hiệu thể thao hàng đầu', status: 'published', createdAt: '2023-05-15', image: '/images/brands/nike.png' },
  { id: 2, name: 'Adidas', slug: 'adidas', description: 'Đối thủ lớn của Nike', status: 'published', createdAt: '2023-04-22', image: '/images/brands/adidas.png' },
  { id: 3, name: 'Puma', slug: 'puma', description: 'Phong cách trẻ trung', status: 'draft', createdAt: '2023-03-10', image: '/images/brands/puma.png' },
  { id: 4, name: 'Reebok', slug: 'reebok', description: 'Thương hiệu lâu đời', status: 'trash', createdAt: '2023-02-28', image: '/images/brands/reebok.png' },
  { id: 5, name: 'New Balance', slug: 'new-balance', description: 'Giày quốc dân', status: 'published', createdAt: '2023-01-15', image: '/images/brands/new-balance.png' }
];

const BrandList = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [trashDialogOpen, setTrashDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const itemsPerPage = 5;

  const filteredBrands = mockBrands.filter(brand =>
    (brand.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.slug.toLowerCase().includes(search.toLowerCase())) &&
    (status === 'all' ? brand.status !== 'trash' :
      status === 'trash' ? brand.status === 'trash' :
        brand.status === status)
  );

  const paginatedBrands = filteredBrands.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const openMenu = (e, brand) => {
    setAnchorEl(e.currentTarget);
    setSelectedBrand(brand);
  };

  const closeMenu = () => setAnchorEl(null);

  const getStatusChip = (status) => {
    const map = {
      published: ['Đã xuất bản', 'success'],
      draft: ['Bản nháp', 'warning'],
      trash: ['Thùng rác', 'error']
    };
    const [label, color] = map[status] || [status, 'default'];
    return <Chip label={label} color={color} size="small" />;
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const idsOnPage = paginatedBrands.map(b => b.id);
    if (isChecked) {
      setSelectedIds(prev => [...new Set([...prev, ...idsOnPage])]);
    } else {
      setSelectedIds(prev => prev.filter(id => !idsOnPage.includes(id)));
    }
  };

  const handleSelectOne = (id) => (e) => {
    const isChecked = e.target.checked;
    setSelectedIds(prev => isChecked ? [...prev, id] : prev.filter(i => i !== id));
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {status !== 'trash' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/admin/brands/create')}
              sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
            >
              Thêm thương hiệu
            </Button>
          )}
        </Box>

        <TextField
          size="small"
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{
        display: 'flex',
        gap: 4,
        borderBottom: '1px solid #eee',
        mb: 2,
        overflowX: 'auto',
        py: 1
      }}>
        {statusTabs.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
              setSelectedIds([]);
            }}
            sx={{
              pb: 1,
              px: 1,
              cursor: 'pointer',
              borderBottom: status === tab.value ? '2px solid red' : '2px solid transparent',
              color: status === tab.value ? 'red' : 'black',
              fontWeight: status === tab.value ? 600 : 400,
              fontSize: 15,
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label} ({tab.count})
          </Box>
        ))}
      </Box>

      {/* Dropdown Hành động */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select displayEmpty defaultValue="">
            <MenuItem value="" disabled>Hành động</MenuItem>
            <MenuItem value="publish">Xuất bản</MenuItem>
            <MenuItem value="draft">Chuyển thành bản nháp</MenuItem>
            <MenuItem value="trash">Chuyển vào thùng rác</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          disabled={selectedIds.length === 0}
          onClick={() => {
            Toastify.success(`Đã chọn ${selectedIds.length} thương hiệu`);
          }}
        >
          Thực Hiện
        </Button>
      </Box>

      {/* Table */}
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
              <TableCell>Slug</TableCell> {/* ✅ Thêm cột Slug */}
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBrands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(brand.id)}
                    onChange={handleSelectOne(brand.id)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar src={brand.image} alt={brand.name} />
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.slug}</TableCell> {/* ✅ Hiển thị Slug */}
                <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {brand.description}
                </TableCell>
                <TableCell>{getStatusChip(brand.status)}</TableCell>
                <TableCell>{brand.createdAt}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => openMenu(e, brand)} size="small">
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={page}
        totalItems={filteredBrands.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        sx={{ mt: 2 }}
      />

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {status === 'trash' ? (
          <>
            <MenuItem onClick={() => { setRestoreDialogOpen(true); closeMenu(); }}>
              <Restore fontSize="small" sx={{ mr: 1 }} /> Khôi phục
            </MenuItem>
            <MenuItem onClick={() => { setDeleteDialogOpen(true); closeMenu(); }} sx={{ color: 'error.main' }}>
              <DeleteForever fontSize="small" sx={{ mr: 1 }} /> Xóa vĩnh viễn
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                navigate(`/admin/brands/edit/${selectedBrand?.id}`);
                closeMenu();
              }}
            >
              Chỉnh sửa
            </MenuItem>
            <MenuItem onClick={() => { setTrashDialogOpen(true); closeMenu(); }} sx={{ color: 'error.main' }}>
              Chuyển vào thùng rác
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Dialogs */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          Toastify.success(`Đã xóa vĩnh viễn thương hiệu ${selectedBrand?.name}`);
          setDeleteDialogOpen(false);
        }}
        itemName={selectedBrand?.name || ''}
        itemType="thương hiệu"
        permanent
      />

      <RestoreConfirmationDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        onConfirm={() => {
          Toastify.success(`Đã khôi phục thương hiệu ${selectedBrand?.name}`);
          setRestoreDialogOpen(false);
          setSelectedBrand(null);
        }}
        itemName={selectedBrand?.name || ''}
        itemType="thương hiệu"
      />

      <TrashConfirmationDialog
        open={trashDialogOpen}
        onClose={() => setTrashDialogOpen(false)}
        onConfirm={() => {
          Toastify.success(`Đã chuyển thương hiệu ${selectedBrand?.name} vào thùng rác`);
          setTrashDialogOpen(false);
          setSelectedBrand(null);
        }}
        itemName={selectedBrand?.name || ''}
        itemType="thương hiệu"
      />

      <Toastify />
    </Box>
  );
};

export default BrandList;
