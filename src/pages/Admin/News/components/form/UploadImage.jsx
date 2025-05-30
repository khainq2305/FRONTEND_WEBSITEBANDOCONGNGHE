import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImage';
import {
  Box, Slider, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Typography
} from '@mui/material';

const UploadImage = ({ avatar, setAvatar }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setOpenCrop(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCrop = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    setAvatar(croppedImage);
    setOpenCrop(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleRemove = () => {
    setAvatar(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #90caf9',
          borderRadius: 2,
          padding: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? '#e3f2fd' : 'inherit',
          transition: 'background-color 0.2s ease-in-out'
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body2">
          {isDragActive ? 'Thả ảnh vào đây...' : 'Kéo ảnh vào hoặc nhấp để chọn ảnh'}
        </Typography>
      </Box>

      {avatar && (
        <Box mt={2}>
          <img
            src={avatar}
            alt="preview"
            style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }}
          />
          <Button onClick={handleRemove} color="error" size="small" sx={{ mt: 1 }}>
            Xóa ảnh
          </Button>
        </Box>
      )}

      <Dialog open={openCrop} maxWidth="sm" fullWidth>
        <DialogTitle>Cắt ảnh</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </Box>
          <Box mt={2}>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, v) => setZoom(v)}
              valueLabelDisplay="auto"
            />
            {croppedAreaPixels && (
              <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                W: {Math.round(croppedAreaPixels.width)}px — H: {Math.round(croppedAreaPixels.height)}px
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrop(false)}>Hủy</Button>
          <Button onClick={handleSaveCrop} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadImage;
