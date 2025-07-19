import { Dialog, DialogTitle, DialogContent, Grid, Typography, Link, Chip, Box } from '@mui/material';
import {
  OpenInNew,
  Person,
  Category as CategoryIcon,
  CalendarToday,
  Label,
  ChatBubble,
  Description,
  Info,
  AccessTime
} from '@mui/icons-material';

const BasicModal = ({ modalItem, onClose }) => {
  const timeLeftText = (publishAt) => {
    if (!publishAt) return '-';
    const diff = new Date(publishAt) - new Date();
    const m = Math.floor(diff / 60000);
    const d = Math.floor(m / 1440);
    const h = Math.floor((m % 1440) / 60);
    const min = m % 60;
    return `Còn ${d} ngày ${h} giờ ${min} phút`;
  };

  return (
    <Dialog open={!!modalItem} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Chi tiết bài viết</DialogTitle>
      <DialogContent dividers sx={{ px: 4, py: 2 }}>
        {modalItem && (
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Tiêu đề + link */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {modalItem.name}
              </Typography>
              <Link
                href={modalItem.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="primary"
                display="flex"
                alignItems="center"
                gap={0.5}
                fontSize="14px"
                sx={{ cursor: 'pointer' }}
              >
                <OpenInNew fontSize="small" /> Đi đến bài viết
              </Link>
            </Box>

            <Box display="flex" gap={3} mt={2}>
              {/* LEFT - Thumbnail */}
              <Box flex="0 0 30%">
                <Box
                  component="img"
                  src={
                    `https://res.cloudinary.com/ddyfb1wen/image/upload/${modalItem.thumbnail}` ||
                    'https://eki.com.vn/wp-content/uploads/2024/03/tuyen-dung-chuyen-vien-cong-nghe-thong-tin-lam-viec-tai-Duc-EK-GROUP-1024x682.webp'
                  }
                  alt={modalItem.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '2px solid #ccc',
                    mb: 1
                  }}
                />
              </Box>

              {/* RIGHT - Info */}
              <Box flex="1">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InfoRow icon={<Person />} label="Tác giả" value={modalItem.author} />
                  </Grid>
                  <Grid item xs={6}>
                    <InfoRow icon={<CalendarToday />} label="Ngày xuất bản" value={modalItem.date} />
                  </Grid>
                  <Grid item xs={6}>
                    <InfoRow icon={<CategoryIcon />} label="Danh mục" value={modalItem.category} />
                  </Grid>
                  <Grid item xs={6}>
                    <InfoRow icon={<ChatBubble />} label="Bình luận" value={modalItem.comment} />
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Info fontSize="small" color="action" />
                      <Typography fontSize={14} fontWeight={500}>
                        Trạng thái:
                      </Typography>
                      <Chip
                        label={modalItem.status === 1 ? 'Đã xuất bản' : modalItem.status === 2 ? 'Hẹn giờ đăng' : 'Bản nháp'}
                        size="small"
                        color={modalItem.status === 2 ? 'info' : modalItem.status === 1 ? 'success' : 'warning'}
                      />
                    </Box>
                  </Grid>

                  {modalItem.publishAt && (
                    <Grid item xs={12}>
                      <InfoRow
                        icon={<AccessTime />}
                        label="Thời gian đăng"
                        value={modalItem.status === 2 ? timeLeftText(modalItem.publishAt) : modalItem.publishAt}
                        color={modalItem.status === 2 ? 'red' : undefined}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Label fontSize="small" color="action" />
                      <Typography fontSize={14} fontWeight={500}>
                        Tag:
                      </Typography>
                      {modalItem.tags.map((tag) => (
                        <Chip key={tag.id} label={tag.name} size="small" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Nội dung */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Description fontSize="small" color="action" />
                <Typography fontSize={14} fontWeight={500}>
                  Nội dung:
                </Typography>
              </Box>
              <Typography fontSize={14} color="text.secondary">
                {modalItem.content || 'Xem thêm'}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const InfoRow = ({ icon, label, value, color }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {icon}
    <Typography fontSize={14} fontWeight={500}>
      {label}:
    </Typography>
    <Typography fontSize={14} color={color}>
      {value}
    </Typography>
  </Box>
);

export default BasicModal;
