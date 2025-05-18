// src/components/QuickCompareSection/index.jsx
import React from 'react';

// --- Định nghĩa ChevronDownIcon trực tiếp ---
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-gray-600"> {/* Kích thước như đã thống nhất */}
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);
// --- Kết thúc định nghĩa Icon ---


const QuickCompareSection = ({ products, sidebarWidthClass, productColumnMinWidthClass }) => {
  // CELL_PADDING được dùng để đảm bảo padding nhất quán với các section khác
  const CELL_PADDING = "py-2 px-2.5"; // Giữ padding này nếu nó được dùng ở các bảng khác

  return (
    // Mỗi section sẽ có border-b riêng để ngăn cách với section tiếp theo
    // Toàn bộ khối này sẽ có border-t từ component cha hoặc section phía trên nó.
    <div className="border-b border-gray-300"> {/* Đường kẻ ngang dưới toàn bộ section này */}
      {/* Tiêu đề "SO SÁNH NHANH" */}
      {/* Tiêu đề này sẽ nằm trong một "ô" tương ứng với cột sidebar */}
      <div className={`flex items-center p-3 cursor-pointer h-[41px] ${sidebarWidthClass} border-r border-gray-300`}> {/* Thêm border-r cho ô tiêu đề */}
        <ChevronDownIcon />
        <h2 className="text-[11px] font-semibold text-gray-700 ml-1.5">
          SO SÁNH NHANH ⭐
        </h2>
      </div>

      {/* Bảng dữ liệu cho "SO SÁNH NHANH" - Sử dụng div với flex/grid để mô phỏng table row */}
      {/* Hàng dữ liệu ví dụ: "So sánh nhanh" */}
      <div className="flex border-t border-gray-300"> {/* Đường kẻ ngang trên hàng dữ liệu này */}
        {/* Ô Nhãn (Cột Sidebar) */}
        <div className={`${sidebarWidthClass} flex-shrink-0 ${CELL_PADDING} text-left font-normal whitespace-nowrap border-r border-gray-300 bg-white flex items-center`}>
            So sánh nhanh
        </div>
        {/* Các Ô Giá Trị Sản Phẩm */}
        <div className="flex-grow grid grid-cols-3"> {/* Chia 3 cột cho sản phẩm */}
            {products.map((product, productIndex) => (
            <div
                key={`quick-compare-val-${product.id}`}
                className={`${CELL_PADDING} text-center ${productColumnMinWidthClass} ${productIndex < products.length - 1 ? 'border-r border-gray-300' : ''} bg-white h-[38px] flex items-center justify-center`}
            >
                &nbsp; {/* Nội dung so sánh nhanh cho sản phẩm này hoặc để trống */}
            </div>
            ))}
        </div>
      </div>
      {/* Bạn có thể thêm các hàng dữ liệu khác cho "SO SÁNH NHANH" ở đây, theo cấu trúc div flex tương tự */}
    </div>
  );
};

export default QuickCompareSection;