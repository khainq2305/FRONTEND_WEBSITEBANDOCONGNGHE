import { useRef, useState, useEffect } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import socket from '../../../../constants/socket'; // điều chỉnh đường dẫn nếu cần

// project imports
import MainCard from 'components/Admin/MainCard';
import IconButton from 'components/Admin/@extended/IconButton';
import Transitions from 'components/Admin/@extended/Transitions';

// services
import { notificationService } from '../../../../services/admin/notificationService';

// icons
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

// dayjs for time formatting
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// styles
const avatarSX = { width: 36, height: 36, fontSize: '1rem' };
const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| ADMIN HEADER - NOTIFICATION ||============================== //

export default function Notification() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Hàm đánh dấu 1 thông báo đã đọc ---
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  // --- Hàm đánh dấu tất cả đã đọc ---
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả đã đọc:', err);
    }
  };

  useEffect(() => {
    // Lắng nghe khi backend gửi event
    socket.on('new-admin-notification', (newNoti) => {
      setNotifications((prev) => [newNoti, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      // Dọn sự kiện khi unmount component
      socket.off('new-admin-notification');
    };
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getByRole();
      const data = Array.isArray(res?.data) ? res.data : [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Lỗi khi lấy thông báo:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotificationContent = (item) => {
    const isSystem = item.type === 'system';
    const title = item.title;
    const createdBy = item.createdBy ? `Admin ${item.createdBy}` : 'Hệ thống';

    return {
      avatar: (
        <Avatar
          sx={{
            bgcolor: isSystem
              ? 'warning.lighter'
              : item.type === 'order'
                ? 'primary.lighter'
                : item.type === 'promotion'
                  ? 'success.lighter'
                  : 'grey.200',
            color: isSystem
              ? 'warning.main'
              : item.type === 'order'
                ? 'primary.main'
                : item.type === 'promotion'
                  ? 'success.main'
                  : 'grey.800'
          }}
        >
          {isSystem ? (
            <MessageOutlined />
          ) : item.type === 'order' ? (
            <SettingOutlined />
          ) : item.type === 'promotion' ? (
            <GiftOutlined />
          ) : (
            <BellOutlined />
          )}
        </Avatar>
      ),
      primaryText: (
        <Typography variant="body2" color="text.secondary">
          {`[${item.type?.toUpperCase() || 'SYSTEM'}] ${createdBy} đã tạo thông báo:`}
        </Typography>
      ),
      secondaryText: (
        <>
          <Typography variant="h6" fontStyle="italic" sx={{ mb: 0.25 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: item.message }} />
        </>
      )
    };
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent',
          ...theme.applyStyles('dark', {
            bgcolor: open ? 'background.default' : 'transparent'
          })
        })}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'notification-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>

      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper
              sx={(theme) => ({
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: { xs: 285, md: 420 }
              })}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Thông báo"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    unreadCount > 0 && (
                      <Tooltip title="Đánh dấu tất cả là đã đọc">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={handleMarkAllAsRead} // Gọi hàm xử lý mới
                        >
                          <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      maxHeight: 505,
                      overflowY: 'auto',
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        px: 2,
                        '&.Mui-selected': {
                          bgcolor: 'grey.50',
                          color: 'text.primary'
                        },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': {
                          ...actionSX,
                          position: 'relative'
                        }
                      }
                    }}
                  >
                    {notifications.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="Không có thông báo nào" />
                      </ListItem>
                    ) : (
                      notifications.map((item) => {
                        const { avatar, primaryText, secondaryText } = renderNotificationContent(item);

                        return (
                          <ListItem
                            key={item.id}
                            component={ListItemButton}
                            divider
                            selected={!item.isRead}
                            onClick={() => handleMarkAsRead(item.id)} // Gọi hàm đánh dấu đọc từng thông báo
                            secondaryAction={
                              <Typography variant="caption" noWrap>
                                {dayjs(item.createdAt).fromNow()}
                              </Typography>
                            }
                          >
                            <ListItemAvatar>{avatar}</ListItemAvatar>
                            <ListItemText primary={primaryText} secondary={secondaryText} />
                            {/* Hiện chấm xanh khi chưa đọc */}
                            {!item.isRead && (
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  bgcolor: 'primary.main',
                                  borderRadius: '50%',
                                  position: 'absolute',
                                  top: 12,
                                  right: 12
                                }}
                                title="Chưa đọc"
                              />
                            )}
                          </ListItem>
                        );
                      })
                    )}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
