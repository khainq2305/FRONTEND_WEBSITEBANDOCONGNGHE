// src/components/PopupModal.jsx
import React from "react";
import { X } from "lucide-react";

const PopupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-lg p-6 w-[360px] text-center relative shadow-lg">
        {/* Nút đóng (X) */}
        <button 
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon Smember */}
        <img 
          src="https://cdn2.cellphones.com.vn/x/media/logo/logo-smember.png" 
          alt="Smember" 
          className="w-14 h-14 mx-auto mb-3" 
        />

        {/* Tiêu đề */}
        <h3 className="text-2xl font-bold text-red-600 mb-2">Smember</h3>

        {/* Nội dung */}
        <p className="text-gray-700 mb-4 text-sm">
          Vui lòng đăng nhập tài khoản Smember để<br />
          xem ưu đãi và thanh toán dễ dàng hơn.
        </p>

        {/* Nút Đăng ký và Đăng nhập */}
        <div className="flex gap-3 mt-4">
          <button 
            className="flex-1 py-2 border-2 border-red-600 text-red-600 font-semibold rounded-md hover:bg-red-50 transition"
            onClick={onClose}
          >
            Đăng ký
          </button>
          <button 
            className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            onClick={onClose}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
