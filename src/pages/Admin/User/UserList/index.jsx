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
  Chip,
  Typography,
  Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

import SearchInput from 'components/common/SearchInput';
import MoreActionsMenu from '../MoreActionsMenu';
import MUIPagination from 'components/common/Pagination';
import Loader from 'components/common/Loader';
import { getAllUsers, updateUserStatus, resetUserPassword, getDeletedUsers, forceDeleteManyUsers } from 'services/admin/userService';
import { toast } from 'react-toastify';

const TABS = [
  { label: 'Tất cả', value: '', key: 'all' },
  { label: 'Hoạt động', value: '1', key: 'active' },
  { label: 'Ngưng hoạt động', value: '0', key: 'inactive' },
  { label: 'Thùng rác', value: 'trash', key: 'deleted' }
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
  const [statusCounts, setStatusCounts] = useState({ all: 0, active: 0, inactive: 0, deleted: 0 });

  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const statusQuery = TABS[tab].value;

      const data =
        statusQuery === 'trash'
          ? await getDeletedUsers({ page, limit: itemsPerPage, search })
          : await getAllUsers({ page, limit: itemsPerPage, search, status: statusQuery });

      setUsers(
        (data.data || []).map((user) => ({
          ...user,
          status: parseInt(user.status || 0, 10)
        }))
      );

      setTotalPages(data.totalPages || 1);

      const [all, active, inactive, deleted] = await Promise.all([
        getAllUsers({ page: 1, limit: 1, status: '' }),
        getAllUsers({ page: 1, limit: 1, status: '1' }),
        getAllUsers({ page: 1, limit: 1, status: '0' }),
        getDeletedUsers({ page: 1, limit: 1, search: '' })
      ]);

      setStatusCounts({
        all: all.total,
        active: active.total,
        inactive: inactive.total,
        deleted: deleted.total
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

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setPage(1);
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    const currentPageIds = users.map((u) => u.id);
    setSelectedIds(
      selectedIds.length === currentPageIds.length
        ? selectedIds.filter((id) => !currentPageIds.includes(id))
        : [...new Set([...selectedIds, ...currentPageIds])]
    );
  };

  const handleForceDelete = async (id) => {
    const confirm = window.confirm('Bạn chắc chắn muốn xoá vĩnh viễn tài khoản này?');
    if (!confirm) return;

    try {
      setActionLoading(true);
      await forceDeleteManyUsers([id]);
      toast.success('Đã xoá vĩnh viễn tài khoản');
      fetchUsers();
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch {
      toast.error('Lỗi khi xoá tài khoản');
    } finally {
      setActionLoading(false);
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

  const handleForceDeleteMany = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm(`Xoá vĩnh viễn ${selectedIds.length} tài khoản?`);
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      await forceDeleteManyUsers(selectedIds);
      toast.success('Đã xoá vĩnh viễn các tài khoản');
      fetchUsers();
      setSelectedIds([]);
    } catch (err) {
      toast.error('Lỗi khi xoá vĩnh viễn');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = (user, newStatus) => {
    setActionLoading(true);
    const targetStatus = newStatus === 'inactive' ? 0 : 1;
    updateUserStatus(user.id, targetStatus)
      .then(() => {
        toast.success(
          targetStatus === 0 ? `Tài khoản ${user.fullName} đã ngưng hoạt động` : `Tài khoản ${user.fullName} đã được kích hoạt lại`
        );
        fetchUsers();
      })
      .catch(() => toast.error('Lỗi khi cập nhật trạng thái tài khoản'))
      .finally(() => setActionLoading(false));
  };

  const handleViewDetail = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Danh sách người dùng
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        sx={{
          mb: 2,
          '& .MuiTabs-indicator': {
            backgroundColor: '#000'
          },
          '& .MuiTab-root': {
            color: '#000',
            fontWeight: 500,
            textTransform: 'none',
            minHeight: 40
          },
          '& .MuiTab-root.Mui-selected': {
            color: '#fff',
            backgroundColor: '#000', 
            borderRadius: 4
          },
          '& .MuiTab-root:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)', 
            color: '#000'
          }
        }}
      >
        {TABS.map((tabItem, index) => (
          <Tab key={index} label={`${tabItem.label} (${statusCounts[tabItem.key] || 0})`} />
        ))}
      </Tabs>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems="center" justifyContent="space-between">
        <Box sx={{ flex: 1, width: '100%' }}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm theo tên, email..."
            sx={{
              width: '100%',
              height: 40,
              backgroundColor: 'white',
              borderRadius: 1,
              border: '1px solid #ccc',
              px: 2
            }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/admin/users/create')}
          sx={{
            height: 40,
            whiteSpace: 'nowrap',
            fontWeight: 600,
            px: 3,
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#222'
            }
          }}
        >
          + Thêm Tài khoản
        </Button>
        {tab === 3 && selectedIds.length > 0 && (
          <Button
            variant="contained"
            onClick={handleForceDeleteMany}
            sx={{
              height: 40,
              fontWeight: 600,
              px: 3,
              ml: 2,
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#222'
              }
            }}
          >
            Xoá vĩnh viễn ({selectedIds.length})
          </Button>
        )}
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
                  <TableCell>
                    <strong>STT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Avatar</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Họ tên</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{tab === 3 ? 'Ngày xoá' : 'Vai trò'}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{tab === 3 ? 'Xoá' : 'Hành động'}</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row, index) => (
                  <TableRow key={row.id} selected={selectedIds.includes(row.id)} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                    </TableCell>
                    <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {tab === 3 ? row.fullName : <Avatar src={row.avatarUrl} alt={row.fullName} sx={{ width: 36, height: 36 }} />}
                    </TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.email}>
                        {row.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {tab === 3 ? (
                        new Date(row.deletedAt).toLocaleString()
                      ) : (
                        <Chip
                          label={convertRoleIdToLabel(row.roleId)}
                          color={roleColors[convertRoleIdToLabel(row.roleId)] || 'default'}
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {tab === 3 ? (
                        <Chip label="Đã xoá" size="small" color="default" />
                      ) : parseInt(row.status) === 1 ? (
                        <Chip label="Hoạt động" color="success" size="small" />
                      ) : (
                        <Chip label="Ngưng hoạt động" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <MoreActionsMenu
                        user={row}
                        isDeleted={tab === 3}
                        onChangeStatus={(newStatus) => handleStatusChange(row, newStatus)}
                        onResetPassword={handleResetPassword}
                        onViewDetail={handleViewDetail}
                        onForceDelete={() => handleForceDelete(row.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Không có kết quả
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <MUIPagination
              currentPage={page}
              totalItems={statusCounts[TABS[tab].key] || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default UserList;
