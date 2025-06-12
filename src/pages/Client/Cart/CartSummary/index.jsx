import React, { useState, useEffect } from "react";
import { FaPercentage, FaQuestionCircle } from "react-icons/fa";
import { FiChevronUp, FiChevronRight } from "react-icons/fi";
import PromoModal from "../PromoModal";
import { couponService } from "../../../../services/client/couponService";
import { formatCurrencyVND } from "../../../../utils/formatCurrency";

const CartSummary = ({ 
  hasSelectedItems, 
  selectedItems,
  orderTotals,
  onCheckout 
}) => {
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // 🔁 Load lại mã đã áp từ LocalStorage khi reload
  useEffect(() => {
    // ===== THAY ĐỔI 1: đảm bảo key khớp với chỗ lưu =====
    const savedCode = localStorage.getItem("appliedCouponCode");
    const savedDiscount = localStorage.getItem("discountAmount");

    if (savedCode && savedDiscount) {
      setAppliedCouponCode(savedCode);
      setDiscountAmount(Number(savedDiscount));
    }
  }, []);

  const openPromoModal = () => setIsPromoModalOpen(true);
  const closePromoModal = () => setIsPromoModalOpen(false);

const handleApplyPromo = async (code) => {
  if (!code) {
    setAppliedCouponCode('');
    setDiscountAmount(0);
    setCouponError('');

    localStorage.removeItem("selectedCoupon"); // ✅ chỉ xài key này
    closePromoModal();
    return;
  }

  if (!hasSelectedItems || selectedItems.length === 0) {
    alert("Vui lòng chọn ít nhất một sản phẩm trước khi áp mã.");
    closePromoModal();
    return;
  }

  const firstSkuId = selectedItems[0].skuId || selectedItems[0].product?.skuId || null;
  const numericOrderTotal = Number(orderTotals.payablePrice.replace(/[^\d]/g, ""));

  try {
    const response = await couponService.applyCoupon({
      code,
      skuId: firstSkuId,
      orderTotal: numericOrderTotal,
    });

    const { coupon } = response.data;

    setAppliedCouponCode(coupon.code);
    setDiscountAmount(coupon.discountAmount);
    setCouponError('');

    // ✅ Chỉ lưu 1 key duy nhất
    localStorage.setItem("selectedCoupon", JSON.stringify(coupon));

    closePromoModal();
  } catch (error) {
    setCouponError(error?.response?.data?.message || "Lỗi khi áp mã");
    setAppliedCouponCode('');
    setDiscountAmount(0);
    localStorage.removeItem("selectedCoupon");
    closePromoModal();
  }
};

  const rawPayable = Number(orderTotals.payablePrice.replace(/[^\d]/g, ""));
  const payableAfterDiscount = rawPayable - discountAmount;
  const payableAfterDiscountFormatted = formatCurrencyVND(
    payableAfterDiscount > 0 ? payableAfterDiscount : 0
  );

  const totals = orderTotals || {
    totalPrice: "0 đ",
    totalDiscount: "0 đ",
    payablePrice: "0 đ",
    rewardPoints: "+0",
  };

  // 🔁 Reset coupon sau khi đặt hàng thành công
  const handleCheckout = () => {
    // ===== THAY ĐỔI 4: xóa đúng key khi finish checkout =====
    localStorage.removeItem("appliedCouponCode");
    localStorage.removeItem("discountAmount");
    onCheckout();
  };

  return (
    <>
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm flex flex-col gap-4">
        {/* Áp mã */}
        <div className="border border-gray-200 rounded-md p-3">
          <button
            onClick={openPromoModal}
            className="flex justify-between items-center w-full text-sm text-gray-800 hover:text-primary transition-colors"
          >
            <span className="flex items-center font-medium">
              <span className="mr-2 text-red-500 text-lg">
                <FaPercentage />
              </span>
              {appliedCouponCode
                ? `Mã đã áp: ${appliedCouponCode}`
                : "Chọn hoặc nhập ưu đãi"}
            </span>
            <FiChevronRight className="text-gray-400" />
          </button>
          {couponError && (
            <p className="mt-2 text-xs text-red-500">{couponError}</p>
          )}
        </div>

        {/* Đổi điểm */}
        <div className="border border-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center w-full text-sm text-gray-800">
            <div className="flex items-center">
              <span className="w-5 h-5 bg-yellow-200 text-yellow-700 text-xs font-bold flex items-center justify-center rounded-full mr-2">
                ₵
              </span>
              <span>Đổi 0 điểm (~0đ)</span>
              <span className="ml-1 text-gray-400 cursor-pointer">
                <FaQuestionCircle />
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Tổng kết */}
        <div className="text-sm text-gray-700 space-y-2">
          <h3 className="font-semibold text-base text-gray-800">Thông tin đơn hàng</h3>
          <div className="flex justify-between">
            <span>Tổng tiền</span>
            <span className="font-medium text-gray-800">{totals.totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Tổng khuyến mãi</span>
            <span className="font-medium text-gray-800">{totals.totalDiscount}</span>
          </div>
          <hr className="border-dashed" />
          <div className="flex justify-between text-gray-800 font-semibold">
            <span>Cần thanh toán</span>
            <span className="text-red-600 text-base">
              {appliedCouponCode
                ? payableAfterDiscountFormatted
                : totals.payablePrice}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Điểm thưởng</span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-yellow-200 text-yellow-700 text-[10px] font-bold flex items-center justify-center rounded-full">
                ₵
              </span>
              <span className="text-gray-700">{totals.rewardPoints}</span>
            </span>
          </div>
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-xs">
            <span>Xem chi tiết</span>
            <FiChevronUp />
          </button>
        </div>

        {/* Xác nhận */}
        <button
          onClick={handleCheckout}
          disabled={!hasSelectedItems}
          className={`block text-center w-full font-semibold py-3 rounded-md transition-colors text-base ${
            hasSelectedItems
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Xác nhận đơn
        </button>
      </aside>

      {isPromoModalOpen && (
        <PromoModal
  onClose={() => setIsPromoModalOpen(false)}
  onApply={handleApplyPromo}
  skuId={selectedItems[0]?.skuId || null}
  appliedCode={appliedCouponCode} // ✅ THÊM DÒNG NÀY
/>

      )}
    </>
  );
};

export default CartSummary;
