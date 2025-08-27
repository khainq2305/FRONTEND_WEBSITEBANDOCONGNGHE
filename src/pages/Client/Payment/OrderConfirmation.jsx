import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import CopyableRow from './CopyableRow';

import ProductList from './OrderConfirmation/ProductList';
import CustomerInfo from './OrderConfirmation/CustomerInfo';
import DeliveryMethod from './OrderConfirmation/DeliveryMethod';
import PaymentMethod from './OrderConfirmation/PaymentMethod';
import { paymentService } from '../../../services/client/paymentService';

import { orderService } from '../../../services/client/orderService';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { formatCurrencyVND } from '../../../utils/formatCurrency';

import bgPc from '../../../assets/Client/images/bg-pc.png';
import successIcon from '../../../assets/Client/images/Logo/snapedit_1749613755235 1.png';
import waitingIcon from '../../../assets/Client/images/Logo/snapedit_1749613755235 1.png';

const Row = ({ label, value, bold, color }) => (
  <div className={`flex justify-between ${color ?? 'text-gray-800'}`}>
    <span>{label}</span>
    <span className={bold ? 'font-semibold' : ''}>{value}</span>
  </div>
);

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const vnpTxnRef = searchParams.get('vnp_TxnRef');
  const resultCode = searchParams.get('resultCode');
  const momoOrderId = searchParams.get('orderId');
  const payosOrderCode = searchParams.get('orderCode'); // PayOS
  const payosStatus = searchParams.get('status'); // PayOS

  const orderCodeFromUrl = payosOrderCode || momoOrderId || vnpTxnRef || searchParams.get('orderCode');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentAttempted, setIsPaymentAttempted] = useState(false);

