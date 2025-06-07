import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
  CircularProgress,
  Avatar,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import { toast } from 'react-toastify';

// Colors derived from the image
const BUBBLE_CUSTOMER_BG = '#e4f3ff'; // Light blue, similar to the customer bubble
const BUBBLE_ADMIN_BG = '#f0f0f0';   // Light grey, similar to the admin bubble
const TEXT_COLOR = '#000000';
const TIMESTAMP_COLOR = '#999999';
const NAME_COLOR = '#333333';
const REPLY_LINK_COLOR = '#4285f4'; // Primary blue for 'Phản hồi' link
const REPLY_INPUT_AREA_BG = '#f5f5f5'; // Background for the overall input area
const REPLY_TO_BOX_BG = '#e8f0fe';  // Background for the 'Trả lời...' box
const REPLY_TO_BORDER_COLOR = '#4285f4'; // Left border for the 'Trả lời...' box
const SEND_BUTTON_BG = '#d32f2f'; // Red for the 'Gửi phản hồi' button
const SEND_BUTTON_HOVER_BG = '#c62828'; // Darker red on hover

// Helper function to format timestamp similar to the image's "1 tuần trước" or "7 giờ trước"
const formatTimestamp = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime()); // Use getTime() for milliseconds
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffWeeks > 0) {
    return `${diffWeeks} tuần trước`;
  } else if (diffDays > 0) {
    return `${diffDays} ngày trước`;
  } else if (diffHours > 0) {
    return `${diffHours} giờ trước`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} phút trước`;
  } else {
    return 'Vừa xong';
  }
};

const QuestionDetailDialog = ({
  open,
  onClose,
  question,
  onSubmitReply,
  currentAdminEmail,
  currentAdminId
}) => {
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const bottomRef = useRef(null);
  const lastSendTimeRef = useRef(0);

  // When question changes, update replies
  useEffect(() => {
    if (question?.replies) {
      setReplies(question.replies);
    } else {
      setReplies([]);
    }
  }, [question]);

  // Auto-scroll to bottom when dialog opens or replies change
  useEffect(() => {
    if (open && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [replies, open]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Get display name based on sender type
  const getDisplayName = (sender) => {
    if (!sender) return 'Khách';
    if (sender.fullName) return sender.fullName;
    if (sender.isAdminReply) return 'Quản Trị Viên'; // As per image
    if (sender.email === question?.email) return question?.fullName || 'Khách hàng';
    return 'Khách';
  };

  // Handle sending reply
  const handleSend = async () => {
    const now = Date.now();
    if (
      now - lastSendTimeRef.current < 1000 ||
      !reply.trim() ||
      sending ||
      cooldown > 0
    ) {
      return;
    }
    lastSendTimeRef.current = now;
    setSending(true);

    try {
      const res = await onSubmitReply({
        questionId: question?.id,
        content: reply.trim(),
        replyToId: replyingTo?.id || null,
        userId: currentAdminId // Assuming admin is sending
      });

      if (!res?.success) {
        toast.error(res.message || 'Gửi thất bại');
        setSending(false);
        return;
      }

      const newReply = {
        ...res.data,
        isAdminReply: true, // Mark as admin reply
        email: currentAdminEmail,
        userId: currentAdminId,
        fullName: 'Quản Trị Viên', // Ensure name is "Quản Trị Viên"
        replyTo: replyingTo || null, // Include original message if replying to specific one
        createdAt: res.data.createdAt || new Date().toISOString()
      };

      setReplies((prev) => [...prev, newReply]);
      setReply('');
      setReplyingTo(null); // Clear replyingTo after sending
      setCooldown(5); // Set cooldown after successful send
      toast.success('Đã gửi');
    } catch (err) {
      console.error('Error sending reply:', err);
      toast.error('Gửi thất bại');
    } finally {
      setSending(false);
    }
  };

  // Small component for the "Phản hồi" link
  const ReplyLink = ({ onClick, showCollapse = false }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mt: 0.5,
        color: REPLY_LINK_COLOR,
        fontWeight: 500,
        cursor: 'pointer',
        fontSize: '0.8rem', // Match image's font size
      }}
      onClick={onClick}
    >
      <ReplyIcon sx={{ fontSize: '1rem', mr: 0.5, transform: 'scaleX(-1)' }} /> {/* Flipped icon */}
      Phản hồi
      {showCollapse && (
        <Typography
          component="span" // Use span to avoid block display issues
          variant="caption"
          sx={{ fontWeight: 500, ml: 1, color: REPLY_LINK_COLOR }} // Same color as "Phản hồi"
        >
          Thu gọn phản hồi ^
        </Typography>
      )}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #eee' }}>
        Phản hồi: {question?.fullName || 'Khách hàng'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#666' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#fff', minHeight: '300px', p: 2 }}>
        <Stack spacing={2}>
          {/* Original Question */}
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32, fontSize: '0.9rem' }}>
              {question?.fullName ? question.fullName[0] : 'K'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}> {/* Allow box to grow */}
              <Box
                bgcolor={BUBBLE_CUSTOMER_BG}
                color={TEXT_COLOR}
                p={1.5}
                borderRadius={2}
                sx={{ maxWidth: 'calc(100% - 40px)' }} // Adjusted for more width, considering avatar space
              >
                <Typography
                  fontWeight="bold"
                  variant="body2"
                  sx={{ color: NAME_COLOR }}
                >
                  {getDisplayName(question)}
                </Typography>
                {/* Changed variant to 'body1' for larger text */}
                <Typography variant="body1">{question?.content}</Typography>
              </Box>
              {/* Timestamp and Reply link for the original question */}
              <Box display="flex" alignItems="center" mt={0.5} gap={1}>
                <Typography variant="caption" sx={{ color: TIMESTAMP_COLOR }}>
                  {formatTimestamp(question?.createdAt)}
                </Typography>
                <ReplyLink onClick={() => setReplyingTo(question)} showCollapse={false} />
              </Box>
            </Box>
          </Box>

          {/* List of Replies */}
          {replies.map((msg, idx) => {
            const isAdmin = msg.isAdminReply;
            return (
              <Box
                key={msg.id || idx}
                display="flex"
                justifyContent={isAdmin ? 'flex-end' : 'flex-start'}
                sx={{ width: '100%' }}
              >
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  sx={{
                    flexDirection: isAdmin ? 'row-reverse' : 'row', // Admin messages on the right, customer on left
                    maxWidth: '90%', // Increased max width for bubbles
                  }}
                >
                  {!isAdmin && ( // Only show avatar for customer replies
                    <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32, fontSize: '0.9rem' }}>
                      {msg.fullName ? msg.fullName[0] : 'K'}
                    </Avatar>
                  )}
                  <Box sx={{ flexGrow: 1 }}> {/* Allow box to grow */}
                    <Box
                      bgcolor={isAdmin ? BUBBLE_ADMIN_BG : BUBBLE_CUSTOMER_BG}
                      color={TEXT_COLOR}
                      p={1.5}
                      borderRadius={2}
                      sx={{ maxWidth: '100%' }} // Allow bubble to take full width of its container
                    >
                      <Typography
                        fontWeight="bold"
                        variant="body2"
                        sx={{ color: NAME_COLOR }}
                      >
                        {getDisplayName(msg)}
                      </Typography>

                      {msg.replyTo && ( // Display the reply-to box if applicable
                        <Box
                          sx={{
                            bgcolor: REPLY_TO_BOX_BG,
                            borderLeft: `3px solid ${REPLY_TO_BORDER_COLOR}`,
                            px: 1.5,
                            py: 1,
                            mb: 1,
                            borderRadius: 1
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 500, color: REPLY_LINK_COLOR }}
                          >
                            {getDisplayName(msg.replyTo)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: '0.85rem', color: '#333' }}
                          >
                            {msg.replyTo.content}
                          </Typography>
                        </Box>
                      )}

                      {/* Changed variant to 'body1' for larger text */}
                      <Typography variant="body1">{msg.content}</Typography>
                    </Box>
                    {/* Timestamp and Reply link for each message (only for customer messages) */}
                    <Box display="flex" alignItems="center" mt={0.5} gap={1} justifyContent={isAdmin ? 'flex-end' : 'flex-start'}>
                      <Typography
                        variant="caption"
                        sx={{ color: TIMESTAMP_COLOR }}
                      >
                        {formatTimestamp(msg.createdAt)}
                      </Typography>
                      {!isAdmin && <ReplyLink onClick={() => setReplyingTo(msg)} />}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}

          <div ref={bottomRef} />
        </Stack>
      </DialogContent>

      {/* Always visible input area at the bottom */}
      <DialogActions sx={{ bgcolor: REPLY_INPUT_AREA_BG, px: 2, py: 2, flexDirection: 'column', alignItems: 'flex-start', borderTop: '1px solid #eee' }}>
        {/* 'Trả lời...' box when replying to a specific message */}
        {replyingTo && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ bgcolor: '#fff', p: 1, mb: 1, borderRadius: 2, width: '100%', border: '1px solid #eee' }}
          >
            <Box>
              <Typography variant="caption">
                Trả lời <strong>{getDisplayName(replyingTo)}</strong>
              </Typography>
              <Typography variant="body2" noWrap maxWidth="350px">
                {replyingTo.content}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setReplyingTo(null)}
              sx={{ color: '#999' }}
            >
              ✕
            </IconButton>
          </Box>
        )}

        {/* Input field and send button */}
        <Box display="flex" alignItems="center" gap={1} width="100%">
          <TextField
            fullWidth
            size="small"
            placeholder={
              cooldown > 0 ? `Chờ ${cooldown} giây...` : 'Viết phản hồi...'
            }
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            disabled={sending || cooldown > 0}
            multiline
            maxRows={4}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#fff',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bdbdbd',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: REPLY_LINK_COLOR,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!reply.trim() || sending || cooldown > 0}
            sx={{
              bgcolor: SEND_BUTTON_BG,
              '&:hover': {
                bgcolor: SEND_BUTTON_HOVER_BG,
              },
              color: '#fff',
              px: 3,
              py: 1.2,
              minWidth: '120px',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : 'Gửi phản hồi'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDetailDialog;
