import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { notificationService } from '@/services/admin/notificationService';

const NotificationDetailDialog = ({ open, onClose, data }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data?.id && !data?.isGlobal) {
      notificationService
        .getUsersByNotification(data.id)
        .then((res) => {
          const userList = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setUsers(userList);
        })
        .catch((err) => console.error('Lỗi lấy danh sách user:', err));
    }
  }, [data]);

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pr: 1
        }}
      >
        <Typography fontWeight={600} fontSize="1.2rem">
          Chi tiết thông báo
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Detail label="Tiêu đề" value={data.title} />
            <Detail
              label="Link"
              value={
                <a href={data.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1e88e5', textDecoration: 'underline' }}>
                  {data.link}
                </a>
              }
            />
            <Box mb={2}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Nội dung
              </Typography>
              <div className="prose prose-sm max-w-full text-gray-800" dangerouslySetInnerHTML={{ __html: data.message }}></div>
            </Box>
            <Detail label="Loại" value={<Chip size="small" label={data.type} />} />
            <Detail label="Target" value={`${data.targetType} #${data.targetId}`} />
            <Detail label="Gửi toàn bộ" value={data.isGlobal ? 'Có' : 'Không'} />
            <Detail label="Bắt đầu" value={formatDate(data.startAt)} />

            {!data.isGlobal && (
              <Box mt={2}>
                <Typography variant="body2" fontWeight={600}>
                  Người dùng nhận thông báo
                </Typography>
                {users.length > 0 ? (
                  <Box mt={1} pl={1}>
                    {users.map((u) => (
                      <Typography key={u.id} variant="body2">
                        • {u.User?.fullName || 'Không rõ'} ({u.User?.email || '—'})
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Không có người dùng nào.
                  </Typography>
                )}
              </Box>
            )}
          </Grid>

          {/* Bên phải */}
          <Grid item xs={12} md={6}>
            <Detail label="Hiển thị" value={data.isActive ? 'Có' : 'Không'} />
            <Detail label="Ngày tạo" value={formatDate(data.createdAt)} />

            {data.imageUrl && (
              <Box mt={3}>
                <Typography fontWeight={500} fontSize="0.95rem" gutterBottom>
                  Hình ảnh thông báo
                </Typography>
                <Box
                  component="img"
                  src={data.imageUrl}
                  alt="thumbnail"
                  sx={{
                    width: '80%',
                    maxWidth: '80%',
                    height: 'auto',
                    borderRadius: 2,
                    border: '1px solid #ccc',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
const Detail = ({ label, value }) => (
  <Box mb={2}>
    <Typography variant="body2" fontWeight={600} gutterBottom>
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {value || '—'}
    </Typography>
  </Box>
);
//
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleString('vi-VN', { hour12: false });
};

export default NotificationDetailDialog;