useEffect(() => {
  if (momoOrderId && resultCode !== null && !isPaymentAttempted) {
    setIsPaymentAttempted(true);

    fetch('https://backend-websitebandocongnghe-1.onrender.com/payment/momo-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: momoOrderId, resultCode })
    })
      .then((res) => res.json()) 
      .then((data) => {
        if (data.success) {
          
          if (data.order) {
            setOrder(data.order);
          } else {
            fetchOrderDetails(orderCodeFromUrl);
          }
        } else {
          
          toast.error(data.message || 'Thanh toán MoMo thất bại.');
          fetchOrderDetails(orderCodeFromUrl);
        }
      })
      .catch((err) => {
        console.error('Callback lỗi:', err);
        toast.error('Có lỗi xảy ra khi xử lý thanh toán MoMo.');
        fetchOrderDetails(orderCodeFromUrl);
      });
  }
}, [momoOrderId, resultCode, isPaymentAttempted, orderCodeFromUrl]);

 useEffect(() => {
    
    if (!payosOrderCode || !payosStatus || isPaymentAttempted) return;

    
    setIsPaymentAttempted(true);
    
  
    const urlParams = new URLSearchParams(window.location.search);
    const orderCode = urlParams.get('orderCode');
    const status = urlParams.get('status');
http://localhost:5000/
   
    if (orderCode) {
        fetch(`http://localhost:5000/payment/payos-callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
         
            body: JSON.stringify({ orderCode, status })
        })
        .then((res) => res.text().then((txt) => ({ ok: res.ok, txt })))
        .then(({ ok, txt }) => {
            if (!ok || txt.trim().toUpperCase() !== 'CẬP NHẬT TRẠNG THÁI PAYOS THÀNH CÔNG') {
                throw new Error(txt || 'PAYOS_CALLBACK_FAILED');
            }
          
            fetchOrderDetails(orderCode);
        })
        .catch((err) => {
            console.error('PayOS callback error:', err);
            
            fetchOrderDetails(orderCode);
        });
    } else {
        console.error("Không tìm thấy orderCode trong URL.");
    }
}, [payosOrderCode, payosStatus, isPaymentAttempted]);
  useEffect(() => {
    if (!vnpTxnRef || isPaymentAttempted) return;

    setIsPaymentAttempted(true);

    const rawQuery = window.location.search.slice(1);

    fetch('https://backend-websitebandocongnghe-1.onrender.com/payment/vnpay-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawQuery })
    })
     .then(res => res.json())
.then(data => {
  if (data.order) {
    setOrder(data.order);  // không cần fetchOrderDetails nữa
  }
})

      .catch((err) => {
        console.error('VNPay callback error:', err);
        toast.error('Có lỗi khi xử lý thanh toán VNPay.');
        fetchOrderDetails(orderCodeFromUrl);
      });
  }, [vnpTxnRef, isPaymentAttempted, orderCodeFromUrl]);

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
      console.error('Lỗi lấy đơn hàng:', err);
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

  const handlePayAgain = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await paymentService.payAgain(order.id, { bankCode: '' });
      if (res.data?.payUrl) {
        window.location.href = res.data.payUrl;
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

if (loading) return <Loader fullscreen />;

  if (!order)
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Tải thông tin đơn hàng thất bại</h2>
          <p className="text-gray-600 mt-2">Vui lòng kiểm tra lại mã đơn hàng hoặc thử lại sau.</p>
          <Link to="/" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
            Về trang chủ
          </Link>
        </div>
      </div>
    );

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
    paymentStatus,
    status: orderStatus,
    rewardPoints = 0
  } = order;

  const shippingDiscount = Math.min(rawShipDiscount, shippingFee);

  const customer = {
    name: userAddress?.fullName || 'Chưa có tên',
    phone: userAddress?.phone || 'N/A'
  };

  const deliveryInfo = {
    address: userAddress?.fullAddress || 'N/A',
    time: order?.deliveryTime || 'Thời gian sẽ được nhân viên xác nhận khi gọi điện'
  };

  const isCOD = paymentMethod?.code?.toLowerCase() === 'cod' || paymentStatus === 'unpaid';

  const isOrderProcessing = orderStatus === 'processing';
  const isPaymentPending = paymentStatus === 'waiting' || paymentStatus === 'unpaid';
  const isPaymentSuccessful = paymentStatus === 'paid' || isCOD;

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-no-repeat bg-center bg-contain" style={{ backgroundImage: `url(${bgPc})` }}>
          <div className="px-4 pt-12 pb-8">
            <div className="text-center">
              {orderStatus === 'cancelled' ? (
                <>
                  <img src={waitingIcon} alt="Đơn đã huỷ" className="w-30 h-45 mx-auto mb-4" />
                  <h1 className="text-red-600 text-3xl font-bold">Đơn hàng đã bị huỷ</h1>
                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    Đơn hàng của bạn đã bị huỷ. Vui lòng đặt lại nếu bạn vẫn muốn tiếp tục mua hàng.
                  </p>
                </>
              ) : isPaymentSuccessful ? (
                <>
                  <img src={successIcon} alt="Đặt hàng thành công" className="w-30 h-45 mx-auto mb-4" />
                  <h1 className="text-green-600 text-3xl font-bold">Đặt hàng thành công!</h1>
                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    Cảm ơn bạn đã mua hàng. Nhân viên sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                  </p>
                </>
              ) : (
                <>
                  <img src={waitingIcon} alt="Đơn hàng chờ thanh toán" className="w-30 h-45 mx-auto mb-4" />
                  <h1 className="text-orange-500 text-3xl font-bold">
                    {paymentMethod?.code === 'atm' ? 'Chờ xác nhận chuyển khoản' : 'Đơn hàng chờ thanh toán'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    {paymentMethod?.code === 'atm'
                      ? 'Vui lòng chuyển khoản đúng nội dung và chờ hệ thống xác nhận giao dịch.'
                      : 'Đơn hàng của bạn đã được tạo. Vui lòng hoàn tất thanh toán để đơn hàng được xử lý.'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="pb-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <ProductList products={products} />
              <CustomerInfo {...customer} />
              <DeliveryMethod address={deliveryInfo.address} time={deliveryInfo.time} />

              <PaymentMethod method={paymentMethod?.name || 'Thanh toán khi nhận hàng (COD)'} status={paymentStatus} />
            </div>

            <div className="bg-white p-4 rounded-xl shadow h-fit">
              <h2 className="text-base font-semibold mb-4 text-gray-800">Thông tin đơn hàng</h2>

              <div className="text-sm space-y-2">
                <CopyableRow label="Mã đơn hàng" value={code} />
                <Row label="Tổng tiền hàng" value={formatCurrencyVND(totalPrice)} bold />
                <Row label="Phí vận chuyển" value={shippingFee === 0 ? 'Miễn phí' : formatCurrencyVND(shippingFee)} />
                <div className="pt-2">
                  <div className="border-t border-dashed border-gray-300 mb-2" />
                  <Row label="Cần thanh toán" value={formatCurrencyVND(finalPrice)} bold color="text-red-600" />
                  <div className="flex justify-between text-amber-600 text-[13px] mt-2 items-center">
                    <span>Điểm tích lũy</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <span className="w-4 h-4 bg-yellow-200 text-yellow-600 text-[10px] font-bold flex items-center justify-center rounded-full">
                        ₵
                      </span>
                      +{rewardPoints} điểm
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {isPaymentPending &&
                  isOrderProcessing &&
                  paymentMethod?.code?.toLowerCase() !== 'atm' &&
                  paymentMethod?.code?.toLowerCase() !== 'cod' && (
                    <button
                      onClick={handlePayAgain}
                      className="bg-primary text-white w-full py-2.5 rounded-md font-semibold inline-block text-center hover:opacity-85 transition-colors"
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
                <Link to="/user-profile#quan-ly-don-hang" className="block text-sm text-green-600 hover:underline text-center">
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
