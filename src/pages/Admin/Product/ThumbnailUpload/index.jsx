// src/components/admin/ThumbnailUpload.jsx
import { Box, Typography, IconButton } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@mui/icons-material/Clear';

const ThumbnailUpload = ({ value, onChange }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        onChange({ file, url });
      }
    },
    [onChange]
  );

  const handleRemove = () => {
    onChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }
  });

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom component="span">
    Thumbnail <Typography component="span" color="error">*</Typography>
  </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '1px dashed #90caf9',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? '#e3f2fd' : '#f5f5f5',
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <input {...getInputProps()} />
        <Typography>Kéo thả hoặc bấm để chọn ảnh từ máy</Typography>
      </Box>

      {value?.url && (
        <Box mt={2} position="relative" width="100%">
          <img src={value.url} alt="Thumbnail" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4 }} />
          <IconButton onClick={handleRemove} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.7)' }}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ThumbnailUpload;
