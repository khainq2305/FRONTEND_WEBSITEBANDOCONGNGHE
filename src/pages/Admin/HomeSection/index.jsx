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
  ListItemText
} from '@mui/material';
import { MoreVert, SwapVert } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { useNavigate } from 'react-router-dom';
import { sectionService } from '../../../services/admin/sectionService';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import HighlightText from '../../../components/Admin/HighlightText';
import MUIPagination from '../../../components/common/Pagination';
import LoaderAdmin from '../../../components/Admin/LoaderVip';
import Breadcrumb from '../../../components/common/Breadcrumb';

const TYPE_LABELS = {
  productOnly: 'Chỉ hiển thị sản phẩm',
  productWithBanner: 'Sản phẩm + Banner',
  productWithCategoryFilter: 'Sản phẩm + Bộ lọc danh mục',
  full: 'Tất cả (Sản phẩm + Banner + Bộ lọc)'
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
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const navigate = useNavigate();

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        search: searchText || undefined,
        isActive: activeTab === 'all' ? undefined : activeTab === 'active'
      };
      const res = await sectionService.list(params);
      const { data, pagination, counts: apiCounts } = res.data;
      setSections(data || []);
      setTotalItems(pagination?.totalItems || 0);
      setCounts({
        all: apiCounts?.all || 0,
        active: apiCounts?.active || 0,
        inactive: apiCounts?.inactive || 0
      });
      setSelectedIds([]);
      setBulkAction('');
    } catch (err) {
      console.error('Lỗi khi load sections', err);
      toast.error(err?.response?.data?.message || 'Không thể tải danh sách.');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchText, activeTab]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDelete = async (sec) => {
    if (!sec || !sec.id || !sec.title) return;
    if (await confirmDelete('xoá vĩnh viễn', `khối "${sec.title}"`)) {
      setIsLoading(true);
      try {
        await sectionService.delete(sec.id);
        toast.success('Xoá thành công');
        fetchSections();
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Xoá thất bại');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkApply = async () => {
    if (!bulkAction || selectedIds.length === 0) {
      toast.info('Vui lòng chọn hành động và ít nhất một mục.');
      return;
    }

    if (bulkAction === 'delete') {
      if (await confirmDelete('xoá vĩnh viễn', `${selectedIds.length} mục đã chọn`)) {
        setIsLoading(true);
        try {
          await Promise.all(selectedIds.map((id) => sectionService.delete(id)));
          toast.success(`Đã xoá ${selectedIds.length} mục thành công`);
          fetchSections();
        } catch (err) {
          toast.error(err?.response?.data?.message || 'Xoá hàng loạt thất bại');
        } finally {
          setIsLoading(false);
        }
      }
    }
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
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);

    try {
      const orderedItemsPayload = items.map((item, index) => ({
        id: item.id,
        orderIndex: index
      }));
      await sectionService.updateOrder(orderedItemsPayload);

      toast.success('Cập nhật thứ tự thành công');
      fetchSections();
    } catch (err) {
      console.error('Lỗi cập nhật thứ tự:', err);
      toast.error(err?.response?.data?.message || 'Cập nhật thứ tự thất bại');
      fetchSections();
    }
  };

  return (
    <Box p={2}>
      {isLoading && <LoaderAdmin fullscreen />}
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Khối Trang chủ', href: '/admin/home-sections' }
        ]}
        ml={3}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <Typography variant="h5" fontWeight={600}>
          Danh sách Khối Trang chủ
        </Typography>
        <Button variant="contained" onClick={() => navigate('/admin/home-sections/create')}>
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, boxShadow: 1, borderRadius: 1 }}>
        <Box mb={2} display="flex" gap={1} flexWrap="wrap">
          <Button
            variant={activeTab === 'all' ? 'contained' : 'text'}
            onClick={() => {
              setActiveTab('all');
              setPage(1);
            }}
          >
            Tất cả ({counts.all})
          </Button>
          <Button
            variant={activeTab === 'active' ? 'contained' : 'text'}
            onClick={() => {
              setActiveTab('active');
              setPage(1);
            }}
          >
            Hoạt động ({counts.active})
          </Button>
          <Button
            variant={activeTab === 'inactive' ? 'contained' : 'text'}
            onClick={() => {
              setActiveTab('inactive');
              setPage(1);
            }}
          >
            Tạm tắt ({counts.inactive})
          </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" gap={1} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select displayEmpty value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
                <MenuItem value="">Hành động hàng loạt</MenuItem>
                <MenuItem value="delete">Xoá mục đã chọn</MenuItem>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(1);
              }
            }}
            sx={{ width: { xs: '100%', sm: 280 } }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: '60px' }}>
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < sections.length}
                  checked={sections.length > 0 && selectedIds.length === sections.length}
                  onChange={toggleSelectAll}
                  disabled={sections.length === 0}
                />
              </TableCell>
              <TableCell sx={{ width: '60px' }}>STT</TableCell>

              <TableCell sx={{ minWidth: 200 }}>Tiêu đề</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Slug</TableCell>
              <TableCell sx={{ minWidth: 180 }}>Loại khối</TableCell>
              <TableCell align="center" sx={{ width: '80px' }}>
                SP
              </TableCell>
              <TableCell align="center" sx={{ width: '80px' }}>
                Banner
              </TableCell>

              <TableCell align="center" sx={{ width: '80px' }}>
                Danh mục
              </TableCell>

              <TableCell align="center" sx={{ width: '100px' }}>
                Lượt
              </TableCell>
              <TableCell align="center" sx={{ width: '120px' }}>
                Trạng thái
              </TableCell>
              <TableCell align="center" sx={{ width: '100px' }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections-list-droppable">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {sections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Không có dữ liệu phù hợp!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sections.map((sec, idx) => (
                      <Draggable key={sec.id} draggableId={String(sec.id)} index={idx}>
                        {(providedDraggable, snapshot) => (
                          <TableRow
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            hover
                            sx={{
                              backgroundColor: snapshot.isDragging ? 'action.hover' : 'inherit'
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedIds.includes(sec.id)} onChange={() => toggleSelectOne(sec.id)} />
                            </TableCell>
                            <TableCell>{(page - 1) * pageSize + idx + 1}</TableCell>

                            <TableCell sx={{ maxWidth: 240, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}>
                              <HighlightText text={sec.title} highlight={searchText} />
                            </TableCell>
                            <TableCell
                              sx={{
                                maxWidth: 150,
                                whiteSpace: 'normal',
                                wordBreak: 'break-all',
                                fontSize: '0.8rem',
                                color: 'text.secondary'
                              }}
                            >
                              {sec.slug}
                            </TableCell>
                            <TableCell>{TYPE_LABELS[sec.type] || sec.type}</TableCell>
                            <TableCell align="center">{sec.products?.length || 0}</TableCell>

                            <TableCell align="center">{sec.banners?.length || 0}</TableCell>
                            <TableCell align="center">{sec.linkedCategories?.length || 0}</TableCell>

                            <TableCell align="center">{sec.orderIndex}</TableCell>
                            <TableCell align="center">
                              {sec.isActive ? (
                                <Chip label="Hoạt động" color="success" size="small" />
                              ) : (
                                <Chip label="Tạm tắt" color="default" size="small" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center">
                                <IconButton size="small" {...providedDraggable.dragHandleProps} title="Kéo thả để sắp xếp">
                                  <SwapVert fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={(e) => openRowMenu(e, sec.id)} title="Tùy chọn">
                                  <MoreVert fontSize="small" />
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

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeRowMenu}>
        <MenuItem
          onClick={() => {
            const sec = sections.find((s) => s.id === menuRowId);
            if (sec && sec.slug) {
              navigate(`/admin/home-sections/edit/${sec.slug}`);
            } else if (sec) {
              console.warn(`Section with ID ${menuRowId} is missing a slug. Navigating with ID.`);
              navigate(`/admin/home-sections/edit/${sec.id}`);
            }
            closeRowMenu();
          }}
        >
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            const sec = sections.find((s) => s.id === menuRowId);
            closeRowMenu();
            if (sec) handleDelete(sec);
          }}
        >
          <ListItemText sx={{ color: 'error.main' }}>Xoá</ListItemText>
        </MenuItem>
      </Menu>

      {totalItems > pageSize && sections.length > 0 && (
        <Box mt={2} display="flex" justifyContent="center">
          <MUIPagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            showPageSizeChanger={true}
          />
        </Box>
      )}
    </Box>
  );
}
