import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { RolesCard, CountCard, DialogDetails, PaperContainer } from './Card';
import AddRoleDialog from './AddRoleDialog';
import { rolesService } from '@/services/admin/rolesService';
import { toast } from 'react-toastify';

// ========================================================================
// API SERVICE CONFIGURATION
// Cấu hình các hàm gọi API, đảm bảo "khớp" với backend
// ========================================================================


const countLable = [
  { id: 1, label: 'Quản trị viên', color: '#2196F3', count: 44 },
  { id: 12, label: 'Biên tập viên', color: '#2196F3', count: 12 },
  { id: 123, label: 'Người xem', color: '#2196F3', count: 100 },
  { id: 1, label: 'Quản trị viên', color: '#2196F3', count: 44 }
];
export const roleLabel = [
  {
    id: 1,
    label: 'Quản trị viên',
    description: 'Toàn quyền hệ thống',
    userCount: 44,
    permissionCount: 44
  },
  {
    id: 2,
    label: 'Biên tập viên',
    description: 'Quản lý nội dung và bài viết',
    userCount: 12,
    permissionCount: 20
  },
  {
    id: 3,
    label: 'Người xem',
    description: 'Chỉ xem dữ liệu, không chỉnh sửa',
    userCount: 100,
    permissionCount: 5
  },
  {
    id: 4,
    label: 'Nhân viên kỹ thuật',
    description: 'Xử lý các vấn đề hệ thống',
    userCount: 8,
    permissionCount: 18
  },
  {
    id: 5,
    label: 'Nhân viên chăm sóc',
    description: 'Chăm sóc khách hàng và đơn hàng',
    userCount: 15,
    permissionCount: 12
  },
  {
    id: 6,
    label: 'Nhân viên bán hàng',
    description: 'Tư vấn và xử lý đơn hàng',
    userCount: 20,
    permissionCount: 14
  },
  {
    id: 7,
    label: 'Kế toán',
    description: 'Quản lý thanh toán và hóa đơn',
    userCount: 5,
    permissionCount: 10
  },
  {
    id: 8,
    label: 'Nhân viên marketing',
    description: 'Quản lý quảng cáo và khuyến mãi',
    userCount: 9,
    permissionCount: 9
  }
];
const RoleManagement = () => {
  const [open, setOpen] = useState(false);
  const [openDetails, setopenDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // ✅ thêm
  const [roles, setRoles] = useState([]);
  const [editOpen, setEditOpen] = useState(false); // trạng thái mở dialog
  const [editRole, setEditRole] = useState(null); // dữ liệu role để sửa
  const [dialogMode, setDialogMode] = useState('create');
  const handleEdit = (role) => {
    setDialogMode('edit');
    setEditRole(role);
    setOpen(true);
  };
  const handleAddClick = () => {
    setDialogMode('create');
    setEditRole(null);
    setOpen(true);
  };

  const fechAllRoles = async () => {
    try {
      const res = await rolesService.getAll();
      setRoles(res.data.data);
      console.log('res.data.data', res.data.data);
    } catch (error) {}
  };
  const handleViewDetails = (role) => {
    setSelectedRole(role);
    setopenDetails(true);
  };
  const handleSubmit = async (payload) => {
    try {
      if (dialogMode === 'create') {
        const res = await rolesService.create(payload);
        setRoles((prev) => [...prev, res.data.data]);
        toast.success('Tạo vai trò thành công');
      } else {
        const res = await rolesService.update(editRole.id, payload);
        setRoles((prev) => prev.map((r) => (r.id === res.data.data.id ? res.data.data : r)));
        toast.success('Cập nhật vai trò thành công');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xử lý vai trò');
    } finally {
      setOpen(false);
    }
  };
  const handleDelete = async (id) => {
  const confirmFirst = window.confirm('Bạn có chắc muốn xóa vai trò này?');
  if (!confirmFirst) return;

  try {
    await rolesService.remove(id); // gọi API xoá thường
    setRoles((prev) => prev.filter((role) => role.id !== id));
    toast.success('Đã xóa vai trò');
  } catch (err) {
    const response = err.response;

    // Nếu có lỗi ràng buộc khoá ngoại (409 từ backend)
    if (response?.status === 409 && response?.data?.code === 'FK_CONSTRAINT') {
      const confirmForce = window.confirm(
        response.data.message + '\nBạn có muốn xoá vai trò và gán người dùng sang vai trò mặc định không?'
      );

      if (!confirmForce) return;

      // Gửi lại API với force = true
      try {
        await rolesService.remove(id, { force: true });
        setRoles((prev) => prev.filter((role) => role.id !== id));
        toast.success('Đã xoá vai trò và dữ liệu liên quan.');
      } catch (err2) {
        console.error('Lỗi xoá liên quan:', err2.response?.data || err2.message);
        toast.error('Lỗi khi xoá kèm dữ liệu liên quan.');
      }

    } else {
      toast.error(response?.data?.message || 'Lỗi khi xoá vai trò');
    }
  }
};

  useEffect(() => {
    fechAllRoles();
  }, []);
  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        + Thêm vai trò
      </Button>
      {/* <PaperContainer>
        <Grid container spacing={2} p={2}>
          {roles.map((role) => (
            <Grid item xs={3} sm={3} md={3} key={role.id}>
              <CountCard id={role.id} label={role.name} count={role.userCount} />
            </Grid>
          ))}
        </Grid>
      </PaperContainer> */}

      <Box sx={{ bgcolor: '#f7f8fa', minHeight: '100vh' }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Quản lý vai trò
        </Typography>
        <Grid container spacing={3}>
          {roles.map((role, index) => (
            <Grid item xs={3} sm={6} md={3} key={index}>
              <RolesCard
                role={role}
                color={role.color}
                label={role.label}
                description={role.description}
                userCount={role.userCount}
                permissionCount={role.permissionCount}
                onDelete={() => handleDelete(role.id)} // nếu có
                onViewDetails={() => handleViewDetails(role)}
                onEdit={() => handleEdit(role)}
                
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AddRoleDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} initialData={editRole} mode={dialogMode} />
      <DialogDetails open={openDetails} onClose={() => setopenDetails(false)} role={selectedRole} />
    </div>
  );
};

export default RoleManagement;
