import React, { useEffect, useState } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Chip, IconButton, Menu,
  Tabs, Tab, TextField, Select, FormControl, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link, useNavigate } from 'react-router-dom';
import { variantService } from '../../../services/admin/variantService';
import MUIPagination from '../../../components/common/Pagination';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// THÊM IMPORT LOADER ADMIN CỦA BẠN
// Điều chỉnh đường dẫn này cho đúng với vị trí file LoaderAdmin.jsx của bạn
// Ví dụ: nếu file của bạn là src/components/common/Loader/index.jsx (export default LoaderAdmin)
// thì import có thể là: import LoaderAdmin from '../../common/Loader';
// Hoặc nếu file là src/components/common/LoaderAdmin.jsx:
import LoaderAdmin from '../../../components/Admin/LoaderVip';


const VariantList = () => {
  const [variants, setVariants] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [tab, setTab] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const isAllSelected = variants.length > 0 && selectedIds.length === variants.length;
  const navigate = useNavigate();

  // THÊM STATE CHO LOADER
  const [isLoading, setIsLoading] = useState(false);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'color': return 'Màu sắc';
      case 'image': return 'Hình ảnh';
      case 'text': return 'Chữ';
      default: return type;
    }
  };
  const getTypeColor = (type) => {
    switch (type) {
      case 'color': return 'success';
      case 'image': return 'info';
      case 'text': return 'default';
      default: return 'default';
    }
  };

  const fetchVariants = async (page = 1) => {
  setIsLoading(true);
  try {
    const query = {
      page,
      limit: itemsPerPage,
    };

    if (tab === 'trash') {
      query.deleted = 'true'; // ✅ dòng này phải đúng
    } else if (tab === 'active') {
      query.status = 'true';
    } else if (tab === 'inactive') {
      query.status = 'false';
    }

    if (searchKeyword.trim()) {
      query.keyword = searchKeyword.trim();
    }

    console.log('🟡 Query gửi lên variantService:', query);

    const res = await variantService.getVariants(query);
    setVariants(res.data.data);
    setTotalItems(res.data.total);
    setCurrentPage(res.data.currentPage);
  } catch (err) {
    console.error('❌ Lỗi khi lấy variant:', err);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchVariants(currentPage); // fetchVariants sẽ tự quản lý isLoading
    const validOptions = tab === 'trash' ? ['restore', 'delete'] : ['trash'];
    if (!validOptions.includes(bulkAction)) setBulkAction('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, tab, searchKeyword]);


  const handlePageChange = (page) => setCurrentPage(page);
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedVariantId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVariantId(null);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setCurrentPage(1);
    setSelectedIds([]);
    setBulkAction('');
    // fetchVariants sẽ được gọi bởi useEffect do 'tab' thay đổi
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchVariants(1); // fetchVariants sẽ tự quản lý isLoading
  };

  const handleSelectAll = (event) => {
    setSelectedIds(event.target.checked ? variants.map(item => item.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleEdit = (id) => {
    navigate(`/admin/product-variants/edit/${id}`);
  };

const handleBulkAction = async () => {
  if (!bulkAction || selectedIds.length === 0) return;

  const labelMap = {
    trash: 'chuyển vào thùng rác',
    delete: 'xoá vĩnh viễn',
    restore: 'khôi phục'
  };

  const confirm = await confirmDelete(`${selectedIds.length} mục đã chọn sẽ được ${labelMap[bulkAction]}`);
  if (!confirm) return;

  setIsLoading(true);
  let shouldFetchManually = true;

  try {
    if (bulkAction === 'trash') {
      await variantService.softDeleteMany(selectedIds);
      toast.success(`Đã ${labelMap[bulkAction]} ${selectedIds.length} thuộc tính.`);
    } else if (bulkAction === 'delete') {
      await variantService.forceDeleteMany(selectedIds);
      toast.success(`Đã ${labelMap[bulkAction]} ${selectedIds.length} thuộc tính.`);
    } else if (bulkAction === 'restore') {
      await variantService.restoreMany(selectedIds);
      toast.success(`Đã ${labelMap[bulkAction]} ${selectedIds.length} thuộc tính.`);
      if (tab === 'trash') {
        setTab('all');
        setCurrentPage(1);
        shouldFetchManually = false;
      }
    }

    if (shouldFetchManually) {
      await fetchVariants(1);
    }
  } catch (error) {
    toast.error(`Lỗi khi ${labelMap[bulkAction]}!`);
    console.error('Lỗi áp dụng hành động:', error);
  } finally {
    setIsLoading(false);
    setSelectedIds([]);
    setBulkAction('');
  }
};




const handleSingleAction = async (action) => {
  handleMenuClose();
  let itemToConfirm = null;

  if (action === 'trash' || action === 'delete') {
    itemToConfirm = variants.find(v => v.id === selectedVariantId);
    const confirm = await confirmDelete(itemToConfirm?.name || 'thuộc tính này');
    if (!confirm) return;
  }

  setIsLoading(true);
  try {
    if (action === 'trash') {
      await variantService.softDelete(selectedVariantId);
      toast.success('Đã chuyển vào thùng rác');
    } else if (action === 'delete') {
      await variantService.forceDelete(selectedVariantId);
      toast.success('Đã xoá vĩnh viễn');
    } else if (action === 'restore') {
      await variantService.restore(selectedVariantId);
      toast.success('Đã khôi phục');
      if (tab === 'trash') {
        setTab('all');
        setCurrentPage(1);
        return;
      }
    }

    await fetchVariants(1);
  } catch (error) {
    toast.error('❌ Lỗi thao tác');
    console.error("❌ Lỗi thao tác:", error);
  } finally {
    setIsLoading(false);
    setSelectedIds([]);
    setSelectedVariantId(null);
  }
};




  return (
    <>
      {/* HIỂN THỊ LOADER KHI isLoading LÀ TRUE */}
      {/* Component LoaderAdmin của bạn sẽ tự xử lý việc hiển thị full màn hình khi prop `fullscreen` là true */}
      {isLoading && <LoaderAdmin fullscreen={true} />}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Tất cả" value="all" />
          <Tab label="Hoạt động" value="active" />
          <Tab label="Tạm tắt" value="inactive" />
          <Tab label="Thùng rác" value="trash" />
        </Tabs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ zIndex: 1300 }}>
              <Select
                displayEmpty
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                renderValue={(selected) => {
                  const labelMap = {
                    trash: 'Chuyển vào thùng rác',
                    restore: 'Khôi phục',
                    delete: 'Xoá vĩnh viễn',
                  };
                  return selected ? labelMap[selected] : 'Hành động hàng loạt';
                }}
                sx={{ width: 180 }}
                MenuProps={{ disablePortal: true, PaperProps: { style: { zIndex: 1400 } } }}
              >
                {(tab === 'trash'
                  ? [<MenuItem key="restore" value="restore">Khôi phục</MenuItem>, <MenuItem key="delete" value="delete">Xoá vĩnh viễn</MenuItem>]
                  : [<MenuItem key="trash" value="trash">Chuyển vào thùng rác</MenuItem>]
                )}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedIds.length === 0 || isLoading} // Vô hiệu hóa khi đang loading
            >
              Áp dụng
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 300 }}
              disabled={isLoading} // Vô hiệu hóa khi đang loading
            />
            <Button
              component={Link}
              to="/admin/product-variants/create"
              variant="contained"
              color="primary"
              disabled={isLoading} // Vô hiệu hóa khi đang loading
            >
              Thêm mới
            </Button>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={isLoading}/>
              </TableCell>
              <TableCell>STT</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Kiểu</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.length === 0 && !isLoading ? ( // Chỉ hiển thị "Không có" nếu không phải đang loading
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có thuộc tính nào.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                      disabled={isLoading} // Vô hiệu hóa khi đang loading
                    />
                  </TableCell>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(item.type)} size="small" color={getTypeColor(item.type)} />
                  </TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.values?.length > 0 ? item.values.map(v => v.value).join(', ') : '—'}
                    </Typography>
                    {item.values?.length > 0 && (
                      <Typography
                        component={Link}
                        to={`/admin/product-variants/${item.id}/values`}
                        sx={{ fontSize: 13, color: 'primary.main', textDecoration: 'underline' }}
                      >
                        Cấu hình
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        tab === 'trash'
                          ? 'Đã xóa'
                          : item.isActive
                            ? 'Hoạt động'
                            : 'Tạm tắt'
                      }
                      size="small"
                      color={
                        tab === 'trash'
                          ? 'error'
                          : item.isActive
                            ? 'success'
                            : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, item.id)} disabled={isLoading}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {tab !== 'trash' ? (
            <>
              <MenuItem onClick={() => handleSingleAction('trash')}>Chuyển vào thùng rác</MenuItem>
              <MenuItem onClick={() => handleEdit(selectedVariantId)}>Sửa</MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={() => handleSingleAction('restore')}>Khôi phục</MenuItem>
              <MenuItem onClick={() => handleSingleAction('delete')}>Xoá vĩnh viễn</MenuItem>
            </>
          )}
        </Menu>
      </TableContainer>

      {totalItems > itemsPerPage && !isLoading && ( // Chỉ hiển thị pagination nếu không loading
        <MUIPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default VariantList;