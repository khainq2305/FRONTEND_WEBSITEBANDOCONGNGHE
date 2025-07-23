import React, { useEffect, useState } from 'react';
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
  FormHelperText,
  Typography
} from '@mui/material';

import Tag from './Tag';
import UploadImage from '@/pages/Admin/News/components/form/UploadImage';

const Sidebar = ({
  category,
  setCategory,
  categories,
  status,
  setStatus,
  isScheduled,
  setIsScheduled,
  publishAt,
  setPublishAt,
  errors,
  setErrors,
  handleSubmit,
  thumbnail,
  setThumbnail,
  tags,
  setTags,
  allTags,
  isFeature,
  setIsFeature,
  mode,
  newCategory,
  setNewCategory,
  onAddCategory,
  onCancelAddCategory
  
  
}) => {
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
  }, [publishAt, isScheduled, setErrors]);

  const timeText = (targetTimeStr) => {
    if (!targetTimeStr) return '';
    const now = new Date();
    const target = new Date(targetTimeStr);
    const diff = target.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `Sẽ đăng sau ${days} ngày ${hours} giờ ${minutes} phút`;
  };

  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      <Stack spacing={2}>
        <Box>
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
                {'— '.repeat(c.level) + c.name}
              </MenuItem>
            ))}
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>} {/* <-- Đảm bảo dòng này có */}
        </FormControl>
        <Typography
          variant="body1"
          
          sx={{ fontSize:'14px', cursor: 'pointer', color: 'secondary.main',textDecoration: 'underline', margin: '2px 0px' }}
          onClick={() => setShowAddCategoryInput(true)}
        >
          Thêm danh mục
        </Typography>
        {showAddCategoryInput && (
          <Box>
            <TextField
          size="small"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Tên danh mục mới"
          fullWidth
        />
          <Box display="flex" gap={1} mt={1}>
            
            <Button
              variant="text"
              onClick={() => {
                if (onAddCategory) {
                  onAddCategory(newCategory);
                }
                setShowAddCategoryInput(false);
                setNewCategory('');
              }}
              disabled={!newCategory}
            >
              Thêm
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                setShowAddCategoryInput(false);
                setNewCategory('');
              }}
            >
              Hủy
            </Button>
          </Box>
          </Box>
        )}
        </Box>
        
        
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

        <FormControl fullWidth>
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
              <FormHelperText>{timeText(publishAt)}</FormHelperText>
            )}
          </Box>
        )}
        <FormControlLabel className="mb-2 border rounded border-gray-300 px-3 py-0.5"
            control={
              <Switch
                checked={isFeature}
                onChange={(e) => setIsFeature(e.target.checked)}
              />
            }
            label="Đánh dấu là bài viết nổi bật"
            sx={{ mt: 2 }}
          />
        <Box>
          <UploadImage thumbnail={thumbnail} setThumbnail={setThumbnail} />
          {errors.thumbnail && (
            <FormHelperText error>{errors.thumbnail}</FormHelperText>
          )}
        </Box>

        <Tag tags={tags} setTags={setTags} allTags={allTags} />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          {mode === 'edit' ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết'}
        </Button>
      </Stack>
    </div>
  );
};

export default Sidebar;
