// src/pages/client/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Package, User, Truck, CheckCircle, Star, XCircle, Clock } from 'lucide-react';
import { orderService } from '@/services/client/orderService';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function OrderDetailPage() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const order = data; // ← Thêm dòng này trước khi dùng `order`

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
    status, // Trạng thái hiện tại của đơn hàng
    userAddress,
    paymentStatus,
    paymentMethod,
    cancelReason,
    createdAt,
    confirmedAt,
    shippedAt,
    deliveredAt,
    completedAt,
    cancelledAt,
    returnedAt,
  } = data;

  // Hàm để lấy văn bản trạng thái hiển thị chính
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

  // Hàm tạo timeline động dựa trên trạng thái của đơn hàng
  const generateDeliveryTimeline = (order) => {
    const timeline = [];
    const currentOrderStatus = order.status; // Đổi tên biến để tránh nhầm lẫn

    // Định nghĩa thứ tự các trạng thái trong luồng chính và icon tương ứng
    const statusSteps = [
      { id: 'pending', label: 'Đơn hàng đã đặt', icon: <Package size={26} />, timestamp: order.createdAt },
      { id: 'processing', label: 'Đã xác nhận', icon: <User size={26} />, timestamp: order.confirmedAt }, // Lấy từ confirmedAt
      { id: 'shipping', label: 'Đang giao hàng', icon: <Truck size={26} />, timestamp: order.shippedAt },
      { id: 'delivered', label: 'Đã nhận hàng', icon: <CheckCircle size={26} />, timestamp: order.deliveredAt },
      { id: 'completed', label: 'Hoàn tất', icon: <Star size={26} />, timestamp: order.completedAt },
    ];

    statusSteps.forEach((step, index) => {
      let isCompleted = false;
      let dateToDisplay = null;
      let stepLabel = step.label; // Mặc định là label cố định

      // Logic cho bước "Đơn hàng đã đặt"
      if (step.id === 'pending') {
        isCompleted = !!order.createdAt;
        dateToDisplay = order.createdAt ? format(new Date(order.createdAt), 'HH:mm dd-MM-yyyy', { locale: vi }) : null;
      }
      // Logic cho bước "Đã xác nhận" (tương ứng với 'processing')
      else if (step.id === 'processing') {
        // Nếu paymentStatus là 'paid' thì nhãn là 'Đã thanh toán & Xác nhận'
        if (order.paymentStatus === 'paid' && order.confirmedAt) {
          stepLabel = 'Đã thanh toán & Xác nhận';
        } else if (order.confirmedAt) {
          stepLabel = 'Đã xác nhận đơn hàng';
        } else {
            stepLabel = 'Chờ xác nhận đơn hàng'; // Nếu chưa có confirmedAt
        }

        dateToDisplay = order.confirmedAt ? format(new Date(order.confirmedAt), 'HH:mm dd-MM-yyyy', { locale: vi }) : null;

        // Hoàn thành nếu trạng thái là processing hoặc cao hơn
        isCompleted = ['processing', 'shipping', 'delivered', 'completed'].includes(currentOrderStatus) && !!order.confirmedAt;
        // Nếu đang ở trạng thái 'pending' nhưng đã có confirmedAt (có thể do API trả về sớm hơn dự kiến)
        if (currentOrderStatus === 'pending' && !!order.confirmedAt) {
            isCompleted = true;
        }

      }
      // Logic cho các bước còn lại theo luồng chính
      else {
        // Kiểm tra xem trạng thái hiện tại có lớn hơn hoặc bằng trạng thái của bước này không
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
        isCurrent: currentOrderStatus === step.id // Xác định bước hiện tại
      });
    });

    // Xử lý các trạng thái cuối cùng không nằm trong luồng chính
    // Nếu đơn hàng bị hủy hoặc hoàn trả, các bước trên có thể không hoàn thành
    if (currentOrderStatus === 'cancelled') {
        // Tìm bước 'Đã hủy' nếu đã có, nếu không thì thêm mới
        const cancelledStep = {
            icon: <XCircle size={26} />,
            label: 'Đơn hàng đã Hủy',
            date: order.cancelledAt ? format(new Date(order.cancelledAt), 'HH:mm dd-MM-yyyy', { locale: vi }) : null,
            isCompleted: true,
            isCurrent: true,
        };
        // Thay thế hoặc thêm vào cuối
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

    // Lọc bỏ các bước không hợp lệ nếu có (ví dụ: thiếu timestamp và không phải trạng thái hiện tại)
    return timeline.filter(step => step.label); // Đảm bảo có label
  };

  const deliveryTimeline = generateDeliveryTimeline(data);

  const formattedAddress = userAddress
    ? `${userAddress.fullName} (+${userAddress.phone})
      ${userAddress.streetAddress}, ${userAddress.ward?.name}, ${userAddress.district?.name}, ${userAddress.province?.name}`
    : 'Đang cập nhật địa chỉ...';

  return (
    <div className="max-w-5xl mx-auto bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-primary transition-colors">
          <ArrowLeft size={18} className="mr-1" />
          <span className="font-semibold text-sm uppercase">Trở lại</span>
        </button>
      </div>

      

      {/* Delivery Timeline */}
<section className="px-6 py-8 border-b border-gray-200">
  <div className="flex justify-between items-start text-center relative">
    {deliveryTimeline.map((step, index) => {
      const isStepCompleted = step.isCompleted;
      const isCurrentStep = step.isCurrent; // Giả sử step.isCurrent là true cho bước hiện tại

      // Màu sắc cho text
      const textColorClass = isCurrentStep || isStepCompleted ? 'text-primary' : 'text-gray-700';

      // Màu sắc và viền cho icon
      let iconBgClass = 'bg-gray-200 text-gray-500'; // Mặc định là xám
      let iconBorderClass = 'border-gray-200'; // Mặc định viền xám

      if (isStepCompleted) {
        iconBgClass = 'bg-primary text-white'; // Bước đã hoàn thành: nền primary, chữ trắng
        iconBorderClass = 'border-primary'; // Viền primary
      } else if (isCurrentStep) {
        iconBgClass = 'bg-primary text-white'; // Bước hiện tại: nền primary, chữ trắng
        iconBorderClass = 'border-primary'; // Viền primary
      } else {
        // Các bước chưa tới: nền xám, chữ xám, viền xám
        iconBgClass = 'bg-gray-200 text-gray-500';
        iconBorderClass = 'border-gray-200';
      }

      return (
        <div key={step.id || index} className={`flex flex-col items-center flex-1 z-10 relative`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 border
                ${iconBgClass} ${iconBorderClass} z-20`}>

          <span className="text-4xl">
  {step.icon}
</span>

          </div>
          <p className={`text-sm font-medium whitespace-nowrap px-1 ${textColorClass}`}>
            {step.label}
          </p>
          {step.date && <p className="text-sm text-gray-500 mt-0.5">{step.date}</p>}

          {/* Đường nối giữa các bước - chỉ cần dựa vào trạng thái completed của bước hiện tại */}
          {index < deliveryTimeline.length - 1 && (
            <div
              className="absolute top-5 h-0.5 z-0"
              style={{
                width: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                // Màu đường nối: primary nếu bước hiện tại đã hoàn thành HOẶC bước hiện tại là active
                // và bước tiếp theo cũng đã hoàn thành hoặc là bước hiện tại
                backgroundColor: isStepCompleted || isCurrentStep && deliveryTimeline[index + 1]?.isCompleted
                  ? 'var(--color-primary)'
                  : '#e5e7eb',
              }}
            ></div>
          )}
        </div>
      );
    })}

    
    {/* Đường gạch primary sẽ được vẽ dựa trên số bước đã hoàn thành và bước hiện tại */}
    {(() => {
      let finalActiveIndex = -1; // Chỉ số của bước cuối cùng đã hoàn thành hoặc đang là bước hiện tại
      for (let i = 0; i < deliveryTimeline.length; i++) {
        if (deliveryTimeline[i].isCompleted || deliveryTimeline[i].isCurrent) {
          finalActiveIndex = i;
        } else {
            // Nếu tìm thấy bước chưa hoàn thành và không phải bước hiện tại, dừng lại
            break;
        }
      }

      if (finalActiveIndex > -1) {
        const totalSteps = deliveryTimeline.length;
        let percentageWidth = 0;

        // Nếu bước cuối cùng "active" là bước hiện tại và chưa hoàn thành hoàn toàn
        if (deliveryTimeline[finalActiveIndex]?.isCurrent && !deliveryTimeline[finalActiveIndex]?.isCompleted) {
          percentageWidth = ((finalActiveIndex + 0.5) / totalSteps) * 100;
        } else {
          // Nếu bước cuối cùng "active" là bước đã hoàn thành
          percentageWidth = ((finalActiveIndex + 1) / totalSteps) * 100;
        }
        
        return (
          <div
            className="absolute top-5 left-0 h-0.5 bg-primary z-0"
            style={{ width: `${percentageWidth}%` }}
          ></div>
        );
      }
      return null;
    })()}

  </div>
</section>

  <section className="p-4 sm:p-6 border-b border-gray-200">
  <p className="text-sm text-gray-700 mb-4">Cảm ơn bạn đã mua sắm tại shop của Nguyễn Quốc Khải</p>
  <div className="flex flex-wrap justify-end items-center gap-2">

    {order?.buttons?.includes('Thanh toán lại') && (
      <button
        onClick={handlePayAgain}
        className="text-sm border border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-sm transition-colors dark:text-orange-400 dark:border-orange-500 dark:hover:bg-orange-900"
      >
        Thanh toán lại
      </button>
    )}

    {order?.buttons?.includes('Hủy đơn') && (
      <>
        <button
          onClick={() => setShowCancelDialog(true)}
          className="text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 px-5 py-2 min-w-[120px] rounded-sm transition-colors dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Hủy Đơn Hàng
        </button>
        <CancelOrderDialog
          isOpen={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          orderId={order.id}
          onSuccess={refetchOrders}
        />
      </>
    )}

    {order?.buttons?.includes('Mua Lại') && (
      <button
        onClick={handleReorder}
        className="text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 px-4 py-2 rounded-sm transition-colors dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        Mua Lại
      </button>
    )}

    {order?.buttons?.includes('Trả hàng/Hoàn tiền') && (
      <button
        onClick={() =>
          navigate('/return-order', {
            state: {
              orderId: order.id,
              orderPaymentMethodCode: order.paymentMethod?.code,
              orderProducts: order.products,
              finalPrice: order.totalAmount,
            },
          })
        }
        className="text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 px-4 py-2 rounded-sm transition-colors dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        Yêu cầu trả hàng
      </button>
    )}

    {order?.buttons?.includes('Đã nhận hàng') && (
      <button
        onClick={async () => {
          try {
            await orderService.markAsCompleted(order.id);
            toast.success('Đã xác nhận đã nhận hàng!');
            refetchOrders();
          } catch (err) {
            toast.error('Không thể xác nhận đơn hàng.');
          }
        }}
        className="text-sm border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-sm transition-colors dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900"
      >
        Đã nhận hàng
      </button>
    )}

  </div>
</section>


      {/* Shipping Address - This section is now standalone */}
   <section className="p-4 sm:p-6 border-b border-gray-200">
  <h2 className="font-semibold text-gray-800 mb-2">ĐỊA CHỈ NHẬN HÀNG</h2>
  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
    {data.userAddress.fullName} (+{data.userAddress.phone}){'\n'}
{data.userAddress.fullAddress}
  </pre>
</section>

     {/* Alert Box - Đặt ngay sau section Payment Summary để khớp với ảnh */}
{/* Hiển thị nếu paymentStatus là 'unpaid' và paymentMethod là 'cod' như trong ảnh mẫu */}


{/* Product List */}
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

{/* Payment Summary */}
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
</section>
{paymentStatus === 'unpaid' && paymentMethod?.code === 'cod' && (
  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 mt-2 mx-4 sm:mx-6 rounded-md flex items-center mb-4">
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.543 2.765-1.543 3.53 0L12.53 5.397l3.967.684c1.785.309 2.518 2.457 1.258 3.717l-2.84 2.84.536 3.967c.309 1.785-1.543 2.765-3.086 1.996L10 16.714l-3.086 1.996c-1.543.765-3.086-.704-2.777-2.316l.536-3.967-2.84-2.84c-1.26-1.26-.527-3.408 1.258-3.717l3.967-.684L8.257 3.099z" clipRule="evenodd"></path>
    </svg>
    <p className="text-sm">
      Vui lòng thanh toán <span className="font-semibold text-red-500">{formatCurrencyVND(finalPrice)}</span> khi nhận hàng.
    </p>
  </div>
)}
{/* Footer Payment Info & Buttons - Đã điều chỉnh để khớp chính xác với ảnh 635970.png */}
<section className="p-4 sm:p-6 flex justify-between items-center">
  {/* Left side: Phương thức thanh toán */}
  <div className="text-sm">
    <span className="text-gray-700">Phương thức Thanh toán</span>
    {/* Dùng giá trị thực tế nếu có, hoặc hiển thị "Thanh toán khi nhận hàng" nếu paymentMethod?.name không có */}
    
  </div>

  {/* Right side: Nút Thanh toán */}
   <div className="text-right">
    {/* Hiển thị dòng chữ "Thanh toán khi nhận hàng" hoặc phương thức đã chọn */}
    <p className="font-semibold text-gray-800">{paymentMethod?.name || 'Thanh toán khi nhận hàng'}</p>
  </div>
</section>
{status === 'cancelled' && cancelReason && (
  <section className="p-4 sm:p-6 border-t border-red-200 bg-red-50 mt-4">
    <h2 className="font-semibold text-red-600 mb-2">Lý do hủy đơn hàng</h2>
    <p className="text-sm text-red-700 whitespace-pre-line">{cancelReason}</p>
  </section>
)}

    </div>
  );
}