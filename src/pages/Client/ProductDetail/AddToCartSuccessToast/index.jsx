// ===== FILE 1: AddToCartSuccessToast.jsx (Phiên bản đã tối giản) =====
//
// LÝ DO THAY ĐỔI:
// - Đã loại bỏ toàn bộ state, effect, và thẻ <style> chứa animation.
// - Component này giờ chỉ tập trung vào việc hiển thị giao diện.
// - Việc đóng toast được giao hoàn toàn cho thư viện xử lý thông qua prop `closeToast`.
//
import React from 'react';

const AddToCartSuccessToast = ({ closeToast, productName, productImage, productPrice }) => {
  return (
    <div className="max-w-xs w-full font-sans bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden">
      {/* 1. Thanh header */}
      <div className="bg-primary py-1 px-2 flex items-center justify-between">
        <p className="text-white text-sm font-semibold">
          Đã thêm vào giỏ hàng thành công!
        </p>
        <button
          onClick={closeToast} // ✅ SỬA LỖI: Gọi trực tiếp closeToast, không cần handleClose hay setTimeout
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 2. Nội dung sản phẩm */}
      <div className="p-2">
        <div className="flex items-center">
          {/* Ảnh sản phẩm */}
          <div className="w-12 h-12 flex-shrink-0 mr-2 border border-gray-200 rounded-md p-1 bg-white">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100/f0f0f0/cccccc?text=L%E1%BB%97i';
              }}
            />
          </div>

          {/* Tên và giá sản phẩm */}
          <div className="flex-grow">
            <p className="text-xs text-gray-800 leading-snug line-clamp-2">
              {productName}
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-red-600 font-semibold mt-1 text-sm inline-block cursor-pointer"
            >
              {productPrice}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartSuccessToast;