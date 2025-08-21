import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
  Divider,
  InputLabel,
  Select,
  FormControl,
  Button,
  Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import CrudChips from './Chips';
import { userService1 } from '@/services/admin/userFake';
import { rolesService} from '@/services/admin/rolesService';
import CheckboxGroup from './CheckboxGroup';
import { use } from 'react';
import RolesPresent from './RolesPresent';

const roleColorPreset = {
  CEO: 'error',
  'Nhân viên': 'default',
  'Quản lý': 'primary',
  'Kế toán': 'success',
  'Thực tập': 'warning'
};

const RoleAssignment = () => {
  const { id } = useParams();
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({});
  const [selectedRole, setSelectedRole] = useState('');
  const selectedRoleObj = roles.find((r) => r.id === selectedRole);

  const fetchUserData = async () => {
    try {
      const res = await userService1.getById(id);
      setUser(res.data.data);
      console.log('Fetched user data:', res.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await rolesService.getAll();
      setRoles(res.data.roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    // fetchRoles();
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRoleObj) {
      alert('Vui lòng chọn vai trò mới trước khi gửi.');
      return;
    }

    console.log('Gửi dữ liệu:', {
      userId: user.id,
      newRoleId: selectedRoleObj.id,
      roleName: selectedRoleObj.description
    });

    // TODO: Gọi API để cập nhật vai trò
  };
//   function rolesPresent(user) {
//   const roles = user?.roles || [];

//   // Kiểm tra xem user có vai trò admin không
//   const isAdmin = roles.some(role => role.name?.toLowerCase() === 'admin');

//   if (isAdmin) {
//     return 'Admin (toàn quyền)';
//   }

//   return roles.length
//     ? roles.map(role => role.description)
//     : 'Không có vai trò';
// }
// const rolessss = user?.roles || []

// console.log('role:', rolessss);
// console.log('Roles present hihi:', rolesPresent(user));
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Vai trò và quyền
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="role-label">Vai trò</InputLabel>
            <Select
              labelId="role-label"
              value={selectedRole}
              label="Vai trò"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem
                  key={role.id}
                  value={role.id}
                  disabled={role.id === user.roleId}
                  sx={{
                    cursor: role.id === user.roleId ? 'not-allowed' : 'pointer'
                  }}
                >
                  {role.description} {role.id === user.roleId && '(Hiện tại)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedRole && <CheckboxGroup />}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              border: '1px solid #eee',
              borderRadius: 2,
              p: 3,
              bgcolor: '#fafafa',
              width: 360
            }}
          >
            <Typography variant="h6" gutterBottom>
              Xem trước quyết định
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg"
                alt="Avatar"
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.fullName}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'self-start', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Vai trò hiện tại:
              </Typography>
              <RolesPresent roles={user?.roles} />
            </Box>

            {selectedRoleObj && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'self-start', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Vai trò mới:
              </Typography>
              <RolesPresent roles={user?.roles} />
            </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quyền hạn
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <CrudChips user={user} subject="User" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Gửi
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RoleAssignment;
