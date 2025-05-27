import CheckoutForm from './CheckoutForm';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import { useEffect, useState } from 'react';
// import { cartService } from "../../../services/client/cartService"; // Not used
import { orderService } from "../../../services/client/orderService";
import { userAddressService } from "../../../services/client/userAddressService";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const [shippingFee, setShippingFee] = useState(0);
    const [productsInOrder, setProductsInOrder] = useState([]);

    useEffect(() => {
      console.log("[CheckoutPage] Product Formatting useEffect - STARTED");
      const storedItems = localStorage.getItem("selectedCartItems");
      if (storedItems) {
        try {
          const parsedItems = JSON.parse(storedItems);
          const formatted = parsedItems.map(item => ({
            ...item,
            variant:
              Array.isArray(item.variantValues)
                ? item.variantValues.map(v => `${v.variant}: ${v.value}`).join(", ")
                : item.variant || "",
          }));
          setProductsInOrder(formatted);
          console.log("[CheckoutPage] Product Formatting useEffect - productsInOrder SET:", formatted);
        } catch (err) {
          console.error("[CheckoutPage] Product Formatting useEffect - Cannot parse selectedCartItems:", err);
        }
      } else {
        console.warn("[CheckoutPage] Product Formatting useEffect - No 'selectedCartItems' in localStorage.");
      }
    }, []);

    const totals = productsInOrder.reduce(
      (acc, item) => {
        const qty = item.quantity || 1;
        const oldPrice = item.oldPrice || item.price || 0;
        const currentPrice = item.price || 0;
        acc.totalAmount += oldPrice * qty;
        acc.discount += (oldPrice - currentPrice) * qty;
        return acc;
      },
      { totalAmount: 0, discount: 0 }
    );

    useEffect(() => {
      console.log("[CheckoutPage] Shipping Fee useEffect - STARTED"); // LOG 1

      const fetchShippingFee = async () => {
        console.log("[CheckoutPage] fetchShippingFee function - ENTERED"); // LOG 2
        try {
          const selectedItemsString = localStorage.getItem("selectedCartItems");
          console.log("[CheckoutPage] fetchShippingFee - selectedItemsString from localStorage:", selectedItemsString); // LOG 3

          if (!selectedItemsString) {
            console.warn("[CheckoutPage] fetchShippingFee - No 'selectedCartItems' in localStorage. Aborting fee calculation.");
            return;
          }

          const selectedItems = JSON.parse(selectedItemsString || "[]");
          console.log("[CheckoutPage] fetchShippingFee - parsed selectedItems:", selectedItems); // LOG 4

          if (!selectedItems || selectedItems.length === 0) {
            console.warn("[CheckoutPage] fetchShippingFee - No items in selectedItems array or array is null. Aborting."); // LOG 5
            return;
          }

          console.log("[CheckoutPage] fetchShippingFee - Attempting to get default address..."); // LOG 6
          const addressResponse = await userAddressService.getDefault();
          console.log("[CheckoutPage] fetchShippingFee - Default address RAW response (Axios object):", addressResponse); // LOG 7

          const serverData = addressResponse?.data;
          console.log("🔥🔥🔥 [CheckoutPage] SERVER DATA (this is addressResponse.data):", serverData); // LOG 7X

        const address = addressResponse?.data?.data;

          console.log("[CheckoutPage] fetchShippingFee - Extracted address object (using serverData directly):", address); // LOG 7A

          if (!address) {
            console.error("[CheckoutPage] fetchShippingFee - Default address object (from serverData) is missing or null. Check LOG 7X.");
            toast.error("Không tìm thấy địa chỉ giao hàng mặc định.");
            return;
          }
          if (!address.district || !address.district.ghnCode) {
            console.error("[CheckoutPage] fetchShippingFee - address.district or district.ghnCode is missing. Current address:", address, "District:", address.district);
            toast.error("Địa chỉ giao hàng thiếu thông tin Quận hoặc mã GHN Quận.");
            return;
          }

          // --- SỬA ĐỔI QUAN TRỌNG Ở ĐÂY ---
          // Frontend bây giờ sẽ kiểm tra và sử dụng address.ward.code
          if (!address.ward || typeof address.ward.code === 'undefined') { // KIỂM TRA address.ward.code
            console.error("[CheckoutPage] fetchShippingFee - address.ward or ward.code is missing. Current address:", address, "Ward:", address.ward);
            toast.error("Địa chỉ giao hàng thiếu thông tin Phường/Xã hoặc Mã Phường/Xã (từ cột 'code').");
            return;
          }
          // Log ra để kiểm tra giá trị thực tế
          console.log(`[CheckoutPage] fetchShippingFee - Address OK. District GHN: ${address.district.ghnCode}, Ward Code (từ cột 'code'): ${address.ward.code}`); // LOG 8A ĐÃ SỬA
          // --- KẾT THÚC SỬA ĐỔI KIỂM TRA ---

          const payloadItems = selectedItems.map(item => {
            if (typeof item.skuId === 'undefined' || typeof item.quantity === 'undefined') {
              console.warn("[CheckoutPage] fetchShippingFee - Item with missing skuId or quantity:", item);
            }
            return {
              skuId: item.skuId,
              quantity: item.quantity
            };
          });
          console.log("[CheckoutPage] fetchShippingFee - Items for payload:", payloadItems); // LOG 9

          if (payloadItems.some(item => typeof item.skuId === 'undefined' || typeof item.quantity === 'undefined')) {
              console.error("[CheckoutPage] fetchShippingFee - Some items in payload are missing skuId or quantity. Cannot proceed.", payloadItems);
              toast.error("Một số sản phẩm trong giỏ hàng bị thiếu thông tin SKU hoặc số lượng.");
              return;
          }

          // --- SỬA ĐỔI QUAN TRỌNG KHI TẠO PAYLOAD ---
          const payload = {
            districtId: address.district.ghnCode, // Giữ nguyên district.ghnCode
            wardCode: address.ward.code,          // << SỬA Ở ĐÂY: Sử dụng address.ward.code
            items: payloadItems
          };
          // --- KẾT THÚC SỬA ĐỔI PAYLOAD ---
          console.log("[CheckoutPage] fetchShippingFee - Final payload for orderService.getShippingFee:", payload); // LOG 10

          console.log("✅ [CheckoutPage] fetchShippingFee - Calling orderService.getShippingFee NOW..."); // LOG 11
          const res = await orderService.getShippingFee(payload);
console.log("🎯 Response from orderService.getShippingFee:", res);

const fee = res?.data?.shippingFee;
if (typeof fee !== 'undefined') {
  setShippingFee(fee);
  console.log("[CheckoutPage] fetchShippingFee - Shipping fee SET:", fee);
} else {
  toast.error("Không nhận được phí vận chuyển hợp lệ từ máy chủ.");
}


        } catch (err) {
          console.error("❌ [CheckoutPage] fetchShippingFee - ERROR calculating shipping fee:", err); // LOG 14
          let errorMessage = "Lỗi khi tính phí vận chuyển. Vui lòng thử lại.";
          if (err.response) {
            console.error("❌ Error response data:", err.response.data);
            console.error("❌ Error response status:", err.response.status);
            errorMessage = err.response.data?.message || `Lỗi máy chủ: ${err.response.status}`;
          } else {
            console.error("❌ Error message:", err.message);
            errorMessage = err.message || "Lỗi không xác định khi tính phí.";
          }
          toast.error(errorMessage);
        }
      };

      fetchShippingFee();
      console.log("[CheckoutPage] Shipping Fee useEffect - fetchShippingFee() CALLED"); // LOG 1B
    }, []);


    return (
        <div className="bg-gray-100 min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
             <div className="max-w-7xl mx-auto mb-4">
                <nav className="text-xs sm:text-sm text-gray-600 whitespace-normal">
                    <Link to="/" className="text-blue-500 hover:underline">Trang chủ</Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <Link to="/cart" className="text-blue-500 hover:underline">Giỏ hàng</Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <span>Thanh toán</span>
                </nav>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
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
                                                        <span
                                                            key={i}
                                                            className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-1 mb-1"
                                                        >
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
                                            <p className="text-red-600 font-semibold text-sm sm:text-base">
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
                    <CheckoutForm />
                    <PaymentMethod
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                    />
                </div>
                <div className="lg:sticky lg:top-4 lg:h-fit">
                   <OrderSummary
  totalAmount={totals.totalAmount}
  discount={totals.discount}
  shippingFee={shippingFee}
  selectedPaymentMethod={selectedPaymentMethod} // ✅ thêm dòng này
/>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;