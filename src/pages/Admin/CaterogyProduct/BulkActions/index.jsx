import { Box, Select, MenuItem, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { confirmDelete } from 'components/common/ConfirmDeleteDialog';
import { categoryService } from 'services/admin/categoryService';

const BulkActions = ({ selectedIds, status, fetchData, setSelectedIds }) => {
  const [action, setAction] = useState('');

  useEffect(() => {
    if (status === 'trashed') {
      setAction('restore');
    } else {
      setAction('trash');
    }
  }, [status]);

  const layLuaChon = () => {
    if (status === 'trashed') {
      return [
        { value: 'restore', label: 'Khôi phục' },
        { value: 'forceDelete', label: 'Xoá vĩnh viễn' }
      ];
    }
    return [{ value: 'trash', label: 'Chuyển vào thùng rác' }];
  };

  const thucHienHanhDong = async () => {
    try {
      if (selectedIds.length === 0 && status === 'trashed') {
        const xacNhan = await confirmDelete(
          action === 'restore' ? 'khôi phục tất cả' : 'xoá vĩnh viễn tất cả'
        );
        if (!xacNhan) return;
        await (action === 'restore'
          ? categoryService.restoreAll()
          : categoryService.forceDeleteAll());
        toast.success(`Đã ${action === 'restore' ? 'khôi phục' : 'xoá'} toàn bộ`);
      } else if (selectedIds.length) {
        const xacNhan = await confirmDelete(`${action} các danh mục đã chọn`);
        if (!xacNhan) return;

        if (action === 'trash') await categoryService.softDeleteMany(selectedIds);
        if (action === 'restore') await categoryService.restoreMany(selectedIds);
        if (action === 'forceDelete') await categoryService.forceDeleteMany(selectedIds);

        toast.success(`Đã ${action} danh mục`);
      } else {
        toast.info('Vui lòng chọn danh mục cần thao tác');
      }

      setSelectedIds([]);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi khi thao tác');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        size="small"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        sx={{ minWidth: 180 }}
      >
        {layLuaChon().map((luaChon) => (
          <MenuItem key={luaChon.value} value={luaChon.value}>
            {luaChon.label}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        onClick={thucHienHanhDong}
        sx={{ height: 40 }}
        disabled={!action}
      >
        Thực hiện
      </Button>
    </Box>
  );
};

export default BulkActions;
