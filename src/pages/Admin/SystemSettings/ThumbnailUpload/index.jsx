import { Box, Typography, IconButton } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@mui/icons-material/Clear';

const ThumbnailUpload = ({ value, onChange, label = 'Ảnh' }) => {
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
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg'] }
  });

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>
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
        <Box mt={2} position="relative" width={120} height={120}>
          <img
            src={value.url}
            alt="Thumbnail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 8,
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
      )}
    </Box>
  );
};

export default ThumbnailUpload;
