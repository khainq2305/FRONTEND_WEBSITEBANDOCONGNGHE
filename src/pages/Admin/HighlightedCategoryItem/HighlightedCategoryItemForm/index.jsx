import React, { useEffect, useState } from 'react';
import {
  Box, Button, Grid, TextField, Typography, MenuItem, Paper, Switch, FormControlLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { highlightedCategoryItemService } from '../../../../services/admin/highlightedCategoryItemService';
import toast from 'react-hot-toast';
import { Select } from '@mui/material';

const HighlightedCategoryItemForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      imageUrl: '',
      customTitle: '',
      customLink: '',
      categoryId: '',
      sortOrder: 0,
      isActive: true
    }
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchData();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await highlightedCategoryItemService.getCategories();
      const tree = buildCategoryTree(res.data || []);
      const flat = flattenCategories(tree);
      setCategories(flat);
      console.log('✅ Categories hiển thị:', flat.map(c => c.name));
    } catch (err) {
      console.error('❌ Lỗi lấy danh mục:', err);
    }
  };

  const buildCategoryTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    list.forEach((item) => {
      if (item.parentId) {
        map[item.parentId]?.children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };

  const flattenCategories = (list, level = 0, isLast = true, prefix = '') => {
    return list.flatMap((item, index) => {
      const isLastChild = index === list.length - 1;
      const newPrefix = prefix + (level > 0 ? (isLast ? '    ' : '│   ') : '');

      const label =
        level === 0
          ? item.name
          : `${prefix}${isLastChild ? '└── ' : '├── '}${item.name}`;

      const current = { id: item.id, name: label };
      const children = item.children?.length
        ? flattenCategories(item.children, level + 1, isLastChild, newPrefix)
        : [];

      return [current, ...children];
    });
  };

  const fetchData = async () => {
    try {
      const res = await highlightedCategoryItemService.getById(id);
      const item = res.data;
      reset(item);
      if (item.imageUrl) {
        setThumbnail({ file: null, url: item.imageUrl });
      }
    } catch (err) {
      console.error('❌ Lỗi load dữ liệu:', err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('customTitle', data.customTitle);
      formData.append('customLink', data.customLink);
      formData.append('categoryId', data.categoryId);
      formData.append('sortOrder', data.sortOrder);
      formData.append('isActive', data.isActive);
      if (data.imageUrl instanceof File) {
        formData.append('image', data.imageUrl);
      }

      if (!isEdit && !thumbnail?.file) {
        setError('imageUrl', {
          type: 'manual',
          message: 'Ảnh đại diện là bắt buộc!'
        });
        return;
      }

      if (isEdit) {
        await highlightedCategoryItemService.update(id, formData);
        toast.success('✅ Cập nhật thành công');
      } else {
        await highlightedCategoryItemService.create(formData);
        toast.success('✅ Thêm mới thành công');
      }
      navigate('/admin/highlighted-category-items');
    } catch (err) {
      console.log('TOÀN BỘ err.response TỪ SERVER:', err.response);
      const backendErrors = err?.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((error) => {
          setError(error.field, { type: 'manual', message: error.message });
        });
      } else {
        toast.error('❌ Lỗi lưu dữ liệu!');
      }
      console.error('❌ Submit error:', err);
    }
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? 'Cập nhật danh mục nổi bật' : 'Thêm danh mục nổi bật'}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {/* Upload ảnh */}
            <Grid item xs={12}>
              <Typography fontWeight={500} mb={1}>
                Ảnh đại diện <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Button variant="outlined" component="label">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setThumbnail({ file, url: URL.createObjectURL(file) });
                      setValue('imageUrl', file, { shouldValidate: true });
                    }
                  }}
                />
              </Button>
              {thumbnail?.url && (
                <Box mt={1}>
                  <img src={thumbnail.url} alt="preview" width={150} />
                </Box>
              )}
              <Controller
                name="imageUrl"
                control={control}
                rules={{ required: 'Ảnh đại diện là bắt buộc!' }}
                render={() => null}
              />
              {errors.imageUrl && (
                <Typography color="error" fontSize={13}>
                  {errors.imageUrl.message}
                </Typography>
              )}
            </Grid>

            {/* Tiêu đề */}
            <Grid item xs={12}>
              <Controller
                name="customTitle"
                control={control}
                rules={{ required: 'Tiêu đề là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tiêu đề"
                    fullWidth
                    error={!!errors.customTitle}
                    helperText={errors.customTitle?.message}
                  />
                )}
              />
            </Grid>

            {/* Link tuỳ chỉnh */}
            <Grid item xs={12}>
              <Controller
                name="customLink"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Link tuỳ chỉnh (nếu có)"
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* Danh mục liên kết */}
            <Grid item xs={12}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: 'Danh mục là bắt buộc' }}
                render={({ field }) => (
                  <Box>
                    <Typography fontWeight={500} mb={1}>
                      Danh mục liên kết <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Select
                      {...field}
                      fullWidth
                      displayEmpty
                      error={!!errors.categoryId}
                    >
                      <MenuItem value="">
                        <em>Chọn danh mục</em>
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <Typography color="error" fontSize={13}>
                        {errors.categoryId.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>

            {/* Thứ tự hiển thị */}
            <Grid item xs={12}>
              <Controller
                name="sortOrder"
                control={control}
                rules={{ required: 'Thứ tự hiển thị là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Thứ tự hiển thị"
                    fullWidth
                    error={!!errors.sortOrder}
                    helperText={errors.sortOrder?.message}
                  />
                )}
              />
            </Grid>

            {/* Trạng thái hiển thị */}
            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Kích hoạt hiển thị"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isEdit ? 'Cập nhật' : 'Lưu'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default HighlightedCategoryItemForm;
