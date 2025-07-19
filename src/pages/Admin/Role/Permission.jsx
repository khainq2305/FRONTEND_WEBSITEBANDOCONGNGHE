import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper
} from '@mui/material';
import axios from 'axios';
import PermissionFormModal from './PermissionForm';
import { PermissionCard } from './Card';

// ============ API CONFIG ============
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/admin',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

const subjectService = {
  getAll: () => apiClient.get('/subjects')
};

const permissionService = {
  getActionBySubject: (subjectKey) =>
    apiClient.get(`/permissions/actions/${subjectKey}`)
};

// ============ COMPONENT ============
const Permission = () => {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState([]); // [{ subject + actions }]
  const [selectedActions, setSelectedActions] = useState([]); // cho modal tạo mới
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSave = (data) => {
    console.log('Dữ liệu quyền đã lưu:', data);
    setOpen(false);
  };

  // Fetch toàn bộ subject và actions
  const fetchAllPermissions = async () => {
    try {
      const subjectRes = await subjectService.getAll();
      const subjects = subjectRes.data.data || [];

      const result = await Promise.all(
        subjects.map(async (subject) => {
          const actionRes = await permissionService.getActionBySubject(subject.key);
          return {
            ...subject,
            actions: actionRes.data.data || []
          };
        })
      );

      setPermissions(result);
    } catch (error) {
      console.error('Lỗi fetch subject + actions:', error);
    }
  };

  useEffect(() => {
    fetchAllPermissions();
  }, []);

  const handleOpenCreateModal = (subject) => {
    setSelectedSubject(subject.key);
    setSelectedActions(subject.actions);
    setOpen(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Phân quyền chức năng
      </Typography>

      <Grid container spacing={3}>
        {permissions.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.key}>
            <PermissionCard
              label={item.label}
              description={item.description}
              actions={item.actions}
              onAdd={() => handleOpenCreateModal(item)}
            />
          </Grid>
        ))}
      </Grid>

      <PermissionFormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        actions={selectedActions}
        subjects={permissions}
        categoryId="system"
        mode="create"
        onSave={handleSave}
      />
    </Box>
  );
};

export default Permission;
