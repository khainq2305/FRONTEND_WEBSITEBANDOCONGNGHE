import { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem,
  Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddCoupon = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '', description: '', discount: '', expiryDate: '', status: 'active'
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Thêm mã giảm giá
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Mã giảm giá"
            value={formData.code}
            onChange={e => setFormData({ ...formData, code: e.target.value })}
            fullWidth
          />
          <TextField
            label="Mô tả"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="Giảm giá (%)"
            type="number"
            value={formData.discount}
            onChange={e => setFormData({ ...formData, discount: e.target.value })}
            fullWidth
          />
          <TextField
            label="Ngày hết hạn"
            type="date"
            value={formData.expiryDate}
            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="expired">Hết hạn</MenuItem>
              <MenuItem value="used">Đã sử dụng</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => navigate('/admin/coupons')}>Hủy</Button>
            <Button variant="contained" onClick={() => navigate('/admin/coupons')}>Thêm</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddCoupon;
