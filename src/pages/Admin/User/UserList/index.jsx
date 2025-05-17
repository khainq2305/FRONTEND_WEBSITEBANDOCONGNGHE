import { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Checkbox,
  Tabs,
  Tab,
  Button,
  Box,
  Stack,
  useMediaQuery,
  Chip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchInput from 'components/common/SearchInput';
import { toast } from 'react-toastify';
import MoreActionsMenu from '../MoreActionsMenu';
import BlockReasonDialog from '../BlockReasonDialog';
import Pagination from 'components/common/Pagination';

const TABS = ['Tất cả', 'Hoạt động', 'Khóa'];

const mockData = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', status: 'active', role: 'Quản trị viên' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', status: 'inactive', role: 'Người dùng' },
  { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', status: 'inactive', role: 'Nhân viên bán hàng' },
  { id: 4, name: 'Phạm Thị D', email: 'd@gmail.com', status: 'active', role: 'Hỗ trợ' }
];

const roleColors = {
  'Quản trị viên': 'error',
  'Người dùng': 'default',
  'Nhân viên bán hàng': 'info',
  'Hỗ trợ': 'success'
};

const UserList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    setUsers(mockData);
  }, []);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setSelectedIds([]);
  };

  const filtered = users.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      TABS[tab] === 'Tất cả' ||
      (TABS[tab] === 'Hoạt động' && user.status === 'active') ||
      (TABS[tab] === 'Khóa' && user.status === 'inactive');
    return matchSearch && matchTab;
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((x) => x.id));
    }
  };

  const handleResetPassword = (email) => {
    toast.success(`Đã gửi mật khẩu mới đến email ${email}`);
  };

  const handleStatusChange = (user, newStatus) => {
    if (newStatus === 'inactive') {
      setTargetUser(user);
      setOpenBlockDialog(true);
    } else {
      toast.success(`Đã mở khóa tài khoản ${user.name}`);
    }
  };

  const handleForcePasswordChange = (user) => {
    toast.info(`Đã đặt ${user.name} phải đổi mật khẩu khi đăng nhập`);
  };

  const handleViewLogs = (user) => {
    toast.info(`Xem nhật ký hành vi của ${user.name} (giả lập)`);
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Danh sách người dùng
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{ mb: 2 }}
        variant={isMobile ? 'scrollable' : 'standard'}
      >
        {TABS.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mb={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <SearchInput value={search} onChange={setSearch} />
        <Button
          variant="contained"
          size="medium"
          sx={{
            height: 40,
            minWidth: 160,
            textTransform: 'none',
            px: 2
          }}
          onClick={() => navigate('/admin/users/create')}
        >
          + Thêm Tài khoản
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell><strong>STT</strong></TableCell>
              <TableCell><strong>Họ tên</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Vai trò</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell align="right"><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, index) => (
              <TableRow key={row.id} selected={selectedIds.includes(row.id)} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Chip label={row.role} color={roleColors[row.role] || 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status === 'active' ? 'Hoạt động' : 'Khóa'}
                    color={row.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <MoreActionsMenu
                    currentStatus={row.status}
                    onChangeStatus={(status) => handleStatusChange(row, status)}
                    onResetPassword={() => handleResetPassword(row.email)}
                    onForceChangePassword={() => handleForcePasswordChange(row)}
                    onViewLogs={() => handleViewLogs(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={page}
        totalItems={filtered.length}
        itemsPerPage={5}
        onPageChange={(p) => setPage(p)}
      />

      <BlockReasonDialog
        open={openBlockDialog}
        onClose={() => setOpenBlockDialog(false)}
        onConfirm={(reason) => {
          toast.success(`Tài khoản ${targetUser?.name} đã bị khóa.\nLý do: ${reason}`);
        }}
      />
    </Box>
  );
};

export default UserList;
