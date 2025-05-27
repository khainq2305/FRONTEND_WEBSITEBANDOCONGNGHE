// src/pages/admin/products/ProductListPage.jsx
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
import { API_BASE_URL } from '../../../constants/environment';
import LoaderAdmin from '../../../components/common/Loader';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [bulkAction, setBulkAction] = useState('');
const [isLoading, setIsLoading] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuProduct, setMenuProduct] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
const bulkActions = filter === 'deleted'
  ? [
      { value: 'restore', label: 'Khôi phục' },
      { value: 'forceDelete', label: 'Xóa vĩnh viễn' }
    ]
  : [
      { value: 'delete', label: 'Xóa' }
    ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategoryTree();
        const flat = flattenCategories(res.data.data || []);
        setCategoryOptions(flat);
      } catch (err) {
        console.error('❌ Lỗi lấy danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  const flattenCategories = (tree, prefix = '') =>
    tree.reduce((acc, cat) => {
      const label = prefix ? `${prefix} > ${cat.name}` : cat.name;
      acc.push({ id: cat.id, name: label });
      if (cat.children?.length) {
        acc.push(...flattenCategories(cat.children, label));
      }
      return acc;
    }, []);

  useEffect(() => {
    fetchData();
  }, [filter, searchText, selectedCategoryId, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchText, selectedCategoryId]);

 const fetchData = async () => {
  setIsLoading(true); // bắt đầu loading
  try {
    const res = await productService.list({
      filter,
      search: searchText,
      categoryId: selectedCategoryId || undefined,
      page: currentPage,
      limit: itemsPerPage
    });
    setProducts(res.data.data || []);
    setTotalItems(res.data.pagination.totalItems || 0);
  } catch (error) {
    console.error('❌ Lỗi fetchData:', error);
  } finally {
    setIsLoading(false); // kết thúc loading
  }
};


  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = filteredProducts.findIndex(p => p.id === active.id);
    const newIndex = filteredProducts.findIndex(p => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(filteredProducts, oldIndex, newIndex);
    const payload = reordered.map((p, idx) => ({ id: p.id, orderIndex: idx }));

    try {
      await productService.updateOrderIndexBulk({ items: payload });
      await fetchData();
    } catch (err) {
      console.error('❌ Lỗi cập nhật thứ tự:', err);
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

  const toggleSelectAll = checked =>
    setSelectedIds(checked ? filteredProducts.map(p => p.id) : []);

  const toggleSelectOne = id =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));

const handleBulkAction = async () => {
  if (!bulkAction || !selectedIds.length) return;
  const labels = { delete: 'xoá', restore: 'khôi phục', forceDelete: 'xoá vĩnh viễn' };
  if (!(await confirmDelete(labels[bulkAction], 'các sản phẩm đã chọn'))) return;

  try {
    setIsLoading(true);

    if (bulkAction === 'delete') {
      await productService.softDeleteMany(selectedIds);
      toast.success('Đã xóa tạm thời các sản phẩm đã chọn');
      // ✅ Cập nhật danh sách sản phẩm (xóa khỏi UI)
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
    } else if (bulkAction === 'restore') {
      await productService.restoreMany(selectedIds);
      toast.success('Đã khôi phục các sản phẩm đã chọn');
      // ✅ Cập nhật danh sách sản phẩm (ẩn khỏi tab "Thùng Rác")
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
    } else {
      await Promise.all(selectedIds.map(id => productService.forceDelete(id)));
      toast.success('Đã xóa vĩnh viễn các sản phẩm đã chọn');
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
    }

    setSelectedIds([]);
    setBulkAction('');
    setCurrentPage(1); // reset trang về 1 nếu cần
  } catch (err) {
    console.error('❌ Lỗi bulk action:', err);
  } finally {
    setIsLoading(false);
  }
};


const handleDeleteOne = async (id, name) => {
  if (!(await confirmDelete('xoá', name))) return;
  try {
    setIsLoading(true);
    await productService.softDelete(id);
    toast.success(`Đã xóa sản phẩm "${name}" thành công`);
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => prev.filter(pid => pid !== id));
  } catch (err) {
    console.error('❌ Xóa mềm lỗi:', err);
  } finally {
    setIsLoading(false);
  }
};



const handleRestore = async (id, name) => {
  if (!(await confirmDelete('khôi phục', name))) return;
  try {
    setIsLoading(true);
    await productService.restore(id);
    toast.success(`Đã khôi phục sản phẩm "${name}" thành công`);
    // ✅ Cập nhật lại danh sách trên UI: loại sản phẩm đó khỏi danh sách
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => prev.filter(pid => pid !== id)); // xoá khỏi danh sách chọn
  } catch (err) {
    console.error('❌ Khôi phục lỗi:', err);
  } finally {
    setIsLoading(false);
  }
};



