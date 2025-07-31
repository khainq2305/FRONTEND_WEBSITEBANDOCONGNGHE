import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  const vnpTxnRef = searchParams.get('vnp_TxnRef');
  const resultCode = searchParams.get('resultCode'); // 0 = success, other = error/cancel (from MoMo)
  const momoOrderId = searchParams.get('orderId'); // MoMo's order ID

  const orderCodeFromUrl = searchParams.get('orderCode') || momoOrderId || vnpTxnRef;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentAttempted, setIsPaymentAttempted] = useState(false); // To prevent multiple callbacks

  // 👉 THÊM STATE MỚI ĐỂ LƯU URL CỦA QR CODE
  const [vietQrImageUrl, setVietQrImageUrl] = useState(null);
  const [vietQrInfo, setVietQrInfo] = useState(null);

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
        .then((res) => {
          if (!res.ok) {
            console.error('MoMo callback failed with status:', res.status);
            throw new Error('MoMo callback failed');
          }
          return res.text();
        })
        .then((txt) => {
          console.log('Momo callback ->', txt);
          // Re-fetch order after callback to get updated status
          fetchOrderDetails(orderCodeFromUrl);
        })
        .catch((err) => {
          console.error('Callback lỗi:', err);
          toast.error('Có lỗi xảy ra khi xử lý thanh toán MoMo.');
          // Even on error, try to fetch order details to reflect the current state
          fetchOrderDetails(orderCodeFromUrl);
        });
    }
  }, [momoOrderId, resultCode, isPaymentAttempted, orderCodeFromUrl]); // Depend on orderCodeFromUrl for re-fetch

  /* ------------------- side-effect: handle VNPay callback ------------------- */
  useEffect(() => {
    // Gửi callback đúng 1 lần
    if (!vnpTxnRef || isPaymentAttempted) return;

    setIsPaymentAttempted(true);

    const rawQuery = window.location.search.slice(1); // bỏ dấu '?'

    fetch('http://localhost:5000/payment/vnpay-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawQuery })
    })
      .then((res) => res.text().then((txt) => ({ ok: res.ok, txt })))
      .then(({ ok, txt }) => {
        console.log('VNPay callback →', txt);
        if (!ok || txt.trim().toUpperCase() !== 'OK') {
          throw new Error(txt);
        }
        fetchOrderDetails(orderCodeFromUrl);
      })
      .catch((err) => {
        console.error('VNPay callback error:', err);
        toast.error('Có lỗi khi xử lý thanh toán VNPay.');
        fetchOrderDetails(orderCodeFromUrl);
      });
  }, [vnpTxnRef, isPaymentAttempted, orderCodeFromUrl]);

  /* ------------------- side-effect: fetch order details ------------------- */
  const fetchOrderDetails = async (code) => {
    setLoading(true);
    try {
      const res = await orderService.getOrderById(code);
      if (res.data?.data) {
        const orderData = res.data.data;
        setOrder(orderData);

        const paymentCode = orderData?.paymentMethod?.code?.toLowerCase();

        // Kiểm tra nếu là phương thức 'atm' và đang chờ thanh toán
        const isPaymentPending = orderData.paymentStatus === 'waiting' || orderData.paymentStatus === 'unpaid';
        if (paymentCode === 'atm' && isPaymentPending) {
          try {
            const qrRes = await paymentService.generateVietQR({
              accountNumber: '2222555552005', // CÓ THỂ THAY BẰNG CONFIG TỪ ENV
              accountName: 'NGUYEN QUOC KHAI',
              bankCode: 'MB',
              amount: orderData.finalPrice,
              message: `Thanh toan ${orderData.orderCode}`,
            });

            console.log("📦 Response generateVietQR:", qrRes);

            if (qrRes?.data?.qrImage) {
              setVietQrImageUrl(qrRes.data.qrImage);
              setVietQrInfo({
                accountNumber: qrRes.data.accountNumber,
                accountName: qrRes.data.accountName,
                bankCode: qrRes.data.bankCode,
                message: qrRes.data.message,
              });

              // Cập nhật lại URL để giữ QR
              const encoded = encodeURIComponent(qrRes.data.qrImage);
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.set('qr', encoded);
              window.history.replaceState({}, '', currentUrl);
            } else {
              console.warn("❌ Backend không trả về qrImage.");
              setVietQrImageUrl(null);
              setVietQrInfo(null);
            }
          } catch (qrError) {
            console.error('❌ Lỗi khi sinh QR VietQR:', qrError);
            toast.error('Không thể tạo mã QR thanh toán.');
            setVietQrImageUrl(null);
            setVietQrInfo(null);
          }
        } else {
          console.log("⚠️ Không phải phương thức thanh toán ATM hoặc không chờ thanh toán.");
          setVietQrImageUrl(null);
          setVietQrInfo(null);
        }
      } else {
        toast.error('Không tìm thấy dữ liệu cho đơn hàng này.');
        setVietQrImageUrl(null);
        setVietQrInfo(null);
      }
    } catch (err) {
      console.error('❌ Lỗi lấy đơn hàng:', err);
      toast.error(err.response?.data?.message || 'Không thể tải thông tin đơn hàng.');
      setVietQrImageUrl(null);
      setVietQrInfo(null);
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
  }, [orderCodeFromUrl]); // Loại bỏ location.search khỏi dependency chính để tránh chạy lại fetchOrderDetails không cần thiết

  useEffect(() => {
    // Đây là useEffect riêng để chỉ lắng nghe thay đổi của URL query param 'qr'
    // và cập nhật state vietQrImageUrl nếu có
    const qr = new URLSearchParams(location.search).get('qr');
    if (qr) {
      setVietQrImageUrl(decodeURIComponent(qr));
    }
  }, [location.search]); // Chạy khi location.search thay đổi

  /* ------------------- handle pay again ------------------- */
  const handlePayAgain = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await orderService.payAgain(order.id, {
        bankCode: '', // ✅ thêm dòng này
      });
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
          <Link to="/" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
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
    paymentStatus,
    status: orderStatus,
    rewardPoints = 0 // 👈 THÊM DÒNG NÀY
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

  // Sửa định nghĩa isCOD để dùng paymentMethod?.code từ backend
  const isCOD = paymentMethod?.code?.toLowerCase() === 'cod' || paymentStatus === 'unpaid';

  const isOrderProcessing = orderStatus === 'processing';
  // 👉 Sửa isPaymentPending để bao gồm cả 'unpaid'
  const isPaymentPending = paymentStatus === 'waiting' || paymentStatus === 'unpaid';
  const isPaymentSuccessful = paymentStatus === 'paid' || isCOD;

  /* ------------------- render ------------------- */
  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-[1200px] mx-auto">
        {/* ---------- header ---------- */}
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

              <PaymentMethod
                method={paymentMethod?.name || 'Thanh toán khi nhận hàng (COD)'}
                status={paymentStatus}
              />
            </div>


            <div className="bg-white p-4 rounded-xl shadow h-fit">
              <h2 className="text-base font-semibold mb-4 text-gray-800">Thông tin đơn hàng</h2>

              <div className="text-sm space-y-2">

                <CopyableRow label="Mã đơn hàng" value={code} />

                <Row label="Tổng tiền hàng" value={formatCurrencyVND(totalPrice)} bold />



                <Row
                  label="Phí vận chuyển"
                  value={shippingFee === 0 ? 'Miễn phí' : formatCurrencyVND(shippingFee)}
                />




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
                  className={`text-white w-full py-2.5 rounded-md font-semibold inline-block text-center hover:opacity-85 transition-colors ${isPaymentPending && isOrderProcessing ? 'bg-gray-500' : 'bg-primary'
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