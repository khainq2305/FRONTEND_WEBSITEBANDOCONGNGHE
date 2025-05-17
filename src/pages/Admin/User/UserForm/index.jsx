// src/pages/Admin/User/UserForm/index.jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const roles = ['admin', 'sales', 'product', 'marketing', 'support', 'content', 'user'];
const statuses = [
  { label: 'Hoạt động', value: 'active' },
  { label: 'Khóa', value: 'inactive' }
];

const UserFormDialog = ({ open, onClose, onSubmit, initialData = {}, asPage = false }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    status: 'active'
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || '',
        password: '',
        status: initialData.status || 'active'
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.email) return alert('Email không được để trống');
    if (!form.role) return alert('Vui lòng chọn vai trò');
    onSubmit(form);
    if (!asPage) onClose();
  };

  const FormContent = (
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <TextField
        fullWidth
        label="Họ tên"
        variant="outlined"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      {!initialData?.id && (
        <TextField
          fullWidth
          label="Mật khẩu"
          type="password"
          variant="outlined"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
      )}
      <TextField
        select
        fullWidth
        label="Vai trò"
        variant="outlined"
        value={form.role}
        onChange={(e) => handleChange('role', e.target.value)}
        SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200 } } } }}
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Trạng thái"
        variant="outlined"
        value={form.status}
        onChange={(e) => handleChange('status', e.target.value)}
      >
        {statuses.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      <Box display="flex" justifyContent="flex-end" gap={1} pt={2}>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>Lưu</Button>
      </Box>
    </Box>
  );

  if (asPage) return <div>{FormContent}</div>;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData?.id ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}</DialogTitle>
      <DialogContent dividers>{FormContent}</DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
