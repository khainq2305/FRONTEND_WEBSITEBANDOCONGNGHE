import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,} from '@mui/material';
import { permissionsService } from '@/services/admin/permissionService';

import UserPermissionCard from './UserPermissionCard';


export default function PermissionManagementPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await permissionsService.getSubject();
        setSubjects(res.data.data || []);
        console.log('đây đyâ', subjects);
      } catch (err) {
        console.error('Lỗi tải danh sách subjects:', err);
        setError('Không thể tải danh sách các mục quản lý. Vui lòng kiểm tra lại backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quản lý phân quyền
      </Typography>
      {subjects.map((item) => (
        <UserPermissionCard
          key={item.key}
          label={item.label}
          subject={item.key}
          desc={item.description}
        />
      ))}
    </Box>
  );
}
