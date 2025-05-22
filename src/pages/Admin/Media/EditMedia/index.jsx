// src/pages/Admin/MediaList/EditMedia.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MediaForm from '../MediaForm';
import { Box, Typography, CircularProgress } from '@mui/material';

const EditMedia = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🧪 Giả lập fetch từ API
    const fetchMedia = async () => {
      try {
        // TODO: Gọi API thực tế
        const mock = {
          id,
          title: 'Slider Giáng Sinh',
          type: 'slider',
          image: 'https://via.placeholder.com/600x200',
          link: 'https://example.com',
          isActive: true,
          orderIndex: 2
        };
        setMedia(mock);
      } catch (err) {
        console.error('Lỗi load media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!media) return <Typography>Không tìm thấy media</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Chỉnh sửa Media: {media.title}
      </Typography>
      <MediaForm mode="edit" initialData={media} />
    </Box>
  );
};

export default EditMedia;
