// src/components/Client/CartSummary.jsx
import React, { useState } from "react"; // Thêm useState
import { Link } from "react-router-dom";
import { FaPercentage, FaQuestionCircle } from "react-icons/fa";
import { FiChevronUp, FiChevronRight } from "react-icons/fi";
import PromoModal from "../PromoModal"; // Import component Modal (sẽ tạo ở bước 2)

const CartSummary = ({ hasSelectedItems, orderTotals }) => {
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false); // State cho modal ưu đãi

  const navigateToCheckout = (event) => {
    if (!hasSelectedItems) {
      event.preventDefault();
      alert("Vui lòng chọn ít nhất một sản phẩm để tiếp tục.");
    }
  };

  const openPromoModal = () => setIsPromoModalOpen(true);
  const closePromoModal = () => setIsPromoModalOpen(false);

  const handleApplyPromo = (promoCode) => {
    // Xử lý logic áp dụng mã khuyến mãi ở đây
    // Ví dụ: gọi API, cập nhật lại orderTotals, v.v.
    alert(`Đã áp dụng mã: ${promoCode}`);
    closePromoModal();
  };


  const totals = orderTotals || {
    totalPrice: "0 đ",
    totalDiscount: "0 đ",
    payablePrice: "0 đ",
    rewardPoints: "+0",
  };

  return (
    <> {/* Bọc bởi Fragment để chứa modal */}
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm flex flex-col gap-4">
        {/* Phần "Chọn hoặc nhập ưu đãi" */}
        <div className="border border-gray-200 rounded-md p-3">
          {/* THAY ĐỔI Ở ĐÂY: onClick để mở modal */}
          <button
            onClick={openPromoModal}
            className="flex justify-between items-center w-full text-sm text-gray-800 hover:text-primary transition-colors"
          >
            <span className="flex items-center font-medium">
              <span className="mr-2 text-red-500 text-lg">
                <FaPercentage />
              </span>
              Chọn hoặc nhập ưu đãi
            </span>
            <FiChevronRight className="text-gray-400" />
          </button>
        </div>

        {/* Phần "Đổi điểm" */}
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

        {/* Thông tin đơn hàng */}
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
            <span className="text-red-600 text-base">{totals.payablePrice}</span>
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

        {/* Nút xác nhận đơn */}
        <Link
          to="/Checkout"
          onClick={navigateToCheckout}
          className={`block text-center w-full font-semibold py-3 rounded-md transition-colors text-base ${
            hasSelectedItems
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          aria-disabled={!hasSelectedItems}
        >
          Xác nhận đơn
        </Link>
      </aside>

      {/* Modal chọn/nhập ưu đãi */}
      {isPromoModalOpen && (
        <PromoModal
          onClose={closePromoModal}
          onApply={handleApplyPromo}
          // availablePromos={...} // Bạn có thể truyền danh sách ưu đãi có sẵn vào đây
        />
      )}
    </>
  );
};

export default CartSummary;