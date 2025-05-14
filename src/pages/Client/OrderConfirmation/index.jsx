import React from 'react';
// import ProductList from '../OrderConfirmation/ProductList';
import GiftList from './GiftList';
import CustomerInfo from './CustomerInfo';
import DeliveryMethod from './DeliveryMethod';
import PaymentMethod from './PaymentMethod';

const OrderConfirmation = () => {
    const order = {
        products: [
            {
                name: 'Robot hút bụi lau nhà Dreame D9 Max Gen 2 Đen',
                image: 'https://storage.googleapis.com/a1aa/image/fb9bfdba-00ad-4958-5f05-1c40f1d29baa.jpg',
                price: 4710000,
                originalPrice: 9990000,
                variant: 'Màu: Đen'
            },
            {
                name: 'Huawei Watch Fit 3 Đen',
                image: 'https://storage.googleapis.com/a1aa/image/7071fc3c-ef03-4b64-fead-269278c75099.jpg',
                price: 2390000,
                originalPrice: 0,
                variant: 'Màu: Đen'
            },
            {
                name: 'Máy lạnh Casper Inverter 1 HP (9300 BTU) GC-09IS35',
                image: 'https://storage.googleapis.com/a1aa/image/43365a5a-372c-4af0-b842-1b578c29ee90.jpg',
                price: 5790000,
                originalPrice: 7990000,
                variant: ''
            },
            {
                name: 'Tai nghe Bluetooth Sony WF-C700N',
                image: 'https://storage.googleapis.com/a1aa/image/43365a5a-372c-4af0-b842-1b578c29ee90.jpg',
                price: 1790000,
                originalPrice: 2490000,
                variant: 'Màu: Đen'
            },
        ],
        gifts: [
            {
                name: 'Vật phẩm khuyến mãi đầu vào trao thưởng Casper Inverter 1 HP GC-09IS35',
                image: 'https://storage.googleapis.com/a1aa/image/b3d97f29-3308-446e-e1ed-4c039930ebc1.jpg',
                quantity: 1,
            },
            {
                name: 'Đặc quyền 100 ngày 1 đổi 1',
                image: 'https://storage.googleapis.com/a1aa/image/b3d97f29-3308-446e-e1ed-4c039930ebc1.jpg',
                quantity: 1,
            },
            {
                name: 'Phiếu ưu đãi 60.000đ khi mua sim FPT kèm máy',
                image: 'https://storage.googleapis.com/a1aa/image/b3d97f29-3308-446e-e1ed-4c039930ebc1.jpg',
                quantity: 1,
            },
            {
                name: 'Đồng hồ thông minh Huawei - Phiếu mua hàng 62.000đ',
                image: 'https://storage.googleapis.com/a1aa/image/b3d97f29-3308-446e-e1ed-4c039930ebc1.jpg',
                quantity: 1,
            },
            {
                name: 'Sim FPT 0777 - Tặng mã ưu đãi 50.000đ',
                image: 'https://storage.googleapis.com/a1aa/image/b3d97f29-3308-446e-e1ed-4c039930ebc1.jpg',
                quantity: 1,
            },
            {
                name: 'Đơn hàng từ 30 triệu được tặng quạt Toshiba giá chỉ 999.000đ',
                image: 'https://storage.googleapis.com/a1aa/image/b3d97f29-3308-446e-e1ed-4c039930ebc1.jpg',
                quantity: 1,
            },
            {
                name: 'Mua Chảo SM457S giá chỉ 199.000đ',
                image: 'https://storage.googleapis.com/a1aa/image/b3d97f29-3308-446e-e1ed-4c039930ebc1.jpg',
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
        <div className="bg-gray-100 min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-green-600 text-lg sm:text-2xl font-bold">Đặt hàng thành công!</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Nhân viên FPT Shop sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                    </p>
                    <div className="flex justify-center my-3">
                        <img src="/images/success.png" alt="Đặt hàng thành công" className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Bên trái: nội dung chi tiết */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-xs sm:text-sm">
                            <h2 className="font-semibold text-sm sm:text-base mb-2">
                                Sản phẩm trong đơn ({order.products.length})
                            </h2>

                            <div className="space-y-3 sm:space-y-4">
                                {order.products.map((product, index) => (
                                    <div key={index} className="flex items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex gap-2 sm:gap-3 flex-1">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium leading-snug line-clamp-2">{product.name}</p>
                                                {product.variant && (
                                                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded mt-1">
                                                        {product.variant}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right whitespace-nowrap ml-2">
                                            <p className="text-red-600 font-semibold text-sm sm:text-base">
                                                {product.price.toLocaleString('vi-VN')} ₫
                                            </p>
                                            {product.originalPrice > 0 && (
                                                <p className="text-gray-400 text-xs line-through mt-0.5">
                                                    {product.originalPrice.toLocaleString('vi-VN')} ₫
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <GiftList gifts={order.gifts} />
                        <CustomerInfo {...order.customer} />
                        <DeliveryMethod {...order.delivery} />
                        <PaymentMethod {...order.payment} />
                    </div>

                    {/* Cột phải: Thông tin đơn hàng */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-xs sm:text-sm h-fit lg:sticky lg:top-4">
                        <h2 className="text-sm sm:text-base font-semibold mb-3">Thông tin đơn hàng</h2>
                        <div className="text-gray-700 space-y-1.5">
                            <div>Mã đơn hàng: <strong>{order.summary.orderId}</strong></div>
                            <div>Tổng tiền: <strong>{order.summary.total.toLocaleString()} ₫</strong></div>
                            <div>Khuyến mãi: <span className="text-red-600">- {order.summary.discount.toLocaleString()} ₫</span></div>
                            <div>Phí vận chuyển: <strong>Miễn phí</strong></div>
                            <div className="font-semibold text-green-600 text-sm sm:text-base">
                                Tổng thanh toán: {order.summary.amountDue.toLocaleString()} ₫
                            </div>
                            <div>Điểm thưởng: <span className="text-yellow-600 font-medium">+{order.summary.points.toLocaleString()}</span></div>
                        </div>
                        <div className="mt-5 space-y-2">
                            <button className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded font-semibold text-sm">
                                Về trang chủ
                            </button>
                            <button className="w text-green-600 underline text-xs sm:text-sm font-medium">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;