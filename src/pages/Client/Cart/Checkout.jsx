import React, { useState } from 'react';
import CheckoutForm from '../CheckoutForm';
import PaymentMethod from '../PaymentMethod';
import OrderSummary from '../OrderSummary';

const CheckoutPage = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);

    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cột trái: Form người đặt hàng + phương thức thanh toán */}
                <div className="md:col-span-2 space-y-4">
                    {/* Danh sách sản phẩm */}
                    <div className="bg-white rounded-lg p-4 shadow-sm text-sm space-y-2">
                        <h2 className="font-semibold mb-3">Sản phẩm trong đơn (2)</h2>
                        <div className="flex items-center gap-3">
                            <img src="https://cdn.tgdd.vn/Products/Images/7077/315603/huawei-watch-fit-3-den-thumb-600x600.jpg" className="w-14 h-14 object-cover rounded" />
                            <div className="flex-1">
                                <p>Huawei Watch Fit 3 Đen</p>
                                <p className="text-red-600 font-semibold">2.390.000 ₫</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <img src="https://cdn.tgdd.vn/Products/Images/2002/315316/may-lanh-casper-inverter-1-hp-gc-09is35-600x600.jpg" className="w-14 h-14 object-cover rounded" />
                            <div className="flex-1">
                                <p>Máy lạnh Casper Inverter 1 HP (9300 BTU) GC-09IS35</p>
                                <p className="text-red-600 font-semibold">5.790.000 ₫ <span className="line-through text-gray-400 ml-2 text-xs">7.990.000 ₫</span></p>
                            </div>
                        </div>
                        <div className="text-sm bg-yellow-100 text-yellow-700 px-3 py-2 rounded">
                            🎁 5 Quà tặng đơn hàng
                        </div>
                    </div>

                    {/* Form người đặt hàng + hình thức nhận hàng */}
                    <CheckoutForm />

                    {/* Phương thức thanh toán */}
                    <PaymentMethod
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                    />
                </div>

                {/* Cột phải: Thông tin đơn hàng */}
                <OrderSummary
                    totalAmount={18460000}
                    discount={5660000}
                    shippingFee={0}
                />
            </div>
        </div>
    );
};

export default CheckoutPage;
