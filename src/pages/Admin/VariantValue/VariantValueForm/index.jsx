import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Switch, FormControlLabel, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { variantValueService } from '../../../../services/admin/variantValueService';
import { API_BASE_URL } from '../../../../constants/environment';
import Breadcrumb from '../../../../components/common/Breadcrumb';

import LoaderAdmin from '../../../../components/Admin/LoaderVip';

const VariantValueForm = () => {
  const { valueId, variantId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(valueId);
  const [variantType, setVariantType] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);


  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    trigger,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      value: '',
      sortOrder: 0,
      isActive: true,
      colorCode: '#000000',
      imageFile: null,
      variantId: variantId || '' 
    }
  });

  
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      if (!variantId) {
        toast.error("Thiếu ID thuộc tính cha. Không thể tải form.");
        navigate('/admin/product-variants'); 
        return; 
      }

      
      const typeAndValuesRes = await variantValueService.getByVariantId(variantId);
      setVariantType(typeAndValuesRes.data.variantType || '');

      setValue('variantId', variantId);

      if (isEditMode && valueId) {
       
        const allValues = typeAndValuesRes.data.data || [];
        const foundValue = allValues.find((v) => v.id.toString() === valueId);

        if (foundValue) {
         
          reset({ ...foundValue, imageFile: null, variantId: foundValue.variantId || variantId });
          if (foundValue.imageUrl) {
            setPreviewUrl(
              foundValue.imageUrl.startsWith('http')
                ? foundValue.imageUrl
                : `${API_BASE_URL}${foundValue.imageUrl}`
            );
          }
        } else {
          toast.error('Không tìm thấy giá trị để chỉnh sửa.');
          navigate(`/admin/product-variants/${variantId}/values`);
        }
      } else if (!isEditMode) {
   
        reset({
          value: '',
          sortOrder: 0,
          isActive: true,
          colorCode: '#000000',
          imageFile: null,
          variantId: variantId 
        });
        setPreviewUrl(''); 
      }
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu cho biểu mẫu.');
      console.error('Form Initial Load Error:', err.response?.data || err.message || err);
      if (variantId) {
        navigate(`/admin/product-variants/${variantId}/values`);
      } else {
        navigate('/admin/product-variants');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    
  }, [isEditMode, valueId, variantId, navigate, reset, setValue, setVariantType, setPreviewUrl]);


  
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
   

      const formData = new FormData();
      formData.append('variantId', data.variantId);
      formData.append('value', data.value);
      formData.append('sortOrder', data.sortOrder);
      formData.append('isActive', data.isActive ? 'true' : 'false');

      if (variantType === 'color') {
        formData.append('colorCode', data.colorCode);
      }
      if (data.imageFile instanceof File) { 
        formData.append('image', data.imageFile);
      }

      if (isEditMode) {
        await variantValueService.update(valueId, formData);
        toast.success('Cập nhật giá trị thành công!');
      } else {
        await variantValueService.create(formData);
        toast.success('Thêm mới giá trị thành công!');
      }
      navigate(`/admin/product-variants/${variantId}/values`);
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(({ field, message }) => {
          setError(field, { type: 'manual', message });
        });
      } else if (err.response?.data?.field && err.response?.data?.message) {
    
        setError(err.response.data.field, { type: 'manual', message: err.response.data.message });
      }
      else {
        toast.error(err.response?.data?.message || 'Đã xảy ra lỗi khi lưu giá trị.');
        console.error('VariantValueForm Submit Error:', err.response?.data || err.message || err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const watchImage = watch('imageFile');
  useEffect(() => {
    if (watchImage instanceof File) {
      const url = URL.createObjectURL(watchImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); 
    }

    else if (!isEditMode && !watchImage) {
        setPreviewUrl('');
    }
  }, [watchImage, isEditMode]);

 
  if (isLoading) {
    return <LoaderAdmin fullscreen />;
  }

  return (
    <>
          <Breadcrumb
    items={[
      { label: 'Thuộc tính sản phẩm', href: '/admin/product-variants' },
      { label: 'Giá trị thuộc tính', href: `/admin/product-variants/${variantId}/values` },
      { label: isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }
    ]}
  />
    <Paper sx={{ width: '100%', p: 3, mt:2, opacity: isLoading ? 0.7 : 1 }}> 

      <Typography variant="h5" mb={3}>
        {isEditMode ? 'Cập nhật giá trị' : 'Thêm giá trị mới'}
      </Typography>

     <form onSubmit={handleSubmit(onSubmit)}>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
    <Controller
      name="value"
      control={control}
      rules={{
        required: 'Giá trị không được để trống',
        maxLength: { value: 255, message: 'Giá trị không được vượt quá 255 ký tự' }
      }}
      render={({ field, fieldState }) => (
        <TextField
          label={
            <span>
              Giá trị <span style={{ color: 'red' }}>*</span>
            </span>
          }
          fullWidth
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          disabled={isLoading}
        />
      )}
    />

    <Controller
      name="sortOrder"
      control={control}
      rules={{
        required: 'Thứ tự không được để trống',
        min: { value: 0, message: 'Thứ tự phải là số không âm' },
        pattern: { value: /^[0-9]+$/, message: 'Thứ tự phải là số nguyên' }
      }}
      render={({ field, fieldState }) => (
        <TextField
          label="Thứ tự hiển thị"
          type="number"
          fullWidth
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          disabled={isLoading}
          InputProps={{ inputProps: { min: 0 } }}
        />
      )}
    />

    {variantType === 'color' && (
      <Controller
        name="colorCode"
        control={control}
        rules={{ required: 'Mã màu là bắt buộc' }}
        render={({ field }) => (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Chọn màu <span style={{ color: 'red' }}>*</span>
            </Typography>
            <ChromePicker
              color={field.value || '#000000'}
              onChangeComplete={(color) => field.onChange(color.hex)}
              disableAlpha
            />
            {errors.colorCode && (
              <Typography color="error" fontSize="0.75rem" sx={{ mt: 0.5 }}>
                {errors.colorCode.message}
              </Typography>
            )}
          </Box>
        )}
      />
    )}

    {variantType === 'image' && (
      <Controller
        name="imageFile"
        control={control}
        rules={{
          validate: (currentFile) => {

            if (!isEditMode && !currentFile && !previewUrl) {
              return 'Ảnh là bắt buộc khi tạo mới';
            }
            if (currentFile instanceof File) {
              if (currentFile.size > 5 * 1024 * 1024) {
                return 'Kích thước ảnh phải nhỏ hơn 5MB';
              }
              if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(currentFile.type)) {
                return 'Chỉ chấp nhận file ảnh định dạng JPG, PNG, GIF, WEBP';
              }
            }
            return true;
          }
        }}
        render={({ field, fieldState }) => (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh hiển thị <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box
              component="label"
              htmlFor="variant-value-image-upload"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  field.onChange(file);
                  trigger("imageFile");
                } else {
                  toast.info("Vui lòng chỉ kéo thả file ảnh.");
                }
              }}
              sx={{
                width: '100%',
                height: 200,
                border: `2px dashed ${fieldState.error ? 'error.main' : (dragOver ? 'primary.main' : '#aaa')}`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#555',
                backgroundColor: dragOver ? 'action.hover' : '#fafafa',
                fontWeight: 500,
                textAlign: 'center',
                transition: 'border-color 0.2s, background-color 0.2s',
                '&:hover': {
                  borderColor: 'primary.light',
                }
              }}
            >
              Kéo thả hoặc bấm để chọn ảnh
              <input
                id="variant-value-image-upload"
                type="file"
                hidden
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file || null);
                  trigger("imageFile");
                  e.target.value = null;
                }}
                disabled={isLoading}
              />
            </Box>

            {previewUrl && (
              <Box mt={2} textAlign="center">
                <img
                  src={previewUrl}
                  alt="Xem trước"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 150,
                    objectFit: 'contain',
                    borderRadius: 6,
                    border: `1px solid ${fieldState.error ? 'red' : '#ccc'}`
                  }}
                />
              </Box>
            )}

            {fieldState.error?.message && (
              <Typography color="error" fontSize="0.75rem" sx={{ mt: 0.5 }}>
                {fieldState.error.message}
              </Typography>
            )}
          </>
        )}
      />
    )}

    <Controller
      name="isActive"
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} disabled={isLoading} />}
          label="Kích hoạt"
        />
      )}
    />

    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
      <Button
        type="submit"
        variant="contained"
        size="large"

        disabled={isLoading}
      >
        {isLoading
          ? (isEditMode ? 'Đang cập nhật...' : 'Đang thêm...')
          : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        onClick={() => navigate(`/admin/product-variants/${variantId}/values`)}
        disabled={isLoading}
      >
        Hủy
      </Button>
    </Box>
  </Box>
</form>
    </Paper>
    </>
  );
};

export default VariantValueForm;