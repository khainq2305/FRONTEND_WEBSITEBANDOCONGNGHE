// src/pages/Admin/MediaList/AddMedia.jsx
import MediaForm from '../MediaForm';
import { Box, Typography } from '@mui/material';

const AddMedia = () => {
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Thêm Media mới
      </Typography>
      <MediaForm mode="create" />
    </Box>
  );
};

export default AddMedia;
