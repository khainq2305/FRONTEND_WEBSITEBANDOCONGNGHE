import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserById } from 'services/admin/userService';
import {
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Chip
} from '@mui/material';

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

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(id)
      .then((res) => setUser(res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Typography color="error">Không tìm thấy người dùng</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Chi tiết người dùng
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <Avatar
              src={user.avatarUrl}
              alt={user.fullName}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6" align="center">
              {user.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              ID: {user.id}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={8} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{user.email}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Số điện thoại
                </Typography>
                <Typography>{user.phone || 'Chưa cập nhật'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày sinh
                </Typography>
                <Typography>{user.dateOfBirth || 'Chưa cập nhật'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Vai trò
                </Typography>
                <Chip label={convertRoleIdToLabel(user.roleId)} color="primary" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Chip
                  label={user.status === 1 ? 'Hoạt động' : 'Ngưng hoạt động'}
                  color={user.status === 1 ? 'success' : 'default'}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Đăng nhập gần nhất
                </Typography>
                <Typography>{user.lastLoginAt || 'Chưa đăng nhập'}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 3 }} />
        <Typography variant="caption" color="text.secondary" mt={2} display="block" textAlign="right">
          Cập nhật lần cuối: {user.updatedAt}
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserDetailPage;
