import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  TextField,
  Button,
  FormHelperText,
  Stack
} from '@mui/material';

import Tag from './Tag';
import UploadImage from '@/pages/Admin/News/components/form/UploadImage';
import SwitchCustom from '@/components/Admin/SwitchCustom';

const Sidebar = ({
  control,
  errors,
  setError,
  clearErrors,
  setValue,
  watch,
  isSubmitting,
  mode,
  onAddCategory
}) => {
  const watchedValues = watch();
  const { 
    categories, 
    allTags, 
    isScheduled, 
    isFeature,
    newCategory,
    tags,
    thumbnail,
    status,
    publishAt
  } = watchedValues;

  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  // Hàm tính thời gian còn lại
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

  const handleImageUpload = (file) => {
    setValue("thumbnail", file);
    clearErrors("thumbnail");
  };

  const handleAddCategory = () => {
    if (newCategory?.trim()) {
      onAddCategory();
      setShowAddCategoryInput(false);
      setValue("newCategory", "");
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Stack spacing={2}>
        {/* Category Selection */}
        <Box>
        <Controller
  name="categoryId"
  control={control}
  rules={{ required: "Vui lòng chọn danh mục" }}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.categoryId}>
      <InputLabel>Danh mục</InputLabel>
      <Select
        {...field} // ⚡ quan trọng, bind field
        value={field.value || ''}
        onChange={(e) => {
          field.onChange(e.target.value);
          clearErrors("categoryId");
        }}
      >
        {categories?.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {'— '.repeat(c.level || 0) + c.name}
          </MenuItem>
        ))}
      </Select>
      {errors.categoryId && (
        <FormHelperText>{errors.categoryId.message}</FormHelperText>
      )}
    </FormControl>
  )}
/>


          
          <Typography
            variant="body1"
            sx={{ 
              fontSize: '14px', 
              cursor: 'pointer', 
              color: 'secondary.main',
              textDecoration: 'underline', 
              margin: '8px 0px' 
            }}
            onClick={() => setShowAddCategoryInput(true)}
          >
            Thêm danh mục
          </Typography>

          {showAddCategoryInput && (
            <Box>
              <Controller
                name="newCategory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    placeholder="Tên danh mục mới"
                    fullWidth
                    error={!!errors.newCategory}
                    helperText={errors.newCategory?.message}
                  />
                )}
              />
              <Box display="flex" gap={1} mt={1}>
                <Button
                  variant="text"
                  onClick={handleAddCategory}
                  disabled={!newCategory?.trim()}
                >
                  Thêm
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => {
                    setShowAddCategoryInput(false);
                    setValue("newCategory", "");
                    clearErrors("newCategory");
                  }}
                >
                  Hủy
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                {...field}
                disabled={isScheduled}
              >
                <MenuItem value={1}>Đăng bài</MenuItem>
                <MenuItem value={0}>Nháp</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        {/* Thumbnail Upload */}
        <Box mt={2}>
  <Controller
    name="thumbnail"
    control={control}
    rules={{ required: "Vui lòng chọn ảnh thumbnail" }}
    render={({ field }) => (
      <UploadImage
        thumbnail={field.value}
        setThumbnail={(file) => field.onChange(file)}
      />
    )}
  />
  {errors.thumbnail && (
    <FormHelperText error>{errors.thumbnail.message}</FormHelperText>
  )}
</Box>

        {/* Schedule Publishing */}
        <FormControl fullWidth>
          <Box display={'flex'} gap={0} alignItems={'center'} className="px-3">
            <Controller
              name="isScheduled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <SwitchCustom
  checked={field.value}
  onChange={(e) => {
    field.onChange(e.target.checked);
    if (!e.target.checked) {
      setValue("publishAt",null); // reset ngay khi tắt
      clearErrors("publishAt");
    }
  }}
/>

                  }
                />
              )}
            />
            <Typography>Lên lịch đăng bài</Typography>
          </Box>
        </FormControl>

        {/* Publish Date */}
        {isScheduled && (
          <Box mt={1}>
            <Controller
              name="publishAt"
              control={control}
              rules={{
                required: isScheduled ? "Vui lòng chọn thời gian đăng bài" : false,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ngày đăng bài"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.publishAt}
                  helperText={errors.publishAt?.message}
                />
              )}
            />
            {publishAt && !errors.publishAt && (
              <FormHelperText>{timeText(publishAt)}</FormHelperText>
            )}
          </Box>
        )}

        {/* Feature Post */}
        <FormControl fullWidth>
          <Box display={'flex'} gap={0} alignItems={'center'} className="px-3">
            <Controller
              name="isFeature"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <SwitchCustom
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                />
              )}
            />
            <Typography>Đánh dấu là bài viết nổi bật</Typography>
          </Box>
        </FormControl>

        {/* Tags - Uncomment if needed */}
        {/* <Tag tags={tags} setTags={setTags} allTags={allTags} /> */}

        {/* Submit Button */}
        <Button 
          variant="contained" 
          fullWidth 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (mode === 'edit' ? 'Đang cập nhật...' : 'Đang đăng...') 
            : (mode === 'edit' ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết')
          }
        </Button>
      </Stack>
    </div>
  );
};

export default Sidebar;