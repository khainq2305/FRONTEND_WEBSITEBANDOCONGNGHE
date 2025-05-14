
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg p-4 shadow-sm mb-6 md:mb-0">
      {/* Tiêu đề */}
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
        So sánh sản phẩm
      </h2>

      {/* Danh sách tên sản phẩm */}
      <ul className="space-y-2 text-gray-700">
        <li className="text-sm md:text-base font-bold">OPPO A60 8GB/128GB</li>
        <li className="text-xs text-gray-500">&</li>
        <li className="text-sm md:text-base font-bold">realme 12 8GB/256GB</li>
        <li className="text-xs text-gray-500">&</li>
        <li className="text-sm md:text-base font-bold">OPPO A60 8GB/256GB</li>
      </ul>

      {/* Checkbox */}
      <div className="mt-6">
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox accent-blue-500 w-4 h-4" />
          <span className="text-sm md:text-base text-gray-800">Chỉ xem điểm khác biệt</span>
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
