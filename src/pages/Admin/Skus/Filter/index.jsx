import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';

const Filter = ({ search, onSearchChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Hành động hàng loạt - chưa xử lý ở đây */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="bulk-action-label">Hành động hàng loạt</InputLabel>
          <Select
            labelId="bulk-action-label"
            value="" // giữ trống vì chưa dùng
            onChange={() => {}}
            label="Hành động hàng loạt"
          >
            <MenuItem value="delete">Chuyển vào thùng rác</MenuItem>
            <MenuItem value="restore">Khôi phục</MenuItem>
            <MenuItem value="forceDelete">Xoá vĩnh viễn</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          disabled
          sx={{
            minWidth: 100,
            backgroundColor: '#f5f5f5',
            boxShadow: 'none',
            color: '#aaa',
          }}
        >
          Áp Dụng
        </Button>
      </Box>

      <TextField
        placeholder="Tìm kiếm..."
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 300, ml: 'auto' }}
      />
    </Box>
  );
};

export default Filter;
