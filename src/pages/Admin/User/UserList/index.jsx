import { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Checkbox,
  Tabs, Tab, Button, Box, Stack, Chip, Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

import SearchInput from 'components/common/SearchInput';
import MoreActionsMenu from '../MoreActionsMenu';
import BlockReasonDialog from '../BlockReasonDialog';
import MUIPagination from 'components/common/Pagination';
import Loader from '../../../../components/common/Loader';
import { getAllUsers, updateUserStatus, resetUserPassword, cancelUserScheduledBlock } from '../../../../services/admin/userService';
import { toast } from 'react-toastify';

const TABS = [
  { label: 'Tất cả', value: '', key: 'all' },
  { label: 'Hoạt động', value: '1', key: 'active' },
  { label: 'Đã lên lịch khóa', value: '2', key: 'scheduled' },
  { label: 'Đang bị khóa', value: '0', key: 'locked' },
  { label: 'Khóa vĩnh viễn', value: '-1', key: 'permanent' }
];

const roleColors = {
  'Quản trị viên': 'error',
  'Người dùng': 'default',
  'Nhân viên bán hàng': 'info',
  'Hỗ trợ': 'success',
  Marketing: 'warning',
  Content: 'primary'
};

const convertRoleIdToLabel = (roleId) => {
  const map = {
    1: 'Quản trị viên',
    2: 'Người dùng',
    3: 'Nhân viên kho',
    4: 'Marketing',
    5: 'Hỗ trợ',
    6: 'Content',
    7: 'Nhân viên bán hàng'
  };
  return map[roleId] || 'Không rõ';
};

const formatCountdown = (endTime) => {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return 'Đang bị khóa';
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `Sẽ bị khóa sau ${minutes} phút ${seconds} giây`;
};

const UserList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    scheduled: 0,
    locked: 0,
    permanent: 0
  });

  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const statusQuery = TABS[tab].value;

      const data = await getAllUsers({
        page,
        limit: itemsPerPage,
        search,
        status: statusQuery
      });
      setUsers(data.data);
      setTotalPages(data.totalPages);

      const [all, active, scheduled, locked, permanent] = await Promise.all([
        getAllUsers({ page: 1, limit: 1, status: '' }),
        getAllUsers({ page: 1, limit: 1, status: '1' }),
        getAllUsers({ page: 1, limit: 1, status: '2' }),
        getAllUsers({ page: 1, limit: 1, status: '0' }),
        getAllUsers({ page: 1, limit: 1, status: '-1' }),
      ]);

      setStatusCounts({
        all: all.total,
        active: active.total,
        scheduled: scheduled.total,
        locked: locked.total,
        permanent: permanent.total
      });
    } catch {
      toast.error('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, tab, page]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) => [...prev]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setPage(1);
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const currentPageIds = users.map((x) => x.id);
    if (selectedIds.length === currentPageIds.length) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleResetPassword = async (user) => {
    try {
      setActionLoading(true);
      await resetUserPassword(user.id);
      toast.success(`Đã gửi mật khẩu mới đến email ${user.email}`);
    } catch {
      toast.error('Lỗi khi cấp lại mật khẩu');
    } finally {
      setActionLoading(false);
    }
  };

 const handleStatusChange = (user, newStatus) => {
  if (newStatus === 'inactive') {
    setTargetUser(user);
    setOpenBlockDialog(true);
  } else if (newStatus === 'permanent') {
    setActionLoading(true);
    updateUserStatus(user.id, -1)
      .then(() => {
        toast.success(`Tài khoản ${user.fullName} đã bị khóa vĩnh viễn`);
        fetchUsers();
      })
      .catch(() => toast.error('Lỗi khi khóa vĩnh viễn tài khoản'))
      .finally(() => setActionLoading(false));
  } else {
    setActionLoading(true);
    updateUserStatus(user.id, 1)
      .then(() => {
        toast.success(`Đã mở khóa tài khoản ${user.fullName}`);
        fetchUsers();
      })
      .catch(() => toast.error('Lỗi khi mở khóa tài khoản'))
      .finally(() => setActionLoading(false));
  }
};


  const handleCancelScheduledBlock = async (user) => {
    try {
      setActionLoading(true);
      await cancelUserScheduledBlock(user.id);
      toast.success(`Đã huỷ lịch khóa tài khoản ${user.fullName}`);
      fetchUsers();
    } catch {
      toast.error('Lỗi khi huỷ lịch khóa');
    } finally {
      setActionLoading(false);
    }
  };

  const handleForcePasswordChange = (user) => {
    toast.info(`Đã đặt ${user.fullName} phải đổi mật khẩu khi đăng nhập`);
  };

  const handleViewLogs = (user) => {
    toast.info(`Xem nhật ký hành vi của ${user.fullName} (giả lập)`);
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Danh sách người dùng</Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }} variant="scrollable">
        {TABS.map((tabItem, index) => (
          <Tab
            key={index}
            label={`${tabItem.label} (${statusCounts[tabItem.key] || 0})`}
          />
        ))}
      </Tabs>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} justifyContent="space-between">
        <SearchInput value={search} onChange={setSearch} />
        <Button
          variant="contained"
          size="medium"
          sx={{ height: 40, minWidth: 160 }}
          onClick={() => navigate('/admin/users/create')}
        >
          + Thêm Tài khoản
        </Button>
      </Stack>

      {loading || actionLoading ? (
        <Loader />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={users.length > 0 && users.every((u) => selectedIds.includes(u.id))} onChange={toggleSelectAll} />
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
                {users.map((row, index) => (
                  <TableRow key={row.id} selected={selectedIds.includes(row.id)} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                    </TableCell>
                    <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.email}>
                        {row.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={convertRoleIdToLabel(row.roleId)}
                        color={roleColors[convertRoleIdToLabel(row.roleId)] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {row.status === -1 ? (
                        <Chip label="Khóa vĩnh viễn" color="default" size="small" />
                      ) : row.scheduledBlockAt ? (
                        <Chip label={formatCountdown(row.scheduledBlockAt)} color="warning" size="small" />
                      ) : row.status === 0 ? (
                        <Chip label="Đang bị khóa" color="error" size="small" />
                      ) : (
                        <Chip label="Hoạt động" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <MoreActionsMenu
                        user={row}
                        currentStatus={row.status === 1 ? 'active' : 'inactive'}
                        onChangeStatus={(newStatus) => handleStatusChange(row, newStatus)}
                        onResetPassword={handleResetPassword}
                        onForceChangePassword={() => handleForcePasswordChange(row)}
                        onViewLogs={() => handleViewLogs(row)}
                        onCancelBlock={handleCancelScheduledBlock}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Không có kết quả</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <MUIPagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </>
      )}

      <BlockReasonDialog
        open={openBlockDialog}
        onClose={() => setOpenBlockDialog(false)}
        onConfirm={(reason) => {
          setActionLoading(true);
          updateUserStatus(targetUser.id, 0, reason)
            .then(() => {
              toast.success(`Tài khoản ${targetUser?.fullName} đã được lên lịch khóa`);
              fetchUsers();
            })
            .catch(() => toast.error('Lỗi khi khóa tài khoản'))
            .finally(() => {
              setOpenBlockDialog(false);
              setActionLoading(false);
            });
        }}
      />
    </Box>
  );
};

export default UserList;
