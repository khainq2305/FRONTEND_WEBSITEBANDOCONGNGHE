import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import NotificationTable from './NotificationTable';
import NotificationForm from './NotificationForm';
import MUIPagination from '../../../components/common/Pagination';
import { notificationService } from '../../../services/admin/notificationService';
import SearchInput from '../../../components/common/SearchInput';
import Loader from '../../../components/common/Loader';
import FilterSelect from '../../../components/common/FilterSelect';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import { useNavigate } from 'react-router-dom';
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [bulkAction, setBulkAction] = useState('');
  const [counts, setCounts] = useState({ all: 0, active: 0, hidden: 0 });
  const navigate = useNavigate();

  const statusTabs = [
    { value: '', label: `Tất cả (${counts.all})` },
    { value: 'active', label: `Hoạt động (${counts.active})` },
    { value: 'hidden', label: `Tạm tắt (${counts.hidden})` }
  ];

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

      setData({
        list: Array.isArray(res.data?.data) ? res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [],
        total: typeof res.data?.total === 'number' ? res.data.total : 0
      });
      setCounts(res.data?.counts || { all: 0, active: 0, hidden: 0 });
    } catch (err) {
      toast.error('Không thể tải danh sách');
      setData({ list: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload, page, status, search, typeFilter, itemsPerPage]);

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    const confirmed = await confirmDelete('xoá', `thông báo "${item.title}"`);
    if (!confirmed) return;

    try {
      await notificationService.delete(item.id);
      toast.success('Đã xoá thông báo !');
      setReload(!reload);
    } catch (err) {
      toast.error('Không thể xoá thông báo');
    }
  };

  const handleFormSuccess = () => {
    setEditing(null);
    setShowForm(false);
    toast.success('Lưu thông báo thành công');
    setReload(!reload);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.list.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.list.map((item) => item.id));
    }
  };

  const handleBulkAction = async () => {
    if (bulkAction === 'trash' && selectedIds.length > 0) {
      const confirmed = await confirmDelete('xoá', `${selectedIds.length} thông báo đã chọn`);
      if (!confirmed) return;

      try {
        await notificationService.deleteMany(selectedIds);
        toast.success('Đã xoá nhiều thông báo');
        setSelectedIds([]);
        setReload(!reload);
      } catch (err) {
        toast.error('Xoá nhiều thất bại');
      }
    }
  };

 return (
  <Box sx={{ p: 4 }}>
    {loading && <Loader fullscreen />}

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h6" fontWeight={600}>
        Danh sách thông báo
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/admin/notifications/create')}
      >
        + Thêm thông báo
      </Button>
    </Box>

    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
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

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        gap: 2,
        flexWrap: 'wrap'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'nowrap' }}>
        <Box sx={{ minWidth: 180 }}>
          <FilterSelect
            value={bulkAction}
            onChange={setBulkAction}
            label="Áp dụng hàng loạt"
            placeholder="Chọn hành động"
            options={[{ value: 'trash', label: 'Xoá' }]}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleBulkAction}
          disabled={selectedIds.length === 0 || !bulkAction}
          sx={{ whiteSpace: 'nowrap', height: 40 }}
        >
          Áp dụng
        </Button>

        <Box sx={{ minWidth: 140 }}>
          <FilterSelect
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setPage(1);
            }}
            label="Loại"
            placeholder="Tất cả"
            options={[
              { value: 'system', label: 'System' },
              { value: 'order', label: 'Order' }
            ]}
          />
        </Box>
      </Box>

      <Box sx={{ minWidth: 260 }}>
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Tìm kiếm thông báo..."
        />
      </Box>
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

    {data.total > 10 && (
      <MUIPagination
        currentPage={page}
        totalItems={data.total}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPage(1);
          setItemsPerPage(value);
        }}
      />
    )}
  </Box>
);

};

export default NotificationPage;
