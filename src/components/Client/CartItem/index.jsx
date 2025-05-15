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

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    closeDeleteModal();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-4">
      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Checkbox */}
        <div
          className={`w-5 h-5 border border-red-600 cursor-pointer flex items-center justify-center rounded-sm mt-1 md:mt-0 ${
            isChecked ? "bg-red-600" : "bg-white"
          }`}
          onClick={onToggleChecked}
        >
          {isChecked && <span className="text-white text-xs font-bold">✓</span>}
        </div>

        {/* Product Image */}
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 md:w-24 md:h-24 rounded-lg border object-cover"
        />

        {/* Product Info - Adjusted for tablet */}
        <div className="flex-1 min-w-0 md:pr-2">
          <h3 className="text-sm md:text-base font-medium text-gray-800 mb-2 line-clamp-2">
            {item.name}
          </h3>

          {/* Color Selector - Improved for tablet */}
          <div className="relative inline-block text-xs md:text-sm">
            <button
              onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
              className="border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 flex items-center gap-1 hover:bg-gray-100"
            >
              <span>Màu: {selectedColor}</span>
              <span className="text-xs">▼</span>
            </button>

            {colorDropdownOpen && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg p-2 w-max max-w-[90vw]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {colorOptions.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setColorDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${
                        color.name === selectedColor
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
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

          {/* Warranty Options - Better spacing for tablet */}
          {item.warranty && (
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs md:text-sm text-gray-600">
              <div className="flex items-center font-semibold text-red-600 mb-2 gap-2">
                <i className="fas fa-shield-alt text-sm"></i>
                <span>Chọn gói bảo hành</span>
              </div>

              <div className="space-y-2">
                {item.warrantyOptions?.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className={`w-4 h-4 border border-red-600 cursor-pointer flex items-center justify-center rounded-sm ${
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
                      <span className="break-words">{option.label}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="text-red-600 font-bold whitespace-nowrap">
                        {option.price}
                      </span>
                      <span className="line-through text-gray-400 text-xs whitespace-nowrap">
                        {option.oldPrice}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price and Quantity - Better alignment for tablet */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          {/* Price Section */}
          <div className="text-right md:text-left space-y-1">
            <div className="text-red-600 font-bold text-sm md:text-base">
              {item.price} đ
            </div>
            <div className="line-through text-gray-400 text-xs md:text-sm">
              {item.originalPrice} đ
            </div>
          </div>

          {/* Quantity Selector - Improved for tablet */}
          <div className="flex items-center justify-end md:justify-start gap-4">
            <div className="border rounded-md overflow-hidden flex">
              <button className="w-8 h-8 border-r border-gray-300 text-gray-400 hover:bg-gray-100" disabled>
                −
              </button>
              <input
                type="number"
                value={item.quantity}
                className="w-10 h-8 text-center border-0 text-sm focus:outline-none"
                readOnly
              />
              <button className="w-8 h-8 border-l border-gray-300 text-gray-600 hover:bg-gray-100">
                +
              </button>
            </div>

            {/* Delete Button - Better positioning for tablet */}
            <button
              className="text-gray-400 hover:text-red-600 p-1"
              onClick={openDeleteModal}
              title="Xóa"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white max-w-md rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-red-600"
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
              <p className="mt-2 text-lg font-medium text-gray-900">
                Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                onClick={closeDeleteModal}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-2 text-red-600 bg-transparent border border-red-600 rounded hover:bg-red-100"
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