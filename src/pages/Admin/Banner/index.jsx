import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  FormControl,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Checkbox,
  Menu,
  Chip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';

import { sliderService } from '../../../services/admin/sliderService';
import MUIPagination from '../../../components/common/Pagination';
import LoaderAdmin from '../../../components/common/Loader';
import HighlightText from '../../../components/Admin/HighlightText';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import Breadcrumb from '../../../components/common/Breadcrumb';

const BannerList = () => {
  const [tab, setTab] = useState('all'); // all | active | inactive
  const [banners, setBanners] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const isAllSelected = displayed.length > 0 && selectedIds.length === displayed.length;
  const imageSizeMap = {
    topbar: { width: 200, height: 40 },
    'slider-main': { width: 300, height: 120 },
    'slider-side': { width: 150, height: 150 },
    'mid-poster': { width: 200, height: 100 },
    'slider-footer': { width: 300, height: 80 }
  };
  const BANNER_TYPES = [
    { value: 'topbar', label: 'Topbar' },
    { value: 'slider-main', label: 'Slider chính' },
    { value: 'slider-side', label: '3 ảnh bên slider' },
    { value: 'mid-poster', label: '6 poster giữa trang' },
    { value: 'slider-footer', label: 'Slider cuối trang' },
    { value: 'category-banner', label: 'Banner danh mục' },
    { value: 'product-banner', label: 'Banner sản phẩm' },
    { value: 'popup-banner', label: 'Popup nổi' },
    { value: 'banner-left-right', label: 'Banner trái/phải' }
  ];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBanners(searchKeyword.trim());
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchKeyword, tab, typeFilter, currentPage]);

  const fetchBanners = async (search = searchKeyword.trim()) => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search
      };

      if (tab === 'active') params.isActive = '1';
      else if (tab === 'inactive') params.isActive = '0';

      if (typeFilter) params.type = typeFilter;

      const res = await sliderService.list(params);
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      const pagination = res?.data?.pagination || {};

      setBanners(data);
      setDisplayed(data);
      setTypeOptions([...new Set(data.map((b) => b.type).filter(Boolean))]);
      setTotalItems(pagination.totalItems || data.length);

      if (currentPage > Math.ceil((pagination.totalItems || data.length) / itemsPerPage)) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách banner:', err);
      setBanners([]);
      setDisplayed([]);
      setTypeOptions([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_e, newTab) => {
    setTab(newTab);
    setCurrentPage(1);
    setSearchKeyword('');
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBanners(searchKeyword.trim());
  };

  const handleSelectAll = (e) => setSelectedIds(e.target.checked ? displayed.map((b) => b.id) : []);

  const handleSelectOne = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleMenuOpen = (e, id) => {
    setAnchorEl(e.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleSingleDelete = async () => {
    handleMenuClose();
    if (!selectedRowId) return;

    const item = banners.find((b) => b.id === selectedRowId);
    const ok = await confirmDelete(`Xoá vĩnh viễn banner "${item.title}"?`);
    if (!ok) return;

    try {
      setIsLoadingAction(true);
      await sliderService.delete(selectedRowId);
      toast.success('Đã xoá banner');
      fetchBanners();
    } catch (err) {
      console.error('Lỗi xoá:', err);
      toast.error('Xoá thất bại');
    } finally {
      setIsLoadingAction(false);
      setSelectedIds([]);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || !selectedIds.length) return;

    const ok = await confirmDelete(`Xoá vĩnh viễn ${selectedIds.length} banner?`);
    if (!ok) return;

    try {
      setIsLoadingAction(true);
      await sliderService.deleteMany(selectedIds);
      toast.success(`Đã xoá ${selectedIds.length} banner`);
      fetchBanners();
    } catch (err) {
      console.error('Lỗi bulk delete:', err);
      toast.error('Xoá hàng loạt thất bại');
    } finally {
      setIsLoadingAction(false);
      setSelectedIds([]);
      setBulkAction('');
    }
  };

  return (
    <>
      {(loading || isLoadingAction) && <LoaderAdmin fullscreen />}
      <Box sx={{ mb: 2 }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/admin' },
            { label: 'Danh sách banner', href: '/admin/banners' }
          ]}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Danh sách Banner
        </Typography>
        <Button component={Link} to="/admin/banners/create" variant="contained" disabled={loading || isLoadingAction}>
          Thêm mới
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }} TabIndicatorProps={{ style: { display: 'none' } }}>
          {[
            { label: 'Tất cả', value: 'all' },
            { label: 'Hoạt động', value: 'active' },
            { label: 'Tạm tắt', value: 'inactive' }
          ].map((t) => (
            <Tab
              key={t.value}
              value={t.value}
              label={t.label}
              disableRipple
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 8,
                px: 2.5,
                py: 1,
                minHeight: 36,
                mr: 1,
                bgcolor: tab === t.value ? '#1a73e8' : 'transparent',
                color: tab === t.value ? '#fff' : '#000',
                '&.Mui-selected': {
                  color: '#fff'
                },
                '&:hover': {
                  bgcolor: tab === t.value ? '#1a73e8' : '#f5f5f5'
                }
              }}
            />
          ))}
        </Tabs>

        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              displayEmpty
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              renderValue={(val) => (val ? 'Xoá vĩnh viễn' : 'Hành động hàng loạt')}
              disabled={loading || isLoadingAction || !displayed.length}
            >
              <MenuItem value="delete">Xoá vĩnh viễn</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleBulkAction}
            disabled={!bulkAction || !selectedIds.length || loading || isLoadingAction}
          >
            Áp dụng
          </Button>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              displayEmpty
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              renderValue={(val) => {
                const found = BANNER_TYPES.find((opt) => opt.value === val);
                return found?.label || 'Tất cả loại';
              }}
              disabled={loading || isLoadingAction}
            >
              <MenuItem value="">
                <em>Tất cả loại</em>
              </MenuItem>
              {BANNER_TYPES.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box ml="auto" display="flex" alignItems="center" gap={1}>
            <TextField
              size="small"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 300 }}
              disabled={loading || isLoadingAction}
            />
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={isAllSelected} onChange={handleSelectAll} disabled={loading || isLoadingAction || !displayed.length} />
                </TableCell>
                <TableCell align="center">STT</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Thứ tự</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có banner nào.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((b, idx) => (
                  <TableRow key={b.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(b.id)}
                        onChange={() => handleSelectOne(b.id)}
                        disabled={loading || isLoadingAction}
                      />
                    </TableCell>
                    <TableCell align="center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      {(() => {
                        const size = b.imageSize || { width: 80, height: 80 };
                        return (
                          <img
                            src={b.imageUrl || ''}
                            alt={b.altText || 'Banner'}
                            width={size.width}
                            height={size.height}
                            style={{ borderRadius: 4, objectFit: 'cover' }}
                          />
                        );
                      })()}
                    </TableCell>

                    <TableCell>
                      <HighlightText text={b.title || '-'} highlight={searchKeyword.trim()} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color="primary"
                        label={
                          {
                            topbar: 'Topbar',
                            'slider-main': 'Slider chính',
                            'slider-side': '3 ảnh bên slider',
                            'mid-poster': ' poster giữa trang',
                            'slider-footer': 'Slider cuối trang',
                            'product-banner': 'Banner sản phẩm',
                            'category-banner': 'Banner danh mục',
                            'popup-banner': 'Popup',
                            'banner-left-right': 'Banner hai bên'
                          }[b.type] || b.type
                        }
                      />
                    </TableCell>
                    <TableCell>{b.displayOrder}</TableCell>
                    <TableCell>
                      {b.isActive ? <Chip label="Hoạt động" size="small" color="success" /> : <Chip label="Tạm tắt" size="small" />}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, b.id)} disabled={loading || isLoadingAction}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={Link}
          to={`/admin/banners/edit/${banners.find((b) => b.id === selectedRowId)?.slug}`}
          onClick={handleMenuClose}
        >
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleSingleDelete}>Xoá</MenuItem>
      </Menu>

      {!loading && totalItems > itemsPerPage && (
        <Box mt={2} display="flex" justifyContent="center">
          <MUIPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        </Box>
      )}
    </>
  );
};

export default BannerList;
