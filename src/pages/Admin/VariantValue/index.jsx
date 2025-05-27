import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, IconButton, Menu, MenuItem, Tabs, Tab, TextField, Button, Checkbox, FormControl, Select
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragHandleIcon from '@mui/icons-material/DragIndicator';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useParams, useNavigate } from 'react-router-dom';
import { variantValueService } from '../../../services/admin/variantValueService';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import MUIPagination from '../../../components/common/Pagination';
import { API_BASE_URL } from '../../../constants/environment';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../components/Admin/LoaderVip';

const VariantValueList = () => {
  const { variantId } = useParams();
  const navigate = useNavigate();
const [variantType, setVariantType] = useState('');
const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState([]);
  const [variantName, setVariantName] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const isTrash = tab === 'trash';

const fetchData = async () => {
  setIsLoading(true);
  try {
    const res = await variantValueService.getByVariantId(variantId, {
      isTrash,
      search,
      page,
      limit: itemsPerPage
    });

    let data = res.data.data || [];

    if (!isTrash) {
      if (tab === 'active') data = data.filter(item => item.isActive);
      if (tab === 'inactive') data = data.filter(item => !item.isActive);
    }

    setVariantType(res.data.variantType);
    setValues(data);
    setVariantName(res.data.variantName || '');
    setTotalItems(res.data.total || 0);
    setSelectedIds([]);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách giá trị:', err);
    toast.error('Không thể tải danh sách');
  } finally {
    setIsLoading(false);
  }
};

  const handleDragEnd = async (result) => {
  if (!result.destination) return;

  const newList = Array.from(values);
  const [moved] = newList.splice(result.source.index, 1);
  newList.splice(result.destination.index, 0, moved);

  setValues(newList);

  // Gọi API cập nhật lại toàn bộ thứ tự
  const newOrder = newList.map((item, index) => ({
    id: item.id,
    sortOrder: index + 1
  }));
  try {
    await variantValueService.reorder(newOrder);

    fetchData();
  } catch (err) {
    toast.error('Không thể cập nhật thứ tự!');
    console.error(err);
  }
};

const getFullImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
};

  useEffect(() => {
    fetchData();
  }, [variantId, tab, page]);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchData();
    }
  };

  const handleCheckAll = (e) => {
    setSelectedIds(e.target.checked ? values.map(v => v.id) : []);
  };

  const handleCheckItem = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

