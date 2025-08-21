import React, { useEffect, useState } from 'react';
import {
  Box,
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { highlightedCategoryItemService } from '../../../../services/admin/highlightedCategoryItemService';
import { Select } from '@mui/material';
import ThumbnailUpload from '../../../../components/Admin/ThumbnailUpload';
import Toastify from '../../../../components/common/Toastify';
import { toast } from 'react-toastify';
import LoaderAdmin from '../../../../components/Admin/LoaderVip/';
import { API_BASE_URL } from '../../../../constants/environment';
import Breadcrumb from '../../../../components/common/Breadcrumb';

const HighlightedCategoryItemForm = () => {
  const { slug } = useParams();
  const isEdit = !!slug;

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      categoryId: '',
      sortOrder: 0,
      isActive: true,
      labelType: ''
    }
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchData();
  }, [slug]);

  const fetchCategories = async () => {
    try {
      const res = await highlightedCategoryItemService.getCategories();
      const tree = buildCategoryTree(res.data || []);
      const flat = flattenCategories(tree);
      setCategories(flat);
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    }
  };

  const buildCategoryTree = (list) => {
    const map = {};
    const roots = [];
    list.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });
    list.forEach((item) => {
      if (item.parentId) map[item.parentId]?.children.push(map[item.id]);
      else roots.push(map[item.id]);
    });
    return roots;
  };

  const flattenCategories = (list, level = 0, isLast = true, prefix = '') => {
    return list.flatMap((item, index) => {
      const isLastChild = index === list.length - 1;
      const newPrefix = prefix + (level > 0 ? (isLast ? '    ' : '│   ') : '');
      const label = level === 0 ? item.name : `${prefix}${isLastChild ? '└── ' : '├── '}${item.name}`;
      const current = { id: item.id, name: label };
      const children = item.children?.length ? flattenCategories(item.children, level + 1, isLastChild, newPrefix) : [];
      return [current, ...children];
    });
  };

  const fetchData = async () => {
    try {
      const res = await highlightedCategoryItemService.getById(slug);


      const item = res.data;

      reset({
        imageUrl: item.imageUrl || '',
        customTitle: item.customTitle || '',
        categoryId: item.categoryId || '',
        sortOrder: item.sortOrder || 0,
        isActive: item.isActive ?? true
      });

      if (item.imageUrl) {
        const url = item.imageUrl.startsWith('http') ? item.imageUrl : `${API_BASE_URL}/uploads/${item.imageUrl}`;
        setThumbnail({ file: null, url });
      }
    } catch (err) {
      console.error('Lỗi load dữ liệu:', err);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('customTitle', data.customTitle);
      formData.append('categoryId', data.categoryId);
      formData.append('sortOrder', data.sortOrder);
      formData.append('isActive', data.isActive);

      formData.append('isHot', data.labelType === 'hot');
      formData.append('isNew', data.labelType === 'new');
      formData.append('isFeatured', data.labelType === 'featured');

      if (data.imageUrl instanceof File) {
        formData.append('image', data.imageUrl);
      }

      if (!isEdit && !thumbnail?.file) {
        setError('imageUrl', {
          type: 'manual',
          message: 'Ảnh đại diện là bắt buộc!'
        });
        setIsLoading(false);
        return;
      }

      if (isEdit) {
        await highlightedCategoryItemService.update(slug, formData);
        toast.success('Cập nhật thành công', {
          onClose: () => navigate('/admin/highlighted-category-items'),
          autoClose: 500
        });
      } else {
        await highlightedCategoryItemService.create(formData);
        toast.success('Thêm mới thành công', {
          onClose: () => navigate('/admin/highlighted-category-items'),
          autoClose: 500
        });
      }
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((error) => {
          setError(error.field, { type: 'manual', message: error.message });
        });
      } else {
        toast.error('Lỗi lưu dữ liệu!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>

      {isLoading && <LoaderAdmin fullscreen />}
      <Breadcrumb

        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Danh mục nổi bật', href: '/admin/highlighted-category-items' },
          { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' }
        ]}
      />

      <Box >
        <Paper elevation={3} sx={{ p: 3, mt: 2, }}>
          <Typography variant="h5" mb={3}>
            {isEdit ? 'Cập nhật danh mục nổi bật' : 'Thêm danh mục nổi bật'}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>

                <ThumbnailUpload
                  value={thumbnail}
                  onChange={(val) => {
                    setThumbnail(val);
                    setValue('imageUrl', val?.file || '', { shouldValidate: true });
                  }}
                />
                <Controller name="imageUrl" control={control} rules={{ required: 'Ảnh đại diện là bắt buộc!' }} render={() => null} />
                {errors.imageUrl && (
                  <Typography color="error" fontSize={13} mt={1}>
                    {errors.imageUrl.message}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="customTitle"
                  control={control}
                  rules={{ required: 'Tiêu đề là bắt buộc' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Tiêu đề <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      fullWidth
                      error={!!errors.customTitle}
                      helperText={errors.customTitle?.message}
                    />
                  )}
                />
              </Grid>

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
                      <Select {...field} fullWidth displayEmpty error={!!errors.categoryId}>
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
              <Grid item xs={12}>
                <Controller
                  name="labelType"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Chọn nhãn hiển thị</FormLabel>
                      <RadioGroup {...field} row>
                        <FormControlLabel value="hot" control={<Radio />} label="HOT" />
                        <FormControlLabel value="new" control={<Radio />} label="Mới" />
                        <FormControlLabel value="featured" control={<Radio />} label="Nổi bật" />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
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
    </>
  );
};

export default HighlightedCategoryItemForm;
