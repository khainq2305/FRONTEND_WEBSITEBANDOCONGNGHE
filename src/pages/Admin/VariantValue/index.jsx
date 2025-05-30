// src/pages/admin/variants/VariantValueList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  TextField,
  Button,
  Checkbox,
  FormControl,
  Select
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useParams, useNavigate } from 'react-router-dom';
import { variantValueService } from '../../../services/admin/variantValueService';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import MUIPagination from '../../../components/common/Pagination';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../components/Admin/LoaderVip';
import HighlightText from '../../../components/Admin/HighlightText';
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isTrash = tab === 'trash';
const [tabCounts, setTabCounts] = useState({
  all: 0,
  active: 0,
  inactive: 0,
  trash: 0
});

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
        if (tab === 'active') data = data.filter((item) => item.isActive);
        if (tab === 'inactive') data = data.filter((item) => !item.isActive);
      }

      setVariantType(res.data.variantType);
      setValues(data);
      setVariantName(res.data.variantName || '');
      setTotalItems(res.data.total || 0);
      setSelectedIds([]);
      setTabCounts({
  all: res.data.totalAll || 0,
  active: res.data.totalActive || 0,
  inactive: res.data.totalInactive || 0,
  trash: res.data.totalTrash || 0
});

    } catch (err) {
      toast.error('Không thể tải danh sách');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 300); 

    return () => clearTimeout(delayDebounce);
  }, [variantId, tab, page, itemsPerPage, search]);

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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const newList = Array.from(values);
    const [moved] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, moved);
    setValues(newList);

    try {
      const newOrder = newList.map((item, index) => ({
        id: item.id,
        sortOrder: index + 1
      }));
      await variantValueService.reorder(newOrder);
      toast.success('Đã cập nhật thứ tự');
      fetchData();
    } catch (err) {
      toast.error('Không thể cập nhật thứ tự!');
    }
  };

  const handleCheckAll = (e) => {
    setSelectedIds(e.target.checked ? values.map((v) => v.id) : []);
  };

  const handleCheckItem = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
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
    } catch {
      toast.error('Lỗi khi xóa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    handleMenuClose();
    try {
      await variantValueService.restore(selectedId);
      toast.success('Khôi phục thành công');
      setTab('all');
      fetchData();
    } catch {
      toast.error('Lỗi khi khôi phục');
    }
  };

  const handleForceDelete = async () => {
    handleMenuClose();
    const confirm = await confirmDelete('xóa vĩnh viễn');
    if (!confirm) return;
    try {
      await variantValueService.forceDelete(selectedId);
      toast.success('Đã xoá vĩnh viễn');
      fetchData();
    } catch {
      toast.error('Lỗi khi xóa vĩnh viễn');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;
    setIsLoading(true);
    try {
      if (bulkAction === 'delete') await variantValueService.softDeleteMany(selectedIds);
      if (bulkAction === 'restore') await variantValueService.restoreMany(selectedIds);
      if (bulkAction === 'force') await variantValueService.forceDeleteMany(selectedIds);
      toast.success('Đã thực hiện hành động');
      setTab('all');
      setSelectedIds([]);
      setBulkAction('');
      fetchData();
    } catch {
      toast.error('Thao tác thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const bulkActions = {
    normal: [{ value: 'delete', label: 'Chuyển vào thùng rác' }],
    trash: [
      { value: 'restore', label: 'Khôi phục' },
      { value: 'force', label: 'Xoá vĩnh viễn' }
    ]
  };

  return (
    <Box>
      {isLoading && <LoaderAdmin fullscreen />}

      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Cấu hình giá trị cho: {variantName}
        </Typography>
        <Button variant="contained" onClick={() => navigate(`/admin/product-variants/${variantId}/values/create`)}>
          Thêm mới
        </Button>
      </Box>

      
      <Box sx={{ boxShadow: 2, p: 2, borderRadius: 2, backgroundColor: 'white', mb: 2 }}>
      
     <Tabs value={tab} onChange={handleTabChange} TabIndicatorProps={{ style: { display: 'none' } }} sx={{ mb: 2 }}>
  {[
    { label: `Tất cả (${tabCounts.all})`, value: 'all' },
    { label: `Hoạt động (${tabCounts.active})`, value: 'active' },
    { label: `Tạm tắt (${tabCounts.inactive})`, value: 'inactive' },
    { label: `Thùng rác (${tabCounts.trash})`, value: 'trash' }
  ].map((item) => (
    <Tab
      key={item.value}
      label={item.label}
      value={item.value}
      disableRipple
      sx={{
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: '8px',
        px: 2.5,
        py: 1,
        mr: 1,
        minHeight: 36,
        bgcolor: tab === item.value ? '#1a73e8' : 'transparent',
        color: tab === item.value ? '#ffffff !important' : '#000000',
        '&.Mui-selected': {
          color: '#ffffff !important'
        },
        '&:hover': {
          bgcolor: tab === item.value ? '#1a73e8' : '#f1f1f1'
        }
      }}
    />
  ))}
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
        
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small">
              <Select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} displayEmpty>
                <MenuItem value="">Hành động hàng loạt</MenuItem>
                {(isTrash ? bulkActions.trash : bulkActions.normal).map((action) => (
                  <MenuItem key={action.value} value={action.value}>
                    {action.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" disabled={!bulkAction || selectedIds.length === 0} onClick={handleBulkAction}>
              Áp dụng
            </Button>
          </Box>

      
          <TextField
            size="small"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchSubmit}
            sx={{ width: 300 }}
          />
        </Box>
      </Box>

    
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={selectedIds.length === values.length && values.length > 0} onChange={handleCheckAll} />
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
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} hover>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedIds.includes(v.id)} onChange={() => handleCheckItem(v.id)} />
                            </TableCell>
                            <TableCell>{v.sortOrder}</TableCell>
                            <TableCell>
                              <HighlightText text={v.value} highlight={search} />
                            </TableCell>

                            <TableCell>{v.slug || <em style={{ color: '#888' }}>—</em>}</TableCell>
                            <TableCell>
                              <Chip label={v.isActive ? 'Hoạt động' : 'Tạm tắt'} size="small" color={v.isActive ? 'success' : 'default'} />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton onClick={(e) => handleMenuOpen(e, v.id)}>
                                  <MoreVertIcon />
                                </IconButton>
                                <Box {...provided.dragHandleProps} sx={{ cursor: 'grab' }}>
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

      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/product-variants')}>
          Quay lại
        </Button>
      </Box>

      
      {totalItems > itemsPerPage && (
        <MUIPagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setPage(1);
          }}
        />
      )}

   
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {!isTrash ? (
          <>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(`/admin/product-variants/${variantId}/values/edit/${selectedId}`);
              }}
            >
              Sửa
            </MenuItem>
            <MenuItem onClick={handleDelete}>Chuyển vào thùng rác</MenuItem>
          </>
        ) : (
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
