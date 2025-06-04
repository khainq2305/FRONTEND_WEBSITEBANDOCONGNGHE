import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import { reviewService } from '@/services/admin/reviewService';
import FilterBar from '../FilterBar';
import { Rating } from '@mui/material';
import { Dialog } from '@mui/material';




const ReviewAll = () => {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({ search: '', rating: '', replied: '' });
  const [replyingId, setReplyingId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleReply = (id) => {
    setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cleanFilters = {};
        if (filters.search?.trim()) cleanFilters.search = filters.search.trim();
        if (filters.rating) cleanFilters.rating = filters.rating;
        if (filters.replied !== '') cleanFilters.replied = filters.replied;

        const res = await reviewService.getAll(cleanFilters);
        const data = res.data.data || [];
        setReviews(data);

        const replyMap = {};
        const expandMap = {};
        data.forEach(r => {
          if (r.isReplied && r.replyContent) {
            replyMap[r.id] = r.replyContent;
            expandMap[r.id] = false;
          }
        });
        setReplies(replyMap);
        setExpandedReplies(expandMap);
      } catch (err) {
        console.error('Lỗi lấy đánh giá:', err);
      }
    };
    fetchData();
  }, [filters]);

  const handleReply = async (id) => {
    try {
      await reviewService.replyToReview(id, {
        replyContent,
        responderId: 1,
      });

      setReplies((prev) => ({ ...prev, [id]: replyContent }));
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
              ...r,
              isReplied: true,
              replyContent,
              updatedAt: new Date().toISOString()
            }
            : r
        )
      );
      setExpandedReplies((prev) => ({ ...prev, [id]: true }));
      setReplyingId(null);
      setReplyContent('');
    } catch (err) {
      console.error('Lỗi phản hồi:', err);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Tất cả bình luận mới nhất
      </Typography>

      <FilterBar
        searchText={filters.search}
        selectedRating={filters.rating || 'all'}
        selectedStatus={
          filters.replied === '' ? 'all' :
            filters.replied === true ? 'replied' :
              filters.replied === false ? 'not_replied' : 'all'
        }
        onSearchChange={(search) =>
          setFilters((prev) => ({ ...prev, search }))
        }
        onRatingChange={(val) =>
          setFilters((prev) => ({ ...prev, rating: val === 'all' ? '' : val }))
        }
        onStatusChange={(val) => {
          let mapped;
          if (val === 'all') mapped = '';
          else if (val === 'replied') mapped = true;
          else if (val === 'not_replied') mapped = false;
          setFilters((prev) => ({ ...prev, replied: mapped }));
        }}
      />

      {reviews.map((c) => (
        <Box
          key={c.id}
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={2}
          p={2}
          border="1px solid #e0e0e0"
          borderRadius={2}
          mb={2}
          bgcolor="#fff"
        >

          <Box flex={8}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Avatar src={c.user?.avatarUrl} />
              <Typography fontWeight="bold">{c.user?.fullName || '---'}</Typography>
              <Typography fontSize="13px" color="text.secondary">
                • {new Date(c.createdAt).toLocaleString('vi-VN')}
              </Typography>
              <Chip
                label={c.isReplied ? 'Đã phản hồi' : 'Chưa phản hồi'}
                size="small"
                color={c.isReplied ? 'success' : 'warning'}
              />
            </Box>

            <Box mt={1.5}>
              <Rating value={c.rating} precision={0.5} readOnly />
              <Typography mt={1} whiteSpace="pre-line" sx={{ wordBreak: 'break-word' }}>
                {c.content}
              </Typography>


              {Array.isArray(c.medias) && c.medias.length > 0 && (
                <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                  {c.medias.map((media) => (
                    <Box key={media.id} width={100} height={100}>
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="media"
                          onClick={() => setSelectedImage(media.url)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 8,
                            cursor: 'pointer'
                          }}
                        />

                      ) : (
                        <video
                          src={media.url}
                          controls
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 4,
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
                        <img src={selectedImage} alt="Zoom" style={{ maxWidth: '100%', maxHeight: '90vh' }} />
                      </Dialog>

                    </Box>
                  ))}
                </Box>
              )}


              {c.isReplied && replies[c.id] && (
                <Box mt={1.5} ml={4} pl={2} borderLeft="3px solid #1976d2">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src="/admin-avatar.png" sx={{ width: 24, height: 24 }} />
                    <Typography fontWeight="medium">Quản trị viên</Typography>
                    <Typography fontSize="13px" color="text.secondary">
                      • {new Date(c.updatedAt || c.createdAt).toLocaleString('vi-VN')}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => toggleReply(c.id)}
                      sx={{ textTransform: 'none', fontSize: '13px' }}
                    >
                      {expandedReplies[c.id] ? 'Ẩn phản hồi' : 'Hiện phản hồi'}
                    </Button>

                  </Box>

                  {expandedReplies[c.id] && (
                    <Typography
                      variant="body1"
                      whiteSpace="pre-line"
                      sx={{ wordBreak: 'break-word', mt: 1 }}
                    >
                      {replies[c.id]}
                    </Typography>
                  )}
                </Box>
              )}


              {!c.isReplied && replyingId === c.id && (
                <Box mt={2}>
                  <TextField
                    multiline
                    fullWidth
                    rows={2}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Nhập phản hồi..."
                  />
                  <Box mt={1} display="flex" gap={1}>
                    <Button
                      variant="contained"
                      onClick={() => handleReply(c.id)}
                      disabled={!replyContent.trim()}
                    >
                      Gửi
                    </Button>
                    <Button variant="text" onClick={() => setReplyingId(null)}>
                      Hủy
                    </Button>
                  </Box>
                </Box>
              )}

              {!c.isReplied && replyingId !== c.id && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setReplyingId(c.id)}
                  sx={{ mt: 2 }}
                >
                  Phản hồi
                </Button>
              )}
            </Box>
          </Box>


          <Box flex={2} textAlign="center">
            <img
              src={c.sku?.product?.thumbnail || '/placeholder.jpg'}
              alt="product"
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 2,
                border: '1px solid #ccc'
              }}
            />
            <Typography variant="body1" mt={1} fontWeight={600}>
              {c.sku?.product?.name || '---'}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ReviewAll;
