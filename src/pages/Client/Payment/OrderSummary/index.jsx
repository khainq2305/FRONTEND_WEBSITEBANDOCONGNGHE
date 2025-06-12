import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../../../services/client/orderService";
import { userAddressService } from "../../../../services/client/userAddressService";
import { toast } from "react-toastify";
import PromoModal from "../../Cart/PromoModal"; // ✅ Import modal đúng thư mục

const OrderSummary = ({
  totalAmount,
  discount,
  shippingFee,
  selectedPaymentMethod,
  selectedCoupon: propCoupon,
}) => {
  const navigate = useNavigate();

  // ✅ Local modal state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

const [selectedCoupon, setSelectedCoupon] = useState(null);

useEffect(() => {
  if (propCoupon) {
    setSelectedCoupon(propCoupon);
  }
}, [propCoupon]);

  const handleApplyPromo = (couponCode) => {
  // ✅ Nếu người dùng bỏ mã
  if (!couponCode) {
    setSelectedCoupon(null);
    localStorage.removeItem("selectedCoupon");
    toast.success("Đã bỏ áp dụng mã giảm giá.");
    return;
  }

  try {
    const couponStorage = JSON.parse(localStorage.getItem("availableCoupons") || "[]");
    const found = couponStorage.find(c => c.code === couponCode);

    if (found) {
      setSelectedCoupon(found);
      localStorage.setItem("selectedCoupon", JSON.stringify(found));
      toast.success(`Áp dụng mã ${couponCode} thành công!`);
    } else {
      toast.error("Không tìm thấy thông tin mã đã chọn!");
    }
  } catch (err) {
    console.error("❌ Lỗi khi xử lý mã:", err);
    toast.error("Lỗi khi áp mã giảm giá!");
  }

  setIsPromoModalOpen(false);
};

useEffect(() => {
  if (propCoupon) {
    setSelectedCoupon(propCoupon);
  } else {
    const stored = localStorage.getItem("selectedCoupon");
    if (stored) {
      try {
        setSelectedCoupon(JSON.parse(stored));
      } catch (e) {
        console.error("❌ Không parse được selectedCoupon:", e);
      }
    }
  }
}, [propCoupon]);


 const couponDiscount =
  selectedCoupon?.discountType === "amount"
    ? selectedCoupon.discountValue
    : selectedCoupon?.discountType === "percentage"
    ? Math.round((totalAmount * selectedCoupon.discountValue) / 100)
    : 0;

// ✅ Nếu là mã giảm phí vận chuyển → tính riêng
const shippingDiscount =
  selectedCoupon?.discountType === "shipping"
    ? Math.min(shippingFee, selectedCoupon.discountValue || 0) // ví dụ freeship tối đa 30k
    : 0;

const totalDiscount = discount + couponDiscount;
const finalAmount = totalAmount - totalDiscount + (shippingFee - shippingDiscount);

const handlePlaceOrder = async () => {
  try {
    const selectedItems = JSON.parse(localStorage.getItem("selectedCartItems") || "[]");
    console.log("🛒 Selected items:", selectedItems);

    if (selectedItems.length === 0) {
      toast.error("Không có sản phẩm được chọn!");
      return;
    }

    const addressRes = await userAddressService.getDefault();
    const address = addressRes.data?.data;
    console.log("📍 Địa chỉ mặc định:", address);

    if (!address?.id) {
      toast.error("Chưa có địa chỉ giao hàng mặc định!");
      return;
    }

    const payload = {
      addressId: address.id,
      paymentMethodId: selectedPaymentMethod,
      couponCode: selectedCoupon?.code || null,
      note: "",
      items: selectedItems.map(item => ({
        skuId: item.skuId,
        quantity: item.quantity,
        price: item.finalPrice,
      })),
      cartItemIds: selectedItems.map(item => item.id),
    };

    console.log("📤 Payload gửi lên backend:", payload);

    const res = await orderService.createOrder(payload);
    const createdOrderId = res.data?.orderId || res.data?.data?.id;
    const createdOrderCode = res.data?.orderCode || res.data?.data?.orderCode;

    console.log("✅ Đã tạo đơn:", {
      createdOrderId,
      createdOrderCode,
      selectedPaymentMethod,
    });

    if (!createdOrderId || !createdOrderCode) {
      toast.error("Không lấy được mã đơn hàng.");
      return;
    }

    // 👉 Nếu là Chuyển khoản ngân hàng (VietQR)
    if (selectedPaymentMethod === 2) {
      console.log("🔁 Phát hiện thanh toán VietQR");

      const vietqrRes = await orderService.vietqrPay({
        accountNumber: '2222555552005',
        accountName: 'NGUYEN QUOC KHAI',
        bankCode: 'MB',
        amount: finalAmount,
        message: createdOrderCode,
      });

      const qrUrl = vietqrRes.data?.qrImage;
      console.log("📦 QR URL từ VietQR:", qrUrl);

      if (!qrUrl) {
        toast.error("Không lấy được ảnh VietQR.");
        return;
      }

      const fullCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const updatedCart = fullCart.filter(cartItem =>
        !selectedItems.some(selected => selected.skuId === cartItem.skuId)
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      localStorage.removeItem("selectedCartItems");
      localStorage.removeItem("selectedCoupon");

      console.log("➡️ Điều hướng sang trang xác nhận có QR");
      navigate(`/order-confirmation?orderCode=${createdOrderCode}&qr=${encodeURIComponent(qrUrl)}`);
      return;
    }

    // 👉 Nếu là MoMo
    if (selectedPaymentMethod === 4) {
      console.log("🔁 Phát hiện thanh toán MoMo");

      const momoRes = await orderService.momoPay({ orderId: createdOrderId });
      const momoPayUrl = momoRes.data?.payUrl;

      console.log("🔗 Momo URL:", momoPayUrl);

      if (momoPayUrl) {
        const fullCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const updatedCart = fullCart.filter(cartItem =>
          !selectedItems.some(selected => selected.skuId === cartItem.skuId)
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        localStorage.removeItem("selectedCartItems");
        localStorage.removeItem("selectedCoupon");

        window.location.href = momoPayUrl;
      } else {
        toast.error("Không nhận được link thanh toán MoMo.");
      }

      return;
    }

    // 👉 Trường hợp còn lại: COD hoặc không khớp
    console.log("⚠️ Rơi vào nhánh COD hoặc phương thức chưa xử lý");

    toast.success("Đặt hàng thành công!");

    const fullCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const updatedCart = fullCart.filter(cartItem =>
      !selectedItems.some(selected => selected.skuId === cartItem.skuId)
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    localStorage.removeItem("selectedCartItems");
    localStorage.removeItem("selectedCoupon");

    navigate(`/order-confirmation?orderCode=${createdOrderCode}`);
  } catch (err) {
    console.error("❌ Lỗi khi đặt hàng:", err);
    toast.error(err?.response?.data?.message || "Lỗi đặt hàng!");
  }
};





  return (
    <div className="relative">
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm sticky top-6 h-fit">

        {/* Mã giảm giá đã áp */}
        {selectedCoupon?.code && (
          <div className="mb-2 text-xs text-green-600">
            Mã đã áp: <strong>{selectedCoupon.code}</strong>
          </div>
        )}

        {/* Chọn mã giảm giá */}
        <div
          onClick={() => setIsPromoModalOpen(true)}
          className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2 mb-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-ticket-alt text-red-600 text-base"></i>
            <span className="font-medium">Chọn hoặc nhập ưu đãi</span>
          </div>
          <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
        </div>

        {/* Điểm đổi */}
        <div className="border border-gray-200 rounded-md px-3 py-2 mb-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-yellow-200 text-yellow-600 text-[10px] font-bold flex items-center justify-center rounded-full">₵</span>
              <span className="whitespace-nowrap">Đổi 0 điểm (~0đ)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-red-600 peer-focus:ring-2 peer-focus:ring-red-600 transition"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transform peer-checked:translate-x-4 transition"></div>
            </label>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="text-xs sm:text-sm text-gray-600 mb-4">
          <h3 className="font-semibold mb-2 text-gray-800">Thông tin đơn hàng</h3>
          <div className="flex justify-between mb-2">
            <span>Tổng tiền</span>
            <span className="font-semibold">{totalAmount.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tổng khuyến mãi</span>
            <span className="font-semibold text-red-600">
              -{totalDiscount.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div className="flex justify-between mb-2">
  <span>Phí vận chuyển</span>
  <span>
    {shippingFee === 0
      ? "Miễn phí"
      : shippingDiscount > 0
      ? `${(shippingFee - shippingDiscount).toLocaleString("vi-VN")} đ`
      : `${shippingFee.toLocaleString("vi-VN")} đ`}
  </span>
</div>

          <div className="pt-2">
            <div className="border-t border-dashed border-gray-300 mb-2" />
            <div className="flex justify-between text-base sm:text-sm font-bold text-red-600">
              <span>Cần thanh toán</span>
              <span>{finalAmount.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500 mt-2">
            <span>Điểm thưởng</span>
            <span className="flex items-center gap-1 text-yellow-600 font-bold">
              <span className="w-4 h-4 bg-yellow-200 text-yellow-600 text-[10px] flex items-center justify-center rounded-full">₵</span>
              <span>+{Math.floor(finalAmount * 0.1).toLocaleString("vi-VN")}</span>
            </span>
          </div>
          <button className="flex items-center gap-1 text-blue-500 mt-2 font-semibold text-xs sm:text-sm">
            <span>Xem chi tiết</span>
            <i className="fas fa-chevron-down text-sm"></i>
          </button>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="block text-center hover:opacity-85 w-full bg-primary text-white font-semibold py-3 rounded-md transition"
        >
          Đặt hàng
        </button>

        <p className="text-[11px] text-gray-400 text-center mt-2">
          Bằng việc nhấn <strong>Đặt hàng</strong>, bạn đồng ý với{" "}
          <a href="#" className="text-blue-500 underline">Điều khoản dịch vụ</a> và{" "}
          <a href="#" className="text-blue-500 underline">Chính sách xử lý dữ liệu cá nhân</a> của PHT Shop
        </p>
      </aside>

      {/* ✅ Hiển thị modal chọn mã */}
      {isPromoModalOpen && (
       <PromoModal
  onClose={() => setIsPromoModalOpen(false)}
  onApply={handleApplyPromo}
  appliedCode={selectedCoupon?.code || ""}
/>

      )}
    </div>
  );
};

export default OrderSummary;
