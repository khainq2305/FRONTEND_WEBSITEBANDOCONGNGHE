import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImage'; // Đảm bảo file này trả về File, không base64
import { Box, Slider, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const UploadImage = ({ thumbnail, setThumbnail }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null); // giữ file gốc
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles?.[0];

    // Không có ảnh thì thôi
    if (!file || !(file instanceof File)) return;

    setOriginalFile(file); // lưu để xử lý sau (crop, upload, v.v.)
    setImageSrc(URL.createObjectURL(file)); // ảnh preview để crop
    setOpenCrop(true); // mở modal crop
  }, []);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      setThumbnail(croppedFile); // ✅ thumbnail là File object
    } catch (error) {
      console.error('Lỗi cắt ảnh:', error);
    }

    // Reset crop UI
    setOpenCrop(false);
    setImageSrc(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleRemove = () => {
    setThumbnail(null);
    setImageSrc(null);
    setOriginalFile(null);
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
        <Typography variant="body2">{isDragActive ? 'Thả ảnh vào đây...' : 'Kéo ảnh vào hoặc nhấp để chọn ảnh'}</Typography>
      </Box>

      {thumbnail && (
  <Box mt={2}>
    <img
      src={thumbnail instanceof File ? URL.createObjectURL(thumbnail) : thumbnail}
      alt="Preview"
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
            <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, v) => setZoom(v)} valueLabelDisplay="auto" />
            {croppedAreaPixels && (
              <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                W: {Math.round(croppedAreaPixels.width)}px — H: {Math.round(croppedAreaPixels.height)}px
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrop(false)}>Hủy</Button>
          <Button onClick={handleSaveCrop} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadImage;
