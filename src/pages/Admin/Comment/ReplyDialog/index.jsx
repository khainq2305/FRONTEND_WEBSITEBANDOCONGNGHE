import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Button,
    Box,
    Stack,
    Avatar,
    IconButton,
    Paper,
    Zoom,
    Rating, // <-- Nhập component Rating
} from "@mui/material";
import {
    Close as CloseIcon,
    Reply as ReplyIcon,
    Send as SendIcon,
    Cancel as CancelIcon,
    FormatQuote as FormatQuoteIcon,
} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';

// Tạo Transition component cho hiệu ứng Zoom
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const ReplyDialog = ({
    open,
    onClose,
    onSubmit,
    selectedComment,
    dialogReplyText,
    onChangeText,
}) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                },
            }}
        >
            <DialogTitle sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ReplyIcon color="primary" />
                        <Typography variant="h6" component="div">
                            Phản hồi bình luận
                        </Typography>
                    </Stack>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                {/* --- Phần trích dẫn bình luận gốc --- */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                        borderRadius: 2,
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Avatar
                            src={selectedComment?.user?.avatarUrl}
                            alt={selectedComment?.user?.fullName}
                            sx={{ width: 40, height: 40 }}
                        />
                        <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {selectedComment?.user?.fullName || "Người dùng"}
                            </Typography>
                            
                            {selectedComment?.rating > 0 && (
                                <Rating
                                    name="read-only-rating"
                                    value={selectedComment.rating}
                                    readOnly
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                />
                            )}
                            {/* --- KẾT THÚC PHẦN ĐÁNH GIÁ --- */}

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {selectedComment?.content}
                            </Typography>
                        </Box>
                        <FormatQuoteIcon sx={{ color: 'text.disabled', transform: 'scaleX(-1)', alignSelf: 'center' }} />
                    </Stack>
                </Paper>

                {/* --- Phần nhập liệu phản hồi --- */}
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    value={dialogReplyText}
                    onChange={(e) => onChangeText(e.target.value)}
                    label="Nội dung phản hồi của bạn"
                    variant="filled"
                    sx={{
                        '& .MuiFilledInput-root': {
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                            '&:before, &:after': {
                                borderBottom: 'none',
                            },
                        },
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    startIcon={<CancelIcon />}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    startIcon={<SendIcon />}
                    sx={{
                        color: '#fff',
                        background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 6px 10px 4px rgba(33, 150, 243, .3)',
                        },
                    }}
                >
                    Gửi phản hồi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReplyDialog;