import React from 'react';
import ProductList from 'components/Client/OrderConfirmation/ProductList';
import GiftList from 'components/Client/OrderConfirmation/GiftList';
import CustomerInfo from 'components/Client/OrderConfirmation/CustomerInfo';
import DeliveryMethod from 'components/Client/OrderConfirmation/DeliveryMethod';
import PaymentMethod from 'components/Client/OrderConfirmation/PaymentMethod';

const OrderConfirmation = () => {
    const order = {
        products: [
            {
                name: 'Quạt không cánh hơi nước tích hợp lọc không khí Fujihome BF-03RC',
                image: '/images/quat.jpg',
                price: 2790000,
                originalPrice: 4990000,
            },
            {
                name: 'Masstel Tab 10 E64; 4G 3GB 32GB Xanh',
                image: '/images/tablet.jpg',
                price: 1980000,
                originalPrice: 2290000,
            },
            {
                name: 'Huawei watch Fit 3 Đen',
                image: '/images/watch.jpg',
                price: 2390000,
                originalPrice: 2990000,
            },
            {
                name: 'Máy lạnh Casper Inverter 1 HP (9000 BTU) GC-09IS35',
                image: '/images/ac.jpg',
                price: 5790000,
                originalPrice: 7990000,
            },
        ],
        gifts: [
            {
                name: 'Vật phẩm khuyến mãi đầu vào trao thưởng Casper Inverter 1 HP GC-09IS35',
                image: '/images/gifts/casper.jpg',
                quantity: 1,
            },
            {
                name: 'Đặc quyền 100 ngày 1 đổi 1',
                image: '/images/gifts/1do1.png',
                quantity: 1,
            },
            {
                name: 'Phiếu ưu đãi 60.000đ khi mua sim FPT kèm máy',
                image: '/images/gifts/fpt-voucher.png',
                quantity: 1,
            },
            {
                name: 'Đồng hồ thông minh Huawei - Phiếu mua hàng 62.000đ',
                image: '/images/gifts/huawei-watch.png',
                quantity: 1,
            },
            {
                name: 'Sim FPT 0777 - Tặng mã ưu đãi 50.000đ',
                image: '/images/gifts/sim-fpt.png',
                quantity: 1,
            },
            {
                name: 'Đơn hàng từ 30 triệu được tặng quạt Toshiba giá chỉ 999.000đ',
                image: '/images/gifts/fan-toshiba.jpg',
                quantity: 1,
            },
            {
                name: 'Mua Chảo SM457S giá chỉ 199.000đ',
                image: '/images/gifts/chao.png',
                quantity: 1,
            },
        ],
        customer: {
            name: 'Nguyễn Văn A',
            phone: '0987654321',
        },
        delivery: {
            type: 'Giao tận nơi',
            time: 'Trước 17:00, ngày 19/05/2025',
        },
        payment: {
            method: 'COD - Thanh toán khi nhận hàng',
        },
        summary: {
            orderId: '66377***',
            total: 18460000,
            discount: 5600000,
            deliveryFee: 0,
            amountDue: 12860000,
            points: 4336,
        },
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center mb-8">
                <h1 className="text-green-600 text-2xl font-bold">Đặt hàng thành công!</h1>
                <p className="text-sm text-gray-600">
                    Nhân viên FPT Shop sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                </p>
                <div className="flex justify-center my-4">
                    <img src="/images/success.png" alt="Đặt hàng thành công" className="w-24 h-24" />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <ProductList products={order.products} />
                    <GiftList gifts={order.gifts} />
                    <CustomerInfo {...order.customer} />
                    <DeliveryMethod {...order.delivery} />
                    <PaymentMethod {...order.payment} />
                </div>

                <div className="bg-white p-4 rounded-lg shadow h-fit">
                    <h2 className="text-base font-semibold mb-4">Thông tin đơn hàng</h2>
                    <div className="text-sm text-gray-700 space-y-2">
                        <div>Mã đơn hàng: <strong>{order.summary.orderId}</strong></div>
                        <div>Tổng tiền: <strong>{order.summary.total.toLocaleString()} ₫</strong></div>
                        <div>Khuyến mãi: <span className="text-red-600">- {order.summary.discount.toLocaleString()} ₫</span></div>
                        <div>Phí vận chuyển: <strong>Miễn phí</strong></div>
                        <div className="font-semibold text-green-600">Tổng thanh toán: {order.summary.amountDue.toLocaleString()} ₫</div>
                        <div>Điểm thưởng: <span className="text-yellow-600 font-medium">+{order.summary.points.toLocaleString()}</span></div>
                    </div>
                    <div className="mt-6">
                        <button className="bg-red-600 text-white w-full py-2 rounded font-semibold">Về trang chủ</button>
                        <button className="mt-2 text-sm text-green-600 underline">Xem chi tiết</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
