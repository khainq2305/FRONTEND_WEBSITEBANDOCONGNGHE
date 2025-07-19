import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Chip
} from '@mui/material';

const PermissionFormModal = ({
  isOpen,
  onClose,
  onSave,
  categoryId = '',
  actions = [],
  subjects = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    action: [],
    subject: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        action: [],
        subject: '',
      });
    }
  }, [isOpen]);

  const handleToggleAction = (key) => {
    const isManage = key === 'manage';
    const isSelected = formData.action.includes(key);
    const manageSelected = formData.action.includes('manage');

    let updated = [...formData.action];

    if (isSelected) {
      updated = updated.filter(k => k !== key);
    } else {
      if (isManage) {
        updated = ['manage'];
      } else {
        updated = updated.filter(k => k !== 'manage');
        updated.push(key);
      }
    }

    setFormData({ ...formData, action: updated });
  };

  const handleToggleAllActions = () => {
    const allKeys = actions.map(a => a.key);
    const allSelected = allKeys.every(k => formData.action.includes(k));

    setFormData({
      ...formData,
      action: allSelected ? [] : allKeys.filter(k => k !== 'manage') // bỏ manage khỏi "chọn tất"
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: `permission-${Date.now()}`,
      category: categoryId,
    });
    onClose();
  };

  const allKeys = actions.map(a => a.key).filter(k => k !== 'manage');
  const allSelected = allKeys.length > 0 && allKeys.every(k => formData.action.includes(k));

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Tạo quyền mới</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Thêm một quyền hạn mới vào danh mục này.
          </Typography>

          <TextField
            label="Tên quyền"
            fullWidth
            margin="normal"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="Mô tả"
            fullWidth
            margin="normal"
            required
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Đối tượng (Subject) */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Đối tượng:
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {subjects.map((s) => (
              <Chip
                key={s.key}
                label={s.label}
                clickable
                color={formData.subject === s.key ? 'primary' : 'default'}
                onClick={() => setFormData({ ...formData, subject: s.key })}
              />
            ))}
          </div>

          {/* Hành động (Action) */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Hành động:
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {actions.map((a) => {
              const isSelected = formData.action.includes(a.key);
              const isManage = a.key === 'manage';
              const manageSelected = formData.action.includes('manage');
              const disabled = manageSelected && !isManage;

              return (
                <Chip
                  key={a.key}
                  label={a.label || a.key}
                  clickable
                  color={isSelected ? 'primary' : 'default'}
                  disabled={disabled}
                  onClick={() => handleToggleAction(a.key)}
                />
              );
            })}
          </div>

          {/* Nút chọn tất cả / bỏ chọn */}
          <Button
            variant="text"
            size="small"
            sx={{ mt: 1, mr: 2 }}
            onClick={handleToggleAllActions}
            disabled={formData.action.includes('manage')}
          >
            {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Button>

          <Button
            variant="text"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => setFormData({ ...formData, action: [] })}
          >
            Đặt lại hành động
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Tạo quyền
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PermissionFormModal;
