import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import ProductList from './OrderConfirmation/ProductList';
import CustomerInfo from './OrderConfirmation/CustomerInfo';
import DeliveryMethod from './OrderConfirmation/DeliveryMethod';
import PaymentMethod from './OrderConfirmation/PaymentMethod';
import { orderService } from '../../../services/client/orderService';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
 
// Import hình ảnh từ thư mục `src` để sử dụng
import bgPc from '../../../assets/Client/images/bg-pc.png';
import successIcon from '../../../assets/Client/images/Logo/Linhvat.svg';

const OrderConfirmation = () => {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

const orderCode = searchParams.get('orderCode')
const location = useLocation();
const qrUrl = new URLSearchParams(location.search).get("qr");

  useEffect(() => {
    const fetchOrder = async () => {
        setLoading(true);
        try {
            const res = await orderService.getOrderById(orderCode); // đúng biến
            if (res.data && res.data.data) {
                setOrder(res.data.data);
            } else {
                toast.error("Không tìm thấy dữ liệu cho đơn hàng này.");
            }
        } catch (err) {
            console.error("❌ Lỗi lấy đơn hàng:", err);
            toast.error(err.response?.data?.message || "Không thể tải thông tin đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    if (orderCode) {
        fetchOrder();
    } else {
        toast.error("Không tìm thấy mã đơn hàng trên URL.");
        setLoading(false);
    }
}, [orderCode]); // 🔁 sửa đúng dependency

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh] bg-gray-50">
                <Loader fullscreen={false} />
            </div>
        );
    }

    if (!order) {
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

    const deliveryInfo = {
        address: userAddress?.fullAddress || "N/A",
        time: order?.deliveryTime || "Thời gian sẽ được nhân viên xác nhận khi gọi điện",
    };

    const summary = {
       orderId: order?.orderCode || '',
        total: totalPrice,
        discount,
        deliveryFee: shippingFee,
        amountDue: finalPrice,
        points: Math.floor((finalPrice - shippingFee) / 10000),
    };

    return (
        <div className="bg-gray-50 py-8">
            {/* ✅ YÊU CẦU: Tạo một khối chứa chính với max-width: 1200px */}
            <div className="max-w-[1200px] mx-auto">
                {/* PHẦN 1: HEADER (Bây giờ đã nằm trong khối 1200px) */}
                <div 
                    className="bg-no-repeat bg-center bg-contain" 
                    style={{ backgroundImage: `url(${bgPc})` }}
                >
                    <div className="px-4 pt-12 pb-8">
                        <div className="text-center">
                            <img src={successIcon} alt="Đặt hàng thành công" className="w-20 h-20 mx-auto mb-4" />
                            <h1 className="text-green-600 text-3xl font-bold">Đặt hàng thành công!</h1>
                            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                                Cảm ơn bạn đã mua hàng. Nhân viên sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PHẦN 2: THÂN TRANG (Cũng nằm trong khối 1200px) */}
                <div className=" pb-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <ProductList products={products} />
                            <CustomerInfo {...customer} />
                           <DeliveryMethod address={deliveryInfo.address} time={deliveryInfo.time} />
{qrUrl && (
  <div className="bg-white p-4 rounded-lg shadow h-fit text-center">
    <h3 className="text-base font-semibold text-gray-800 mb-2">Quét mã VietQR để thanh toán</h3>
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

                            <PaymentMethod method={paymentMethod?.name || "Thanh toán khi nhận hàng (COD)"} />
                        </div>

                        
<div className="bg-white p-4 rounded-lg shadow h-fit">
    <h2 className="text-base font-semibold mb-4 text-gray-800">Thông tin đơn hàng</h2>
    <div className="text-sm text-gray-700 space-y-3">
        <div className="flex justify-between">
            <span>Mã đơn hàng:</span>
            <strong>{summary.orderId}</strong>
        </div>
        <hr />
        <div className="flex justify-between">
            <span>Tổng tiền:</span>
            <span>{formatCurrencyVND(summary.total ?? 0)}</span>
        </div>
        <div className="flex justify-between">
            <span>Khuyến mãi:</span>
            <span className="text-red-600">- {formatCurrencyVND(summary.discount ?? 0)}</span>
        </div>
        <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <strong>
                {(summary.deliveryFee ?? 0) > 0
                    ? formatCurrencyVND(summary.deliveryFee)
                    : 'Miễn phí'}
            </strong>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-base text-gray-800">
            <span>Cần thanh toán:</span>
            <span className="text-red-600">{formatCurrencyVND(summary.amountDue ?? 0)}</span>
        </div>
    </div>
    <div className="mt-6 space-y-3">
        <Link
            to="/"
            className="bg-primary text-white w-full py-2.5 rounded-md font-semibold inline-block text-center hover:opacity-85 transition-colors"
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