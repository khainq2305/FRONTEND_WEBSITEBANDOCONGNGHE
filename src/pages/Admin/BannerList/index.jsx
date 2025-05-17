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
  TextField,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchInput from 'components/common/SearchInput'; 
import Pagination from 'components/common/Pagination'; 
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock dữ liệu
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

// Component menu cho hành động (MoreActionsMenu)
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

  // Dialog thêm banner mới
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newBannerName, setNewBannerName] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerStatus, setNewBannerStatus] = useState('active');

  const navigate = useNavigate();
  const itemsPerPage = 5;

  // Lọc banner theo search và status
  const filteredBanners = banners.filter(
    (banner) => banner.name.toLowerCase().includes(search.toLowerCase()) && (status === '' || banner.status === status)
  );

  // Tổng số trang dựa trên filteredBanners
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  // Reset page nếu page hiện tại vượt quá totalPages sau mỗi lần filteredBanners thay đổi
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  // Reset page về 1 khi search hoặc status thay đổi
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  // Lấy danh sách banner hiển thị trang hiện tại
  const paginatedBanners = filteredBanners.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Đếm số lượng theo trạng thái
  const totalCount = banners.length;
  const activeCount = banners.filter((b) => b.status === 'active').length;
  const hiddenCount = banners.filter((b) => b.status === 'hidden').length;
  const trashCount = banners.filter((b) => b.status === 'trash').length;

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

  // Các hàm dialog cập nhật trạng thái
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
    setBanners((prev) => prev.map((banner) => (banner.id === bannerToUpdate.id ? { ...banner, status: newStatus } : banner)));
    toast.success(`Đã cập nhật trạng thái banner "${bannerToUpdate.name}" thành "${newStatus}"`);
    closeUpdateStatusDialog();
  };

  // Dialog xóa tạm thời
  const openDeleteBannerDialog = (banner) => {
    setBannerToDelete(banner);
    setOpenDeleteDialog(true);
  };
  const closeDeleteBannerDialog = () => {
    setOpenDeleteDialog(false);
    setBannerToDelete(null);
  };
  const submitDeleteBanner = () => {
    setBanners((prev) => prev.map((banner) => (banner.id === bannerToDelete.id ? { ...banner, status: 'trash' } : banner)));
    toast.success(`Đã chuyển banner "${bannerToDelete.name}" vào thùng rác`);
    closeDeleteBannerDialog();
  };

  // Khôi phục banner
  const restoreBanner = (banner) => {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, status: 'active' } : b)));
    toast.success(`Đã khôi phục banner "${banner.name}"`);
  };

  // Xóa vĩnh viễn banner
  const permanentlyDeleteBanner = (banner) => {
    setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    toast.success(`Đã xóa vĩnh viễn banner "${banner.name}"`);
  };

  // Dialog thêm banner mới
  const openAddBannerDialog = () => {
    setNewBannerName('');
    setNewBannerImage('');
    setNewBannerStatus('active');
    setOpenAddDialog(true);
  };
  const closeAddBannerDialog = () => setOpenAddDialog(false);
  const submitAddBanner = () => {
    if (!newBannerName.trim()) {
      toast.error('Tên banner không được để trống');
      return;
    }
    if (!newBannerImage.trim()) {
      toast.error('URL hình ảnh không được để trống');
      return;
    }
    const newId = banners.length ? Math.max(...banners.map((b) => b.id)) + 1 : 1;
    const newBanner = {
      id: newId,
      name: newBannerName,
      image: newBannerImage,
      status: newBannerStatus,
      createdAt: new Date().toISOString().slice(0, 10) // yyyy-mm-dd
    };
    setBanners((prev) => [newBanner, ...prev]);
    toast.success(`Đã thêm banner "${newBannerName}"`);
    setOpenAddDialog(false);
  };
  // Xử lý phân trang khi user chọn page mới
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  return (
    <Box sx={{ p: 2 }}>
      <ToastContainer />

      {/* Tabs trạng thái */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid #eee',
          mb: 2
        }}
      >
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

      {/* Search và nút thêm mới */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
          <SearchInput placeholder="Tìm tên banner..." value={search} onChange={setSearch} />
        </Box>
        <Button variant="contained" onClick={openAddBannerDialog} sx={{ ml: 2, whiteSpace: 'nowrap' }}>
          Thêm banner mới
        </Button>
      </Box>

      {/* Bảng danh sách banner */}
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
                    <img src={banner.image} alt={banner.name} width={120} style={{ borderRadius: 8 }} />
                  </TableCell>
                  <TableCell>{getStatusChip(banner.status)}</TableCell>
                  <TableCell>{banner.createdAt}</TableCell>
                  <TableCell align="right">
                    {/* Các hành động theo trạng thái */}
                    {banner.status === 'trash' ? (
                      <>
                        <Button size="small" onClick={() => restoreBanner(banner)} sx={{ mr: 1 }} variant="outlined">
                          Khôi phục
                        </Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => permanentlyDeleteBanner(banner)}>
                          Xóa vĩnh viễn
                        </Button>
                      </>
                    ) : (
                      <MoreActionsMenu
                        actions={[
                          {
                            label: 'Sửa banner',
                            onClick: () => navigate(`/admin/banner/${banner.id}`)
                          },
                          {
                            label: 'Cập nhật trạng thái',
                            onClick: () => openUpdateStatusDialog(banner)
                          },
                          {
                            label: 'Xóa tạm thời',
                            color: 'error',
                            onClick: () => openDeleteBannerDialog(banner)
                          }
                        ]}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có banner phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
      </Box>

      {/* Dialog cập nhật trạng thái */}
      <Dialog open={openUpdateStatus} onClose={closeUpdateStatusDialog}>
        <DialogTitle>Cập nhật trạng thái banner</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Banner: <strong>{bannerToUpdate?.name}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Trạng thái</InputLabel>
            <Select labelId="status-select-label" value={newStatus} label="Trạng thái" onChange={(e) => setNewStatus(e.target.value)}>
              <MenuItem value="active">Hiển thị</MenuItem>
              <MenuItem value="hidden">Ẩn</MenuItem>
              <MenuItem value="trash">Thùng rác</MenuItem>
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
        <DialogTitle>Xác nhận xóa tạm thời</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn chuyển banner <strong>{bannerToDelete?.name}</strong> vào thùng rác?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteBannerDialog}>Hủy</Button>
          <Button variant="contained" color="error" onClick={submitDeleteBanner}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm banner mới */}
      <Dialog open={openAddDialog} onClose={closeAddBannerDialog}>
        <DialogTitle>Thêm banner mới</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}>
          <TextField label="Tên banner" value={newBannerName} onChange={(e) => setNewBannerName(e.target.value)} fullWidth />
          <TextField label="URL hình ảnh" value={newBannerImage} onChange={(e) => setNewBannerImage(e.target.value)} fullWidth />
          <FormControl fullWidth>
            <InputLabel id="new-banner-status-label">Trạng thái</InputLabel>
            <Select
              labelId="new-banner-status-label"
              value={newBannerStatus}
              label="Trạng thái"
              onChange={(e) => setNewBannerStatus(e.target.value)}
            >
              <MenuItem value="active">Hiển thị</MenuItem>
              <MenuItem value="hidden">Ẩn</MenuItem>
              <MenuItem value="trash">Thùng rác</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddBannerDialog}>Hủy</Button>
          <Button variant="contained" onClick={submitAddBanner}>
            Thêm mới
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerList;
