import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Tooltip, Paper, TableContainer, FormControl,
  Select, MenuItem, TextField, Checkbox, Menu
} from '@mui/material';
import { Edit, MoreVert } from '@mui/icons-material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useNavigate } from 'react-router-dom';
import { sectionService } from '../../../services/admin/sectionService';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { toast } from 'react-toastify';
import Toastify from '../../../components/common/Toastify';

const getDisplaySectionType = (type) => {
  const typeMap = {
    'productList': 'Chỉ sản phẩm',
    'banner': 'Banner',
    'categoryList': 'Danh mục nổi bật',
    'customLink': 'Liên kết tùy chỉnh'
  };
  return typeMap[type] || type || 'Không xác định';
};

const HomeSectionList = () => {
  const [sections, setSections] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuSection, setMenuSection] = useState(null);

  const navigate = useNavigate();

  const fetchSections = async () => {
    try {
      const params = {};
      if (searchText) params.search = searchText;
      if (activeTab === 'active') params.isActive = true;
      if (activeTab === 'inactive') params.isActive = false;

      const res = await sectionService.list(params);
      setSections(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách khối:', error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [activeTab]);

  const handleDelete = async (section) => {
    const confirm = await confirmDelete('xoá', `khối "${section.title}"`);
    if (!confirm) return;

    try {
      await sectionService.delete(section.id);
      toast.success('Đã xoá thành công!');
      fetchSections();
    } catch (error) {
      toast.error('Xoá thất bại!');
      console.error('Lỗi khi xoá:', error);
    }
  };

  const handleEdit = (section) => {
    navigate(`/admin/home-sections/edit/${section.id}`, {
      state: { initialData: section }
    });
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(sections.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleOpenMenu = (e, section) => {
    setMenuAnchorEl(e.currentTarget);
    setMenuSection(section);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuSection(null);
  };

  const handleSearch = () => {
    fetchSections();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Tabs */}
      <Box display="flex" gap={2} mb={2}>
        <Button variant={activeTab === 'all' ? 'contained' : 'text'} onClick={() => setActiveTab('all')}>Tất Cả</Button>
        <Button variant={activeTab === 'active' ? 'contained' : 'text'} onClick={() => setActiveTab('active')}>Hoạt Động</Button>
        <Button variant={activeTab === 'inactive' ? 'contained' : 'text'} onClick={() => setActiveTab('inactive')}>Tạm Tắt</Button>
      </Box>

      {/* Bulk Action & Search */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <FormControl size="small">
          <Select defaultValue="" displayEmpty>
            <MenuItem value=""><em>Hành động hàng loạt</em></MenuItem>
            <MenuItem value="delete">Xoá</MenuItem>
            <MenuItem value="disable">Tạm tắt</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" disabled>Áp Dụng</Button>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Tìm kiếm theo tiêu đề"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} variant="outlined">Tìm</Button>
        <Box flexGrow={1} />
        <Button variant="contained" onClick={() => navigate('/admin/home-sections/create')}>Thêm Mới</Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'grey.200' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === sections.length && sections.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>THỨ TỰ</TableCell>
              <TableCell>TIÊU ĐỀ</TableCell>
              <TableCell>LOẠI KHỐI</TableCell>
              <TableCell align="center">SỐ SP</TableCell>
              <TableCell align="center">SỐ BANNER</TableCell>
              <TableCell align="center">HÀNH ĐỘNG</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleToggleSelect(item.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{getDisplaySectionType(item.type)}</TableCell>
                <TableCell align="center">{item.skuIds?.length || 0}</TableCell>
                <TableCell align="center">{item.banners?.length || 0}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                    <IconButton onClick={(e) => handleOpenMenu(e, item)} size="small">
                      <MoreVert />
                    </IconButton>
                    <IconButton size="small"><SwapVertIcon /></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu hành động */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => { handleEdit(menuSection); handleCloseMenu(); }}>Chỉnh sửa</MenuItem>
        <MenuItem onClick={() => { handleDelete(menuSection); handleCloseMenu(); }}>Xoá</MenuItem>
      </Menu>

      <Toastify />
    </Box>
  );
};

export default HomeSectionList;
