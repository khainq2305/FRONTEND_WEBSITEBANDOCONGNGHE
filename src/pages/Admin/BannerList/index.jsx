// BannerList.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const mockBanners = [
  {
    id: 1,
    name: 'Banner Khuyến mãi mùa hè',
    image: 'https://th.bing.com/th/id/R.1f96a356192f7ed4f594cc9a52e9271a?rik=Q21fHQE3lx5oPA&pid=ImgRaw&r=0',
    status: 'active',
    createdAt: '2025-05-01'
  },
  {
    id: 2,
    name: 'Banner Flash Sale',
    image: 'https://th.bing.com/th/id/R.1f96a356192f7ed4f594cc9a52e9271a?rik=Q21fHQE3lx5oPA&pid=ImgRaw&r=0',
    status: 'hidden',
    createdAt: '2025-05-05'
  },
  {
    id: 3,
    name: 'Banner Giảm giá đặc biệt',
    image: 'https://th.bing.com/th/id/R.1f96a356192f7ed4f594cc9a52e9271a?rik=Q21fHQE3lx5oPA&pid=ImgRaw&r=0',
    status: 'trash',
    createdAt: '2025-04-20'
  }
];

const MoreActionsMenu = ({ actions }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {actions.map((action, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              handleClose();
              action.onClick();
            }}
            sx={{ color: action.color === 'error' ? 'red' : 'inherit' }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const BannerList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [banners, setBanners] = useState(mockBanners);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [bannerToUpdate, setBannerToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  const navigate = useNavigate();
  const itemsPerPage = 5;

  const filteredBanners = banners.filter(
    (banner) =>
      banner.name.toLowerCase().includes(search.toLowerCase()) &&
      (status === '' || banner.status === status)
  );
  const paginatedBanners = filteredBanners.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  // 👇 Tính số lượng theo từng trạng thái
  const totalCount = banners.length;
  const activeCount = banners.filter((b) => b.status === 'active').length;
  const hiddenCount = banners.filter((b) => b.status === 'hidden').length;
  const trashCount = banners.filter((b) => b.status === 'trash').length;

  // 👇 Đặt trong BannerList, sau khi có access tới banners
  const statusTabs = [
    { value: '', label: `Tất cả (${totalCount})` },
    { value: 'active', label: `Hiển thị (${activeCount})` },
    { value: 'hidden', label: `Ẩn (${hiddenCount})` },
    { value: 'trash', label: `Thùng rác (${trashCount})` }
  ];
  
  const getStatusChip = (status) => {
    const map = {
      active: ['Hiển thị', 'success'],
      hidden: ['Ẩn', 'default'],
      trash: ['Thùng rác', 'error']
    };
    const [label, color] = map[status] || [status, 'default'];
    return <Chip label={label} color={color} size="small" />;
  };

  const openUpdateStatusDialog = (banner) => {
    setBannerToUpdate(banner);
    setNewStatus(banner.status);
    setOpenUpdateStatus(true);
  };

  const closeUpdateStatusDialog = () => {
    setOpenUpdateStatus(false);
    setBannerToUpdate(null);
  };

  const submitUpdateStatus = () => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === bannerToUpdate.id ? { ...banner, status: newStatus } : banner
      )
    );
    toast.success(`Đã cập nhật trạng thái banner "${bannerToUpdate.name}" thành "${newStatus}"`);
    closeUpdateStatusDialog();
  };

  const openDeleteBannerDialog = (banner) => {
    setBannerToDelete(banner);
    setOpenDeleteDialog(true);
  };

  const closeDeleteBannerDialog = () => {
    setOpenDeleteDialog(false);
    setBannerToDelete(null);
  };

  const submitDeleteBanner = () => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === bannerToDelete.id ? { ...banner, status: 'trash' } : banner
      )
    );
    toast.success(`Đã chuyển banner "${bannerToDelete.name}" vào thùng rác`);
    closeDeleteBannerDialog();
  };

  const restoreBanner = (banner) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, status: 'active' } : b))
    );
    toast.success(`Đã khôi phục banner "${banner.name}"`);
  };

  const permanentlyDeleteBanner = (banner) => {
    setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    toast.success(`Đã xóa vĩnh viễn banner "${banner.name}"`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <ToastContainer />
      <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee', mb: 2 }}>
        {statusTabs.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            sx={{
              pb: 1,
              px: 1,
              cursor: 'pointer',
              borderBottom: status === tab.value ? '2px solid red' : '2px solid transparent',
              color: status === tab.value ? 'red' : 'black',
              fontWeight: status === tab.value ? 600 : 400,
              fontSize: 15
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <SearchInput placeholder="Tìm tên banner..." value={search} onChange={setSearch} />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên banner</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBanners.length > 0 ? (
              paginatedBanners.map((banner, idx) => (
                <TableRow key={banner.id}>
                  <TableCell>{(page - 1) * itemsPerPage + idx + 1}</TableCell>
                  <TableCell>{banner.name}</TableCell>
                  <TableCell>
                    <img src={banner.image} alt={banner.name} style={{ width: 120, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                  </TableCell>
                  <TableCell>{getStatusChip(banner.status)}</TableCell>
                  <TableCell>{banner.createdAt}</TableCell>
                  <TableCell align="right">
                    <MoreActionsMenu
                      actions={
                        banner.status === 'trash'
                          ? [
                              {
                                label: 'Khôi phục',
                                onClick: () => restoreBanner(banner)
                              },
                              {
                                label: 'Xóa vĩnh viễn',
                                onClick: () => permanentlyDeleteBanner(banner),
                                color: 'error'
                              }
                            ]
                          : [
                              {
                                label: 'Xem chi tiết',
                                onClick: () => navigate(`/admin/banners/${banner.id}`)
                              },
                              {
                                label: 'Cập nhật trạng thái',
                                onClick: () => openUpdateStatusDialog(banner)
                              },
                              {
                                label: 'Xóa tạm thời',
                                onClick: () => openDeleteBannerDialog(banner),
                                color: 'error'
                              }
                            ]
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có banner phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Pagination
          page={page}
          count={Math.ceil(filteredBanners.length / itemsPerPage)}
          onChange={(e, val) => setPage(val)}
        />
      </Box>

      {/* Dialog cập nhật trạng thái */}
      <Dialog open={openUpdateStatus} onClose={closeUpdateStatusDialog}>
        <DialogTitle>Cập nhật trạng thái banner</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Banner: {bannerToUpdate?.name}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="select-status-label">Trạng thái</InputLabel>
            <Select
              labelId="select-status-label"
              value={newStatus}
              label="Trạng thái"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <SelectMenuItem value="active">Hiển thị</SelectMenuItem>
              <SelectMenuItem value="hidden">Ẩn</SelectMenuItem>
              <SelectMenuItem value="trash">Thùng rác</SelectMenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateStatusDialog}>Hủy</Button>
          <Button variant="contained" onClick={submitUpdateStatus}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xóa tạm thời */}
      <Dialog open={openDeleteDialog} onClose={closeDeleteBannerDialog}>
        <DialogTitle>Xác nhận xóa banner</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn chuyển banner <strong>{bannerToDelete?.name}</strong> vào thùng rác không?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteBannerDialog}>Không</Button>
          <Button variant="contained" color="error" onClick={submitDeleteBanner}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerList;
