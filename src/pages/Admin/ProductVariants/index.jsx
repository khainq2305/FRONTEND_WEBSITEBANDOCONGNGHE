import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Menu,
  Tabs,
  Tab,
  TextField,
  Select,
  FormControl,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link, useNavigate } from 'react-router-dom';
import { variantService } from '../../../services/admin/variantService';
import MUIPagination from '../../../components/common/Pagination';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../components/Admin/LoaderVip';
import 'react-toastify/dist/ReactToastify.css';
import HighlightText from '../../../components/Admin/HighlightText';
import Breadcrumb from '../../../components/common/Breadcrumb';

import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
const VariantList = () => {
  const [variants, setVariants] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [tab, setTab] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isAllSelected = variants.length > 0 && selectedIds.length === variants.length;
  const navigate = useNavigate();
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    trash: 0
  });

  const getTypeLabel = (type) => {
    switch (type) {
      case 'color':
        return 'Màu sắc';
      case 'text':
        return 'Chữ';
      default:
        return type;
    }
  };
  const getTypeColor = (type) => {
    switch (type) {
      case 'color':
        return 'success';
      case 'text':
        return 'default';
      default:
        return 'default';
    }
  };

  const fetchVariants = async (page = 1, perPage = itemsPerPage) => {
    setIsLoading(true);
    try {
      const query = { page, limit: perPage };
      if (tab === 'trash') query.deleted = 'true';
      else if (tab === 'active') query.status = 'true';
      else if (tab === 'inactive') query.status = 'false';
      if (searchKeyword.trim()) query.keyword = searchKeyword.trim();

      const res = await variantService.getVariants(query);
      setVariants(res.data.data);
      setTotalItems(res.data.total);
      setCurrentPage(res.data.currentPage);
      setTabCounts({
        all: res.data.total || 0,
        active: res.data.totalActive || 0,
        inactive: res.data.totalInactive || 0,
        trash: res.data.totalTrash || 0
      });
    } catch (err) {
      console.error('Lỗi khi lấy variant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      fetchVariants(1, itemsPerPage);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchKeyword]);

  useEffect(() => {
    fetchVariants(currentPage, itemsPerPage);
  }, [currentPage, tab, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

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
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchVariants(1, itemsPerPage);
  };

  const handleSelectAll = (event) => {
    setSelectedIds(event.target.checked ? variants.map((item) => item.id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleEdit = (id) => {
    const variant = variants.find(v => v.id === id);
    if (!variant) return;
    navigate(`/admin/product-variants/edit/${variant.slug}`);
  };
  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) {
      toast.info('Vui lòng chọn hành động và ít nhất một thuộc tính.');
      return;
    }
    const labelMap = {
      trash: 'chuyển vào thùng rác',
      delete: 'xoá vĩnh viễn',
      restore: 'khôi phục'
    };

    const confirmText = `${selectedIds.length} thuộc tính đã chọn sẽ được ${labelMap[bulkAction]}. ${bulkAction === 'delete' ? 'Tất cả giá trị con của thuộc tính này cũng sẽ bị xoá vĩnh viễn.' : ''}`;
    const confirm = await confirmDelete(confirmText);
    if (!confirm) return;

    setIsLoading(true);
    let shouldFetchManually = true;

    try {
      let apiResponse;

      if (bulkAction === 'trash') {
        apiResponse = await variantService.softDeleteMany(selectedIds);
        toast.success(apiResponse?.data?.message || `Đã ${labelMap[bulkAction]} ${selectedIds.length} thuộc tính.`);
      } else if (bulkAction === 'delete') {
        apiResponse = await variantService.forceDeleteMany(selectedIds);

        if (apiResponse && apiResponse.status === 207) {
          toast.warning(apiResponse.data.message);
        } else {
          toast.success(apiResponse?.data?.message || `Đã ${labelMap[bulkAction]} thành công.`);
        }
      } else if (bulkAction === 'restore') {
        apiResponse = await variantService.restoreMany(selectedIds);
        toast.success(apiResponse?.data?.message || `Đã ${labelMap[bulkAction]} ${selectedIds.length} thuộc tính.`);
        if (tab === 'trash') {
          setTab('all');
          setCurrentPage(1);
          shouldFetchManually = false;
        }
      }

      if (shouldFetchManually) {
        setCurrentPage(1);
        await fetchVariants(1);
      }
    } catch (error) {
      const backendMessage = error?.response?.data?.message;

      if (error.response && error.response.status === 409) {
        toast.warning(backendMessage || 'Một hoặc nhiều thuộc tính đang được sử dụng, không thể xoá vĩnh viễn.');
      } else {
        toast.error(backendMessage || `Lỗi khi ${labelMap[bulkAction]}!`);
      }
      console.error('Lỗi áp dụng hành động:', backendMessage || error.message);
    } finally {
      setIsLoading(false);
      setSelectedIds([]);
      setBulkAction('');
    }
  };

  const handleSingleAction = async (action) => {
    handleMenuClose();
    const item = variants.find((v) => v.id === selectedVariantId);
    let confirmResult = true;

    if (action === 'trash') {
      confirmResult = await confirmDelete(`chuyển "${item?.name || 'thuộc tính này'}" vào thùng rác`);
    } else if (action === 'delete') {
      confirmResult = await confirmDelete(`xoá vĩnh viễn "${item?.name || 'thuộc tính này'}". Tất cả giá trị con cũng sẽ bị xoá.`);
    }
    if (!confirmResult) return;


    setIsLoading(true);
    let shouldFetchManually = true;
    try {
      let apiResponse;
      if (action === 'trash') {
        apiResponse = await variantService.softDelete(selectedVariantId);
        toast.success(apiResponse?.data?.message || `Đã chuyển "${item?.name}" vào thùng rác.`);
      } else if (action === 'delete') {
        apiResponse = await variantService.forceDelete(selectedVariantId);
        toast.success(apiResponse?.data?.message || `Đã xoá vĩnh viễn "${item?.name}".`);
      } else if (action === 'restore') {
        apiResponse = await variantService.restore(selectedVariantId);
        toast.success(apiResponse?.data?.message || `Đã khôi phục "${item?.name}".`);
        if (tab === 'trash') {
          setTab('all');
          setCurrentPage(1);
          shouldFetchManually = false;
        }
      }

      if (shouldFetchManually) {
        setCurrentPage(1);
        await fetchVariants(1);
      }

    } catch (error) {
      const backendMessage = error?.response?.data?.message;

      if (error.response && error.response.status === 409) {
        toast.warning(backendMessage || `Thuộc tính "${item?.name}" đang được sử dụng, không thể xoá vĩnh viễn.`);
      } else {
        toast.error(backendMessage || 'Lỗi thao tác!');
      }
      console.error('Lỗi thao tác:', backendMessage || error.message);
    } finally {
      setIsLoading(false);

      setSelectedVariantId(null);
    }
  };

  return (
    <>
      {isLoading && <LoaderAdmin fullscreen />}
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Thuộc tính sản phẩm' }
        ]}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Danh sách thuộc tính
        </Typography>
        <Button component={Link} to="/admin/product-variants/create" variant="contained" color="primary" disabled={isLoading}>
          Thêm mới
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} TabIndicatorProps={{ style: { display: 'none' } }} sx={{ mb: 1 }}>
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
                '&.Mui-selected': { color: '#ffffff !important' },
                '&:hover': {
                  bgcolor: tab === item.value ? '#1a73e8' : '#f1f1f1'
                }
              }}
            />
          ))}
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
                    delete: 'Xoá vĩnh viễn'
                  };
                  return selected ? labelMap[selected] : 'Hành động hàng loạt';
                }}
                sx={{ width: 180 }}
                MenuProps={{ disablePortal: true, PaperProps: { style: { zIndex: 1400 } } }}
              >
                {tab === 'trash'
                  ? [
                    <MenuItem key="restore" value="restore">
                      Khôi phục
                    </MenuItem>,
                    <MenuItem key="delete" value="delete">
                      Xoá vĩnh viễn
                    </MenuItem>
                  ]
                  : [
                    <MenuItem key="trash" value="trash">
                      Chuyển vào thùng rác
                    </MenuItem>
                  ]}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleBulkAction} disabled={!bulkAction || selectedIds.length === 0 || isLoading}>
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
              disabled={isLoading}
            />
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={isLoading} />
              </TableCell>
              <TableCell align="center">STT</TableCell>

              <TableCell>Tên</TableCell>
              <TableCell>Kiểu</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.length === 0 && !isLoading ? (
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
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell align="center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>

                  <TableCell>
                    <HighlightText text={item.name} highlight={searchKeyword} />
                  </TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(item.type)} size="small" color={getTypeColor(item.type)} />
                  </TableCell>
                  <TableCell>{item.slug}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.values?.length > 0 ? item.values.map((v) => v.value).join(', ') : '—'}
                    </Typography>


                    {item.deletedAt ? (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: 13,
                            color: 'text.disabled',
                            textDecoration: 'none',
                            cursor: 'not-allowed',
                          }}
                        >
                          Cấu hình
                        </Typography>

                        <Tooltip title="Thuộc tính này đã ở trong thùng rác. Vui lòng khôi phục để cấu hình.">
                          <InfoIcon
                            color="action"
                            sx={{
                              fontSize: '16px',
                              ml: 0.5,
                              verticalAlign: 'middle',
                              cursor: 'help',
                            }}
                          />
                        </Tooltip>
                      </>
                    ) : (

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
                      label={tab === 'trash' ? 'Đã xóa' : item.isActive ? 'Hoạt động' : 'Tạm tắt'}
                      size="small"
                      color={tab === 'trash' ? 'error' : item.isActive ? 'success' : 'default'}
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

      {Math.ceil(totalItems / itemsPerPage) > 1 && !isLoading && (
        <MUIPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </>
  );
};
export default VariantList;
