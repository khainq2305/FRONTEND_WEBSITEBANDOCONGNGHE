import { useEffect, useState } from 'react';
import NotificationTable from './NotificationTable';
import NotificationForm from './NotificationForm';
import DeleteAllDialog from './DeleteAllDialog';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import Pagination from 'components/common/Pagination';
import { notificationService } from '../../../services/admin/notificationService';

const NotificationPage = () => {
  const [data, setData] = useState({ list: [], total: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [status, setStatus] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [bulkAction, setBulkAction] = useState('');
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll({
        page,
        limit: itemsPerPage,
        search,
        ...(status === 'active' && { isActive: true }),
        ...(status === 'hidden' && { isActive: false }),
        ...(typeFilter && { type: typeFilter })
      });

      console.log('📦 Res from getAll:', res);

      setData({
        list: Array.isArray(res.data?.data) ? res.data.data : [],
        total: typeof res.data?.total === 'number' ? res.data.total : 0
      });
    } catch (err) {
      console.error('❌ Lỗi fetch:', err);
      setData({ list: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload, page, status, search, typeFilter]);

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    await notificationService.delete(item.id);
    setReload(!reload);
  };

  const handleFormSuccess = () => {
    setEditing(null);
    setShowForm(false);
    setReload(!reload);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.list.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.list.map((item) => item.id));
    }
  };

  const handleBulkAction = () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      setShowDeleteAllDialog(true);
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await notificationService.deleteMany(selectedIds);
      setSelectedIds([]);
      setReload(!reload);
    } catch (err) {
      console.error('❌ Lỗi xoá nhiều:', err);
    } finally {
      setShowDeleteAllDialog(false);
    }
  };

  const statusTabs = [
    { value: '', label: 'Tất cả' },
    { value: 'active', label: 'Hiển thị' },
    { value: 'hidden', label: 'Ẩn' }
  ];

  return (
    <Box sx={{ p: 4 }}>
      <div className="flex justify-between items-center mb-4">
        {!showForm && (
          <Button variant="contained" onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}>
            + Thêm thông báo
          </Button>
        )}
      </div>

      {!showForm && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {statusTabs.map((tab) => (
                <Box
                  key={tab.value}
                  onClick={() => {
                    setStatus(tab.value);
                    setPage(1);
                  }}
                  sx={{
                    pb: 1,
                    px: 1,
                    cursor: 'pointer',
                    borderBottom: status === tab.value ? '2px solid blue' : '2px solid transparent',
                    color: status === tab.value ? 'blue' : 'black',
                    fontWeight: status === tab.value ? 600 : 400,
                    fontSize: 15
                  }}
                >
                  {tab.label}
                </Box>
              ))}
            </Box>

            <TextField
              size="small"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel>Loại</InputLabel>
              <Select
                value={typeFilter}
                label="Loại"
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="promotion">Promotion</MenuItem>
                <MenuItem value="order">Order</MenuItem>
                <MenuItem value="news">News</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel>Hành động</InputLabel>
              <Select
                value={bulkAction}
                label="Hành động"
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <MenuItem value="trash">Xoá</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleBulkAction}
              disabled={selectedIds.length === 0 || !bulkAction}
            >
              Thực hiện
            </Button>
          </Box>

          <NotificationTable
            notifications={Array.isArray(data.list) ? data.list : []}
            setNotifications={(list) => setData((prev) => ({ ...prev, list }))}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              currentPage={page}
              totalItems={data.total}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </Box>
        </>
      )}

      {showForm && (
        <NotificationForm
          editing={editing}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      )}

      <DeleteAllDialog
        open={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={handleConfirmDeleteAll}
      />
    </Box>
  );
};

export default NotificationPage;
