// src/components/common/CropImageDialog.jsx
import React, { useRef } from 'react';
import 'cropperjs/dist/cropper.css';
import { Cropper } from 'react-cropper';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const CropImageDialog = ({
  open,
  onClose,
  imageSrc,
  onCropComplete,
  cropHeight = 400,
  aspectRatio = 1,      
  dialogMaxWidth = 'sm'  
}) => {
  const cropperRef = useRef(null);

  const handleDone = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();

      if (!canvas) {
        console.error('Canvas is null');
        return;
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Blob is null');
          return;
        }

        const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete({ file, url: previewUrl });
        onClose();
      }, 'image/jpeg');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={dialogMaxWidth} fullWidth>
      <DialogTitle>Cắt ảnh</DialogTitle>
      <DialogContent>
        <Cropper
          src={imageSrc}
          style={{ height: cropHeight, width: '100%' }}
          aspectRatio={aspectRatio}  
          guides={false}
          viewMode={1}
          ref={cropperRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleDone}>Xong</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropImageDialog;
