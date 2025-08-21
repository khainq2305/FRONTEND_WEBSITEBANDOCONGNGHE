import { Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { getAllRoles } from '../../../../services/admin/userService';
import { toast } from 'react-toastify';

const statuses = [
  { label: 'Hoạt động', value: 1 },
  { label: 'Ngưng hoạt động', value: 0 }
];

const UserFormDialog = ({ open, onClose, onSubmit, initialData = {}, asPage = false, errors = {} }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    roleId: '',
    password: '',
    status: 1
  });

  const [formErrors, setFormErrors] = useState({});
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        roleId: initialData.roleId || '',
        password: '',
        status: initialData.status ?? 1
      });
    }
  }, [initialData]);

  useEffect(() => {
    setFormErrors(errors || {});
  }, [errors]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
        if (data.length > 0 && !form.roleId) {
          setForm((prev) => ({ ...prev, roleId: data[0].id }));
        }
      } catch {
        toast.error('Không tải được danh sách vai trò');
      }
    };
    // fetchRoles();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  const commonInputProps = {
    fullWidth: true,
    variant: 'outlined',
    sx: {
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#fff',
        '& fieldset': {
          borderColor: '#ccc'
        },
        '&:hover fieldset': {
          borderColor: '#000'
        },
        '&.Mui-focused fieldset': {
          borderColor: '#000'
        },
        '&.Mui-focused': {
          outline: 'none'
        }
      },
      '& input': {
        outline: 'none !important',
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 1000px white inset', 
          WebkitTextFillColor: '#000'
        }
      },
      '& label.Mui-focused': {
        color: '#000'
      }
    }
  };

  const FormContent = (
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <TextField
        {...commonInputProps}
        label="Họ tên"
        value={form.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        error={!!formErrors.fullName}
        helperText={formErrors.fullName}
      />
      <TextField
        {...commonInputProps}
        label="Email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      {!initialData?.id && (
        <TextField
          {...commonInputProps}
          label="Mật khẩu"
          type="password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={!!formErrors.password}
          helperText={formErrors.password}
        />
      )}
      <TextField
        {...commonInputProps}
        select
        label="Vai trò"
        value={form.roleId?.toString() || ''}
        onChange={(e) => handleChange('roleId', e.target.value)}
        error={!!formErrors.roleId}
        helperText={formErrors.roleId}
      >
        {roles.length > 0 ? (
          roles.map((role) => (
            <MenuItem key={role.id} value={role.id.toString()}>
              {role.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            Không có vai trò
          </MenuItem>
        )}
      </TextField>

      <TextField
        {...commonInputProps}
        select
        label="Trạng thái"
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
        <Button
          onClick={onClose}
          sx={{
            color: '#000',
            backgroundColor: '#f3f3f3',
            '&:hover': {
              backgroundColor: '#ddd'
            }
          }}
        >
          Hủy
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#222'
            }
          }}
        >
          Lưu
        </Button>
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
