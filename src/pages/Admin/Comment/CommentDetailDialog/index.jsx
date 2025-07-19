import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Stack,
  Paper,
  Avatar,
  Box,
  Divider,
  ImageList,
  ImageListItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// ====================================================================
// 1. HÀM TIỆN ÍCH (HELPER FUNCTION)
// ====================================================================
const getRatingText = (rating) => {
  switch (rating) {
    case 1:
      return 'Rất tệ';
    case 2:
      return 'Không hài lòng';
    case 3:
      return 'Bình thường';
    case 4:
      return 'Hài lòng';
    case 5:
      return 'Tuyệt vời';
    default:
      return '';
  }
};

// ====================================================================
// 2. CÁC COMPONENT CON (SUB-COMPONENTS)
// ====================================================================

/**
 * Component con: Dialog để xem trước Ảnh/Video
 */
const MediaPreviewDialog = ({ open, onClose, mediaItem }) => {
  if (!mediaItem) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, backgroundColor: 'black' }}>
        {mediaItem.type === 'video' ? (
          <video src={mediaItem.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '90vh' }} />
        ) : (
          <img src={mediaItem.url} alt="Xem trước" style={{ maxWidth: '100%', maxHeight: '90vh' }} />
        )}
      </Box>
    </Dialog>
  );
};

/**
 * Component con: Thẻ hiển thị bình luận của người dùng
 */


const UserCommentCard = ({ comment, onMediaClick }) => (
  <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
    <Stack spacing={2.5}>
      {/* User and Product Info */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={comment.user?.avatarUrl} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography fontWeight="bold">{comment.user?.fullName}</Typography>
            <Typography variant="caption" color="text.secondary">
              Đã đăng vào: {new Date(comment.createdAt).toLocaleString('vi-VN')}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={comment.sku?.product?.thumbnail} variant="rounded" sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography fontWeight="bold" noWrap maxWidth="250px">
              {comment.sku?.product?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
            </Typography>

            {/* ✅ Hiển thị biến thể giống bên client */}
            {comment.sku?.variantValues?.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                Biến thể:{' '}
                {comment.sku.variantValues
                  .map((vv) =>
                    vv.variantValue?.variant?.name && vv.variantValue?.value
                      ? `${vv.variantValue.variant.name}: ${vv.variantValue.value}`
                      : 'Không xác định'
                  )
                  .join(', ')}
              </Typography>
            )}
          </Box>
        </Stack>
      </Stack>

      <Divider />

      {/* Rating and Content */}
      <Box>
        <Box display="flex" alignItems="center" mb={1.5}>
          {[...Array(5)].map((_, star) => (
            <StarIcon key={star} sx={{ color: star < comment.rating ? '#ffb400' : 'grey.300' }} />
          ))}
          <Typography sx={{ ml: 1.5, fontWeight: 'bold' }}>{getRatingText(comment.rating)}</Typography>
        </Box>
        <Box sx={{ borderLeft: 4, borderColor: 'grey.200', pl: 2, fontStyle: 'italic' }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
            {comment.content}
          </Typography>
        </Box>
      </Box>

      {/* Media Gallery */}
      {comment.media?.length > 0 && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            Hình ảnh/Video đính kèm
          </Typography>
          <ImageList sx={{ width: '100%', mt: 1 }} cols={5} rowHeight={120} gap={8}>
            {comment.media.map((item) => (
              <ImageListItem
                key={item.id}
                sx={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '8px', '&:hover .media-overlay': { opacity: 1 } }}
                onClick={() => onMediaClick(item)}
              >
                <img
                  src={item.type === 'video' ? item.thumbnailUrl || item.url : item.url}
                  alt="review media"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {item.type === 'video' && (
                  <Box
                    className="media-overlay"
                    sx={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
                      justifyContent: 'center', alignItems: 'center',
                      color: 'white', opacity: 0, transition: 'opacity 0.3s'
                    }}
                  >
                    <PlayCircleOutlineIcon sx={{ fontSize: 40 }} />
                  </Box>
                )}
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
    </Stack>
  </Paper>
);


/**
 * Component con: Thẻ hiển thị phản hồi của Admin
 */
const AdminReplyCard = ({ comment }) => (
  <Paper
    elevation={2}
    sx={{
      p: { xs: 2, md: 3 },
      borderRadius: 2,
      backgroundColor: 'primary.lighter',
      borderLeft: 5,
      borderColor: 'primary.main'
    }}
  >
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <ReplyIcon />
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            Phản hồi từ {comment.repliedBy || 'Quản trị viên'}
          </Typography>
          {comment.repliedAt && (
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.repliedAt).toLocaleString('vi-VN')}
            </Typography>
          )}
        </Box>
      </Stack>
      <Typography
        variant="body1"
        sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', pt: 1, mt: 1, borderTop: 1, borderColor: 'primary.light' }}
      >
        {comment.replyContent}
      </Typography>
    </Stack>
  </Paper>
);

// ====================================================================
// 3. COMPONENT CHÍNH (MAIN COMPONENT)
// ====================================================================
const CommentDetailDialog = ({ open, onClose, comment, onReplyClick }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const handleClosePreview = () => {
    setSelectedMedia(null);
  };

  if (!comment) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <RateReviewIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chi tiết đánh giá
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'action.active' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 1.5, md: 3 }, backgroundColor: 'grey.50' }}>
          <Stack spacing={3}>
            <UserCommentCard comment={comment} onMediaClick={handleMediaClick} />

            {comment.isReplied && comment.replyContent && <AdminReplyCard comment={comment} />}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Đóng
          </Button>
          {!comment.isReplied && (
            <Button onClick={() => onReplyClick(comment)} variant="contained" startIcon={<ReplyIcon />}>
              Phản hồi ngay
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <MediaPreviewDialog open={!!selectedMedia} onClose={handleClosePreview} mediaItem={selectedMedia} />
    </>
  );
};

export default CommentDetailDialog;
