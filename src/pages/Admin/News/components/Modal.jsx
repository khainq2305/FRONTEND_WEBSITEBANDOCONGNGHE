import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

const BasicModal = ({ open, onClose, title, item }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2} className='uppercase font-bold'>
          {title}
        </Typography>

        {item && (
          <div className="space-y-2 text-sm">
            <div><strong>Tiêu đề:</strong> {item.name}</div>
            <div><strong>Tác giả:</strong> {item.author}</div>
            <div><strong>Danh mục:</strong> {item.category}</div>
            <div><strong>Tag:</strong> {item?.tag || 'Không có'}</div>
            <div><strong>Bình luận:</strong> {item?.comment || 0}</div>
            <div>
              <strong>Ngày đăng:</strong>{' '}
              {item.date ? new Date(item.date).toLocaleDateString('vi-VN') : 'Không rõ'}
            </div>
            <div><strong>Trạng thái:</strong> {item.status === 'active' ? 'Đang hoạt động' : 'Ngưng'}</div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default BasicModal;
