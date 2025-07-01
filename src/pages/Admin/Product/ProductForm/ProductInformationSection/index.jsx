import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormHelperText,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button
} from '@mui/material';
import ThumbnailUpload from '../../ThumbnailUpload';
import BannerUpload    from '../../../../../components/Admin/BannerUpload';   
import TinyEditor from '../../../../../components/Admin/TinyEditor';

const badgeOptions = [
  { label: 'Giao nhanh', value: 'GIAO NHANH' },
  { label: 'Thu cũ đổi mới', value: 'THU CŨ ĐỔI MỚI' },
  { label: 'Giá tốt', value: 'GIÁ TỐT' },
  { label: 'Trả góp 0%', value: 'TRẢ GÓP 0%' }
];

const ProductInformationSection = ({
  formData,
  handleChange,
  formErrors,
  setFormData,
  infoContent,
  setInfoContent,
  thumbnail,
  setThumbnail,
  badgeImage,
  setBadgeImage,
  categoryTree,
  brandList
}) => {
  const renderCategoryOptions = (categories, level = 0, prefix = '') => {
    let options = [];
    categories.forEach((cat, index) => {
      const isLast = index === categories.length - 1;
      const currentPrefix = prefix + (isLast ? '└── ' : '├── ');

      options.push(
        <MenuItem key={cat.id} value={cat.id} sx={{ pl: level * 2 }}>
          <span style={{ whiteSpace: 'pre' }}>{currentPrefix}</span>
          {cat.name}
        </MenuItem>
      );

      if (cat.children && cat.children.length > 0) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        options = options.concat(renderCategoryOptions(cat.children, level + 1, newPrefix));
      }
    });
    return options;
  };

  const handleClearBadge = () => {
    const mockEvent = {
      target: { name: 'badge', value: '' }
    };
    handleChange(mockEvent);
  };

  return (
    <>
      {/* CỘT BÊN TRÁI */}
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          label="Tên sản phẩm"
          name="name"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
          error={!!formErrors.name}
          helperText={formErrors.name}
        />

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Mô tả chi tiết
        </Typography>
        <TinyEditor value={formData.description} onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))} height={400} />

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Thông tin thêm
        </Typography>
        <TinyEditor value={infoContent} onChange={setInfoContent} height={250} />
      </Grid>

      {/* CỘT BÊN PHẢI */}
      <Grid item xs={12} md={4}>
        <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
        {formErrors.thumbnail && (
          <FormHelperText error sx={{ ml: 2, mt: 1 }}>
            {formErrors.thumbnail}
          </FormHelperText>
        )}

        <TextField
          select
          fullWidth
          label="Danh mục"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          sx={{ mt: 3, mb: 2 }}
          error={!!formErrors.categoryId}
          helperText={formErrors.categoryId}
        >
          <MenuItem value="">-- Chọn danh mục --</MenuItem>
          {renderCategoryOptions(categoryTree)}
        </TextField>

        <TextField
          select
          fullWidth
          label="Thương hiệu"
          name="brandId"
          value={formData.brandId}
          onChange={handleChange}
          sx={{ mb: 2 }}
          error={!!formErrors.brandId}
          helperText={formErrors.brandId}
        >
          <MenuItem value="">-- Chọn thương hiệu --</MenuItem>
          {brandList.map((brand) => (
            <MenuItem key={brand.id} value={brand.id}>
              {brand.name}
            </MenuItem>
          ))}
        </TextField>

        <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormLabel component="legend">Nhãn sản phẩm</FormLabel>
            {formData.badge && (
              <Button size="small" variant="text" onClick={handleClearBadge} sx={{ textTransform: 'none' }}>
                Xóa chọn
              </Button>
            )}
          </Box>
          <RadioGroup aria-label="badge" name="badge" value={formData.badge || ''} onChange={handleChange}>
            <Grid container>
              {badgeOptions.map((option) => (
                <Grid item xs={6} key={option.value}>
                  <FormControlLabel value={option.value} control={<Radio size="small" />} label={option.label} />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
          {formErrors.badge && <FormHelperText error>{formErrors.badge}</FormHelperText>}
        </FormControl>

       <BannerUpload
  value={badgeImage}
  onChange={setBadgeImage}
  sx={{ mt: 3 }}
/>
        <TextField
         sx={{ mt: 3 }}
          select
          fullWidth
          label="Trạng thái"
          name="isActive"
          value={formData.isActive ? '1' : '0'}
          onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === '1' }))}
        >
          <MenuItem value="1">Hiển thị</MenuItem>
          <MenuItem value="0">Ẩn</MenuItem>
        </TextField>
      </Grid>
    </>
  );
};

export default ProductInformationSection;
