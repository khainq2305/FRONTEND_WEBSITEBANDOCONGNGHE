import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import CopyableRow from './CopyableRow';

import ProductList from './OrderConfirmation/ProductList';
import CustomerInfo from './OrderConfirmation/CustomerInfo';
import DeliveryMethod from './OrderConfirmation/DeliveryMethod';
import PaymentMethod from './OrderConfirmation/PaymentMethod';

import { orderService } from '../../../services/client/orderService';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { formatCurrencyVND } from '../../../utils/formatCurrency';

import bgPc from '../../../assets/Client/images/bg-pc.png';
import successIcon from '../../../assets/Client/images/Logo/snapedit_1749613755235 1.png';
import waitingIcon from '../../../assets/Client/images/Logo/snapedit_1749613755235 1.png'; // Add a suitable icon for waiting status

/* ---------- helper row ---------- */
const Row = ({ label, value, bold, color }) => (
  <div className={`flex justify-between ${color ?? 'text-gray-800'}`}>
    <span>{label}</span>
    <span className={bold ? 'font-semibold' : ''}>{value}</span>
  </div>
);

const OrderConfirmation = () => {
  /* ------------------- state ------------------- */
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();

  // Get parameters from URL
  const resultCode = searchParams.get('resultCode'); // 0 = success, other = error/cancel (from MoMo)
  const momoOrderId = searchParams.get('orderId');   // MoMo's order ID
  const orderCodeFromUrl = searchParams.get('orderCode') || momoOrderId; // Use orderCode or momoOrderId

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentAttempted, setIsPaymentAttempted] = useState(false); // To prevent multiple callbacks

  const qrUrl = new URLSearchParams(location.search).get('qr'); // For VietQR

  /* ------------------- side-effect: Handle MoMo callback ------------------- */
  useEffect(() => {
    // Only send callback if MoMo params are present and not already attempted
    if (momoOrderId && resultCode !== null && !isPaymentAttempted) {
      setIsPaymentAttempted(true); // Mark as attempted
      fetch('http://localhost:5000/payment/momo-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: momoOrderId, resultCode })
      })
        .then(res => {
          if (!res.ok) {
            console.error('MoMo callback failed with status:', res.status);
            throw new Error('MoMo callback failed');
          }
          return res.text();
        })
        .then(txt => {
          console.log('Momo callback ->', txt);
          // Re-fetch order after callback to get updated status
          fetchOrderDetails(orderCodeFromUrl);
        })
        .catch(err => {
          console.error('Callback lỗi:', err);
          toast.error('Có lỗi xảy ra khi xử lý thanh toán MoMo.');
          // Even on error, try to fetch order details to reflect the current state
          fetchOrderDetails(orderCodeFromUrl);
        });
    }
  }, [momoOrderId, resultCode, isPaymentAttempted, orderCodeFromUrl]); // Depend on orderCodeFromUrl for re-fetch

  /* ------------------- side-effect: fetch order details ------------------- */
  const fetchOrderDetails = async (code) => {
    setLoading(true);
    try {
      const res = await orderService.getOrderById(code);
      if (res.data?.data) {
        setOrder(res.data.data);
      } else {
        toast.error('Không tìm thấy dữ liệu cho đơn hàng này.');
      }
    } catch (err) {
      console.error('❌ Lỗi lấy đơn hàng:', err);
      toast.error(err.response?.data?.message || 'Không thể tải thông tin đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderCodeFromUrl) {
      fetchOrderDetails(orderCodeFromUrl);
    } else {
      toast.error('Không tìm thấy mã đơn hàng trên URL.');
      setLoading(false);
    }
  }, [orderCodeFromUrl]);

  /* ------------------- handle pay again ------------------- */
  const handlePayAgain = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await orderService.payAgain(order.id);
      if (res.data?.payUrl) {
        window.location.href = res.data.payUrl; // Redirect to new payment link
      } else {
        toast.error('Không thể tạo link thanh toán lại.');
      }
    } catch (err) {
      console.error('Lỗi thanh toán lại:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi yêu cầu thanh toán lại.');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- loading / error ------------------- */
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-50">
        <Loader fullscreen={false} />
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Tải thông tin đơn hàng thất bại</h2>
          <p className="text-gray-600 mt-2">Vui lòng kiểm tra lại mã đơn hàng hoặc thử lại sau.</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );

  /* ------------------- destructuring data ------------------- */
  const {
    products = [],
    userAddress,
    paymentMethod,
    totalPrice,
    productDiscount = 0,
    couponDiscount = 0,
    shippingFee = 0,
    shippingDiscount: rawShipDiscount = 0,
    finalPrice,
    orderCode: code,
    paymentStatus, // Get paymentStatus from order
    status: orderStatus // Get order status
  } = order;
  const shippingDiscount = Math.min(rawShipDiscount, shippingFee);

  const customer = {
    name: userAddress?.fullName || 'Chưa có tên',
    phone: userAddress?.phone || 'N/A',
  };

  const deliveryInfo = {
    address: userAddress?.fullAddress || 'N/A',
    time: order?.deliveryTime || 'Thời gian sẽ được nhân viên xác nhận khi gọi điện',
  };
const isCOD = paymentMethod?.code?.toLowerCase() === 'cod' || paymentStatus === 'unpaid';

  const isOrderProcessing = orderStatus === 'processing';
    const isPaymentPending = paymentStatus === 'waiting';
