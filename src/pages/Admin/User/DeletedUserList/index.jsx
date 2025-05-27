import { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Box, Typography, Button, Checkbox } from '@mui/material';
import SearchInput from 'components/common/SearchInput';
import MUIPagination from 'components/common/Pagination';
import Loader from 'components/common/Loader';
import { getDeletedUsers, forceDeleteManyUsers } from 'services/admin/userService';
import { toast } from 'react-toastify';

const DeletedUserList = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getDeletedUsers({ page, limit: itemsPerPage, search });
      setUsers(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch {
      toast.error('Không thể tải danh sách tài khoản đã xoá!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    const currentPageIds = users.map((u) => u.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(
      allSelected ? selectedIds.filter((id) => !currentPageIds.includes(id)) : [...new Set([...selectedIds, ...currentPageIds])]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xoá vĩnh viễn ${selectedIds.length} tài khoản?`)) return;
    try {
      await forceDeleteManyUsers(selectedIds);
      toast.success('Đã xoá vĩnh viễn!');
      setSelectedIds([]);
      fetchUsers();
    } catch {
      toast.error('❌ Xoá vĩnh viễn thất bại!');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Danh sách tài khoản đã xoá
      </Typography>

      <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên hoặc email..." />

      {selectedIds.length > 0 && (
        <Button
          variant="text"
          onClick={handleBulkDelete}
          sx={{
            mt: 2,
            color: '#1976d2', 
            backgroundColor: 'rgba(25, 118, 210, 0.1)', 
            borderRadius: '8px',
            px: 2,
            py: 1,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.2)'
            }
          }}
        >
          Xoá vĩnh viễn ({selectedIds.length})
        </Button>
      )}

      {loading ? (
        <Loader />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={users.length > 0 && users.every((u) => selectedIds.includes(u.id))} onChange={toggleSelectAll} />
                </TableCell>
                <TableCell>
                  <strong>STT</strong>
                </TableCell>
                <TableCell>
                  <strong>Họ tên</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Thời điểm xóa</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id} hover selected={selectedIds.includes(user.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedIds.includes(user.id)} onChange={() => toggleSelectRow(user.id)} />
                  </TableCell>
                  <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.deletedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalPages > 1 && (
        <Box mt={2}>
          <MUIPagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(p) => setPage(p)}
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
};

export default DeletedUserList;
