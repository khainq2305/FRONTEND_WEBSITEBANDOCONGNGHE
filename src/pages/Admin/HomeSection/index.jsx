// src/pages/Admin/HomeSectionList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Chip,
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  TableContainer,
  TextField,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { MoreVert, Delete as DeleteIcon, SwapVert } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useNavigate } from 'react-router-dom';
import { sectionService } from '../../../services/admin/sectionService';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import Toastify from '../../../components/common/Toastify';
import HighlightText from '../../../components/Admin/HighlightText';
import MUIPagination from '../../../components/common/Pagination';

const TYPE_LABELS = {
  productOnly: 'Chỉ sản phẩm',
  productWithBanner: 'Sản phẩm + Banner',
  productWithFilters: 'Sản phẩm + Bộ lọc',
  fullBlock: 'Sản phẩm + Banner + Bộ lọc'
};

export default function HomeSectionList() {
  const [sections, setSections] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [countActive, setCountActive] = useState(0);
  const [countInactive, setCountInactive] = useState(0);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const navigate = useNavigate();

  const fetchSections = useCallback(async () => {
    try {
      const params = {
        page,
        limit: pageSize,
        search: searchText || undefined,
        isActive: activeTab === 'all' ? undefined : activeTab === 'active'
      };
      const res = await sectionService.list(params);
      const { data, pagination, counts } = res.data;
      setSections(data);
      setTotalItems(pagination.totalItems);
      setCountActive(counts.active);
      setCountInactive(counts.inactive);
      setSelectedIds([]);
      setBulkAction('');
    } catch (err) {
      console.error('Lỗi khi load sections', err);
    }
  }, [page, pageSize, searchText, activeTab]); // ✅ thiếu cái này là không reload

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDelete = async (sec) => {
    if (await confirmDelete('xoá', `"${sec.title}"`)) {
      try {
        await sectionService.delete(sec.id);
        toast.success('Xoá thành công');
        fetchSections();
      } catch {
        toast.error('Xoá thất bại');
      }
    }
  };

  const handleBulkApply = async () => {
    if (!bulkAction || selectedIds.length === 0) return;

    if (bulkAction === 'delete') {
      if (await confirmDelete('xoá', `${selectedIds.length} mục đã chọn`)) {
        try {
          await Promise.all(selectedIds.map((id) => sectionService.delete(id)));
          toast.success('Xoá hàng loạt thành công');
          fetchSections();
        } catch {
          toast.error('Xoá hàng loạt thất bại');
        }
      }
    }
    // bạn có thể thêm case 'disable' ở đây nếu muốn
  };

  const toggleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? sections.map((s) => s.id) : []);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  };

  const openRowMenu = (e, id) => {
    setMenuAnchorEl(e.currentTarget);
    setMenuRowId(id);
  };
  const closeRowMenu = () => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  };
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setSections(items);

    try {
      const orderedIds = items.map((item) => item.id);
      await sectionService.updateOrder(orderedIds);
      toast.success('Cập nhật thứ tự thành công');
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật thứ tự thất bại');
    }
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Danh sách Khối Trang chủ</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/home-sections/create')}>
          Thêm mới
        </Button>
      </Box>

      {/* Tabs + Bulk + Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box mb={2} display="flex" gap={2}>
          <Button variant={activeTab === 'all' ? 'contained' : 'text'} onClick={() => setActiveTab('all')}>
            Tất cả ({totalItems})
          </Button>
          <Button variant={activeTab === 'active' ? 'contained' : 'text'} onClick={() => setActiveTab('active')}>
            Hoạt động ({countActive})
          </Button>
          <Button variant={activeTab === 'inactive' ? 'contained' : 'text'} onClick={() => setActiveTab('inactive')}>
            Tạm tắt ({countInactive})
          </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={2} alignItems="center">
            <FormControl size="small">
              <Select displayEmpty value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
                <MenuItem value="">
                  <em>Hành động</em>
                </MenuItem>
                <MenuItem value="delete">Xoá</MenuItem>
                {/* <MenuItem value="disable">Tạm tắt</MenuItem> */}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleBulkApply} disabled={!bulkAction || selectedIds.length === 0}>
              Áp dụng
            </Button>
          </Box>

          <TextField
            size="small"
            placeholder="Tìm theo tiêu đề..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
            sx={{ width: 280 }}
          />
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={selectedIds.length === sections.length && sections.length > 0} onChange={toggleSelectAll} />
              </TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Loại khối</TableCell>
              <TableCell align="center">SP</TableCell>
              <TableCell align="center">Banner</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {sections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Á cha, không có dữ liệu rồi!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sections.map((sec, idx) => (
                      <Draggable key={sec.id} draggableId={String(sec.id)} index={idx}>
                        {(provided) => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedIds.includes(sec.id)} onChange={() => toggleSelectOne(sec.id)} />
                            </TableCell>
                            <TableCell>{(page - 1) * pageSize + idx + 1}</TableCell>
                            <TableCell
                              sx={{
                                maxWidth: 240,
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                lineHeight: 1.5
                              }}
                            >
                              <HighlightText text={sec.title} highlight={searchText} />
                            </TableCell>

                            <TableCell>{TYPE_LABELS[sec.type] || sec.type}</TableCell>
                            <TableCell align="center">{sec.productHomeSections?.length || 0}</TableCell>
                            <TableCell align="center">{sec.banners?.length || 0}</TableCell>
                            <TableCell align="center">
                              {sec.isActive ? (
                                <Chip label="Hoạt động" color="success" size="small" />
                              ) : (
                                <Chip label="Tạm tắt" color="default" size="small" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                <IconButton size="small" onClick={(e) => openRowMenu(e, sec.id)}>
                                  <MoreVert fontSize="small" />
                                </IconButton>
                                <IconButton size="small">
                                  <SwapVert fontSize="small" />
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

      {/* Row action menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeRowMenu}>
        <MenuItem
          onClick={() => {
            navigate(`/admin/home-sections/edit/${menuRowId}`);
            closeRowMenu();
          }}
        >
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/admin/home-sections/detail/${menuRowId}`);
            closeRowMenu();
          }}
        >
          <ListItemText>Xem chi tiết</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const sec = sections.find((s) => s.id === menuRowId);
            closeRowMenu();
            if (sec) handleDelete(sec);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xoá</ListItemText>
        </MenuItem>
      </Menu>

      <MUIPagination currentPage={page} totalItems={totalItems} itemsPerPage={pageSize} onPageChange={(p) => setPage(p)} />
      <Toastify />
    </Box>
  );
}
