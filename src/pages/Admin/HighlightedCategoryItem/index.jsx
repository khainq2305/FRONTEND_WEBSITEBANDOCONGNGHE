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
  FormControl,
  TableContainer 
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
import { API_BASE_URL } from '../../../constants/environment';
import HighlightText from '../../../components/Admin/HighlightText';
import NoImage from '../../../assets/Admin/images/no-image.jpg';
import Breadcrumb from '../../../components/common/Breadcrumb'; 

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
  }, [debouncedSearch, page, statusFilter, itemsPerPage]); 

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const query = { search: debouncedSearch, page, limit: itemsPerPage };
      if (statusFilter === 'active') query.isActive = true;
      else if (statusFilter === 'inactive') query.isActive = false;

      const res = await highlightedCategoryItemService.list(query);
      setItems(res.data.data || []);
      setTotalItems(res.data.pagination?.totalItems || 0); 

      if (res.data.stats) {
        setStats(res.data.stats);
      }
       setSelectedIds([]); 
       setBulkAction('');  
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      toast.error(err?.response?.data?.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (fileName) => (!fileName ? NoImage : fileName.startsWith('http') ? fileName : `${API_BASE_URL}${fileName.startsWith('/') ? '' : '/'}${fileName}`);


  const toggleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? items.map((i) => i.id) : []);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleApplyBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) {
        toast.info('Vui lòng chọn hành động và ít nhất một mục.');
        return;
    }
    if (bulkAction === 'delete') {
      const ok = await confirmDelete('xoá vĩnh viễn', `${selectedIds.length} mục đã chọn`);
      if (!ok) return;
      setIsLoading(true);
      try {
        await highlightedCategoryItemService.deleteMany(selectedIds);
        toast.success(`Đã xoá ${selectedIds.length} mục thành công`);
        fetchData(); 
      } catch (err) {
        console.error('Lỗi khi xoá hàng loạt:', err);
        toast.error(err?.response?.data?.message || 'Lỗi khi xoá hàng loạt');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDragEnd = async ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    
    const currentList = Array.from(items);
    const [movedItem] = currentList.splice(source.index, 1);
    currentList.splice(destination.index, 0, movedItem);
    
    setItems(currentList); 

    const updates = currentList.map((it, idx) => ({ id: it.id, sortOrder: idx })); 
    
    setIsLoading(true);
    try {
      await highlightedCategoryItemService.reorder(updates);
      toast.success('Cập nhật thứ tự thành công');
    } catch (err) {
      console.error('Lỗi cập nhật thứ tự:', err);
      toast.error(err?.response?.data?.message || 'Không thể cập nhật thứ tự');
      fetchData(); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMenuClick = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setMenuItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItemId(null);
  };

  const handleDeleteSingle = async (itemId, itemTitle) => {
    handleMenuClose();
    const ok = await confirmDelete('xoá vĩnh viễn', `mục "${itemTitle}"`);
    if (!ok) return;
    setIsLoading(true);
    try {
      await highlightedCategoryItemService.delete(itemId);
      toast.success(`Đã xoá "${itemTitle}" thành công`);
      fetchData();
    } catch (err) {
      console.error('Lỗi khi xoá mục:', err);
      toast.error(err?.response?.data?.message || 'Lỗi khi xoá mục');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box p={2}>
     
      {isLoading && <LoaderAdmin fullscreen />}
      <Box mb={1}>
  <Breadcrumb
    items={[
      { label: 'Trang chủ', href: '/admin' },
      { label: 'Danh mục nổi bật', href: '/admin/highlighted-category-items' }
    ]}
  />
</Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt:2,  flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Danh mục nổi bật trang chủ
        </Typography>
        <Button variant="contained" onClick={() => navigate('/admin/highlighted-category-items/create')}>
          Thêm Mới
        </Button>
      </Box>
      <Paper sx={{ mb: 2, p: 2, boxShadow: 1, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'Tất Cả', count: stats.totalAll },
            { value: 'active', label: 'Hoạt Động', count: stats.totalActive },
            { value: 'inactive', label: 'Tạm Tắt', count: stats.totalInactive }
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

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" sx={{minWidth: 180}}>
              <Select displayEmpty value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
                <MenuItem value=""><em>Hành động hàng loạt</em></MenuItem>
                <MenuItem value="delete">Xoá mục đã chọn</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleApplyBulkAction} disabled={!bulkAction || selectedIds.length === 0}>
              Áp Dụng
            </Button>
          </Box>

          <TextField
            size="small"
            variant="outlined"
            placeholder="Tìm kiếm theo tiêu đề"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {if (e.key === 'Enter') {setPage(1); fetchData();}}}
            sx={{ width: {xs: '100%', sm: 280} }}
            InputProps={{
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => {setSearch(''); setDebouncedSearch(''); setPage(1);}}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{backgroundColor: 'grey.100'}}>
              <TableRow>
                <TableCell padding="checkbox" sx={{width: '60px'}}>
                  <Checkbox
                    indeterminate={selectedIds.length > 0 && selectedIds.length < items.length}
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={toggleSelectAll}
                    disabled={items.length === 0}
                  />
                </TableCell>
                <TableCell sx={{width: '60px'}}>STT</TableCell>
    
                <TableCell align="center" sx={{width: '100px'}}>Ảnh</TableCell>
                <TableCell sx={{minWidth: 200}}>Tiêu đề</TableCell>
                <TableCell sx={{minWidth: 150}}>Danh mục</TableCell>
                            <TableCell align="center" sx={{width: '100px'}}>Lượt</TableCell>
                <TableCell align="center" sx={{width: '120px'}}>Trạng thái</TableCell>
                <TableCell align="center" sx={{width: '120px'}}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="highlighted-items-list">
                {(provided) => (
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{py: 3}}>
                          Không có dữ liệu phù hợp
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, idx) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={idx}>
                          {(prov, snap) => (
                            <TableRow
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              hover
                              sx={{ background: snap.isDragging ? 'action.hover' : 'inherit' }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox checked={selectedIds.includes(item.id)} onChange={() => toggleSelectOne(item.id)} />
                              </TableCell>
                              <TableCell>{(page - 1) * itemsPerPage + idx + 1}</TableCell>
                           
                              <TableCell align="center">
                                <Box
                                  sx={{
                                    position: 'relative', 
                                    width: 80, 
                                    height: 80,
                                    mx: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={getImageUrl(item.imageUrl)}
                                    alt={item.customTitle || "Ảnh"}
                                    sx={{
                                      width: '100%', 
                                      height: '100%',
                                      objectFit: 'contain',
                                      borderRadius: 1,
                                      border: '1px solid',
                                      borderColor: 'divider'
                                    }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
                                  />
                                  {(item.isHot || item.isNew || item.isFeatured) && (
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 4, 
                                        right: 4, 
                                        backgroundColor: item.isHot
                                          ? 'error.main'
                                          : item.isNew
                                            ? 'info.main'
                                            : item.isFeatured
                                              ? 'warning.main'
                                              : 'grey.500',
                                        color: 'white',
                                        px: 0.75,
                                        py: 0.25,
                                        borderRadius: '4px',
                                        fontSize: '0.65rem', 
                                        fontWeight: 'bold',
                                        lineHeight: 1.2,
                                        textTransform: 'uppercase',
                                        zIndex: 1 
                                      }}
                                    >
                                      {item.isHot ? 'HOT' : item.isNew ? 'MỚI' : item.isFeatured ? 'NỔI BẬT' : ''}
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: 270 }}>
                                <HighlightText text={item.customTitle} highlight={debouncedSearch} />
                              </TableCell>
                              <TableCell>
                                <Chip label={item.category?.name || 'N/A'} size="small" variant="outlined"/>
                              </TableCell>
                                 <TableCell align="center">{item.sortOrder}</TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={item.isActive ? 'Hoạt động' : 'Tạm tắt'}
                                  color={item.isActive ? 'success' : 'default'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="center">
                                 <Box display="flex" justifyContent="center" alignItems="center">
                                    <IconButton size="small" {...prov.dragHandleProps} title="Kéo thả">
                                        <SwapVertIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={(e) => handleMenuClick(e, item.id)} title="Tùy chọn">
                                        <MoreVertIcon fontSize="small"/>
                                    </IconButton>
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
        </TableContainer>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && Boolean(menuItemId)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const item = items.find(it => it.id === menuItemId);
          if (item && item.slug) navigate(`/admin/highlighted-category-items/edit/${item.slug}`);
          else if (item) navigate(`/admin/highlighted-category-items/edit/${item.id}`); 
          handleMenuClose();
        }}>Chỉnh sửa</MenuItem>
        <MenuItem onClick={() => {
            const item = items.find(it => it.id === menuItemId);
            if(item) handleDeleteSingle(item.id, item.customTitle);
        }} sx={{color: 'error.main'}}>Xoá</MenuItem>
      </Menu>

      {totalItems > itemsPerPage && (
        <Box mt={2} display="flex" justifyContent="center">
            <MUIPagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(size) => {
                setItemsPerPage(size);
                setPage(1); 
            }}
            showPageSizeChanger={true}
            />
        </Box>
      )}
    </Box>
  );
}
