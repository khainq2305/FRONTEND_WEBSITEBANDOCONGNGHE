import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    Rating,
    TextField,
    Button,
    Chip,
    Grid
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reviewService } from '@/services/admin/reviewService';

const ReviewAllDetail = () => {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await reviewService.getById(id);
                if (res?.data) {
                    setReview(res.data.data);
                    console.log(res.data.data)
                    setReply(res.data.data.replyContent || '');
                } else {
                    setReview(null);
                }
            } catch (err) {
                console.error('❌ Lỗi khi lấy chi tiết bình luận:', err);
                setReview(null);
            }
        };
        fetch();
    }, [id]);

    const handleSubmitReply = async () => {
        try {
            setLoading(true);
            await reviewService.replyToReview(id, {
                replyContent: reply,
                responderId: 1
            });
            alert('Đã phản hồi thành công!');
        } catch (err) {
            console.error('❌ Lỗi phản hồi:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!review) {
        return (
            <Typography sx={{ mt: 4, textAlign: 'center' }}>
                Không tìm thấy bình luận
            </Typography>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    🗨️ Chi tiết bình luận sản phẩm
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box display="flex" gap={2} mb={2}>
                    <Box
                        component="img"
                        src={review.sku?.product?.thumbnail || 'https://via.placeholder.com/100'}
                        alt={review.sku?.product?.name || 'Sản phẩm'}
                        width={100}
                        height={100}
                        sx={{ objectFit: 'cover', borderRadius: 2 }}
                    />
                    <Box>
                        <Typography fontWeight={600}>{review.sku?.product?.name}</Typography>
                        <Rating value={review.rating || 0} readOnly />
                        <Typography fontWeight="bold" mb={1}>Ngày giờ bình luận:</Typography>
                        <Typography variant="body2" mt={1}>
                            {review.createdAt
                                ? new Date(review.createdAt).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })
                                : 'Không rõ thời gian'}
                        </Typography>

                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Avatar src={review.user?.avatarUrl} />
                    <Typography>{review.user?.fullName || 'Ẩn danh'}</Typography>
                    <Chip
                        label={review.isReplied ? 'Đã phản hồi' : 'Chưa phản hồi'}
                        size="small"
                        color={review.isReplied ? 'success' : 'warning'}
                    />
                </Box>

                <Typography fontWeight="bold" mb={1}>Nội dung:</Typography>
                <Typography
                    sx={{
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        maxWidth: '90%',
                        lineHeight: 1.6,
                        mb: 3
                    }}
                >
                    {review.content || 'Không có nội dung'}
                </Typography>


                {review.medias?.length > 0 && (
                    <>
                        <Typography fontWeight="bold" mb={1}>Hình ảnh / Video đính kèm:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                            {review.medias.map((media, i) => (
                                <Box key={i}>
                                    {media.type === 'image' ? (
                                        <Box
                                            component="img"
                                            src={media.url}
                                            alt={`review-media-${i}`}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                boxShadow: 1,
                                                '&:hover': { opacity: 0.9 }
                                            }}
                                            onClick={() => window.open(media.url, '_blank')}
                                        />
                                    ) : (
                                        <video
                                            src={media.url}
                                            controls
                                            width="180"
                                            height="100"
                                            style={{ borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.15)' }}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </>
                )}

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Phản hồi"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    onClick={handleSubmitReply}
                    disabled={loading || !reply.trim()}
                >
                    Gửi phản hồi
                </Button>
            </CardContent>
        </Card>
    );
};

export default ReviewAllDetail;
