import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { toast } from 'react-toastify';
import { returnRefundService } from '@/services/client/returnRefundService';
import Loader from '@/components/common/Loader';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { confirmDelete } from '../../../../components/common/ConfirmDeleteDialog';

import ReturnCancelledImage from '@/assets/Client/images/20190219_iPx0I4QFCANpK9p1EgnkeFlV.png';
const rejectReasonsOptions = [
  { id: 'INVALID_PROOF', label: 'Bằng chứng không rõ ràng/không hợp lệ' },
  { id: 'OUT_OF_POLICY', label: 'Yêu cầu nằm ngoài chính sách đổi trả' },
  { id: 'WRONG_ITEM_RETURNED', label: 'Sản phẩm gửi về không đúng với yêu cầu' },
  { id: 'DAMAGED_BY_CUSTOMER', label: 'Sản phẩm bị lỗi do người mua' },
  { id: 'OVER_TIME_LIMIT', label: 'Đã quá thời hạn yêu cầu đổi trả' },
  { id: 'OTHER', label: 'Lý do khác' }
];

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
const handleCancelRequest = async () => {
  const confirmed = await confirmDelete('hủy', 'yêu cầu trả hàng này');
  if (!confirmed) return;

  try {
    await returnRefundService.cancelReturnRequest(id);
    toast.success('Đã hủy yêu cầu trả hàng');
    navigate(0);
  } catch (err) {
    console.error('❌ Lỗi khi hủy yêu cầu:', err);
    toast.error('Không thể hủy yêu cầu lúc này');
  }
};

    if (loading) return <Loader fullscreen />;
    if (!data) return (
        <Box className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md mb-10 text-center">
            <Typography variant="h6" color="textSecondary">Không tìm thấy dữ liệu yêu cầu trả hàng.</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)} className="mt-4">Quay lại</Button>
        </Box>
    );

    const {
        status,
        createdAt,
        reason,
        detailedReason,
        refundAmount,
        items,
        bankName,
        accountNumber,
        accountHolderName,
        refundEmail,
        evidenceImages: images,
        evidenceVideos: videos,
        order,
        returnCode
    } = data;


    const progressSteps = ['CYBERZONE đang xem xét', 'Trả hàng', 'Kiểm tra hàng hoàn', 'Hoàn tiền'];

    let currentStepIndex = 0;

    if (status === 'pending') {
        currentStepIndex = 0;
    } else if (['approved', 'awaiting_pickup', 'pickup_booked', 'returning'].includes(status)) {
        currentStepIndex = 1;
    } else if (status === 'received') {
        currentStepIndex = 2;
    } else if (['refunded', 'completed'].includes(status)) {
        currentStepIndex = 3;
    } else if (['rejected', 'cancelled', 'failed'].includes(status)) {
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


  const getReasonText = (reasonCode) => {
  switch (reasonCode) {
    case 'WRONG_SIZE_COLOR':
      return 'Nhận sai kích cỡ, màu sắc, hoặc sai sản phẩm';
    case 'NOT_AS_DESCRIBED':
      return 'Sản phẩm khác với mô tả của shop';
    case 'DEFECTIVE':
      return 'Sản phẩm bị lỗi, hư hỏng, không hoạt động';
    case 'CHANGE_MIND':
      return 'Không còn nhu cầu mua nữa';
    case 'OTHER':
      return detailedReason || 'Lý do khác (vui lòng mô tả bên dưới)';
    default:
      return reasonCode;
  }
};



    const imageUrls = images
        ? (images.includes(',') ? images.split(',').map(s => s.trim()) : [images.trim()])
        : [];

    const videoUrls = videos
        ? (videos.includes(',') ? videos.split(',').map(s => s.trim()) : [videos.trim()])
        : [];


const stepPercent = 100 / (progressSteps.length - 1);
const dotPx = 16; // hoặc w-4
const containerWidth = 100; // %
const extraOffsetPercent = (dotPx / 2 / containerWidth) * 100; // = 8px / tổng width
    return (
        <Box className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg mb-10">

            <Box className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <Box className="flex items-center">
                    <IconButton onClick={() => navigate(-1)} className="mr-2 p-1">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className="font-bold text-gray-800">QUAY LẠI</Typography>
                </Box>

                <Box className="flex items-center text-sm text-gray-600">
                    <Typography className="font-semibold text-gray-800">
                        Mã Yêu Cầu: {returnCode || 'N/A'}
                    </Typography>
                    <span className="mx-2">|</span>

                   <Typography>
  Hoàn Tiền Vào: 
  {data.refundRequest?.refundedAt 
    ? format(new Date(data.refundRequest.refundedAt), 'HH:mm dd \'tháng\' MM yyyy', { locale: vi }) 
    : 'Chưa hoàn tiền'}
</Typography>

                </Box>
            </Box>


{status === 'cancelled' ? (
  <Box className="mb-8 p-4 bg-orange-50 rounded-md border border-orange-200">
    <Typography className="text-red-600 font-semibold text-sm mb-1">
      Yêu cầu đã bị huỷ
    </Typography>
    <Typography className="text-gray-600 text-sm">
      {data.cancelledBy === 'user'
        ? 'Bạn đã huỷ yêu cầu trả hàng hoàn tiền.'
        : 'Yêu cầu của bạn đã bị huỷ bởi quản trị viên.'}
    </Typography>

    {data.responseNote && (
      <Typography className="text-sm text-gray-800 mt-2">
        <strong>Lý do huỷ:</strong> {data.responseNote}
      </Typography>
    )}
  </Box>


) : (
<Box className="mb-8 p-4 bg-white rounded-md">
  <Box className="relative mb-6 h-4 w-full max-w-4xl mx-auto">
    {/* Line xám chạy hết */}
    <Box
      className="absolute top-1/2 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0"
      style={{
        left: '12.5%',
        right: '12.5%',
      }}
    />

{currentStepIndex > -1 && (
<Box
  className="absolute top-1/2 h-0.5 bg-green-500 transform -translate-y-1/2 z-10 transition-all duration-500 ease-in-out"
  style={{
    left: '12.5%',
    right: `calc(${100 - stepPercent * currentStepIndex - 12.5}% + ${extraOffsetPercent}%)`,
  }}
/>
)}



    {/* Các bước: dot + text */}
    <Box className="relative flex justify-between items-center w-full z-20">
      {progressSteps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <Box key={step} className="flex flex-col items-center w-1/4 z-20">
           <Box
  className={`w-4 h-4 rounded-full ${
    isCompleted
      ? 'bg-green-400'            // ✅ Đã hoàn thành
      : isCurrent
      ? 'bg-primary'            // ✅ Đang xử lý (hoặc 'bg-blue-400')
      : 'bg-gray-300'            // ⬜ Chưa tới
  }`}
/>
            <Typography
  className={`text-[13px] text-center whitespace-nowrap leading-tight ${isCurrent ? 'text-primary font-bold' : 'text-gray-700'}`}
  style={{ marginTop: '12px' }} // ← ép cách ra rõ
>
  {step}
</Typography>

          </Box>
        );
      })}
    </Box>
  </Box>
</Box>

)}

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

                                <Typography className="font-semibold text-base text-red-600">
                                    {formatCurrencyVND(itemPrice)}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}

                <Box className="pt-4 mt-4 flex justify-end">
                    <Grid container spacing={0} className="w-full sm:w-[350px]">
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

                <Typography className="mb-2 text-gray-800 text-sm">
                    Lý do: <span className="font-bold">{getReasonText(reason)}</span>
                </Typography>

                {detailedReason && reason === 'OTHER' && (
                    <Typography className="text-gray-800 text-sm">
                        Chi tiết: {detailedReason}
                    </Typography>
                )}

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




          <Box className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
  {['pending', 'approved'].includes(status) && (
    <Button
      variant="outlined"
      color="error"
      onClick={handleCancelRequest}
      size="large"
      className="px-6 py-2"
    >
      Hủy yêu cầu trả hàng
    </Button>
  )}

</Box>

        </Box>
    );
};

export default ReturnOrderDetailPage;