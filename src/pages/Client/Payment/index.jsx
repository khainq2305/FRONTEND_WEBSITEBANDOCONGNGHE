import React, { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { orderService } from "../../../services/client/orderService";
import { userAddressService } from "../../../services/client/userAddressService";
import CheckoutForm from './CheckoutForm';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';

const CheckoutPage = () => {
    // State cho trang thanh toán
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const [shippingFee, setShippingFee] = useState(0);
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    // State quản lý địa chỉ
    const [addressList, setAddressList] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(true);

    // Lấy sản phẩm và coupon từ localStorage
    useEffect(() => {
        const storedItems = localStorage.getItem("selectedCartItems");
        if (storedItems) {
            try {
                const parsedItems = JSON.parse(storedItems);
               const formatted = parsedItems.map(item => ({
  ...item,
  oldPrice: item.price,         // 👈 đây là giá gốc từ Cart
  price: item.finalPrice,       // 👈 đây là giá khuyến mãi
  variant: Array.isArray(item.variantValues)
    ? item.variantValues.map(v => `${v.variant}: ${v.value}`).join(", ")
    : item.variant || "",
}));

                setProductsInOrder(formatted);
            } catch (err) {
                console.error("Lỗi parse selectedCartItems:", err);
            }
        }
        const storedCoupon = localStorage.getItem("selectedCoupon");
        if (storedCoupon) {
            try {
                setSelectedCoupon(JSON.parse(storedCoupon));
            } catch (err) {
                console.error("Lỗi parse selectedCoupon:", err);
            }
        }
    }, []);

    // Hàm lấy dữ liệu địa chỉ từ server - có thể gọi lại
    const refetchAddresses = useCallback(async () => {
        setIsLoadingAddress(true);
        try {
            const res = await userAddressService.getList();
            const allAddresses = res.data?.data || [];
            
            if (allAddresses.length > 0) {
                allAddresses.sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0));
                setAddressList(allAddresses);
                setSelectedAddress(allAddresses.find(addr => addr.isDefault) || allAddresses[0]);
            } else {
                setAddressList([]);
                setSelectedAddress(null);
            }
        } catch (error) {
            console.error("Không thể lấy sổ địa chỉ:", error);
            toast.error("Lỗi khi tải sổ địa chỉ của bạn.");
        } finally {
            setIsLoadingAddress(false);
        }
    }, []);

    // Gọi hàm lấy địa chỉ lần đầu khi component mount
    useEffect(() => {
        refetchAddresses();
    }, [refetchAddresses]);

    // Tự động tính lại phí ship mỗi khi địa chỉ được chọn hoặc sản phẩm thay đổi
   useEffect(() => {
    if (!selectedAddress || !selectedAddress.district || !selectedAddress.ward) {
        console.log("⏳ Chờ selectedAddress sẵn sàng...");
        return;
    }

    const fetchShippingFee = async () => {
        try {
            const districtId = selectedAddress.district.ghnCode || selectedAddress.district.code;
            const wardCode = selectedAddress.ward.code;

            if (!districtId || !wardCode) {
                console.warn("❌ Không đủ thông tin để tính phí:", { districtId, wardCode });
                setShippingFee(0);
                return;
            }

            const items = productsInOrder.map(item => ({
                skuId: item.skuId,
                quantity: item.quantity,
            }));

            const payload = { districtId, wardCode, items };

            console.log("📦 Payload gửi lên:", payload);
            const res = await orderService.getShippingFee(payload);
            console.log("📨 Phí ship nhận về:", res.data);

            setShippingFee(res.data?.shippingFee || 0);
        } catch (error) {
            console.error("🔥 Lỗi tính phí vận chuyển:", error);
            toast.error(error.response?.data?.message || "Không thể tính phí vận chuyển.");
            setShippingFee(0);
        }
    };

    fetchShippingFee();
}, [selectedAddress, productsInOrder]);

console.log("🎯 selectedAddress debug:", selectedAddress);
console.log("➡️ districtId (GHN):", selectedAddress?.district?.ghnCode);
console.log("➡️ wardCode:", selectedAddress?.ward?.code);

    const totals = productsInOrder.reduce(
        (acc, item) => {
            const qty = item.quantity || 1;
            const oldPrice = item.oldPrice || item.price || 0;
            const currentPrice = item.price || 0;
            acc.totalAmount += oldPrice * qty;
            acc.discount += (oldPrice - currentPrice) * qty;
            return acc;
        }, { totalAmount: 0, discount: 0 }
    );

    return (
        <div className="bg-gray-100 max-w-[1200px] mx-auto min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
            <div className="max-w-7xl mx-auto mb-4">
                <nav className="text-xs sm:text-sm text-gray-600 whitespace-normal">
                    <Link to="/" className="text-blue-500 hover:underline">Trang chủ</Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <Link to="/cart" className="text-blue-500 hover:underline">Giỏ hàng</Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <span>Thanh toán</span>
                </nav>
            </div>
            {/* ✨ THAY ĐỔI LAYOUT Ở ĐÂY */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                
                {/* Cột trái (thông tin) giờ chiếm 3/5 */}
                <div className="lg:col-span-3 space-y-3 sm:space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-xs sm:text-sm">
                        <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                            Sản phẩm trong đơn ({productsInOrder.length})
                        </h2>
                        <div className="product-list-inner-box bg-gray-50 p-3 rounded-md space-y-3 sm:space-y-4">
                            {productsInOrder.length > 0 ? (
                                productsInOrder.map((product, index) => (
                                    <div key={product.id || `product-${index}`} className="flex items-start gap-2 sm:gap-3">
                                        <img
                                            src={product.image || "https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg"}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg";
                                            }}
                                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium leading-snug line-clamp-2">{product.name}</p>
                                            {product.variant && (
                                                <div className="mt-1 text-xs text-gray-600">
                                                    {product.variant.split(',').map((v, i) => (
                                                        <span key={i} className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-1 mb-1">
                                                            {v.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-1">
                                                Số lượng: <span className="font-medium text-gray-800">{product.quantity || 1}</span>
                                            </div>
                                        </div>
                                        <div className="text-right whitespace-nowrap ml-2">
                                            <p className="text-sky-600 font-semibold text-sm sm:text-base">
                                                {(product.price || 0).toLocaleString("vi-VN")} ₫
                                            </p>
                                            {(product.oldPrice && product.oldPrice > (product.price || 0)) && (
                                                <p className="text-gray-400 text-xs line-through mt-0.5">
                                                    {product.oldPrice.toLocaleString("vi-VN")} ₫
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">Không có sản phẩm nào được chọn để thanh toán.</p>
                            )}
                        </div>
                    </div>

                    <CheckoutForm
                        isLoading={isLoadingAddress}
                        addressList={addressList}
                        selectedAddress={selectedAddress}
                        onSelectAddress={setSelectedAddress}
                        onAddressCreated={refetchAddresses}
                    />
                    
                    <PaymentMethod
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                    />
                </div>

                {/* Cột phải (tóm tắt đơn hàng) giờ chiếm 2/5 */}
                <div className="lg:col-span-2 lg:sticky lg:top-4 lg:h-fit">
                    <OrderSummary
                        totalAmount={totals.totalAmount}
                        discount={totals.discount}
                        shippingFee={shippingFee}
                        selectedPaymentMethod={selectedPaymentMethod}
                        selectedCoupon={selectedCoupon}
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;