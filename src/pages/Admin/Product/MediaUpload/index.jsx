// src/components/admin/MediaUpload.jsx
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@mui/icons-material/Clear';

const MediaUpload = ({ files, onChange }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }));
    onChange([...files, ...newFiles]);
  }, [files, onChange]);

  const handleRemove = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    onChange(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'video/*': ['.mp4', '.mov']
    }
  });

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Media</Typography>
    <Box
  {...getRootProps()}
  sx={{
    border: '1px dashed #90caf9',
    borderRadius: 2,
    p: 2,
    textAlign: 'center',
    cursor: 'pointer',
    bgcolor: isDragActive ? '#e3f2fd' : '#f5f5f5',
    height: 200, // 👈 cao hơn vì có thể là ảnh + video
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <input {...getInputProps()} />
  <Typography>
    Kéo & thả hoặc click để chọn ảnh/video
  </Typography>
</Box>


      <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
        {files.map((media, index) => (
          <Box key={index} position="relative">
            {media.type === 'image' ? (
              <img src={media.url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} />
            ) : (
              <video src={media.url} controls style={{ width: 120, height: 80, borderRadius: 4 }} />
            )}
            <IconButton
              onClick={() => handleRemove(index)}
              size="small"
              sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.8)' }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MediaUpload;
