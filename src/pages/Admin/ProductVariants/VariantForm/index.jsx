import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Switch, FormControlLabel, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { variantService } from '../../../../services/admin/variantService';
import TinyEditor from '../../../../components/Admin/TinyEditor';
import LoaderAdmin from '../../../../components/Admin/LoaderVip';
import Breadcrumb from '../../../../components/common/Breadcrumb';

const variantTypes = [
  { value: 'color', label: 'Màu sắc' },
  { value: 'text', label: 'Chữ' }
];

const VariantForm = () => {
  const { variantId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(variantId);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      description: '',
      isActive: true
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        await variantService.update(variantId, data);
        toast.success('Cập nhật thành công');
      } else {
        await variantService.createVariant(data);
        toast.success('Thêm mới thành công');
      }
      navigate('/admin/product-variants');
    } catch (err) {
      const responseErrors = err?.response?.data?.errors;

      if (Array.isArray(responseErrors)) {
        responseErrors.forEach((e) => {
          if (e.field) {
            setError(e.field, { type: 'manual', message: e.message });
          }
        });
      }

      toast.error('Lỗi khi lưu');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await variantService.getById(variantId);
      reset({
        name: res.data.name || '',
        type: res.data.type || '',
        description: res.data.description || '',
        isActive: res.data.isActive ?? true
      });
    } catch (err) {
      toast.error('Không tìm thấy thuộc tính');
      navigate('/admin/product-variants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) fetchDetail();
  }, [variantId]);
  if (isLoading) return <LoaderAdmin fullscreen />;

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/admin' },
          { label: 'Thuộc tính sản phẩm', href: '/admin/product-variants' },
          { label: isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }
        ]}
      />
      <Paper sx={{ width: '100%', p: 3, mt: 2 }}>
        <Typography variant="h5" mb={3}>
          {isEditMode ? 'Cập nhật thuộc tính' : 'Thêm thuộc tính mới'}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Controller
      name="name"
      control={control}
      rules={{ required: 'Tên không được để trống' }}
      render={({ field, fieldState }) => (
        <TextField
          label={
            <span>
              Tên thuộc tính <span style={{ color: 'red' }}>*</span>
            </span>
          }
          fullWidth
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />

    <Controller
      name="type"
      control={control}
      rules={{ required: 'Vui lòng chọn kiểu hiển thị' }}
      render={({ field }) => (
        <TextField
          select
          label={
            <span>
              Kiểu thuộc tính <span style={{ color: 'red' }}>*</span>
            </span>
          }
          fullWidth
          {...field}
          error={!!errors.type}
          helperText={errors.type?.message}
        >
          {variantTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />

    <Controller
      name="description"
      control={control}
      render={({ field }) => <TinyEditor value={field.value} onChange={field.onChange} height={300} />}
    />

    <Controller
      name="isActive"
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
          label="Kích hoạt"
        />
      )}
    />

    <Box>
      <Button type="submit" variant="contained" size="large">
        {isEditMode ? 'Cập nhật' : 'Thêm mới'}
      </Button>
    </Box>
  </Box>
</form>
      </Paper>
    </>
  );
};

export default VariantForm;
