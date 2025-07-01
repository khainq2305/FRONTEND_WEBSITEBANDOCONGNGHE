// src/components/Admin/BannerUpload.jsx
import { Box, Typography, IconButton } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Component upload cho ảnh banner / badge overlay.
 * - Kế thừa logic từ ThumbnailUpload nhưng:
 *   • label mặc định: "Ảnh banner / badge"
 *   • Kích thước khung dropzone & preview nhỏ hơn.
 *
 * Props:
 *  - value: { file?: File, url: string } | null
 *  - onChange: (newValue: valueType | null) => void
 *  - label?: string (tuỳ chỉnh tiêu đề)
 */
const BannerUpload = ({ value, onChange, label = 'Ảnh banner / badge' }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      onChange({ file, url });
    },
    [onChange]
  );

  const handleRemove = () => onChange(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
  });

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>

      {/* Dropzone */}
      <Box
        {...getRootProps()}
        sx={{
          border: '1px dashed #90caf9',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? '#e3f2fd' : '#f5f5f5',
          height: 120, // nhỏ hơn thumbnail
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <input {...getInputProps()} />
        <Typography fontSize={14} color="text.secondary">
          Kéo thả hoặc bấm để chọn ảnh (PNG, JPG, WEBP)
        </Typography>
      </Box>

      {/* Preview */}
      {value?.url && (
        <Box mt={2} position="relative" width={100} height={100}>
          <img
            src={value.url}
            alt="banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 6,
              border: '1px solid #ccc',
              display: 'block',
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
              zIndex: 2,
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default BannerUpload;
