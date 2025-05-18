import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

const UploadImage = () => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Button variant="contained" component="label">
        Chọn ảnh từ máy
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {preview && (
        <Box mt={2}>
          <img
            src={preview}
            alt="preview"
            style={{ width: '100px', height: '100px', borderRadius: 4, display: 'block', marginBottom: 8 }}
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => setPreview(null)}
            size="small"
          >
            Xóa ảnh
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UploadImage;
