import React, { useState, useEffect } from 'react';
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
  Switch,
  FormHelperText
} from '@mui/material';
import Tag from './Tag';
import UploadImage from '@/pages/Admin/News/components/form/UploadImage';
import { useArticle } from '@/pages/Admin/News/components/form/FormPost'; // lấy từ context nội bộ

const Sidebar = () => {
  const {
    category, setCategory,
    categories, setCategories,
    status, setStatus,
    isScheduled, setIsScheduled,
    publishAt, setPublishAt,
    errors, setErrors, // 👈 thêm
    handleSubmit, // đổi tên onSubmit thành handleSubmit để đồng bộ context
    mode
  } = useArticle();
  useEffect(() => {
    if (isScheduled && publishAt) {
      const now = new Date();
      const target = new Date(publishAt);
      const diff = target - now;

      const MIN = 30 * 60 * 1000;
      const MAX = 30 * 24 * 60 * 60 * 1000;

      if (diff < MIN) {
        setErrors(prev => ({ ...prev, publishAt: 'Thời gian phải cách hiện tại ít nhất 30 phút' }));
      } else if (diff > MAX) {
        setErrors(prev => ({ ...prev, publishAt: 'Không được đặt lịch đăng quá 30 ngày' }));
      } else {
        setErrors(prev => ({ ...prev, publishAt: null }));
      }
    }
  }, [publishAt, isScheduled]);

  const timeText = (targetTimeStr) => {
    if (!targetTimeStr) return '';

    const now = new Date();
    const target = new Date(targetTimeStr);

    const diff = target.getTime() - now.getTime(); // milliseconds
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `Sẽ đăng sau ${days} ngày ${hours} giờ ${minutes} phút`;
  };


  return (
    <div style={{ width: '100%' }}>
      <Stack spacing={2}>
        

        <FormControl fullWidth error={!!errors.category}>
          <InputLabel>Danh mục</InputLabel>
          <Select
  value={category}
  onChange={(e) => {
    setCategory(e.target.value);
    setErrors(prev => ({ ...prev, category: null }));
  }}
>
  {categories.map((c) => (
    <MenuItem key={c.id} value={c.id}>
      {c.name}
    </MenuItem>
  ))}
</Select>

          <FormHelperText>{errors.category || ''}</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isScheduled}
          >
            <MenuItem value="1">Đăng bài</MenuItem>
            <MenuItem value="0">Nháp</MenuItem>
          </Select>
        </FormControl>

        {/* Bật / tắt lên lịch */}
        <FormControl fullWidth error={!!errors.category}>
          <Box className="mb-2 border rounded border-gray-300 px-3 py-0.5">
            <FormControlLabel
              sx={{ ml: 0 }}
              control={
                <Switch
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  color="primary"
                />
              }
              label="Lên lịch đăng bài"
              labelPlacement="start"
            />
          </Box>
        </FormControl>

        {/* Nếu có lên lịch, thì hiện input ngày + helperText */}
        {isScheduled && (
          <Box mt={1}>
            <TextField
              label="Ngày đăng bài"
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.publishAt}
              helperText={errors.publishAt || ''}
            />


            {publishAt && !errors.publishAt && (
              <FormHelperText>
                {timeText(publishAt)}
              </FormHelperText>
            )}
          </Box>
        )}


        <Box>

          <UploadImage />

          {errors.avatar && (
            <FormHelperText error>{errors.avatar}</FormHelperText>
          )}
        </Box>



        <Tag />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
  {mode === 'edit' ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết'}
</Button>
      </Stack>
    </div>
  );
};

export default Sidebar;
