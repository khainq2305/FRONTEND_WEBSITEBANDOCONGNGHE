import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Stack,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch
} from '@mui/material';
import Tag from './Tag';
import UploadImage from './UploadImage';

const Sidebar = ({
  title,
  setTitle,
  category,
  setCategory,
  status,
  setStatus,
  onSubmit
}) => {
  const [isScheduled, setIsScheduled] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      <Stack spacing={2}>
        

        <FormControl fullWidth> {/* ✅ phải có */}
          <InputLabel>Danh mục</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="congnghe">Công nghệ</MenuItem>
            <MenuItem value="marketing">Marketing</MenuItem>
            <MenuItem value="giaitri">Giải trí</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="active">Hiển thị</MenuItem>
            <MenuItem value="inactive">Ẩn</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth  >
            <Box className='mb-2 border rounded border-gray-300 px-3 py-0.5'>
              <FormControlLabel sx={{ ml: 0 }}
                control={<Switch checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  color="primary" />}
                label="Lên lịch đăng bài"
                labelPlacement="start"
              />
            </Box>
            {isScheduled && (
              <TextField sx={{mt: 1}}
                label="Ngày đăng bài"
                type="datetime-local"
                defaultValue="2024-05-16T08:30"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
        </FormControl>
        <FormControl>
          <UploadImage />
          </FormControl>    
        <Tag />
        <Button variant="contained" fullWidth onClick={onSubmit}>
          Lưu Bài Viết
        </Button>
      </Stack>
    </div>
  );
};

export default Sidebar;
