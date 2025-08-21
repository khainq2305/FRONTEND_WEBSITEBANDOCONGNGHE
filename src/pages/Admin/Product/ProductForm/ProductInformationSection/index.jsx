import React, { useState, useEffect } from 'react';

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

import BannerUpload from '../../../../../components/Admin/BannerUpload';
import TinyEditor from '../../../../../components/Admin/TinyEditor';
import AddCategoryDialog from '../AddCategoryDialog';
import AddBrandDialog from '../AddBrandDialog';
import { toast } from 'react-toastify';

const badgeOptions = [
  { label: 'Giao nhanh', value: 'GIAO NHANH' },
  { label: 'Thu cũ đổi mới', value: 'THU CŨ ĐỔI MỚI' },
  { label: 'Giá tốt', value: 'GIÁ TỐT' },
  { label: 'Trả góp 0%', value: 'TRẢ GÓP 0%' },
  { label: 'Giá kho', value: 'GIÁ KHO' }
];

const ProductInformationSection = ({
  formData,
  handleChange,
  formErrors,
  setFormData,
  infoContent,
  setBrandList,
  setInfoContent,
  thumbnail,
  setCategoryTree,
  setThumbnail,
  badgeImage,
  setBadgeImage,
  categoryTree,
  brandList
}) => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddBrand, setOpenAddBrand] = useState(false);

  const renderCategoryOptions = (categories, level = 0, prefix = '') => {
    let options = [];
    categories.forEach((cat, index) => {
      const isLast = index === categories.length - 1;
      const currentPrefix = prefix + (isLast ? '└── ' : '├── ');

      options.push(
      <MenuItem key={cat.id} value={cat.id} sx={{ pl: level * 3 + 2 }}>
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
          label={
            <>
              Tên sản phẩm{' '}
              <Typography component="span" color="error">
                *
              </Typography>
            </>
          }
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

        <Box sx={{ my: 2 }}>
          <TextField
            select
            fullWidth
            label={
              <>
                Danh mục{' '}
                <Typography component="span" color="error">
                  *
                </Typography>
              </>
            }
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            error={!!formErrors.categoryId}
            helperText={formErrors.categoryId}
             SelectProps={{
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 300, 
          width: 350     
        }
      }
    }
  }}
          >
            <MenuItem value="">-- Chọn danh mục --</MenuItem>
            {renderCategoryOptions(categoryTree)}
          </TextField>

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button variant="outlined" size="small" onClick={() => setOpenAddCategory(true)}>
              + Thêm danh mục mới
            </Button>
          </Box>
        </Box>

        <Box sx={{ my: 2 }}>
          <TextField
            select
            fullWidth
            label={
              <>
                Thương hiệu{' '}
                <Typography component="span" color="error">
                  *
                </Typography>
              </>
            }
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            error={!!formErrors.brandId}
            helperText={formErrors.brandId}
             SelectProps={{
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 300,
          width: 350 
        }
      }
    }
  }}
          >
            <MenuItem value="">-- Chọn thương hiệu --</MenuItem>
            {brandList.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button variant="outlined" size="small" onClick={() => setOpenAddBrand(true)}>
              + Thêm thương hiệu mới
            </Button>
          </Box>
        </Box>

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

        <BannerUpload value={badgeImage} onChange={setBadgeImage} sx={{ mt: 3 }} />
        <TextField
          sx={{ mt: 3 }}
          select
          fullWidth
          label={
            <>
              Trạng thái{' '}
              <Typography component="span" color="error">
                *
              </Typography>
            </>
          }
          name="isActive"
          value={formData.isActive ? '1' : '0'}
          onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === '1' }))}
        >
          <MenuItem value="1">Hiển thị</MenuItem>
          <MenuItem value="0">Ẩn</MenuItem>
        </TextField>

        <TextField
          type="number"
          fullWidth
          label="Thứ tự hiển thị"
          name="orderIndex"
          value={formData.orderIndex}
          onChange={handleChange}
          sx={{ mt: 3 }}
          error={!!formErrors.orderIndex}
          helperText={formErrors.orderIndex}
        />
      </Grid>
      <AddCategoryDialog
  open={openAddCategory}
  onClose={() => setOpenAddCategory(false)}
  onSuccess={(newCategory) => {
    setCategoryTree((prev) => [
      ...prev,
      {
        ...newCategory,
        children: []
      }
    ]);

    setFormData((prev) => ({
      ...prev,
      categoryId: String(newCategory.id)
    }));

    toast.success('Thêm danh mục thành công');
  }}
  categoryTree={categoryTree}
/>



      <AddBrandDialog
        open={openAddBrand}
        onClose={() => setOpenAddBrand(false)}
        onSuccess={(newBrand) => {
          setBrandList((prev) => [...prev, newBrand]);
          setFormData((prev) => ({ ...prev, brandId: newBrand.id }));
        }}
      />
    </>
  );
};

export default ProductInformationSection;
