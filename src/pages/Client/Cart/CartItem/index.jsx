// src/components/Client/CartItem.jsx (Hoặc đường dẫn tương ứng của bạn)
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

const CartItem = ({ item, isChecked, onToggleChecked }) => {
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(item.color);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const colorOptions = [
    { name: "Đen", image: item.image },
    { name: "Trắng", image: item.image },
    { name: "Xanh", image: item.image },
    { name: "Đỏ", image: item.image },
  ];

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = () => {
    // Trong ứng dụng thực tế, bạn sẽ gọi một hàm ở đây
    // để thực sự xóa sản phẩm khỏi state của giỏ hàng/backend.
    alert("Sản phẩm đã được xóa!");
    closeDeleteModal();
    // Ví dụ: onDeleteItem(item.id); // Giả sử có prop onDeleteItem
  };

  return (
    // Bỏ padding p-3 sm:p-4 ở div ngoài cùng này
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
      {/* Main Content Row - Thêm padding p-3 sm:p-4 vào đây */}
      <div className="flex items-center justify-between flex-wrap gap-2 p-3 sm:p-4">
        {/* Checkbox */}
        <div
          className={`w-5 h-5 cursor-pointer flex items-center justify-center rounded-sm transition border ${
            isChecked
              ? "bg-primary border-primary"
              : "bg-white border-gray-500" // Viền xám đậm khi chưa chọn
          }`}
          onClick={onToggleChecked}
        >
          {isChecked && <span className="text-white text-xs font-bold">✓</span>}
        </div>

        {/* Product Image */}
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover ml-3 mr-3" // ml-3 để tạo khoảng cách với checkbox
        />

        {/* Product Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2">
            {item.name}
          </h3>
          {/* Color Selector */}
          <div className="relative inline-block text-xs md:text-sm">
            <button
              onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
              className="border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 flex items-center gap-1 hover:bg-gray-100 transition"
            >
              <span>Màu: {selectedColor}</span>
              <span className="text-xs">▼</span>
            </button>
            {colorDropdownOpen && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow w-max max-w-[90vw] overflow-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-2">
                  {colorOptions.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setColorDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-gray-50 transition ${
                        color.name === selectedColor
                          ? "bg-primary border-primary"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span
                        className={`text-xs md:text-sm font-medium ${
                          color.name === selectedColor
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="text-red-600 font-bold text-sm md:text-base">
            {item.price} đ
          </div>
          <div className="line-through text-gray-400 text-xs">
            {item.originalPrice} đ
          </div>
        </div>

        {/* Quantity + Delete */}
        <div className="flex items-center justify-end gap-2">
          <div className="border rounded flex shadow-sm">
            <button className="w-8 h-8 border-r border-gray-300 text-gray-400 hover:bg-gray-100 disabled">
              −
            </button>
            <input
              type="number"
              value={item.quantity}
              readOnly
              className="w-10 h-8 text-center border-0 text-sm focus:outline-none"
            />
            <button className="w-8 h-8 border-l border-gray-300 text-gray-600 hover:bg-gray-100">
              +
            </button>
          </div>
          <button
            className="text-gray-400 hover:text-red-600 p-1 transition"
            onClick={openDeleteModal}
            title="Xóa"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-5 text-center shadow-lg">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.937 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Xoá sản phẩm khỏi giỏ hàng?
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 text-sm"
                onClick={closeDeleteModal}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-2 text-red-600 bg-white border border-red-600 rounded hover:bg-red-50 text-sm"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;