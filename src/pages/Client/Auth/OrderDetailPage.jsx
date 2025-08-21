// src/pages/client/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Package, User, Truck, CheckCircle, Star, XCircle, Clock } from 'lucide-react';
import { orderService } from '@/services/client/orderService';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import CancelOrderDialog from './CancelOrderDialog'; // hoặc đúng path nếu khác

// --- Khai báo các URL icon bạn đã cung cấp (giữ nguyên) ---
const creditIcons = 'https://salt.tikicdn.com/ts/upload/16/f8/f3/0c02ea827b71cd89ffadb7a22babbdd6.png';
const vietqrIcon = 'https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png';

const paymentIconMap = {
  cod: 'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png',
  atm: vietqrIcon,
  vnpay: 'https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png',
  momo: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/momo.png',
  zalopay: 'https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/zalopay.png',
  viettel_money: 'https://i.imgur.com/ttZPvTx.png',
  stripe: 'https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png',
  credit: creditIcons
};

// --- Các hàm tiện ích để lấy Icon (Đã cập nhật) ---
const getShippingProviderLogo = (providerCode) => {
  switch (providerCode?.toLowerCase()) {
    case 'ghn':
      return <img src="https://img-cache.coccoc.com/image2?i=3&l=38/1152512735" alt="GHN Logo" className="w-8 h-8 object-contain mr-2 inline-block" />;
    case 'ghtk': // Thêm logo GHTK
      return <img src="https://i.pinimg.com/736x/ae/9d/0b/ae9d0b78b41e163170347747eaa7db76.jpg" alt="GHTK Logo" className="w-8 h-8 object-contain mr-2 inline-block" />;
    case 'vtpost': // Thêm logo Viettel Post (VTPost)
      return <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Viettel-Post-Red.png" alt="Viettel Post Logo" className="w-8 h-8 object-contain mr-2 inline-block" />;
    default:
      return null;
  }
};

const getPaymentMethodIcon = (methodCode) => {
  const iconUrl = paymentIconMap[methodCode?.toLowerCase()];
  if (iconUrl) {
    let altText = 'Icon thanh toán'; 
    switch (methodCode?.toLowerCase()) {
        case 'cod': altText = 'Tiền mặt'; break;
        case 'atm': altText = 'Chuyển khoản'; break;
        case 'vnpay': altText = 'VNPay'; break;
        case 'momo': altText = 'MoMo'; break;
        case 'zalopay': altText = 'ZaloPay'; break;
        case 'viettel_money': altText = 'Viettel Money'; break;
        case 'stripe': altText = 'Stripe'; break;
        case 'credit': altText = 'Thẻ tín dụng'; break;
        default: altText = 'Phương thức thanh toán';
    }
    return <img src={iconUrl} alt={altText} className="w-6 h-6 object-contain mr-2 inline-block" />;
  }
  return null;
};
// --- Hết các hàm tiện ích ---

