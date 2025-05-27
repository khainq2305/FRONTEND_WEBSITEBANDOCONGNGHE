import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, Switch,
  FormControlLabel, Paper
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { variantValueService } from '../../../../services/admin/variantValueService';
import { API_BASE_URL } from '../../../../constants/environment';

const VariantValueForm = () => {
  const { valueId, variantId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(valueId);
  const [variantType, setVariantType] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
     setError, // 👈 thêm cái này
    setValue,
     trigger, // ✅ thêm dòng này
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

  const fetchVariantType = async () => {
    const res = await variantValueService.getByVariantId(variantId);
    setVariantType(res.data.variantType || '');
    return res.data.data;
  };

  const fetchDetail = async () => {
    try {
      const data = await fetchVariantType();
      const found = data.find(v => v.id.toString() === valueId);
      if (!found) throw new Error();
      reset({ ...found, imageFile: null });
   if (found.imageUrl) {
  setPreviewUrl(
    found.imageUrl.startsWith('http')
      ? found.imageUrl
      : `${API_BASE_URL}${found.imageUrl}`
  );
}

    } catch {
      toast.error('Không tìm thấy giá trị');
      navigate(`/admin/product-variants/${variantId}/values`);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchDetail();
    } else {
      fetchVariantType();
    }
  }, [valueId]);

const onSubmit = async (data) => {
  try {
    const validImage = variantType === 'image' ? await trigger('imageFile') : true;
    if (!validImage) return;

    const formData = new FormData();
    formData.append('variantId', data.variantId);
    formData.append('value', data.value);
    formData.append('sortOrder', data.sortOrder);
    formData.append('isActive', data.isActive ? 'true' : 'false'); // ✅ ép string
    if (variantType === 'color') {
      formData.append('colorCode', data.colorCode);
    }
    if (data.imageFile instanceof File) {
      formData.append('image', data.imageFile);
    }

    if (isEditMode) {
      await variantValueService.update(valueId, formData);
      toast.success('✅ Cập nhật thành công');
    } else {
      await variantValueService.create(formData);
      toast.success('✅ Thêm mới thành công');
    }

    navigate(`/admin/product-variants/${variantId}/values`);
  } catch (err) {
    if (err.response?.data?.errors) {
      err.response.data.errors.forEach(({ field, message }) => {
        setError(field, { type: 'manual', message });
      });
    } else {
      toast.error('❌ Lỗi khi lưu');
      console.error('❌ VariantValueForm Error:', err);
    }
  }
};


  const watchImage = watch('imageFile');
  useEffect(() => {
    if (watchImage instanceof File) {
      const url = URL.createObjectURL(watchImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchImage]);

  return (
    <Paper sx={{ width: '100%', p: 3 }}>
      <Typography variant="h5" mb={3}>
        {isEditMode ? 'Cập nhật giá trị' : 'Thêm giá trị mới'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="value"
            control={control}
            rules={{ required: 'Giá trị không được để trống' }}
            render={({ field, fieldState }) => (
              <TextField label="Giá trị" fullWidth {...field} error={!!fieldState.error} helperText={fieldState.error?.message} />
            )}
          />

          <Controller
            name="sortOrder"
            control={control}
            render={({ field }) => (
              <TextField label="Thứ tự" type="number" fullWidth {...field} />
            )}
          />

          {variantType === 'color' && (
            <Controller
              name="colorCode"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography variant="subtitle2">Chọn màu</Typography>
                  <ChromePicker color={field.value} onChange={(c) => field.onChange(c.hex)} disableAlpha />
                </Box>
              )}
            />
          )}

      
{variantType === 'image' && (
 <Controller
  name="imageFile"
  control={control}
  rules={{
    validate: (file) => {
      if (variantType === 'image' && !file && !isEditMode) {
        return 'Ảnh là bắt buộc';
      }
      if (file && file.size > 5 * 1024 * 1024) {
        return 'Ảnh phải nhỏ hơn 5MB';
      }
      return true;
    }
  }}
  render={({ field }) => (
    <>
      <Box
        component="label"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith('image/')) {
            field.onChange(file);
          }
        }}
        sx={{
          width: '100%',
          height: 200,
          border: '2px dashed #aaa',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#555',
          backgroundColor: '#fafafa',
          fontWeight: 500,
          textAlign: 'center'
        }}
      >
        Kéo thả hoặc bấm để chọn ảnh từ máy
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => field.onChange(e.target.files[0])}
        />
      </Box>

      {previewUrl && (
        <Box mt={2}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 6,
              border: '1px solid #ccc'
            }}
          />
        </Box>
      )}

      {errors.imageFile?.message && (
        <Typography color="error" fontSize={13} mt={1}>
          {errors.imageFile.message}
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
              <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Kích hoạt" />
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
  );
};

export default VariantValueForm;
