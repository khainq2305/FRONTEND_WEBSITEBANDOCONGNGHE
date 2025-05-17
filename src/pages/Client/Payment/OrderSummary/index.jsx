// src/components/Client/OrderSummary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ totalAmount, discount, shippingFee }) => {
  const navigate = useNavigate();
  const finalAmount = totalAmount - discount + shippingFee;

  const handlePlaceOrder = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="relative">
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm sticky top-6 h-fit">
        {/* Ô nhập ưu đãi */}
        {/* Chọn hoặc nhập ưu đãi */}
        <div className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2 mb-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer">
          <div className="flex items-center gap-2">
            <i className="fas fa-ticket-alt text-red-600 text-base"></i>
            <span className="font-medium">Chọn hoặc nhập ưu đãi</span>
          </div>
          <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
        </div>
        <div className="border border-gray-200 rounded-md px-3 py-2 mb-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-yellow-200 text-yellow-600 text-[10px] font-bold flex items-center justify-center rounded-full">
                ₵
              </span>
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
              -{discount.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Phí vận chuyển</span>
            <span className="text-green-600 font-semibold">
              {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")} đ`}
            </span>
          </div>

          {/* Gạch ngăn cách */}
          <div className="pt-2">
            <div className="border-t border-dashed border-gray-300 mb-2" />
            <div className="flex justify-between text-base sm:text-sm font-bold text-red-600">
              <span>Cần thanh toán</span>
              <span>{finalAmount.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>

          {/* Điểm thưởng */}
          <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500 mt-2">
            <span>Điểm thưởng</span>
            <span className="flex items-center gap-1 text-yellow-600 font-bold">
              <span className="w-4 h-4 bg-yellow-200 text-yellow-600 text-[10px] flex items-center justify-center rounded-full">
                ₵
              </span>
              <span>+{Math.floor(finalAmount * 0.1).toLocaleString("vi-VN")}</span>
            </span>
          </div>

          <button className="flex items-center gap-1 text-blue-500 mt-2 font-semibold text-xs sm:text-sm">
            <span>Xem chi tiết</span>
            <i className="fas fa-chevron-down text-sm"></i>
          </button>
        </div>

        {/* Nút đặt hàng */}
        <button
          onClick={handlePlaceOrder}
          className="block text-center w-full bg-primary text-white font-semibold py-3 rounded-md  transition"
        >
          Đặt hàng
        </button>

        {/* Điều khoản */}
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Bằng việc nhấn <strong>Đặt hàng</strong>, bạn đồng ý với{" "}
          <a href="#" className="text-blue-500 underline">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="text-blue-500 underline">
            Chính sách xử lý dữ liệu cá nhân
          </a>{" "}
          của PHT Shop
        </p>
      </aside>
    </div>
  );
};

export default OrderSummary;