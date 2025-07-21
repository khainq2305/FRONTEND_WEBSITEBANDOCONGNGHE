import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon cho bước hoàn thành
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Icon cho chấm tròn
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // Icon cho trạng thái hủy/lỗi
import { toast } from 'react-toastify';
import { returnRefundService } from '@/services/client/returnRefundService';
import Loader from '@/components/common/Loader';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { format }  from 'date-fns';
import { vi } from 'date-fns/locale';

// Hàm giả định để lấy icon phương thức thanh toán (giữ nguyên)
const getPaymentMethodIcon = (bankName) => {
    if (!bankName) return null;
    const lowerCaseBankName = bankName.toLowerCase();
    if (lowerCaseBankName.includes('momo')) {
        return <img src="https://static.mservice.com.vn/img/logo-momo.png" alt="MoMo" className="w-6 h-6 inline-block mr-2 rounded-full object-contain" />;
    }
    if (lowerCaseBankName.includes('zalopay')) {
        return <img src="https://zalopay.vn/assets/icon/logo-zalopay.svg" alt="ZaloPay" className="w-6 h-6 inline-block mr-2" />;
    }
    return null;
};

const ReturnOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await returnRefundService.getReturnDetail(id);
                setData(res.data?.data);
            } catch (err) {
                console.error('Error fetching return request:', err);
                toast.error('Không tìm thấy yêu cầu trả hàng');
                navigate('/user-profile#quan-ly-don-hang', { replace: true });
            } finally {
                setLoading(false);
            }
        })();
    }, [id, navigate]);

    if (loading) return <Loader fullscreen />;
    if (!data) return (
        <Box className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md mb-10 text-center">
            <Typography variant="h6" color="textSecondary">Không tìm thấy dữ liệu yêu cầu trả hàng.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)} className="mt-4">Quay lại</Button>
        </Box>
    );

    const {
        status, 
        createdAt, // Lấy từ API
        reason,
        detailedReason,
        refundAmount, // Tổng số tiền hoàn lại
        items, // Các sản phẩm trong yêu cầu trả hàng
        bankName,
        accountNumber,
        accountHolderName,
        refundEmail,
       evidenceImages: images,
  evidenceVideos: videos,
        order, // Đơn hàng gốc
        returnCode // Giả định trường này có từ API getReturnRequestDetail
    } = data;

    // Logic cho thanh tiến trình (giữ nguyên)
    const progressSteps = ['Trả hàng', 'Kiểm tra hàng hoàn', 'Hoàn tiền'];
    let currentStepIndex = 0;

    if (['pending', 'approved', 'awaiting_pickup', 'pickup_booked', 'returning'].includes(status)) {
        currentStepIndex = 0;
    } 
    if (status === 'received') {
        currentStepIndex = 1;
    } 
    if (['refunded', 'completed'].includes(status)) {
        currentStepIndex = 2;
    }
    if (['rejected', 'cancelled', 'failed'].includes(status)) {
        currentStepIndex = -1; 
    }

    const getStatusChipColor = (currentStatus) => {
        switch (currentStatus) {
            case 'pending':
            case 'approved':
            case 'awaiting_pickup':
            case 'pickup_booked':
            case 'returning':
                return 'warning';
            case 'received':
                return 'info';
            case 'refunded':
            case 'completed':
                return 'success';
            case 'rejected':
            case 'cancelled':
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };
    
    // Ánh xạ lý do trả hàng từ mã sang văn bản dễ đọc
    const getReasonText = (reasonCode) => {
        switch(reasonCode) {
            case 'WRONG_SIZE_COLOR': return 'Sai kích thước/màu sắc';
            case 'DEFECTIVE_PRODUCT': return 'Sản phẩm bị lỗi';
            case 'NOT_AS_DESCRIBED': return 'Không đúng mô tả';
            case 'MISSING_PARTS': return 'Thiếu linh kiện/phụ kiện';
            case 'OTHER': return detailedReason || 'Lý do khác';
            default: return reasonCode; // Trả về mã nếu không khớp
        }
    }

    // Xử lý `images` và `videos` từ chuỗi comma-separated sang mảng URL
 // Xử lý `images` và `videos` dù là chuỗi đơn hay nhiều cái
const imageUrls = images
  ? (images.includes(',') ? images.split(',').map(s => s.trim()) : [images.trim()])
  : [];

const videoUrls = videos
  ? (videos.includes(',') ? videos.split(',').map(s => s.trim()) : [videos.trim()])
  : [];

    return (
        <Box className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg mb-10">
            {/* Header với nút quay lại và thông tin chung trên cùng */}
            <Box className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <Box className="flex items-center">
                    <IconButton onClick={() => navigate(-1)} className="mr-2 p-1">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="font-bold text-gray-800">QUAY LẠI</Typography>
                </Box>
                {/* Thông tin Mã Yêu Cầu và Hoàn Tiền Vào */}
                <Box className="flex items-center text-sm text-gray-600">
                    <Typography className="font-semibold text-gray-800">
                        Mã Yêu Cầu: {returnCode || 'N/A'}
                    </Typography>
                    <span className="mx-2">|</span>
                    {/* Sử dụng data.createdAt hoặc data.updatedAt tùy thuộc vào trường bạn muốn hiển thị */}
                    <Typography>
                        Hoàn Tiền Vào: {data.createdAt ? format(new Date(data.createdAt), 'HH:mm dd ThMM yyyy', { locale: vi }) : 'N/A'}
                    </Typography>
                </Box>
            </Box>

            {/* Thanh tiến trình */}
<Box className="mb-8 p-4 bg-white rounded-md">
  {/* Wrapper giới hạn width chung */}
  <Box className="relative mb-6 h-4 w-full max-w-4xl mx-auto">
    {/* Line nền xám toàn bộ */}
    <Box className="absolute top-1/2 left-[calc(16.66%-8px)] right-[calc(16.66%-8px)] h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />

    {/* Line xanh tiến độ (CHUẨN, không vượt) */}
    {currentStepIndex > 0 && (
      <Box
        className="absolute top-1/2 h-0.5 bg-green-500 transform -translate-y-1/2 z-10"
        style={{
          left: 'calc(16.66% - 8px)',
          right: `calc(${(100 - 16.66 - (currentStepIndex * 33.33))}% + 8px)`,
        }}
      />
    )}

    {/* Dot + Label */}
    <Box className="relative flex justify-between items-center w-full z-20">
      {progressSteps.map((step, index) => (
        <Box key={step} className="flex flex-col items-center w-1/3">
          <Box
            className={`w-4 h-4 rounded-full mb-1 ${
              index < currentStepIndex
                ? 'bg-green-500'
                : index === currentStepIndex
                ? 'bg-orange-500'
                : 'bg-gray-300'
            }`}
          />
          <Typography
            className={`text-[13px] text-center mt-2 whitespace-nowrap leading-tight ${
              index === currentStepIndex ? 'text-orange-600 font-semibold' : 'text-gray-700'
            }`}
          >
            {step}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>

 
</Box>
{/* Nếu hoàn tiền, hiển thị thông báo tương ứng */}
{status === 'refunded' && (
  <Box className="bg-orange-50 border border-orange-200 rounded-md px-4 py-3 mb-6">
    <Typography className="text-orange-600 font-semibold mb-1">Đã hoàn tiền</Typography>
    <Typography className="text-sm text-gray-800">
      Số tiền {formatCurrencyVND(refundAmount)} sẽ được hoàn vào&nbsp;
      {bankName
        ? `tài khoản ${bankName} của bạn`
        : 'Số dư TK của bạn'}
      &nbsp;trong vòng 24 giờ.
    </Typography>
  </Box>
)}


            {/* Thông tin sản phẩm */}
            <Box className="my-6 p-4 border border-gray-200 rounded-md">
                {items.map(item => { 
                    // 'items' là ReturnRequestItem, đã có sku.product và sku được include từ API
                    const matchedOrderItem = order?.items?.find(oi => oi.skuId === item.skuId);
const itemPrice = matchedOrderItem?.price || 0;

                    const productName = item.sku?.product?.name || 'Sản phẩm không tồn tại';
                    const productThumbnail = item.sku?.product?.thumbnail || 'https://via.placeholder.com/80';
                    const productVariation = item.sku?.variation;
                    
                    return (
                        <Box key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                            <img
                                src={productThumbnail} 
                                alt={productName}
                                className="w-20 h-20 object-cover rounded-md border border-gray-200"
                            />
                            <Box className="flex-grow">
                                <Typography className="font-medium text-base text-gray-800">{productName}</Typography>
                                {productVariation && <Typography variant="body2" color="textSecondary" className="text-xs">
                                    {productVariation}
                                </Typography>}
                                <Typography variant="body2" color="textSecondary" className="text-xs">
                                    x{item.quantity}
                                </Typography>
                            </Box>
                            <Box className="text-right">
                                {/* Hiển thị giá sản phẩm theo ảnh mẫu (giả định 0 đ nếu không muốn hiện giá thật) */}
                                <Typography className="font-semibold text-base text-red-600">
                                    {formatCurrencyVND(itemPrice)}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
                {/* Phần "Số tiền hoàn nhận được" và "Hoàn tiền vào" */}
                <Box className="pt-4 mt-4 flex justify-end"> {/* Loại bỏ border-t nếu muốn tách biệt hoàn toàn */}
                    <Grid container spacing={0} className="w-full sm:w-[350px]"> {/* Điều chỉnh width để khớp ảnh */}
                        <Grid item xs={6} className="text-gray-600 text-sm">Số tiền hoàn nhận được</Grid>
                        <Grid item xs={6} className="text-right font-semibold text-red-500 text-sm">
                            {formatCurrencyVND(refundAmount)}
                        </Grid>
                        <Grid item xs={6} className="text-gray-600 text-sm mt-1">Hoàn tiền vào</Grid>
                      <Grid item xs={6} className="text-right font-semibold text-gray-800 text-sm mt-1">
  {order?.paymentMethod === 'momo'
    ? 'Ví MoMo'
    : order?.paymentMethod === 'zalopay'
    ? 'Ví ZaloPay'
    : order?.paymentMethod === 'cod'
    ? 'Thanh toán khi nhận hàng'
    : order?.paymentMethod === 'bank'
    ? 'Chuyển khoản ngân hàng'
    : 'Không rõ'}
</Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Lý do trả hàng và Bằng chứng */}
            <Box className="my-6 p-4 border border-gray-200 rounded-md">
                <Typography variant="h6" className="font-bold text-gray-700 mb-3">Lý do trả hàng</Typography>
                {/* Dòng lý do chính */}
                <Typography className="mb-2 text-gray-800 text-sm">
                    Lý do: <span className="font-bold">{getReasonText(reason)}</span>
                </Typography>
                {/* Dòng chi tiết lý do (nếu có và reason là OTHER) */}
                {detailedReason && reason === 'OTHER' && (
                    <Typography className="text-gray-800 text-sm">
                        Chi tiết: {detailedReason}
                    </Typography>
                )}
                {/* Hiển thị bằng chứng ngay dưới lý do như ảnh mẫu trước đó (ảnh 0f2b93.png) */}
                {(imageUrls?.length > 0 || videoUrls?.length > 0) && (
                    <Box className="mt-4 pt-4 border-t border-gray-200">
                        <Typography variant="subtitle1" className="font-semibold mb-2 text-gray-700">Bằng chứng:</Typography>
                        <Box className="flex flex-wrap gap-3 mt-2">
                            {imageUrls?.map((url, imgIndex) => (
                                <img key={`img-${imgIndex}`} src={url} alt={`Bằng chứng ${imgIndex + 1}`} className="w-[100px] h-[100px] object-cover rounded-md border" />
                            ))}
                            {videoUrls?.map((url, vidIndex) => (
                                <video key={`vid-${vidIndex}`} src={url} controls className="w-[100px] h-[100px] object-cover rounded-md border" />

                            ))}
                        </Box>
                        {imageUrls.length === 0 && videoUrls.length === 0 && (
                            <Typography className="text-gray-500">Không có bằng chứng được cung cấp.</Typography>
                        )}
                    </Box>
                )}
            </Box>
            
            {/* Thông tin hoàn tiền (Box riêng) */}
           
            <Box className="mt-8 text-center">
                <Button variant="outlined" color="primary" onClick={() => navigate(-1)} size="large" className="px-6 py-2">
                    Quay lại
                </Button>
            </Box>
        </Box>
    );
};

export default ReturnOrderDetailPage;