const isPaymentSuccessful = paymentStatus === 'paid' || isCOD;

  /* ------------------- render ------------------- */
  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-[1200px] mx-auto">
        {/* ---------- header ---------- */}
        <div className="bg-no-repeat bg-center bg-contain" style={{ backgroundImage: `url(${bgPc})` }}>
          <div className="px-4 pt-12 pb-8">
            <div className="text-center">
              {isPaymentSuccessful ? (
                <img src={successIcon} alt="Đặt hàng thành công" className="w-30 h-45 mx-auto mb-4" />
              ) : (
                <img src={waitingIcon} alt="Đơn hàng chờ thanh toán" className="w-30 h-45 mx-auto mb-4" />
              )}
              <h1 className={`${isPaymentSuccessful ? 'text-green-600' : 'text-orange-500'} text-3xl font-bold`}>
                {isPaymentSuccessful ? 'Đặt hàng thành công!' : 'Đơn hàng chờ thanh toán'}
              </h1>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                {isPaymentSuccessful ?
                  'Cảm ơn bạn đã mua hàng. Nhân viên sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.' :
                  'Đơn hàng của bạn đã được tạo. Vui lòng hoàn tất thanh toán để đơn hàng được xử lý.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* ---------- body ---------- */}
        <div className="pb-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* ---- left: info ---- */}
            <div className="md:col-span-2 space-y-4">
              <ProductList products={products} />
              <CustomerInfo {...customer} />
              <DeliveryMethod address={deliveryInfo.address} time={deliveryInfo.time} />

              {qrUrl && paymentMethod?.code?.toLowerCase() === 'vietqr' && isPaymentPending && (
                <div className="bg-white p-4 rounded-lg shadow h-fit text-center">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Quét mã VietQR để thanh toán
                  </h3>
                  <img
                    src={decodeURIComponent(qrUrl)}
                    alt="Mã QR chuyển khoản ngân hàng"
                    className="mx-auto w-60 border border-gray-200 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Vui lòng quét mã VietQR để thực hiện chuyển khoản theo thông tin trên mã.
                  </p>
                </div>
              )}

              <PaymentMethod
                method={paymentMethod?.name || 'Thanh toán khi nhận hàng (COD)'}
                status={paymentStatus} // Pass paymentStatus to PaymentMethod component if it displays it
              />
            </div>

            {/* ---- right: order summary ---- */}
            <div className="bg-white p-4 rounded-lg shadow h-fit">
              <h2 className="text-base font-semibold mb-4 text-gray-800">Thông tin đơn hàng</h2>

              <div className="text-sm space-y-2">
                {/* tiền hàng & ưu đãi */}
                <CopyableRow label="Mã đơn hàng" value={code} />

                <Row label="Tổng tiền hàng" value={formatCurrencyVND(totalPrice)} bold />
                <Row
                  label="Giảm giá từ sản phẩm"
                  value={formatCurrencyVND(productDiscount)}
                />
                {couponDiscount > 0 && (
                  <Row
                    label="Giảm giá từ coupon"
                    value={`- ${formatCurrencyVND(couponDiscount)}`}
                    color="text-green-600"
                  />
                )}

                {/* phí vận chuyển */}
                {shippingDiscount > 0 ? (
                  <>
                    <Row label="Phí vận chuyển" value={formatCurrencyVND(shippingFee)} />
                    <Row
                      label="Giảm phí vận chuyển"
                      value={`- ${formatCurrencyVND(shippingDiscount)}`}
                      color="text-green-600"
                    />
                  </>
                ) : (
                  <Row
                    label="Phí vận chuyển"
                    value={shippingFee === 0 ? 'Miễn phí' : formatCurrencyVND(shippingFee)}
                  />
                )}

                {/* tổng khuyến mãi */}
                <Row
                  label="Tổng khuyến mãi"
                  value={formatCurrencyVND(productDiscount + couponDiscount + shippingDiscount)}
                />

                {/* cần thanh toán */}
                <div className="pt-2">
                  <div className="border-t border-dashed border-gray-300 mb-2" />
                  <Row
                    label="Cần thanh toán"
                    value={formatCurrencyVND(finalPrice)}
                    bold
                    color="text-red-600"
                  />
                  <p className="text-sm text-green-600 mt-1 text-right">
                    Tiết kiệm&nbsp;
                    {formatCurrencyVND(productDiscount + couponDiscount + shippingDiscount)}
                  </p>
                  <p className="text-[11px] text-gray-400 text-right">(Đã bao gồm VAT nếu có)</p>
                </div>
              </div>

              {/* nút & link */}
              <div className="mt-6 space-y-3">
                {isPaymentPending && isOrderProcessing && ( // Only show "Pay Again" if waiting for payment and order is processing
                  <button
                    onClick={handlePayAgain}
                    className="bg-blue-600 text-white w-full py-2.5 rounded-md font-semibold inline-block text-center hover:opacity-85 transition-colors"
                  >
                    Thanh toán lại
                  </button>
                )}
                <Link
                  to="/"
                  className={`text-white w-full py-2.5 rounded-md font-semibold inline-block text-center hover:opacity-85 transition-colors ${
                    isPaymentPending && isOrderProcessing ? 'bg-gray-500' : 'bg-primary'
                  }`}
                >
                  Về trang chủ
                </Link>
                <Link
                  to="/user-profile#don-mua"
                  className="block text-sm text-green-600 hover:underline text-center"
                >
                  Xem lịch sử đơn mua
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;