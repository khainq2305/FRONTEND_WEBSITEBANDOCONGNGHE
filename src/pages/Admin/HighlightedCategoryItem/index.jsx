// src/pages/admin/products/HighlightedCategoryItemList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  Button,
  Chip,
  Menu,
  MenuItem,
  Checkbox,
  Select,
  InputAdornment,
  FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { highlightedCategoryItemService } from '../../../services/admin/highlightedCategoryItemService';
import MUIPagination from '../../../components/common/Pagination';
import { useNavigate } from 'react-router-dom';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../components/common/Loader';
import Toastify from '../../../components/common/Toastify';
import { API_BASE_URL } from '../../../constants/environment';
import HighlightText from '../../../components/Admin/HighlightText';
import NoImage from '../../../assets/Admin/images/no-image.jpg';

export default function HighlightedCategoryItemList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItemId, setMenuItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(10);
const [stats, setStats] = useState({ totalAll: 0, totalActive: 0, totalInactive: 0, totalTrash: 0 });

  useEffect(() => {
    const tid = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(tid);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, page, statusFilter]);

  const fetchData = async () => {
  setIsLoading(true);
  try {
    const query = { search: debouncedSearch, page, limit: itemsPerPage };
    if (statusFilter === 'active') query.isActive = true;
    else if (statusFilter === 'inactive') query.isActive = false;
    else if (statusFilter === 'deleted') query.deleted = true;

    const res = await highlightedCategoryItemService.list(query);
    setItems(res.data.data || []);
    setTotalItems(res.data.pagination.totalItems || 0);

    // Lấy thống kê tổng quan
    if (res.data.stats) {
      setStats(res.data.stats);
    }
  } catch (err) {
    console.error(err);
    toast.error('Lỗi khi tải dữ liệu');
  } finally {
    setIsLoading(false);
  }
};


  const getImageUrl = (fileName) =>
    !fileName ? '' : fileName.startsWith('http') ? fileName : `${API_BASE_URL}/uploads/${fileName}`;

  const toggleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? items.map((i) => i.id) : []);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleApplyBulkAction = async () => {
    if (bulkAction === 'delete' && selectedIds.length) {
      const ok = await confirmDelete('xoá', 'các mục đã chọn');
      if (!ok) return;
      setIsLoading(true);
      try {
        await highlightedCategoryItemService.deleteMany(selectedIds);
        toast.success('Đã xoá các mục thành công');
        setItems((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
        setSelectedIds([]);
        setBulkAction('');
        if (items.length - selectedIds.length === 0 && page > 1) setPage(1);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi xoá hàng loạt');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragEnd = async ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    const updates = reordered.map((it, idx) => ({ id: it.id, sortOrder: idx + 1 }));
    setIsLoading(true);
    try {
      await highlightedCategoryItemService.reorder(updates);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Không thể cập nhật thứ tự');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Toastify />
      {isLoading && <LoaderAdmin fullscreen />}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight={600}>Danh mục nổi bật</Typography>
          <Button variant="contained" onClick={() => navigate('/admin/highlighted-category-items/create')}>Thêm Mới</Button>
        </Box>
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'white', boxShadow: 1, borderRadius: 1 }}>
      

       {/* Tabs lọc trạng thái */}
<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
  {[
    { value: 'all', label: 'Tất Cả', count: stats.totalAll },
    { value: 'active', label: 'Hoạt Động', count: stats.totalActive },
    { value: 'inactive', label: 'Tạm Tắt', count: stats.totalInactive },

  ].map(({ value, label, count }) => (
    <Button
      key={value}
      variant={statusFilter === value ? 'contained' : 'text'}
      onClick={() => {
        setStatusFilter(value);
        setPage(1);
      }}
    >
      {label} ({count ?? 0})
    </Button>
  ))}
</Box>


{/* Bulk action và tìm kiếm tách hàng riêng biệt, nằm 2 bên */}
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
  {/* Bên trái: Áp dụng hàng loạt */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <FormControl size="small">
      <Select
        displayEmpty
        value={bulkAction}
        onChange={(e) => setBulkAction(e.target.value)}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value=""><em>Hành động hàng loạt</em></MenuItem>
        <MenuItem value="delete">Xoá</MenuItem>
      </Select>
    </FormControl>
    <Button
      variant="outlined"
      onClick={handleApplyBulkAction}
      disabled={!bulkAction || selectedIds.length === 0}
    >
      Áp Dụng
    </Button>
  </Box>

  {/* Bên phải: ô tìm kiếm */}
  <TextField
    size="small"
    variant="outlined"
    placeholder="Tìm kiếm theo tiêu đề"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && fetchData()}
    sx={{ width: 280 }}
    InputProps={{
      endAdornment: search && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => setSearch('')}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </InputAdornment>
      )
    }}
  />
</Box>

      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={items.length > 0 && selectedIds.length === items.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < items.length}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell align="center">Thứ tự</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">Không có dữ liệu phù hợp</TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, idx) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={idx}>
                        {(prov, snap) => (
                          <TableRow
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            sx={{ background: snap.isDragging ? '#f0f0f0' : 'inherit' }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedIds.includes(item.id)} onChange={() => toggleSelectOne(item.id)} />
                            </TableCell>
                            <TableCell align="center">{item.sortOrder}</TableCell>
                            <TableCell>
                              <img
                                src={item.imageUrl ? getImageUrl(item.imageUrl) : NoImage}
                                alt=""
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = NoImage;
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <HighlightText text={item.customTitle} highlight={debouncedSearch} />
                            </TableCell>
                            <TableCell>
                              <Chip label={item.category?.name || '---'} size="small" />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.isActive ? 'Hoạt động' : 'Tạm tắt'}
                                color={item.isActive ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={(e) => {
                                  setAnchorEl(e.currentTarget);
                                  setMenuItemId(item.id);
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <IconButton {...prov.dragHandleProps}>
                                <SwapVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl) && menuItemId === item.id}
                                onClose={() => setAnchorEl(null)}
                              >
                                <MenuItem onClick={() => navigate(`/admin/highlighted-category-items/edit/${item.id}`)}>Chỉnh sửa</MenuItem>
                                <MenuItem
                                  onClick={async () => {
                                    setAnchorEl(null);
                                    const ok = await confirmDelete('xoá', 'mục này');
                                    if (!ok) return;
                                    setIsLoading(true);
                                    try {
                                      await highlightedCategoryItemService.delete(item.id);
                                      toast.success('Đã xoá thành công');
                                      fetchData();
                                    } catch (err) {
                                      console.error(err);
                                      toast.error('Lỗi khi xoá');
                                    } finally {
                                      setIsLoading(false);
                                    }
                                  }}
                                >
                                  Xoá
                                </MenuItem>
                              </Menu>
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
        <MUIPagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setPage(1);
          }}
        />
      )}
    </Box>
  );
}
