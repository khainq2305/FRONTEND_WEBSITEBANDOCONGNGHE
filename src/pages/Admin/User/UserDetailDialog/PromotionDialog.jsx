import React, { useState, useEffect } from 'react';

// Import các component và icon cần thiết từ Material-UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar'; // ✅ Import Avatar
import { rolesService } from '@/services/admin/rolesService';
// --- Component Dialog có thể tái sử dụng ---
// Bạn có thể lưu component này vào một file riêng, ví dụ: 'components/RoleSelectDialog.js'

/**
 * Dialog cho phép chọn nhiều vai trò từ một danh sách.
 *
 * @param {object} props
 * @param {boolean} props.open - State để điều khiển đóng/mở Dialog.
 * @param {Array<{id: number|string, label: string}>} props.roles - Danh sách tất cả vai trò.
 * @param {Array<number|string>} props.defaultSelected - Mảng các ID vai trò được chọn ban đầu.
 * @param {Function} props.onClose - Hàm được gọi khi đóng Dialog.
 * @param {Function} props.onApply - Hàm được gọi khi nhấn "Áp dụng", trả về mảng ID đã chọn.
 */
export default function RoleSelectDialog({ open, onClose, onApply, defaultSelected = [], user = [] }) {
  // State để lưu các ID của vai trò đang được chọn
  const [selectedIds, setSelectedIds] = useState([]);
  const [roles, setRoles] = useState([])
  // Biến kiểm tra xem vai trò Admin (id: 1) có đang được chọn hay không
  const isAdminSelected = selectedIds.includes(1);

  const getAllRoles = async () => {
    try {
      const res = await rolesService.getAll()
      setRoles(res.data.data)
      console.log('roles',res.data.data)
    } catch (error) {
      
    }
  }
  // Cập nhật state mỗi khi dialog mở
  useEffect(() => {
    if (open) {
      getAllRoles()
      // Nếu Admin có trong danh sách mặc định, chỉ chọn Admin và bỏ qua các vai trò khác.
      if (defaultSelected.includes(1)) {
        setSelectedIds([1]);
      } else {
        setSelectedIds(defaultSelected);
      }
    }
  }, [defaultSelected, open]);

  // Xử lý khi người dùng chọn/bỏ chọn item trong dropdown
  const handleChange = (event) => {
    const value = event.target.value;
    const newSelectedIds = typeof value === 'string' ? value.split(',') : value;

    // Nếu người dùng vừa chọn Admin, xóa các lựa chọn khác và chỉ giữ lại Admin.
    // Dùng lastIndexOf để tìm phần tử mới nhất được thêm vào.
    if (newSelectedIds[newSelectedIds.length - 1] === 1) {
      setSelectedIds([1]);
    } else {
      setSelectedIds(newSelectedIds);
    }
  };

  // Xử lý khi nhấn nút xóa (X) trên một Chip
  const handleDelete = (idToDelete) => {
    setSelectedIds((prev) => prev.filter((id) => id !== idToDelete));
  };

  // Xử lý khi nhấn nút "Áp dụng"
  const handleApply = () => {
    onApply(selectedIds);
    debugger
    onClose();
  };
  console.log(user)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Chọn chức năng đảm nhận
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* --- Phần chọn vai trò --- */}
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Vai trò</InputLabel>
          <Select
            labelId="role-select-label"
            multiple
            value={selectedIds}
            onChange={handleChange}
            label="Vai trò"
            renderValue={(selected) => `${selected.length} vai trò đã chọn`}
          >
            {roles.map((role) => (
              <MenuItem
                key={role.id}
                value={role.id}
                // ✅ LOGIC MỚI: Vô hiệu hóa các item khác nếu Admin đã được chọn
                disabled={isAdminSelected && role.id !== 1}
              >
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* --- Phần hiển thị các mục đã chọn (Chip) --- */}
        <Box sx={{ mt: 2, minHeight: 80, p: 1, border: '1px dashed', borderColor: 'grey.300', borderRadius: 2 }}>
          {selectedIds.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', pt: 3 }}>
              Chưa có chức năng nào được chọn
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedIds.map((id) => {
                const role = roles.find((r) => r.id === id);
                return (
                  <Chip key={id} label={role?.name || 'Không rõ'} onDelete={() => handleDelete(id)} color="primary" variant="outlined" />
                );
              })}
            </Box>
          )}
        </Box>
        {selectedIds.length > 0 && (
          <Box display="flex" gap={1} sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2, mt: 1.5, p: 1 }}>
            <Avatar>hihi</Avatar>
            <Box>
              <Typography fontSize={16} fontWeight={600}>
                {user.fullName}
              </Typography>
              <Box>
                {selectedIds.map((id) => {
                  const role = roles.find((r) => r.id === id);
                  return (
                    <Typography fontSize={12} key={id}>
                      {role?.name || 'Không rõ'}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleApply} variant="contained" disableElevation>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
