import React, { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import { Link } from "react-router-dom"; // THÊM IMPORT Link
const CheckoutPage = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const productsInOrder = [
        {
            id: 1,
            name: 'Robot hút bụi lau nhà Dreame D9 Max Gen 2 Đen',
            image: 'https://cdn.tgdd.vn/Products/Images/2002/319025/robot-hut-bui-lau-nha-dreame-d9-max-gen-2-den-thumb-600x600.jpg',
            variant: 'Màu: Đen',
            price: 4710000,
            oldPrice: 9990000,
        },
        {
            id: 2,
            name: 'Huawei Watch Fit 3 Đen',
            image: 'https://cdn.tgdd.vn/Products/Images/7077/315603/huawei-watch-fit-3-den-thumb-600x600.jpg',
            variant: 'Màu: Đen',
            price: 2390000,
            oldPrice: 0,
        },
        {
            id: 3,
            name: 'Máy lạnh Casper Inverter 1 HP (9300 BTU) GC-09IS35',
            image: 'https://cdn.tgdd.vn/Products/Images/2002/315316/may-lanh-casper-inverter-1-hp-gc-09is35-600x600.jpg',
            variant: '',
            price: 5790000,
            oldPrice: 7990000,
        },
        {
            id: 4,
            name: 'Tai nghe Bluetooth Sony WF-C700N',
            image: 'https://cdn.tgdd.vn/Products/Images/54/307778/tai-nghe-bluetooth-true-wireless-sony-wf-c700n-den-thumb-600x600.jpg',
            variant: 'Màu: Đen',
            price: 1790000,
            oldPrice: 2490000,
        },
    ];

    return (
        <div className="bg-gray-100 min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
             <div className="max-w-7xl mx-auto mb-4"> {/* Thêm container cho breadcrumb để căn chỉnh */}
                <nav className="text-xs sm:text-sm text-gray-600 whitespace-normal">
                    <Link to="/" className="text-blue-500 hover:underline">Trang chủ</Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <Link to="/cart" className="text-blue-500 hover:underline">Giỏ hàng</Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <span>Thanh toán</span>
                </nav>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Cột trái: Form người đặt hàng + phương thức thanh toán */}
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    {/* Danh sách sản phẩm - Mobile: compact, Desktop: đầy đủ */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm text-xs sm:text-sm space-y-3 sm:space-y-4">
                        <h2 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                            Sản phẩm trong đơn ({productsInOrder.length})
                        </h2>

                        {productsInOrder.map((product) => (
                            <div key={product.id} className="flex items-start gap-2 sm:gap-3">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium leading-snug line-clamp-2">{product.name}</p>
                                    {product.variant && (
                                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-1.5 sm:px-2 py-0.5 rounded mt-1">
                                            {product.variant}
                                        </span>
                                    )}
                                </div>
                                <div className="text-right whitespace-nowrap ml-2">
                                    <p className="text-red-600 font-semibold text-sm sm:text-base">
                                        {product.price.toLocaleString('vi-VN')} ₫
                                    </p>
                                    {product.oldPrice > 0 && (
                                        <p className="text-gray-400 text-xs line-through mt-0.5">
                                            {product.oldPrice.toLocaleString('vi-VN')} ₫
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form người đặt hàng + hình thức nhận hàng */}
                    <CheckoutForm />

                    {/* Phương thức thanh toán */}
                    <PaymentMethod
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                    />
                </div>

                {/* Cột phải: Thông tin đơn hàng - Mobile: ở dưới, Desktop: sticky bên phải */}
                <div className="lg:sticky lg:top-4 lg:h-fit">
                    <OrderSummary
                        totalAmount={18460000}
                        discount={5660000}
                        shippingFee={0}
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;