const handleDelete = async () => {
  handleMenuClose();
  const confirm = await confirmDelete();
  if (!confirm) return;

  setIsLoading(true);
  try {
    await variantValueService.softDelete(selectedId);
    toast.success('Đã chuyển vào thùng rác');
    fetchData();
  } catch (err) {
    toast.error('Lỗi khi xóa');
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, [variantId, tab, page, search]);

const handleForceDelete = async () => {
  handleMenuClose();
  const confirm = await confirmDelete('vĩnh viễn');
  if (!confirm) return;

  try {
    await variantValueService.forceDelete(selectedId);
    toast.success('Đã xóa vĩnh viễn thành công');
    fetchData();
  } catch (err) {
    toast.error('Lỗi khi xóa vĩnh viễn');
    console.error(err);
  }
};

const handleRestore = async () => {
  handleMenuClose();
  try {
    await variantValueService.restore(selectedId);
    toast.success('Khôi phục thành công');
    setTab('all'); // 👉 chuyển về tab "Tất cả"
    fetchData();
  } catch (err) {
    toast.error('Lỗi khi khôi phục');
  }
};



const handleBulkAction = async () => {
  if (!bulkAction || selectedIds.length === 0) return;

  setIsLoading(true); // 👈 THÊM DÒNG NÀY
  try {
    if (bulkAction === 'delete') {
      await variantValueService.softDeleteMany(selectedIds);
      toast.success('Đã chuyển vào thùng rác');
    }
    if (bulkAction === 'force') {
      await variantValueService.forceDeleteMany(selectedIds);
      toast.success('Đã xóa vĩnh viễn');
    }
    if (bulkAction === 'restore') {
      await variantValueService.restoreMany(selectedIds);
      toast.success('Đã khôi phục thành công');
       setTab('all'); // 👉 thêm dòng này
    }

    setBulkAction('');
    setSelectedIds([]);
    fetchData();
  } catch (err) {
    toast.error('Thao tác thất bại');
  } finally {
    setIsLoading(false); 
  }
};


  const bulkActions = {
    normal: [
      { value: 'delete', label: 'Chuyển vào thùng rác' }
    ],
    trash: [
      { value: 'restore', label: 'Khôi phục' },
      { value: 'force', label: 'Xoá vĩnh viễn' }
    ]
  };
{isLoading && <LoaderAdmin fullscreen />}

  return (
    <Box>
   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
  <Typography variant="h6">
    Cấu hình giá trị cho: {variantName}
  </Typography>

  <Button
    variant="outlined"
    color="secondary"
    onClick={() => navigate('/admin/product-variants')}
  >
    Quay lại
  </Button>
</Box>


    <Box
  sx={{
    boxShadow: 2,
    borderRadius: 2,
    p: 2,
    mb: 3,
    backgroundColor: 'white'
  }}
>
  <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
    <Tab label="Tất cả" value="all" />
    <Tab label="Hoạt động" value="active" />
    <Tab label="Tạm tắt" value="inactive" />
    <Tab label="Thùng rác" value="trash" />
  </Tabs>

  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2
    }}
  >
    {/* Bên trái: bulk action */}
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <FormControl size="small">
        <Select
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Hành động hàng loạt</MenuItem>
          {(isTrash ? bulkActions.trash : bulkActions.normal).map((action) => (
            <MenuItem key={action.value} value={action.value}>
              {action.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        disabled={!bulkAction || selectedIds.length === 0}
        onClick={handleBulkAction}
      >
        Áp dụng
      </Button>
    </Box>

    {/* Bên phải: Tìm kiếm + Thêm mới */}
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearchSubmit}
        sx={{ width: 300 }}
      />
      <Button
        variant="contained"
        onClick={() => navigate(`/admin/product-variants/${variantId}/values/create`)}
      >
        Thêm mới
      </Button>
    </Box>
  </Box>


   
</Box>


      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === values.length && values.length > 0}
                  onChange={handleCheckAll}
                />
              </TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Slug</TableCell>
        
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="variantValues">
    {(provided) => (
      <TableBody ref={provided.innerRef} {...provided.droppableProps}>
       {values.length === 0 ? (
  <TableRow>
    <TableCell colSpan={6} align="center">
      Không có dữ liệu phù hợp
    </TableCell>
  </TableRow>
) : (
  values.map((v, index) => (
    <Draggable key={v.id} draggableId={v.id.toString()} index={index}>
      {(provided) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          hover
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedIds.includes(v.id)}
              onChange={() => handleCheckItem(v.id)}
            />
          </TableCell>
          <TableCell>{v.sortOrder}</TableCell>
          <TableCell>{v.value}</TableCell>
          <TableCell>
            {v.slug && v.slug.trim() !== '' ? v.slug : <em style={{ color: '#888' }}>—</em>}
          </TableCell>
          <TableCell>
            <Chip
              label={v.isActive ? 'Hoạt động' : 'Tạm tắt'}
              size="small"
              color={v.isActive ? 'success' : 'default'}
            />
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={(e) => handleMenuOpen(e, v.id)}>
                <MoreVertIcon />
              </IconButton>
              <Box
                {...provided.dragHandleProps}
                sx={{ cursor: 'grab', display: 'flex', justifyContent: 'center' }}
              >
                <ImportExportIcon fontSize="small" />
              </Box>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </Draggable>
  ))
)}
{provided.placeholder}

       
      </TableBody>
    )}
  </Droppable>
</DragDropContext>


        </Table>
      </Paper>

      {totalItems > itemsPerPage && (
        <Box display="flex" justifyContent="center" mt={2}>
          <MUIPagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {!isTrash && (
          <>
            <MenuItem onClick={() => {
              handleMenuClose();
              navigate(`/admin/product-variants/${variantId}/values/edit/${selectedId}`);
            }}>Sửa</MenuItem>
            <MenuItem onClick={handleDelete}>Chuyển vào thùng rác</MenuItem>
          </>
        )}
        {isTrash && (
          <>
            <MenuItem onClick={handleRestore}>Khôi phục</MenuItem>
            <MenuItem onClick={handleForceDelete}>Xoá vĩnh viễn</MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default VariantValueList;
