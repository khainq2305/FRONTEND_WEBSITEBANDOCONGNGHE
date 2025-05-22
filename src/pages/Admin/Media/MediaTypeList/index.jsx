import { useEffect, useState } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Pagination from 'components/common/Pagination';
import MediaTable from '../MediaTable'; // Component đã tách riêng phần bảng

const mockData = [
  {
    id: 1,
    title: 'Popup Tết',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS42-ZAZ6zlLN_UcP2Wbb8YBek-Cea_gMnbWQ&s',
    type: 'popup',
    isActive: 1,
    orderIndex: 1,
    status: 'active'
  },
  {
    id: 1,
    title: 'Popup Tết',
    image: 'https://subiz.com/blog/wp-content/uploads/2020/02/Mask-Group.png',
    type: 'popup',
    isActive: 1,
    orderIndex: 1,
    status: 'hidden'
  },
  {
    id: 1,
    title: 'Popup Tết',
    image: 'https://images2.thanhnien.vn/zoom/686_429/Uploaded/nthanhluan/2022_03_14/picture12-152.png',
    type: 'popup',
    isActive: 1,
    orderIndex: 1,
    status: 'trash'
  },
  {
    id: 2,
    title: 'Slider Giới thiệu',
    images: [
      'https://st.download.com.vn/data/image/2022/03/28/Tech-Illustrated-Slides-slide-700.jpg',
      'https://iotlink.com.vn/wp-content/uploads/2023/06/Ban-do-so-Map4D-1024x684.png',
      'https://iotlink.com.vn/wp-content/uploads/2023/06/Ban-do-so-Map4D-voi-Big-Data-la-ban-dap-phat-trien-doanh-nghiep-trong-tuong-lai.jpg'
    ],
    type: 'slider',
    isActive: 0,
    orderIndex: 2,
    status: 'active'
  },
  {
    id: 2,
    title: 'Slider Giới thiệu',
    images: [
      'https://i.ytimg.com/vi/FaUXEKaaSAQ/maxresdefault.jpg',
      'https://9slide.vn/wp-content/uploads/2020/08/Download-4-Powerpoint-Template-Khoa-hoc-Cong-nghe.png',
      'https://marketplace.canva.com/EAEkIDG8gg0/1/0/800w/canva-xanh-d%C6%B0%C6%A1ng-c%C3%A1c-th%C3%A0nh-ph%E1%BA%A7n-c%C3%B9ng-k%C3%ADch-th%C6%B0%E1%BB%9Bc-%26-gi%E1%BA%A3-l%E1%BA%ADp-c%C3%B4ng-ngh%E1%BB%87-trong-gi%C3%A1o-d%E1%BB%A5c-b%E1%BA%A3n-thuy%E1%BA%BFt-tr%C3%ACnh-c%C3%B4ng-ngh%E1%BB%87-6CTvYO6rBJg.jpg'
    ],
    type: 'slider',
    isActive: 0,
    orderIndex: 2,
    status: 'hidden'
  },
  {
    id: 2,
    title: 'Slider Giới thiệu',
    images: [
      'https://bandotrangtri.vn/wp-content/uploads/2022/10/Ban-do-the-gioi.png',
      'https://autoppt.com/wp-content/uploads/2025/03/Common_Theme_Template_8.webp',
      'https://uix.vn/wp-content/uploads/2020/10/Slide34-10-780x439.png'
    ],
    type: 'slider',
    isActive: 0,
    orderIndex: 2,
    status: 'trash'
  },
  {
    id: 3,
    title: 'Banner Flash Sale',
    image: 'https://thietkehaithanh.com/wp-content/uploads/2022/09/banner-cong-nghe-thietkehaithanh.jpg',
    type: 'banner',
    isActive: 1,
    orderIndex: 3,
    status: 'active'
  },
  {
    id: 4,
    title: 'Banner Flash Sale',
    image: 'https://upcontent.vn/wp-content/uploads/2024/07/mau-banner-cong-nghe-3.jpg',
    type: 'banner',
    isActive: 1,
    orderIndex: 4,
    status: 'hidden'
  },
  {
    id: 5,
    title: 'Banner Flash Sale',
    image: 'https://intphcm.com/data/upload/banner-la-gi.jpg',
    type: 'banner',
    isActive: 1,
    orderIndex: 5,
    status: 'trash'
  }
];

const MediaTypeList = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);

  const data = mockData.filter((m) => m.type.toLowerCase() === type.toLowerCase());
  const filteredData = data.filter(
    (item) => item.title.toLowerCase().includes(search.toLowerCase()) && (status === '' || item.status === status)
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginated = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const statusTabs = [
    { value: '', label: 'Tất cả' },
    { value: 'active', label: 'Hiển thị' },
    { value: 'hidden', label: 'Ẩn' },
    { value: 'trash', label: 'Thùng rác' }
  ];

  const handleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map((i) => i.id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          QUẢN LÝ {type.toUpperCase()}
        </Typography>
        <Button variant="contained" onClick={() => navigate(`/admin/medias/add?type=${type}`)}>
          + Thêm {type}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 4, borderBottom: '1px solid #eee' }}>
          {statusTabs.map((tab) => {
            const count = tab.value === '' ? data.length : data.filter((m) => m.status === tab.value).length;
            return (
              <Box
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                sx={{
                  pb: 1,
                  px: 1,
                  cursor: 'pointer',
                  borderBottom: status === tab.value ? '2px solid blue' : '2px solid transparent',
                  color: status === tab.value ? 'blue' : 'black',
                  fontWeight: status === tab.value ? 600 : 400,
                  fontSize: 15,
                  userSelect: 'none'
                }}
              >
                {tab.label} ({count})
              </Box>
            );
          })}
        </Box>
        <Box sx={{ maxWidth: 240, mt: { xs: 2, sm: 0 } }}>
          <TextField fullWidth size="small" placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Hành động</InputLabel>
          <Select value={bulkAction} label="Hành động" onChange={(e) => setBulkAction(e.target.value)}>
            {status !== 'trash' && <MenuItem value="trash">Chuyển vào thùng rác</MenuItem>}
            {status === 'trash' && <MenuItem value="restore">Khôi phục</MenuItem>}
            {status === 'trash' && <MenuItem value="delete">Xóa vĩnh viễn</MenuItem>}
          </Select>
        </FormControl>
        <Button variant="contained">Thực Hiện</Button>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select value={filterStatus} label="Trạng thái" onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="active">Hiển thị</MenuItem>
            <MenuItem value="hidden">Ẩn</MenuItem>
            <MenuItem value="trash">Đã xoá</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <MediaTable
        data={paginated}
        selectedIds={selectedIds}
        handleSelect={handleSelect}
        handleSelectAll={handleSelectAll}
        page={page}
        itemsPerPage={itemsPerPage}
      />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination currentPage={page} totalPages={totalPages || 1} onPageChange={setPage} />
      </Box>
    </Box>
  );
};

export default MediaTypeList;
