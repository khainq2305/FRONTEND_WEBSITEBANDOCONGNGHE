import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Link,
  Chip,
  Box
} from '@mui/material';
import { useArticle } from '../News';
import {
  OpenInNew,
  Person,
  Category as CategoryIcon,
  CalendarToday,
  Label,
  ChatBubble,
  Description
} from '@mui/icons-material';
import { gray } from '@ant-design/colors';

const BasicModal = () => {
  const { modalItem, setModalItem } = useArticle();
  const textProps = {
    fontSize: '18px',
    fontWeight: 500
  };

  return (
    <Dialog open={!!modalItem} onClose={() => setModalItem(null)} maxWidth="sm" fullWidth>
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
                sx={{cursor: "pointer"}}
              >
                <OpenInNew fontSize="small" /> Đi đến bài viết
              </Link>
            </Box>
            <Box display="flex" gap={3} mt={2}>
              {/* LEFT - Thumbnail 30% */}
              <Box flex="0 0 30%">
                {modalItem && (
                  <Box
                    component="img"
                    src={
                      modalItem.thumbnail ||
                      'https://eki.com.vn/wp-content/uploads/2024/03/tuyen-dung-chuyen-vien-cong-nghe-thong-tin-lam-viec-tai-Duc-EK-GROUP-1024x682.webp'
                    }
                    alt={modalItem.name}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '2px solid #ccc',
                      mb: 1
                    }}
                  />
                )}
              </Box>

              {/* RIGHT - Info 70% */}
              <Box flex="1">
                <Grid container spacing={2}>
                  {/* Tác giả */}
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" color="action" />
                      <Typography fontSize={14} fontWeight={500}>Tác giả:</Typography>
                      <Typography fontSize={14}>{modalItem.author}</Typography>
                    </Box>
                  </Grid>

                  {/* Ngày xuất bản */}
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography fontSize={14} fontWeight={500}>Ngày xuất bản:</Typography>
                      <Typography fontSize={14}>{modalItem.date}</Typography>
                    </Box>
                  </Grid>

                  {/* Danh mục */}
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CategoryIcon fontSize="small" color="action" />
                      <Typography fontSize={14} fontWeight={500}>Danh mục:</Typography>
                      <Typography fontSize={14}>{modalItem.category}</Typography>
                    </Box>
                  </Grid>

                  {/* Bình luận */}
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ChatBubble fontSize="small" color="action" />
                      <Typography fontSize={14} fontWeight={500}>Bình luận:</Typography>
                      <Typography fontSize={14}>{modalItem.comment}</Typography>
                    </Box>
                  </Grid>

                  {/* Tag */}
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Label fontSize="small" color="action" />
                      <Typography fontSize={14} fontWeight={500}>Tag:</Typography>
                      <Chip label={modalItem.tag} size="small" />
                    </Box>
                  </Grid>

                  {/* Nội dung */}
                  <Grid item xs={12}>

                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Description fontSize="small" color="action" />
                <Typography fontSize={14} fontWeight={500}>Nội dung:</Typography>
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

export default BasicModal;
