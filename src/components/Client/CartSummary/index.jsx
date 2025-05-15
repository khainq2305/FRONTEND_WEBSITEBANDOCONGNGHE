// src/components/Client/CartSummary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const navigate = useNavigate();

  const handleConfirmOrder = () => {
    navigate('/checkout');
  };

  return (
    <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200">
      {/* Quà tặng */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-500 mb-2">
        <h2 className="flex items-center gap-2">
          <i className="fas fa-gift text-red-600"></i>
          <span>Quà tặng</span>
        </h2>
        <a href="#" className="text-blue-500 hover:underline">
          Xem quà (5)
        </a>
      </div>

      {/* Ô nhập ưu đãi */}
      <div className="border border-gray-200 rounded-md p-2 sm:p-3 mb-4 text-xs sm:text-sm text-gray-600">
        <button className="flex justify-between items-center w-full font-semibold text-red-600">
          <span>Chọn hoặc nhập ưu đãi</span>
          <i className="fas fa-chevron-right text-sm"></i>
        </button>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="w-5 h-5 bg-yellow-200 text-yellow-600 text-[10px] font-bold flex items-center justify-center rounded-full">
            ₵
          </span>
          <span>Đổi 0 điểm (~0đ)</span>
          <label className="ml-auto relative inline-flex items-center cursor-pointer">
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
          <span className="font-semibold">18.460.000 đ</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tổng khuyến mãi</span>
          <span className="font-semibold">5.660.000 đ</span>
        </div>
        <div className="flex justify-between mb-2 text-red-600 font-bold">
          <span>Cần thanh toán</span>
          <span>12.800.000 đ</span>
        </div>
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500">
          <span>Điểm thưởng</span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 bg-yellow-200 text-yellow-600 text-[10px] font-bold flex items-center justify-center rounded-full">
              ₵
            </span>
            <span>+5,336</span>
          </span>
        </div>
        <button className="flex items-center gap-1 text-blue-500 mt-2 font-semibold">
          <span>Xem chi tiết</span>
          <i className="fas fa-chevron-down text-sm"></i>
        </button>
      </div>

      {/* Nút xác nhận đơn */}
      <button
        onClick={handleConfirmOrder}
        className="w-full bg-red-600 text-white font-semibold py-3 mt-4 rounded-md hover:bg-red-700 transition"
      >
        Xác nhận đơn
      </button>
    </aside>
  );
};

export default CartSummary;