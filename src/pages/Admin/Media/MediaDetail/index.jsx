import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';

const getStatusChip = (status) => {
  const map = {
    active: ['Hiển thị', 'success'],
    hidden: ['Ẩn', 'default'],
    trash: ['Đã xoá', 'error']
  };
  const [label, color] = map[status] || [status, 'default'];
  return <Chip label={label} color={color} size="small" />;
};

const MediaDetail = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        // TODO: thay bằng API thực tế
        const mock = {
          id,
          title: 'Slider Xuân 2025',
          type: 'slider', // 'banner', 'popup', hoặc 'slider'
          image: 'https://via.placeholder.com/600x200',
          images: [
            'https://via.placeholder.com/300x150?text=Slide+1',
            'https://via.placeholder.com/300x150?text=Slide+2',
            'https://via.placeholder.com/300x150?text=Slide+3'
          ],
          link: 'https://example.com',
          isActive: true,
          orderIndex: 1,
          status: 'active',
          position: 'Trang chủ'
        };
        setMedia(mock);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!media) return <Typography>Không tìm thấy media</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Chi tiết Media: {media.title}
      </Typography>

      <Box display="flex" gap={4} flexWrap="wrap">
        <Box flex={1}>
          <Typography variant="subtitle2">Tiêu đề:</Typography>
          <Typography mb={2}>{media.title}</Typography>

          <Typography variant="subtitle2">Loại:</Typography>
          <Typography mb={2}>{media.type}</Typography>

          <Typography variant="subtitle2">Link chuyển hướng:</Typography>
          <Typography mb={2}>{media.link || 'Không có'}</Typography>

          <Typography variant="subtitle2">Thứ tự hiển thị:</Typography>
          <Typography mb={2}>{media.orderIndex}</Typography>

          <Typography variant="subtitle2">Vị trí:</Typography>
          <Typography mb={2}>{media.position || 'Không có'}</Typography>

          <Typography variant="subtitle2">Trạng thái:</Typography>
          {getStatusChip(media.status)}
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box flex={1}>
          <Typography variant="subtitle2" mb={1}>
            Hình ảnh:
          </Typography>

          {media.type === 'slider' ? (
            <Box display="flex" gap={2} flexWrap="wrap">
              {media.images?.map((img, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 200,
                    height: 100,
                    borderRadius: 1,
                    overflow: 'hidden',
                    backgroundColor: '#f3f3f3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={img}
                    alt={`slider-${i}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                width: 600,
                height: 300,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={media.image}
                alt={media.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default MediaDetail;