const handleForceDelete = async (id, name) => {
  if (!(await confirmDelete('xoá vĩnh viễn', name))) return;
  try {
    setIsLoading(true);
    await productService.forceDelete(id);
    toast.success(`Đã xóa vĩnh viễn sản phẩm "${name}"`);
    // ✅ Cập nhật UI
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => prev.filter(pid => pid !== id));
  } catch (err) {
    console.error('❌ Xóa vĩnh viễn lỗi:', err);
  } finally {
    setIsLoading(false);
  }
};



  const filteredProducts = products.filter(p => {
    if (filter === 'active' && (!p.isActive || p.deletedAt)) return false;
    if (filter === 'inactive' && (p.isActive || p.deletedAt)) return false;
    if (filter === 'deleted' && !p.deletedAt) return false;
    if (filter === 'all' && p.deletedAt) return false;
    if (filter !== 'deleted' && p.deletedAt) return false;
    if (selectedCategoryId && p.category?.id !== selectedCategoryId) return false;
    const kw = searchText.toLowerCase().trim();
    return !kw ||
      p.name?.toLowerCase().includes(kw) ||
      p.slug?.toLowerCase().includes(kw) ||
      p.category?.name?.toLowerCase().includes(kw);
  });

  const getThumbnailUrl = thumb =>
    thumb?.startsWith('http') ? thumb : `${API_BASE_URL}${thumb || ''}`;

  const SortableRow = ({ product, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
      <TableRow ref={setNodeRef} style={style}>
        {children({ listeners, attributes })}
      </TableRow>
    );
  };

  return (
    <Box>
      {/* Mount toast container once */}
      <Toastify />
{isLoading && <LoaderAdmin fullscreen />}

      <Typography variant="h4" gutterBottom>Danh sách sản phẩm</Typography>

      {/* Filters, bulk actions, search */}
      <Box sx={{ p:2, mb:2, border:'1px solid #eee', borderRadius:2, bgcolor:'#fafafa' }}>
        <Box sx={{ display:'flex', gap:3, mb:2 }}>
          {['Tất Cả','Hoạt Động','Tạm Tắt','Thùng Rác'].map((lbl, i) => {
            const val = ['all','active','inactive','deleted'][i];
            return (
              <Typography
                key={val}
                onClick={() => setFilter(val)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: filter===val?'bold':'normal',
                  color: filter===val?'primary.main':'text.primary',
                  borderBottom: filter===val?'2px solid #1976d2':'none',
                  pb: 0.5
                }}
              >
                {lbl}
              </Typography>
            );
          })}
        </Box>
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            
<FormControl size="small" sx={{ minWidth: 180 }}>
  <InputLabel id="bulk-action-label">Áp dụng hàng loạt</InputLabel>
  <Select
    labelId="bulk-action-label"
    value={bulkAction}
    onChange={(e) => setBulkAction(e.target.value)}
    label="Áp dụng hàng loạt"
    renderValue={(selected) => {
      if (!selected) return <em>Áp dụng hàng loạt</em>;
      const selectedLabel = bulkActions.find(item => item.value === selected)?.label;
      return selectedLabel || selected;
    }}
    notched
  >
    <MenuItem value="" disabled>
      <em>Áp dụng hàng loạt</em>
    </MenuItem>
    {bulkActions.map(action => (
      <MenuItem key={action.value} value={action.value}>
        {action.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>



            <Button
              variant="contained"
              size="small"
              sx={{ minWidth:100 }}
              disabled={!bulkAction || !selectedIds.length}
              onClick={handleBulkAction}
            >
              Áp Dụng
            </Button>
            <FormControl size="small" sx={{ minWidth:180, mt:'-4px' }}>
              <InputLabel id="cat-filter">Danh mục</InputLabel>
              <Select
                labelId="cat-filter"
                value={selectedCategoryId}
                label="Danh mục"
                onChange={e => setSelectedCategoryId(e.target.value)}
                notched
              >
                <MuiMenuItem value="">Tất cả</MuiMenuItem>
                {categoryOptions.map(c => <MuiMenuItem key={c.id} value={c.id}>{c.name}</MuiMenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <TextField
            placeholder="Tìm kiếm..."
            size="small"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            sx={{ width:250 }}
          />
        </Box>
      </Box>

      {/* Table */}
      <Paper elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredProducts.length>0 && selectedIds.length===filteredProducts.length}
                  indeterminate={selectedIds.length>0 && selectedIds.length<filteredProducts.length}
                  onChange={e => toggleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Hành động</TableCell>
              <TableCell width={40}>Kéo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DndContext
              sensors={useSensors(useSensor(PointerSensor))}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredProducts.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredProducts.map(product => (
                  <SortableRow key={product.id} product={product}>
                    {({ listeners, attributes }) => (
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedIds.includes(product.id)}
                            onChange={() => toggleSelectOne(product.id)}
                          />
                        </TableCell>
                        <TableCell>{product.orderIndex}</TableCell>
                        <TableCell sx={{ position:'relative', width:60, height:60 }}>
                          <Avatar
                            variant="rounded"
                            src={getThumbnailUrl(product.thumbnail)}
                            alt={product.name}
                            sx={{ width:100, height:100 }}
                          />
                          <Chip
                            label={product.hasVariants?'Biến thể':'Đơn'}
                            color={product.hasVariants?'primary':'default'}
                            size="small"
                            sx={{
                              position:'absolute', top:'5px', left:'5px', fontWeight:'bold',
                              ...(!product.hasVariants && { backgroundColor:'#757575', color:'white' })
                            }}
                          />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category?.name||'Không rõ'}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.isActive?'Hoạt động':'Tạm tắt'}
                            color={product.isActive?'success':'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{product.slug}</TableCell>
                        <TableCell>
                          <IconButton onClick={e => handleMenuOpen(e, product)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <span
                            {...listeners}
                            {...attributes}
                            style={{ cursor:'grab', fontSize:20, userSelect:'none', display:'flex', justifyContent:'center' }}
                            title="Kéo để sắp xếp"
                          >
                            ☰
                          </span>
                        </TableCell>
                      </>
                    )}
                  </SortableRow>
                ))}
              </SortableContext>
            </DndContext>
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
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
    open
    onClose={handleMenuClose}
    anchorReference="anchorPosition"
    anchorPosition={menuPosition}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    PaperProps={{ sx: { minWidth: 140, p: 1 } }}
  >
    {filter === 'deleted' ? (
      <>
        <MenuItem
          onClick={async () => {
            await handleRestore(menuProduct.id, menuProduct.name);
            handleMenuClose();
          }}
        >
          Khôi phục
        </MenuItem>
        <MenuItem
          onClick={async () => {
            await handleForceDelete(menuProduct.id, menuProduct.name);
            handleMenuClose();
          }}
        >
          Xoá vĩnh viễn
        </MenuItem>
      </>
    ) : (
      <>
        <MenuItem
          onClick={() => {
            window.location.href = `/admin/products/edit/${menuProduct.id}`;
            handleMenuClose();
          }}
        >
          Sửa
        </MenuItem>
        <MenuItem
          onClick={async () => {
            await handleDeleteOne(menuProduct.id, menuProduct.name);
            handleMenuClose();
          }}
        >
          Chuyển vào thùng rác
        </MenuItem>
      </>
    )}
  </Menu>
)}


      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <MUIPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
}
