// src/components/Client/CartItem.jsx
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

const CartItem = ({ item, isChecked, onToggleChecked }) => {
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(item.color);
  const [selectedWarrantyOptions, setSelectedWarrantyOptions] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const colorOptions = [
    { name: "Đen", image: item.image },
    { name: "Trắng", image: item.image },
    { name: "Xanh", image: item.image },
    { name: "Đỏ", image: item.image },
  ];

  const toggleWarrantyOption = (label) => {
    setSelectedWarrantyOptions((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = () => {
    alert("Sản phẩm đã được xóa!");
    closeDeleteModal();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
      {/* Main Content Row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Checkbox */}
        <div
          className="w-5 h-5 border border-red-600 cursor-pointer flex items-center m-2 justify-center rounded-sm transition"
          style={{ backgroundColor: isChecked ? "#DC2626" : "white" }}
          onClick={onToggleChecked}
        >
          {isChecked && <span className="text-white text-xs font-bold">✓</span>}
        </div>

        {/* Product Image */}
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover mr-3"
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
                        color.name === selectedColor ? "border-red-500 bg-red-50" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs md:text-sm text-gray-700 font-medium">
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
          <div className="text-red-600 font-bold text-sm md:text-base">{item.price} đ</div>
          <div className="line-through text-gray-400 text-xs">{item.originalPrice} đ</div>
        </div>

        {/* Quantity + Delete */}
        <div className="flex items-center justify-end gap-2 ml-2 mt-2 sm:mt-0">
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

      {/* Warranty Options */}
      {item.warranty && (
        <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-2 sm:p-3 space-y-2">
          <div className="flex items-center font-semibold text-red-600 text-sm gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-red-600"
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
            <span>Chọn gói bảo hành</span>
          </div>

          {item.warrantyOptions?.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 border border-red-600 flex items-center justify-center rounded-sm cursor-pointer transition ${
                    selectedWarrantyOptions.includes(option.label)
                      ? "bg-red-600"
                      : "bg-white"
                  }`}
                  onClick={() => toggleWarrantyOption(option.label)}
                >
                  {selectedWarrantyOptions.includes(option.label) && (
                    <span className="text-white text-[10px] font-bold">✓</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm">{option.label}</span>
              </div>
              <div className="text-right ml-2">
                <div className="text-red-600 font-semibold text-xs sm:text-sm">
                  {option.price}
                </div>
                <div className="text-xs text-gray-400 line-through">{option.oldPrice}</div>
              </div>
            </label>
          ))}
        </div>
      )}

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