export default function OrderDetailPage() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const order = data; 
const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await orderService.getOrderById(orderCode);
        setData(res.data?.data);
      } catch (err) {
        console.error('[OrderDetail]', err);
        navigate('/purchases', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [orderCode, navigate]);
const handleReorder = async () => {
  try {
    await orderService.reorder(order.id);
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    navigate('/cart');
  } catch (err) {
    toast.error('Không thể mua lại đơn hàng!');
  }
};

const handlePayAgain = async () => {
  try {
    const res = await orderService.payAgain(order.id, { bankCode: '' });
    if (res.data?.payUrl) {
      window.location.href = res.data.payUrl;
    } else {
      toast.error('Không tạo được link thanh toán.');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể thanh toán lại.');
  }
};

const handleMarkAsReceived = async () => {
  try {
    await orderService.markAsCompleted(order.id);
    toast.success('Đã xác nhận đã nhận hàng!');
    window.location.reload();
  } catch (err) {
    toast.error('Không thể xác nhận đơn hàng.');
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const {
    products = [],
    totalPrice,
    shippingFee,
    shippingDiscount = 0,
    couponDiscount = 0,
    finalPrice,
    status, 
    userAddress,
    paymentStatus,
    paymentMethod,
    cancelReason,
    createdAt,
    confirmedAt,
    shippedAt,
    deliveredAt,
    shippingProvider, 
    completedAt,
    cancelledAt,
    returnedAt,
  } = data;

  const getStatusText = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã nhận hàng';
      case 'completed':
        return 'Hoàn tất';
      case 'cancelled':
        return 'Đã hủy';
      case 'returned':
        return 'Đã hoàn trả';
      default:
        return 'Không xác định';
    }
  };

  const generateDeliveryTimeline = (order) => {
    const timeline = [];
    const currentOrderStatus = order.status;

    const statusSteps = [
      { id: 'pending', label: 'Đơn hàng đã đặt', icon: <Package size={26} />, timestamp: order.createdAt },
      { id: 'processing', label: 'Đã xác nhận', icon: <User size={26} />, timestamp: order.confirmedAt },
      { id: 'shipping', label: 'Đang giao hàng', icon: <Truck size={26} />, timestamp: order.shippedAt },
      { id: 'delivered', label: 'Đã nhận hàng', icon: <CheckCircle size={26} />, timestamp: order.deliveredAt },
      { id: 'completed', label: 'Hoàn tất', icon: <Star size={26} />, timestamp: order.completedAt },
    ];

    statusSteps.forEach((step) => {
      let isCompleted = false;
      let dateToDisplay = null;
      let stepLabel = step.label;

      if (step.id === 'pending') {
        isCompleted = !!order.createdAt;
        dateToDisplay = order.createdAt ? format(new Date(order.createdAt), 'HH:mm dd-MM-yyyy', { locale: vi }) : null;
      }
      else if (step.id === 'processing') {
        if (order.paymentStatus === 'paid' && order.confirmedAt) {
          stepLabel = 'Đã thanh toán & Xác nhận';
        } else if (order.confirmedAt) {
          stepLabel = 'Đã xác nhận đơn hàng';
        } else {
            stepLabel = 'Chờ xác nhận đơn hàng';
        }

        dateToDisplay = order.confirmedAt ? format(new Date(order.confirmedAt), 'HH:mm dd-MM-yyyy', { locale: vi }) : null;

        isCompleted = ['processing', 'shipping', 'delivered', 'completed'].includes(currentOrderStatus) && !!order.confirmedAt;
        if (currentOrderStatus === 'pending' && !!order.confirmedAt) {
            isCompleted = true;
        }

      }
      else {
        const currentStatusIndex = statusSteps.findIndex(s => s.id === currentOrderStatus);
        const stepIndex = statusSteps.findIndex(s => s.id === step.id);

        if (stepIndex <= currentStatusIndex) {
          isCompleted = !!step.timestamp;
          if (step.timestamp) {
            dateToDisplay = format(new Date(step.timestamp), 'HH:mm dd-MM-yyyy', { locale: vi });
          }
        }
      }

      timeline.push({
        icon: step.icon,
        label: stepLabel,
        date: dateToDisplay,
        isCompleted: isCompleted,
        isCurrent: currentOrderStatus === step.id
      });
    });

    if (currentOrderStatus === 'cancelled') {
        const cancelledStep = {
            icon: <XCircle size={26} />,
            label: 'Đơn hàng đã Hủy',
            date: order.cancelledAt ? format(new Date(order.cancelledAt), 'HH:mm dd-MM-yyyy', { locale: vi }) : null,
            isCompleted: true,
            isCurrent: true,
        };
        const existingCancelledIndex = timeline.findIndex(s => s.id === 'cancelled');
        if (existingCancelledIndex !== -1) {
            timeline[existingCancelledIndex] = cancelledStep;
        } else {
            timeline.push(cancelledStep);
        }
    } else if (currentOrderStatus === 'returned') {
        const returnedStep = {
            icon: <Clock size={16} />,
            label: 'Đơn hàng đã Hoàn trả',
            date: order.returnedAt ? format(new Date(order.returnedAt), 'HH:mm dd-MM-yyyy', { locale: vi }) : null,
            isCompleted: true,
            isCurrent: true,
        };
        const existingReturnedIndex = timeline.findIndex(s => s.id === 'returned');
        if (existingReturnedIndex !== -1) {
            timeline[existingReturnedIndex] = returnedStep;
        } else {
            timeline.push(returnedStep);
        }
    }

    return timeline.filter(step => step.label);
  };

  const formattedAddress = userAddress
    ? `${userAddress.fullName} (+${userAddress.phone})
      ${userAddress.streetAddress}, ${userAddress.ward?.name}, ${userAddress.district?.name}, ${userAddress.province?.name}`
    : 'Đang cập nhật địa chỉ...';

  return (
    <div className="max-w-5xl mx-auto bg-white ">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-primary transition-colors">
          <ArrowLeft size={18} className="mr-1" />
          <span className="font-semibold text-sm uppercase">Trở lại</span>
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">Mã đơn hàng:</span>
          <span className="font-semibold text-gray-900">{order?.orderCode}</span>
          <span className="text-gray-400">|</span>
          <span className="text-primary font-semibold capitalize">
            {getStatusText(order?.status) || '...'}
          </span>
        </div>
      </div>

      {/* Shipping Address - Updated section */}
      <section className="p-0 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          
          {/* ĐỊA CHỈ NHẬN HÀNG */}
          <div className="p-4 flex flex-col border-b md:border-b-0 md:border-r border-gray-300">
            <h2 className="font-semibold text-gray-800 mb-2">ĐỊA CHỈ NHẬN HÀNG</h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {userAddress?.fullName} (+{userAddress?.phone}){'\n'}
              {userAddress?.fullAddress}
            </pre>
          </div>

          {/* HÌNH THỨC VẬN CHUYỂN */}
          <div className="p-4 flex flex-col border-b md:border-b-0 md:border-r border-gray-300">
            <h2 className="font-semibold text-gray-800 mb-2">HÌNH THỨC VẬN CHUYỂN</h2>
            <p className="text-sm text-gray-700 flex items-center">
              {getShippingProviderLogo(shippingProvider?.code)} {/* Logo trước tên */}
              {shippingProvider?.name || <span className="text-gray-400 italic">Đang cập nhật</span>}
            </p>
          </div>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <div className="p-4 flex flex-col">
            <h2 className="font-semibold text-gray-800 mb-2">PHƯƠNG THỨC THANH TOÁN</h2>
            <p className="text-sm text-gray-700 flex items-center">
              {getPaymentMethodIcon(paymentMethod?.code)}
              {paymentMethod?.name || 'Thanh toán khi nhận hàng'}
            </p>
          </div>

        </div>
      </section>

      {/* Alert Box (giữ nguyên) */}
      {paymentStatus === 'unpaid' && paymentMethod?.code === 'cod' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 flex items-center mb-4">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.543 2.765-1.543 3.53 0L12.53 5.397l3.967.684c1.785.309 2.518 2.457 1.258 3.717l-2.84 2.84.536 3.967c.309 1.785-1.543 2.765-3.086 1.996L10 16.714l-3.086 1.996c-1.543.765-3.086-.704-2.777-2.316l.536-3.967-2.84-2.84c-1.26-1.26-.527-3.408 1.258-3.717l3.967-.684L8.257 3.099z" clipRule="evenodd"></path>
          </svg>
          <p className="text-sm">
            Vui lòng thanh toán <span className="font-semibold text-red-500">{formatCurrencyVND(finalPrice)}</span> khi nhận hàng.
          </p>
        </div>
      )}

      {/* Product List (giữ nguyên) */}
      <section className="border-b border-gray-200 divide-y divide-gray-200">
        {products.map((item, index) => (
          <div key={item.skuId || index} className="p-4 sm:p-6 flex items-center">
            <img
              src={item.image || '/images/default.jpg'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded mr-4 border border-gray-200"
            />
            <div className="flex-1">
              <Link
                to={`/product/${item.skuId}`}
                className="text-sm text-gray-800 font-medium hover:text-primary line-clamp-2"
              >
                {item.name}
              </Link>
              {item.variation && (
                <p className="text-xs text-gray-500 mt-1">Phân loại: {item.variation}</p>
              )}
              <p className="text-xs text-gray-700 mt-1">x{item.quantity}</p>
            </div>
            <div className="text-right ml-4">
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-xs text-gray-500 line-through">
                  {formatCurrencyVND(item.originalPrice)}
                </p>
              )}
              <p className="text-sm text-red-500 font-semibold">
                {formatCurrencyVND(item.price)}
              </p>
            </div>
          </div>
        ))}
        {products.length > 1 && (
          <div className="flex justify-between items-center p-4 sm:p-6 bg-gray-50 text-gray-600">
            <span className="text-sm">Có {products.length} sản phẩm</span>
            <button className="text-primary text-sm font-medium hover:underline">
              Xem thêm
            </button>
          </div>
        )}
      </section>

      {/* Payment Summary (giữ nguyên) */}
      <section className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-700">Tổng tiền hàng</span>
          <span className="text-gray-800">{formatCurrencyVND(totalPrice)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-700">Phí vận chuyển</span>
          <span className="text-gray-800">{formatCurrencyVND(shippingFee)}</span>
        </div>
        {shippingDiscount > 0 && (
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-700">Giảm phí vận chuyển</span>
            <span className="text-primary">-{formatCurrencyVND(shippingDiscount)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-700">Voucher của Shop</span>
            <span className="text-primary">-{formatCurrencyVND(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <span className="text-gray-700 text-base font-semibold">Thành tiền</span>
          <span className="text-red-500 text-xl font-semibold">{formatCurrencyVND(finalPrice)}</span>
        </div>
        {/* Nút hành động giống ngoài danh sách */}
<div className="p-4 flex flex-wrap gap-2 border-t border-gray-200 mt-4 justify-end">
  {status === 'processing' && (
    <>
      <button
        onClick={() => setShowCancelDialog(true)}
        className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
      >
        Hủy đơn
      </button>
      {paymentStatus === 'waiting' && !['atm', 'vietqr', 'manual_transfer'].includes(paymentMethod?.code) && (
        <button
          onClick={handlePayAgain}
          className="text-sm border border-orange-500 text-orange-600 px-4 py-2 rounded hover:bg-orange-50"
        >
          Thanh toán lại
        </button>
      )}
    </>
  )}

  {status === 'shipping' && (
    <button
      onClick={handleMarkAsReceived}
      className="text-sm bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
    >
      Đã nhận hàng
    </button>
  )}

  {status === 'delivered' && (
    <button
      onClick={() =>
        navigate('/return-order', {
          state: {
            orderId: order.id,
            orderPaymentMethodCode: paymentMethod?.code,
            orderProducts: products,
            finalPrice: finalPrice,
          },
        })
      }
      className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
    >
      Yêu cầu Trả hàng / Hoàn tiền
    </button>
  )}

  {(status === 'completed' || status === 'cancelled') && (
  <button
    onClick={handleReorder}
    className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
  >
    Mua lại
  </button>
)}

</div>

      </section>
      
 

      {status === 'cancelled' && cancelReason && (
        <section className="p-4 sm:p-6 border-t border-red-200 bg-red-50 mt-4">
          <h2 className="font-semibold text-red-600 mb-2">Lý do hủy đơn hàng</h2>
          <p className="text-sm text-red-700 whitespace-pre-line">{cancelReason}</p>
        </section>
      )}
<CancelOrderDialog
  open={showCancelDialog}
  onClose={() => setShowCancelDialog(false)}
  orderCode={order.orderCode}
  orderId={order.id}
  onSuccess={() => {
    setShowCancelDialog(false);
    window.location.reload();
  }}
/>

    </div>
  );
}