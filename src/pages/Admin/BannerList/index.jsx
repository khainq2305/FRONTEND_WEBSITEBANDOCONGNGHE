import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchInput from 'components/common/SearchInput';
import Pagination from 'components/common/Pagination';

import BannerTable from './BannerTable/BannerTable';

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
    image: 'https://thietkehaithanh.com/wp-content/uploads/2022/09/banner-cong-nghe-thietkehaithanh.jpg',
    status: 'hidden',
    createdAt: '2025-05-05'
  },
  {
    id: 3,
    name: 'Banner Giảm giá đặc biệt',
    status: 'trash',
    image: 'https://intphcm.com/data/upload/banner-la-gi.jpg',
    createdAt: '2025-04-20'
  },
];

const BannerList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [banners] = useState(mockBanners);

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const itemsPerPage = 5;

  const filteredBanners = banners.filter(
    (banner) => banner.name.toLowerCase().includes(search.toLowerCase()) &&
                (status === '' || banner.status === status)
  );
  
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const paginatedBanners = filteredBanners.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === paginatedBanners.length ? [] : paginatedBanners.map((b) => b.id)
    );
  };

  // 👇 Đặt trong BannerList, sau khi có access tới banners
  const statusTabs = [
    { value: '', label: `Tất cả` },
    { value: 'active', label: `Hiển thị` },
    { value: 'hidden', label: `Ẩn` },
    { value: 'trash', label: `Thùng rác` }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />

      {/* Header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>QUẢN LÝ BANNER</Typography>
        <Button variant="contained" onClick={() => navigate('/admin/banners/add')}>
          + Thêm Banner
        </Button>
      </Box>

      {/* Tabs and search bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee' }}>
          {statusTabs.map((tab) => {
            const count = tab.value === '' ? banners.length : banners.filter((b) => b.status === tab.value).length;
            return (
              <Box
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                sx={{
                  pb: 1, px: 1, cursor: 'pointer',
                  borderBottom: status === tab.value ? '2px solid blue' : '2px solid transparent',
                  color: status === tab.value ? 'blue' : 'black',
                  fontWeight: status === tab.value ? 600 : 400,
                  fontSize: 15, userSelect: 'none'
                }}
              >
                {tab.label} ({count})
              </Box>
            );
          })}
        </Box>
        <Box sx={{ maxWidth: 240, mt: { xs: 2, sm: 0 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      {/* Controls row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Hành động</InputLabel>
          <Select
            value={bulkAction}
            label="Hành động"
            onChange={(e) => setBulkAction(e.target.value)}
          >
            {status !== 'trash' && <MenuItem value="trash">Chuyển vào thùng rác</MenuItem>}
            {status === 'trash' && <MenuItem value="restore">Khôi phục</MenuItem>}
            {status === 'trash' && <MenuItem value="delete">Xóa vĩnh viễn</MenuItem>}
          </Select>
        </FormControl>
        <Button variant="contained" >
          Thực Hiện
        </Button>

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filterStatus}
            label="Trạng thái"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="active">Hiển thị</MenuItem>
            <MenuItem value="hidden">Ẩn</MenuItem>
            <MenuItem value="trash">Đã xoá</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <BannerTable
        banners={paginatedBanners}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        navigate={navigate}
        onDelete={(b) => {
          console.log('Xóa banner:', b);
        }}
      />

      {/* Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination currentPage={page} totalPages={totalPages || 1} onPageChange={setPage} />
      </Box>
    </Box>
  );
};

export default BannerList;
