import React, { useEffect, useState, useRef } from 'react';
import { productService } from '../../../services/admin/productService';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Checkbox,
  Chip,
  TextField,
  MenuItem as MuiMenuItem,
  Button,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import MUIPagination from '../../../components/common/Pagination';
import Toastify from '../../../components/common/Toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../constants/environment';
import LoaderAdmin from '../../../components/common/Loader';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import HighlightText from '../../../components/Admin/HighlightText';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/common/Breadcrumb';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    deleted: 0
  });

  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuProduct, setMenuProduct] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const bulkActions =
    filter === 'deleted'
      ? [
        { value: 'restore', label: 'Khôi phục' },
        { value: 'forceDelete', label: 'Xóa vĩnh viễn' }
      ]
      : [{ value: 'delete', label: 'Chuyển vào thùng rác' }];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategoryTree();
        const flat = flattenCategories(res.data.data || []);
        setCategoryOptions(flat);
      } catch (err) {
        console.error('Lỗi lấy danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  const flattenCategories = (nodes, depth = 0) => {
    const result = [];
    for (const node of nodes) {
      const indent = '  '.repeat(depth);

      const label = depth > 0 ? `${indent}├─ ${node.name}` : node.name;
      result.push({ id: node.id, name: label });

      if (node.children && node.children.length > 0) {
        result.push(...flattenCategories(node.children, depth + 1));
      }
    }
    return result;
  };

  useEffect(() => {
    fetchData();
  }, [filter, searchText, selectedCategoryId, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchText, selectedCategoryId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await productService.list({
        filter,
        search: searchText,
        categoryId: selectedCategoryId || undefined,
        page: currentPage,
        limit: itemsPerPage
      });

      if (res.data && res.data.data) {
        setProducts(res.data.data || []);
        setTotalItems(res.data.pagination.totalItems || 0);
        setTabCounts(res.data.counts || {});
      } else {
        setProducts([]);
        setTotalItems(0);

        console.warn('API response missing data structure:', res);
      }
    } catch (error) {
      setTotalItems(0);
      console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
    } finally {
      setIsLoading(false);
    }
  };

const handleDragEnd = async ({ active, over }) => {
  if (!selectedCategoryId) {
    toast.warning('Vui lòng lọc theo một danh mục cụ thể để sắp xếp.');
    return;
  }

  if (!over || active.id === over.id) return;

  const currentProductList = products.filter((p) => {
    if (filter === 'active' && (!p.isActive || p.deletedAt)) return false;
    if (filter === 'inactive' && (p.isActive || p.deletedAt)) return false;
    if (filter === 'deleted' && !p.deletedAt) return false;
    if (filter === 'all' && p.deletedAt) return false;
    if (filter !== 'deleted' && p.deletedAt) return false;
    if (selectedCategoryId && String(p.category?.id) !== String(selectedCategoryId)) return false;
    const kw = searchText.toLowerCase().trim();
    if (kw) {
      return (
        p.name?.toLowerCase().includes(kw) ||
        p.slug?.toLowerCase().includes(kw) ||
        p.category?.name?.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  const oldIndex = currentProductList.findIndex((p) => String(p.id) === String(active.id));
  const newIndex = currentProductList.findIndex((p) => String(p.id) === String(over.id));

  if (oldIndex < 0 || newIndex < 0) return;

  const activeItem = currentProductList[oldIndex];
  const overItem = currentProductList[newIndex];

  // ⚠️ Chỉ hoán đổi orderIndex giữa 2 item
  const payload = [
    {
      id: activeItem.id,
      orderIndex: overItem.orderIndex,
      categoryId: overItem.category?.id || selectedCategoryId
    },
    {
      id: overItem.id,
      orderIndex: activeItem.orderIndex,
      categoryId: activeItem.category?.id || selectedCategoryId
    }
  ];

  const uniqueCategoryIds = [...new Set(payload.map((i) => i.categoryId))];
  if (uniqueCategoryIds.length !== 1) {
    toast.warning('Chỉ được kéo sắp xếp sản phẩm trong cùng một danh mục.');
    return;
  }

  try {
    setIsLoading(true);
    console.log('Payload gửi lên:', payload);
    await productService.updateOrderIndexBulk({ items: payload });

    toast.success('Đã cập nhật thứ tự sản phẩm.');

    await fetchData(); // Load lại danh sách từ server
  } catch (err) {
    console.error('Lỗi cập nhật thứ tự:', err);
    toast.error('Lỗi cập nhật thứ tự sản phẩm.');
  } finally {
    setIsLoading(false);
  }
};


  const handleMenuOpen = (e, product) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.right });
    setMenuAnchorEl(e.currentTarget);
    setMenuProduct(product);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuProduct(null);
    setMenuPosition(null);
  };

  const toggleSelectAll = (checked) => setSelectedIds(checked ? filteredProducts.map((p) => p.id) : []);

  const toggleSelectOne = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleBulkAction = async () => {
    if (!bulkAction || !selectedIds.length) return;
    const labels = {
      delete: 'xoá',
      restore: 'khôi phục',
      forceDelete: 'xoá vĩnh viễn'
    };

    if (!(await confirmDelete(labels[bulkAction], ` ${selectedIds.length} sản phẩm đã chọn`))) return;

    setIsLoading(true);
    try {
      if (bulkAction === 'delete') {
        await productService.softDeleteMany(selectedIds);
        toast.success('Đã xóa tạm thời các sản phẩm đã chọn');
      } else if (bulkAction === 'restore') {
        await productService.restoreMany(selectedIds);
        toast.success('Đã khôi phục các sản phẩm đã chọn');
      } else {
        await productService.forceDeleteMany(selectedIds);
        toast.success('Đã xóa vĩnh viễn các sản phẩm đã chọn');
      }

      setSelectedIds([]);
      setBulkAction('');
      await fetchData();
    } catch (err) {
      console.error('Lỗi bulk action:', err);

      if (err?.response?.data?.message) {
        toast.warning(err.response.data.message);
      } else {
        toast.error(`Lỗi khi ${labels[bulkAction]} hàng loạt.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOne = async (id, name) => {
    if (!(await confirmDelete('xoá', name))) return;
    setIsLoading(true);
    try {
      await productService.softDelete(id);
      toast.success(`Đã xóa sản phẩm "${name}" thành công`);
      // Gọi lại fetchData để cập nhật UI sau khi xóa mềm
      await fetchData();
      setSelectedIds((prev) => prev.filter((pid) => pid !== id));
    } catch (err) {
      console.error('Xóa mềm lỗi:', err);
      toast.error(`Lỗi khi xóa sản phẩm "${name}".`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id, name) => {
    if (!(await confirmDelete('khôi phục', name))) return;
    setIsLoading(true);
    try {
      await productService.restore(id);
      toast.success(`Đã khôi phục sản phẩm "${name}" thành công`);
      // Gọi lại fetchData để cập nhật UI sau khi khôi phục
      await fetchData();
      setSelectedIds((prev) => prev.filter((pid) => pid !== id));
    } catch (err) {
      console.error('Khôi phục lỗi:', err);
      toast.error(`Lỗi khi khôi phục sản phẩm "${name}".`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDelete = async (id, name) => {
    if (!(await confirmDelete('xoá vĩnh viễn', name))) return;
    setIsLoading(true);
    try {
      await productService.forceDelete(id);
      toast.success(`Đã xoá vĩnh viễn "${name}"`);
      await fetchData();
      setSelectedIds((prev) => prev.filter((pid) => pid !== id));
    } catch (err) {
      console.error('Xóa vĩnh viễn lỗi:', err);

      if (err?.response?.data?.message) {
        toast.warning(err.response.data.message);
      } else {
        toast.error(`Lỗi khi xoá vĩnh viễn sản phẩm "${name}".`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'active' && (!p.isActive || p.deletedAt)) return false;
    if (filter === 'inactive' && (p.isActive || p.deletedAt)) return false;
    if (filter === 'deleted' && !p.deletedAt) return false;
    if (filter === 'all' && p.deletedAt) return false;
    if (filter === 'lowStock' && !p.lowStockWarning) return false;

    if (filter !== 'deleted' && p.deletedAt) return false;
    if (selectedCategoryId && String(p.category?.id) !== String(selectedCategoryId)) return false;

    const kw = searchText.toLowerCase().trim();
    if (kw) {
      return p.name?.toLowerCase().includes(kw) || p.slug?.toLowerCase().includes(kw) || p.category?.name?.toLowerCase().includes(kw);
    }
    return true;
  });

  const getThumbnailUrl = (thumb) => {
    if (!thumb) return '';
    return thumb.startsWith('http') || thumb.startsWith('blob:') ? thumb : `${API_BASE_URL}${thumb || ''}`;
  };

  const SortableRow = ({ product, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: String(product.id) });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
      <TableRow ref={setNodeRef} style={style}>
        {children({ listeners, attributes })}
      </TableRow>
    );
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <Box>
      {isLoading && <LoaderAdmin fullscreen />}
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/admin' }, { label: 'Sản phẩm' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
        <Typography variant="h4">Danh sách sản phẩm</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/products/create')}>
          + Thêm sản phẩm
        </Button>
      </Box>

      <Box sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {[
            { label: 'Tất Cả', value: 'all' },
            { label: 'Hoạt Động', value: 'active' },
            { label: 'Tạm Tắt', value: 'inactive' },
            { label: 'Sắp hết hàng', value: 'lowStock' },
            { label: 'Thùng Rác', value: 'deleted' }
          ]
            .map(({ label, value }) => {
              const isActiveFilter = filter === value;
              const count = tabCounts[value] || 0;

              return (
                <Box
                  key={value}
                  onClick={() => setFilter(value)}
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 14,
                    bgcolor: isActiveFilter ? 'primary.main' : '',
                    color: isActiveFilter ? 'white' : 'text.primary',
                    transition: '0.2s',
                    '&:hover': {
                      bgcolor: isActiveFilter ? 'primary.dark' : '#e0e0e0'
                    }
                  }}
                >
                  {`${label} (${count})`}
                </Box>
              );
            })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="bulk-action-label">Áp dụng hàng loạt</InputLabel>
              <Select
                labelId="bulk-action-label"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                label="Áp dụng hàng loạt"
                renderValue={(selected) => {
                  if (!selected) return <em>Áp dụng hàng loạt</em>;
                  const selectedLabel = bulkActions.find((item) => item.value === selected)?.label;
                  return selectedLabel || selected;
                }}
              >
                <MuiMenuItem value="" disabled>
                  <em>Áp dụng hàng loạt</em>
                </MuiMenuItem>
                {bulkActions.map((action) => (
                  <MuiMenuItem key={action.value} value={action.value}>
                    {action.label}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="small"
              sx={{ minWidth: 100, mt: '6px', padding: '6px' }}
              disabled={!bulkAction || !selectedIds.length}
              onClick={handleBulkAction}
            >
              Áp Dụng
            </Button>

            <FormControl size="small" sx={{ minWidth: 280, mt: '-4px' }}>
              <InputLabel id="cat-filter">Danh mục</InputLabel>
              <Select
                labelId="cat-filter"
                value={selectedCategoryId}
                label="Danh mục"
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      minWidth: 300 // đặt chiều rộng tối thiểu cho dropdown
                    }
                  }
                }}
              >
                <MuiMenuItem value="">Tất cả</MuiMenuItem>
                {categoryOptions.map((c) => (
                  <MuiMenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TextField
            placeholder="Tìm kiếm..."
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: { xs: '100%', sm: 250 } }}
          />
        </Box>
      </Box>

      <Paper elevation={1}>
        <Table sx={{ minWidth: 650 }} aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredProducts.length}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  disabled={filteredProducts.length === 0}
                />
              </TableCell>
              <TableCell align="center">STT</TableCell>

           
              <TableCell align="center">Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>

              <TableCell>Danh mục</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Slug</TableCell>
                 <TableCell align="center">Thứ tự</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredProducts.map((p) => String(p.id))} strategy={verticalListSortingStrategy}>
                {filteredProducts.map((product, index) => (
                  <SortableRow key={product.id} product={product}>
                    {({ listeners, attributes }) => (
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedIds.includes(product.id)} onChange={() => toggleSelectOne(product.id)} />
                        </TableCell>
                          <TableCell align="center">{index + 1}</TableCell>
                        
                        <TableCell sx={{ position: 'relative', width: 110, height: 110, p: 1 }}>
                          <Avatar
                            align="center"
                            variant="rounded"
                            src={getThumbnailUrl(product.thumbnail)}
                            alt={product.name}
                            sx={{ width: '100%', height: '100%' }}
                          />
                          {product.hasVariants !== undefined && (
                            <Chip
                              label={product.hasVariants ? 'Biến thể' : 'Đơn giản'}
                              color={product.hasVariants ? 'primary' : 'default'}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 6,
                                left: 6,
                                fontSize: '10px',
                                padding: '4px 6px',
                                height: 'auto',
                                borderRadius: '2px',
                                lineHeight: 1.2,
                                fontWeight: 600,
                                ...(product.hasVariants ? {} : { backgroundColor: '#757575', color: 'white' })
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ minWidth: 200 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ minHeight: 24 }}>
                              <HighlightText text={product.name} highlight={searchText} />
                            </Box>
                            {product.lowStockWarning && (
                              <Chip
                                label="Sắp hết hàng"
                                color="warning"
                                size="small"
                                sx={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  px: 1,
                                  height: 20,
                                  borderRadius: 1,
                                  alignSelf: 'start'
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>


                        <TableCell>{product.category?.name || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.isActive ? 'Hoạt động' : 'Tạm tắt'}
                            color={product.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{product.slug}</TableCell>
                        <TableCell align="center">{product.orderIndex}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, product)}>
                              {' '}
                              <MoreVertIcon />
                            </IconButton>
                            <ImportExportIcon
                              {...listeners}
                              {...attributes}
                              sx={{
                                cursor: 'grab',
                                fontSize: 20,
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Kéo để sắp xếp"
                            />
                          </Box>
                        </TableCell>
                      </>
                    )}
                  </SortableRow>
                ))}
              </SortableContext>
            </DndContext>
            {filteredProducts.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có sản phẩm nào được tìm thấy.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {menuProduct && menuPosition && (
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={menuPosition}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { minWidth: 140, p: 1 } }}
        >
          {filter === 'deleted' ? (
            <>
              <MenuItem
                onClick={async () => {
                  handleMenuClose();
                  await handleRestore(menuProduct.id, menuProduct.name);
                }}
              >
                Khôi phục
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  handleMenuClose();
                  await handleForceDelete(menuProduct.id, menuProduct.name);
                }}
                sx={{ color: 'error.main' }}
              >
                Xoá vĩnh viễn
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                onClick={() => {
                  window.location.href = `/admin/products/edit/${menuProduct.slug}`;
                }}
              >
                Sửa
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  handleMenuClose();
                  await handleDeleteOne(menuProduct.id, menuProduct.name);
                }}
              >
                Chuyển vào thùng rác
              </MenuItem>
            </>
          )}
        </Menu>
      )}

      {totalItems > itemsPerPage && (
        <MUIPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
}
