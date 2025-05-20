import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { useArticle } from './FormPost';

const UploadImage = () => {
  const { avatar, setAvatar} = useArticle()

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Kiểm tra định dạng
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert('Chỉ chấp nhận ảnh JPG, PNG, WEBP');
    return;
  }

  // Kiểm tra dung lượng (giới hạn ví dụ: 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    alert('Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 2MB.');
    return;
  }

  // Nếu ok → preview
  const reader = new FileReader();
  reader.onload = () => {
    setAvatar(reader.result); // hoặc set file gốc tùy backend
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

      {avatar && (
        <Box mt={2}>
          <img
            src={avatar}
            alt="preview"
            style={{ width: '100px', height: '100px', borderRadius: 4, display: 'block', marginBottom: 8 }}
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => setAvatar(null)}
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
