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
  MenuItem as MuiMenuItem
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
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const tid = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(tid);
  }, [search]);

  // Fetch on filters/search/page
  useEffect(() => {
    fetchData();
  }, [debouncedSearch, page, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const query = { search: debouncedSearch, page, limit: itemsPerPage };
      if (statusFilter === 'active') query.isActive = true;
      else if (statusFilter === 'inactive') query.isActive = false;
      const res = await highlightedCategoryItemService.list(query);
      setItems(res.data.data || []);
      setTotalItems(res.data.pagination.totalItems || 0);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };
const getImageUrl = (fileName) =>
  !fileName
    ? ''
    : fileName.startsWith('http')
    ? fileName
    : `${API_BASE_URL}/uploads/${fileName}`;

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(items.map((i) => i.id));
    else setSelectedIds([]);
  };
  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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

      <Typography variant="h4" gutterBottom>
        Danh mục nổi bật
      </Typography>

      {/* status filter */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {['all', 'active', 'inactive'].map((st) => (
          <Button
            key={st}
            variant={statusFilter === st ? 'contained' : 'text'}
            onClick={() => { setStatusFilter(st); setPage(1); }}
          >
            {st === 'all' ? 'Tất Cả' : st === 'active' ? 'Hoạt Động' : 'Tạm Tắt'}
          </Button>
        ))}
      </Box>

      {/* bulk + search */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <Select
          size="small"
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          displayEmpty
          sx={{ minWidth: 180 }}
        >
          <MuiMenuItem value="">
            <em>Hành động hàng loạt</em>
          </MuiMenuItem>
          <MuiMenuItem value="delete">Xóa</MuiMenuItem>
        </Select>
        <Button
          variant="outlined"
          disabled={bulkAction !== 'delete' || selectedIds.length === 0}
          onClick={handleApplyBulkAction}
        >
          Áp Dụng
        </Button>
        <TextField
          size="small"
          placeholder="Tìm kiếm theo tiêu đề"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 250 }}
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
        <Button
          variant="contained"
          onClick={() => navigate('/admin/highlighted-category-items/create')}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={items.length>0 && selectedIds.length===items.length}
                  indeterminate={selectedIds.length>0 && selectedIds.length<items.length}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, idx) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={idx}>
                      {(prov, snap) => (
                        <TableRow
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          sx={{ background: snap.isDragging ? '#f0f0f0' : 'inherit' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedIds.includes(item.id)}
                              onChange={() => toggleSelectOne(item.id)}
                            />
                          </TableCell>
                          <TableCell>{item.sortOrder}</TableCell>
<TableCell>
  {item.imageUrl ? (
    <img
      src={getImageUrl(item.imageUrl)}
      alt=""
      style={{ width: 60, height: 40, objectFit: 'cover' }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/60x40?text=No+Image';
      }}
    />
  ) : (
    <span style={{ fontSize: 12, color: '#aaa' }}>Không có ảnh</span>
  )}
</TableCell>


                          <TableCell>{item.customTitle}</TableCell>
                          <TableCell>
                            <Chip label={item.category?.name || '---'} size="small" />
                          </TableCell>
                          <TableCell>{item.customLink || '---'}</TableCell>
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
                              open={Boolean(anchorEl) && menuItemId===item.id}
                              onClose={() => setAnchorEl(null)}
                            >
                              <MenuItem
                                onClick={() => navigate(`/admin/highlighted-category-items/edit/${item.id}`)}
                              >
                                Chỉnh sửa
                              </MenuItem>
                              <MenuItem
                                onClick={async () => {
                                  setAnchorEl(null);
                                  const ok=await confirmDelete('xoá','mục này');
                                  if(!ok) return;
                                  setIsLoading(true);
                                  try {
                                    await highlightedCategoryItemService.delete(item.id);
                                    toast.success('Đã xoá thành công');
                                    fetchData();
                                  } catch(err){
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
                  ))}
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
        />
      )}
    </Box>
  );
}
