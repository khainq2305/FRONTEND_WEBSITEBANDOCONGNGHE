import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductList from './OrderConfirmation/ProductList';
import CustomerInfo from './OrderConfirmation/CustomerInfo';
import DeliveryMethod from './OrderConfirmation/DeliveryMethod';
import PaymentMethod from './OrderConfirmation/PaymentMethod';
import { orderService } from 'services/client/orderService';
import { toast } from 'react-toastify';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        setOrder(res.data.data);
      } catch (err) {
        console.error("❌ Lỗi lấy đơn hàng:", err);
        toast.error("Không thể tải thông tin đơn hàng.");
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  const {
    products = [],
    userAddress,
    paymentMethod,
    totalPrice,
    discount = 0,
    shippingFee = 0,
    finalPrice,
    id,
  } = order;

  const customer = {
    name: userAddress?.fullName || "Chưa có tên",
    phone: userAddress?.phone || "N/A",
  };

  const delivery = {
    type: "Giao tận nơi",
    time: "Đang xử lý - chưa xác định",
  };

  const summary = {
    orderId: `#${id}`,
    total: totalPrice,
    discount,
    deliveryFee: shippingFee,
    amountDue: finalPrice,
    points: Math.floor(finalPrice / 1000),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-green-600 text-2xl font-bold">Đặt hàng thành công!</h1>
        <p className="text-sm text-gray-600">
          Nhân viên sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
        </p>
        <div className="flex justify-center my-4">
          <img src="/images/success.png" alt="Đặt hàng thành công" className="w-24 h-24" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <ProductList products={products} />
          <CustomerInfo {...customer} />
          <DeliveryMethod {...delivery} />
          <PaymentMethod method={paymentMethod?.name || "Không rõ"} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="text-base font-semibold mb-4">Thông tin đơn hàng</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div>Mã đơn hàng: <strong>{summary.orderId}</strong></div>
            <div>Tổng tiền: <strong>{summary.total.toLocaleString()} ₫</strong></div>
            <div>Khuyến mãi: <span className="text-red-600">- {summary.discount.toLocaleString()} ₫</span></div>
            <div>Phí vận chuyển: <strong>{summary.deliveryFee > 0 ? `${summary.deliveryFee.toLocaleString()} ₫` : 'Miễn phí'}</strong></div>
            <div className="font-semibold text-green-600">
              Tổng thanh toán: {summary.amountDue.toLocaleString()} ₫
            </div>
            <div>
              Điểm thưởng: <span className="text-yellow-600 font-medium">+{summary.points.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/" className="bg-red-600 text-white w-full py-2 rounded font-semibold inline-block text-center">
              Về trang chủ
            </Link>
            <Link to="/tai-khoan/don-mua" className="mt-2 block text-sm text-green-600 underline text-center">
              Xem đơn mua
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
