import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  Tooltip,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import ShieldMoonRoundedIcon from '@mui/icons-material/ShieldMoonRounded';
import { motion, AnimatePresence } from 'framer-motion';

// ===================== Styled =====================
const glass = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(10px)'
};

const GradientTitle = styled(DialogTitle)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: '#fff'
}));

const HeaderGlow = styled('div')(() => ({
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(1200px circle at 10% -20%, rgba(255,255,255,0.25), transparent 40%),\
     radial-gradient(900px circle at 70% 120%, rgba(255,255,255,0.2), transparent 40%)',
  pointerEvents: 'none'
}));

const Panel = styled(Box)(({ theme }) => ({
  ...glass,
  borderRadius: 16,
  padding: theme.spacing(2),
  border: '1px solid rgba(255,255,255,0.6)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
}));

const labelCss = { fontWeight: 600, opacity: 0.7, minWidth: 120 };

const pulse = keyframes`
  0% { transform: scale(0.9); opacity: .5; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.9); opacity: .5; }
`;

const StatusDot = styled(FiberManualRecordRoundedIcon)(() => ({
  fontSize: 12,
  marginRight: 6,
  animation: `${pulse} 1.6s ease-in-out infinite`
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: '12px 0',
  borderBottom: '1px dashed rgba(0,0,0,0.06)'
}));

const FancyBackdrop = styled('div')(() => ({
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(1200px circle at 10% -10%, rgba(99,102,241,0.08), transparent 40%),\
     radial-gradient(1000px circle at 90% 120%, rgba(236,72,153,0.08), transparent 40%)',
  pointerEvents: 'none'
}));

// ===================== Helpers =====================
const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatDateVN = (d) => (d ? new Date(d).toLocaleDateString('vi-VN') : '—');

const roleColor = (theme, roleName) => {
  if (!roleName) return 'default';
  const map = {
    Admin: 'error',
    'Sales staff': 'warning',
    'Customer support': 'info',
    'Content editor': 'secondary'
  };
  return map[roleName] || 'success';
};

// Lấy URL avatar từ các field thường gặp
const pickAvatarUrl = (user) =>
  user?.avatar ||
  user?.avatarUrl ||
  user?.photoURL ||
  user?.image ||
  null;

// Avatar có fallback về initials khi ảnh lỗi/không có
const AvatarWithFallback = ({
  user,
  size = 48,
  rounded = false,
  motionProps,
  sx
}) => {
  const [error, setError] = useState(false);

  // URL ảnh (nếu có)
  const src = useMemo(() => {
    const url = pickAvatarUrl(user);
    return error ? null : url || null;
  }, [user, error]);

  const initials = getInitials(user?.fullName || user?.email || '');

  const commonSx = {
    width: size,
    height: size,
    fontWeight: 700,
    ...(rounded ? { borderRadius: 12 } : {}),
    ...(sx || {})
  };

  const content = (
    <Avatar
      src={src || undefined}
      alt={user?.fullName || user?.email || 'avatar'}
      onError={() => setError(true)}
      sx={commonSx}
    >
      {initials}
    </Avatar>
  );

  if (motionProps) {
    return (
      <Box component={motion.div} {...motionProps}>
        {content}
      </Box>
    );
  }
  return content;
};

// ===================== Component =====================
const UserDetailDialog = ({ open, onClose, user }) => {
  const theme = useTheme();
  if (!user) return null;

  const active = Number(user.status) === 1;

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* noop */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, y: 24, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 20, scale: 0.98 },
            transition: { duration: 0.28, ease: 'easeOut' },
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              backgroundImage:
                'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.95))'
            }
          }}
        >
          <GradientTitle>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <AvatarWithFallback
                  user={user}
                  size={48}
                  motionProps={{ whileHover: { rotate: -2, scale: 1.03 }, whileTap: { scale: 0.98 } }}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.45)'
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                    Thông tin chi tiết người dùng
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Chip
                      size="small"
                      icon={<ShieldMoonRoundedIcon />}
                      label={active ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                      color={active ? 'success' : 'default'}
                      variant="filled"
                      sx={{ color: '#fff' }}
                      component={motion.div}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 }}
                    />
                    <Chip
                      size="small"
                      icon={<WorkspacePremiumRoundedIcon />}
                     label={user.roles?.map(r => r.name).join(", ") || "Chưa có"}
  color={roleColor(theme, user.roles?.[0]?.name)} // Lấy màu theo role đầu tiên
                      variant="outlined"
                      sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}
                      component={motion.div}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16 }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Tooltip title="Đóng">
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                  <CloseRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <HeaderGlow />
          </GradientTitle>

          <DialogContent dividers sx={{ position: 'relative', bgcolor: 'transparent' }}>
            <FancyBackdrop />
            {/* Header Card */}
            <Panel component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <AvatarWithFallback user={user} size={64} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {user.fullName || '—'}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <AlternateEmailRoundedIcon fontSize="small" />
                        <Typography variant="body2">{user.email}</Typography>
                        <Tooltip title="Sao chép email">
                          <IconButton size="small" onClick={() => copy(user.email)}>
                            <ContentCopyRoundedIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Panel>

            <Divider sx={{ my: 2 }} />

            {/* Details List */}
            <Panel component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <DetailRow>
                <BadgeRoundedIcon />
                <Typography sx={labelCss}>Họ tên</Typography>
                <Typography>{user.fullName || '—'}</Typography>
              </DetailRow>
              <DetailRow>
                <AlternateEmailRoundedIcon />
                <Typography sx={labelCss}>Email</Typography>
                <Typography sx={{ wordBreak: 'break-all' }}>{user.email || '—'}</Typography>
              </DetailRow>
              <DetailRow>
                <WorkspacePremiumRoundedIcon />
                <Typography sx={labelCss}>Vai trò</Typography>
               <Typography>
  {user.roles?.map(r => r.name).join(", ") || "Chưa có"}
</Typography>

              </DetailRow>
              {user.createdAt && (
                <DetailRow>
                  <EventAvailableRoundedIcon />
                  <Typography sx={labelCss}>Ngày tạo</Typography>
                  <Typography>{formatDateVN(user.createdAt)}</Typography>
                </DetailRow>
              )}
              {user.updatedAt && (
                <DetailRow>
                  <UpdateRoundedIcon />
                  <Typography sx={labelCss}>Cập nhật cuối</Typography>
                  <Typography>{formatDateVN(user.updatedAt)}</Typography>
                </DetailRow>
              )}
            </Panel>

          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default UserDetailDialog;
