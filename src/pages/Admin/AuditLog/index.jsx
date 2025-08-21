import React, { useState, useEffect } from 'react';
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
import HighlightText from '../../../components/Admin/HighlightText';
import MUIPagination from '../../../components/common/Pagination';
import LoaderAdmin from '../../../components/Admin/LoaderVip';

// Mock data
const mockSections = [
  {
    id: 1,
    title: 'Khối 1',
    slug: 'khoi-1',
    type: 'productOnly',
    products: [1, 2],
    banners: [1],
    linkedCategories: [1],
    orderIndex: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Khối 2',
    slug: 'khoi-2',
    type: 'productWithBanner',
    products: [1],
    banners: [1],
    linkedCategories: [1, 2],
    orderIndex: 2,
    isActive: false,
  },
  // Add more mock sections as needed
];

const TYPE_LABELS = {
  productOnly: 'Chỉ hiển thị sản phẩm',
  productWithBanner: 'Sản phẩm + Banner',
  productWithCategoryFilter: 'Sản phẩm + Bộ lọc danh mục',
  full: 'Tất cả (Sản phẩm + Banner + Bộ lọc)',
};

export default function HomeSectionList() {
  const [sections, setSections] = useState(mockSections); // Using mock data
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(mockSections.length); // Mock total items
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const navigate = useNavigate();

  // This would normally be a network call, replaced with mock data
  const fetchSections = () => {
    setIsLoading(false); // Assuming no loading in mock data scenario
    setSections(mockSections); // Set mock sections
    setTotalItems(mockSections.length); // Mock total items count
    setCounts({
      all: mockSections.length,
      active: mockSections.filter((sec) => sec.isActive).length,
      inactive: mockSections.filter((sec) => !sec.isActive).length,
    });
  };

  useEffect(() => {
    fetchSections();
  }, [searchText, activeTab]);

  const handleDelete = (sec) => {
    if (!sec || !sec.id || !sec.title) return;
    // Simulating delete operation
    setSections((prevSections) => prevSections.filter((section) => section.id !== sec.id));
    setTotalItems((prevTotal) => prevTotal - 1);
    setCounts({
      all: sections.length - 1,
      active: sections.filter((sec) => sec.isActive).length,
      inactive: sections.filter((sec) => !sec.isActive).length,
    });
  };

  const handleBulkApply = () => {
    if (!bulkAction || selectedIds.length === 0) {
      toast.info('Vui lòng chọn hành động và ít nhất một mục.');
      return;
    }

    if (bulkAction === 'delete') {
      setSections((prevSections) =>
        prevSections.filter((sec) => !selectedIds.includes(sec.id))
      );
      setTotalItems((prevTotal) => prevTotal - selectedIds.length);
      setCounts({
        all: sections.length - selectedIds.length,
        active: sections.filter((sec) => sec.isActive).length,
        inactive: sections.filter((sec) => !sec.isActive).length,
      });
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
    // Simulate the update order operation
    toast.success('Cập nhật thứ tự thành công');
  };

  return (
    <Box p={2}>
      {isLoading && <LoaderAdmin fullscreen />}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
              <TableCell >Hành động</TableCell>
              <TableCell >Tài nguyên</TableCell>
              <TableCell >Người thực hiện</TableCell>
              <TableCell >Trạng thái</TableCell>
              <TableCell >Thời gian</TableCell>
              <TableCell >Thiết bị</TableCell>
              <TableCell >Ip Address</TableCell>
              <TableCell align="center" sx={{ width: '100px' }}>
                Chi tiết
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
                              backgroundColor: snapshot.isDragging ? 'action.hover' : 'inherit',
                            }}
                          >

                            <TableCell sx={{ maxWidth: 240, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}>
                              {/* <HighlightText text={sec.title} highlight={searchText} /> */}
                              Thêm Sản phẩm
                            </TableCell>
                            <TableCell>
                              Sản phẩm
                            </TableCell>
                            <TableCell>Doan Thanh</TableCell>
                            <TableCell>Thành công</TableCell>
                            <TableCell>12:22:20 20/12/2020</TableCell>
                            <TableCell>Chrome</TableCell>

                            <TableCell >123.4.3.1</TableCell>
                            {/* <TableCell align="center">
                              {sec.isActive ? (
                                <Chip label="Hoạt động" color="success" size="small" />
                              ) : (
                                <Chip label="Tạm tắt" color="default" size="small" />
                              )}
                            </TableCell> */}
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
