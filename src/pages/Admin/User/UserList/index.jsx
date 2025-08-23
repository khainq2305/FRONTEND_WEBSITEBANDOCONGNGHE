import { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  Tabs,
  Tab,
  Button,
  Box,
  Stack,
  Chip,
  Typography,
  Avatar,
  Card, // Dùng Card để bọc toàn bộ nội dung
  CardContent, // Thêm padding cho Card
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // Icon cho nút thêm mới
import DeleteIcon from '@mui/icons-material/Delete'; // Icon cho nút xoá

import SearchInput from 'components/common/SearchInput';
import MoreActionsMenu from '../MoreActionsMenu';
import MUIPagination from 'components/common/Pagination';
import Loader from 'components/common/Loader';
import { getAllUsers, updateUserStatus, resetUserPassword, getDeletedUsers, forceDeleteManyUsers } from 'services/admin/userService';
import { toast } from 'react-toastify';
import RoleSelectDialog from '../UserDetailDialog/PromotionDialog';
import UserDetailDialog from '../UserDetailDialog';
import axios from 'axios';

// --- Dữ liệu và hàm tiện ích ---
const TABS = [
  { label: 'Tất cả', value: '', key: 'all' },
  { label: 'Thùng rác', value: 'trash', key: 'deleted' }
];

const demoRoles = [
  { id: 1, label: 'Admin' },
  { id: 2, label: 'Người Dùng' },
  { id: 3, label: 'Chăm sóc khách hàng' },
  { id: 4, label: 'Quản lý kho' },
  { id: 5, label: 'Marketing' }
];
// --- Kết thúc phần tiện ích ---

const UserList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [detailOpen, setDetailOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState({ all: 0, active: 0, inactive: 0, deleted: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [appliedRoles, setAppliedRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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

      // Fetch counts
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

  // --- Các hàm xử lý logic ---
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



  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };



  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý Người dùng
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/users/create')}>
          Thêm mới
        </Button>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Tabs value={tab} onChange={handleTabChange} variant="scrollable" sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            {TABS.map((tabItem) => (
              <Tab key={tabItem.key} label={`${tabItem.label} (${statusCounts[tabItem.key] || 0})`} />
            ))}
          </Tabs>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} justifyContent="space-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm theo tên, email..."
              sx={{ width: { xs: '100%', sm: 320 } }}
            />
            {tab === 3 && selectedIds.length > 0 && (
              <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleForceDeleteMany}>
                Xoá vĩnh viễn ({selectedIds.length})
              </Button>
            )}
          </Stack>

          {loading || actionLoading ? (
            <Loader />
          ) : (
            <>
              <TableContainer>
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox checked={users.length > 0 && users.every((u) => selectedIds.includes(u.id))} onChange={toggleSelectAll} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Người dùng</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{tab === 3 ? 'Ngày xoá' : 'Vai trò'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        Hành động
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((row) => (
                      <TableRow key={row.id} selected={selectedIds.includes(row.id)} hover>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar src={row.avatarUrl} alt={row.fullName} sx={{ width: 40, height: 40 }} />
                            <Box>
                              <Typography variant="subtitle2" component="div" noWrap sx={{ maxWidth: 200 }}>
                                {row.fullName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                {row.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          {tab === 3 ? (
                            new Date(row.deletedAt).toLocaleString()
                          ) : row.roles && row.roles.length > 0 ? (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {row.roles.map((role) => (
                                <Chip key={role.id} label={role.name} size="small" sx={{ mb: 0.5 }} />
                              ))}
                            </Stack>
                          ) : (
                            <Chip label="Không rõ" size="small" color="default" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <MoreActionsMenu
                            user={row}
                            isDeleted={tab === 3}
                            onChangeStatus={(newStatus) => handleStatusChange(row, newStatus)}
                            onView={() => {
                              setSelectedUser(row);
                              setOpenDialog(true);
                            }}
                            onResetPassword={handleResetPassword}
                            onViewDetail={handleViewDetail}
                            onForceDelete={() => handleForceDelete(row.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography p={4}>Không có người dùng nào</Typography>
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
                  sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <RoleSelectDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        roles={demoRoles}
        defaultSelected={appliedRoles}
        user={selectedUser}
      />

      <UserDetailDialog open={detailOpen} onClose={() => setDetailOpen(false)} user={selectedUser} />
    </Box>
  );
};

export default UserList;
