// src/pages/client/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Package, User, CheckCircle, Truck, Star } from 'lucide-react';
import { orderService } from '@/services/client/orderService';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function OrderDetailPage() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    status,
    userAddress,
    paymentStatus,
    paymentMethod,
    cancelReason,
    createdAt,
  } = data;
  const deliveryTimeline = [
    { icon: <Package size={16} />, label: 'Đơn hàng đã đặt', date: '08-03-2025' },
    { icon: <User size={16} />, label: 'Đã xác nhận thông tin Thanh toán', date: '09-03-2025' },
    { icon: <Truck size={16} />, label: 'Đã giao cho ĐVVC', date: '12-03-2025' },
    { icon: <CheckCircle size={16} />, label: 'Đã nhận được hàng', date: '07-15 12-03-2025' },
    { icon: <Star size={16} />, label: 'Đơn hàng đã Hoàn thành', date: '23:58 12-03-2025' },
  ];

  // Address and contact formatting for display
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

      
      <section className="px-6 py-8 border-b border-gray-200">
        <div className="flex justify-between items-start text-center">
          {deliveryTimeline.map((step, index) => (
            <div key={index} className={`flex flex-col items-center flex-1 ${index < deliveryTimeline.length - 1 ? 'relative' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                           ${index <= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step.icon}
              </div>
              <p className="text-xs text-gray-700 font-medium whitespace-nowrap px-1">{step.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
              {index < deliveryTimeline.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-300 transform -translate-x-1/2 z-0" style={{ left: 'calc(50% + 16px)', width: 'calc(100% - 32px)' }}></div>
              )}
            </div>
          ))}
        </div>
      </section>

  
      <section className="p-4 sm:p-6 border-b border-gray-200">
        <p className="text-sm text-gray-700 mb-4">Cảm ơn bạn đã mua sắm tại Shopee!</p>
        <div className="flex justify-end gap-3">
          <button className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary-dark transition-colors">
            Mua Lại
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-sm text-sm font-medium hover:bg-gray-100 transition-colors">
            Liên Hệ Người Bán
          </button>
        </div>
      </section>

      {/* Shipping Address - This section is now standalone */}
      <section className="p-4 sm:p-6 border-b border-gray-200"> {/* Removed flex and pr-6 border-r */}
        <h2 className="font-semibold text-gray-800 mb-2">ĐỊA CHỈ NHẬN HÀNG</h2>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
          {formattedAddress}
        </pre>
      </section>

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
        {/* "Xem thêm" product button - if more than 1 product */}
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

      {/* Footer Payment Info & Buttons */}
      <section className="p-4 sm:p-6 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-700">Phương thức thanh toán</span>
          <p className="font-semibold text-gray-800">{paymentMethod?.name || 'COD'}</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary-dark transition-colors">
          Thanh toán khi nhận hàng
        </button>
      </section>
       {paymentStatus === 'unpaid' && (
           <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 text-yellow-800 text-sm p-3 text-center z-20">
               Vui lòng thanh toán <span className="font-semibold">{formatCurrencyVND(finalPrice)}</span> khi nhận hàng.
           </div>
       )}
    </div>
  );
}