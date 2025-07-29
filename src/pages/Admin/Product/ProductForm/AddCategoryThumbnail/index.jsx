import React, { useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@mui/icons-material/Clear';

const AddCategoryThumbnail = ({ value, onChange, sx = {} }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      onChange({ file, url });
    }
  }, [onChange]);

  const handleRemove = () => {
    onChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }
  });

  return (
    <Box sx={{ ...sx }}>
      <Typography variant="subtitle1" gutterBottom>
        Ảnh đại diện <span style={{ color: 'red' }}>*</span>
      </Typography>


      {!value?.url && (
        <Box
          {...getRootProps()}
          sx={{
            border: '1px dashed #90caf9',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? '#e3f2fd' : '#f5f5f5',
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <input {...getInputProps()} />
          <Typography fontSize={14}>Kéo thả hoặc bấm để chọn ảnh từ máy</Typography>
        </Box>
      )}

      {/* Preview: square 64x64 */}
      {value?.url && (
        <Box mt={1.5} display="flex" alignItems="center" gap={1}>
          <Box position="relative">
            <img
              src={value.url}
              alt="Preview"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid #ccc',
                display: 'block'
              }}
            />
            <IconButton
              onClick={handleRemove}
              size="small"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'rgba(255,255,255,0.8)',
                p: '2px',
                zIndex: 2
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography fontSize={13} color="text.secondary">
            Đã chọn 1 ảnh
          </Typography>
        </Box>
      )}

    </Box>
  );
};

export default AddCategoryThumbnail;
