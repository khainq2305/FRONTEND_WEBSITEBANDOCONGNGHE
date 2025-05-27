import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { formatCurrencyVND } from "../../../../utils/formatCurrency";
import { cartService } from "../../../../services/client/cartService";

const CartItem = ({ item, isChecked, onToggleChecked, onQuantityChange }) => {

  const [quantity, setQuantity] = useState(item.quantity);
 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const confirmDelete = () => {
    alert("Sản phẩm đã được xóa!");
    closeDeleteModal();
    // TODO: gọi onDelete nếu bạn cần cập nhật danh sách ngoài
  };

const handleQuantityChange = async (delta) => {
  const newQty = quantity + delta;
  if (newQty < 1 || isUpdating) return;

  try {
    setIsUpdating(true);
    await cartService.updateQuantity({
      cartItemId: item.id,
      quantity: newQty,
    });
    setQuantity(newQty);

    // ✅ Gọi lại hàm tổng nếu có
    if (onQuantityChange) onQuantityChange();
  } catch (error) {
    console.error("Lỗi cập nhật số lượng:", error);
    alert("Không thể cập nhật số lượng sản phẩm.");
  } finally {
    setIsUpdating(false);
  }
};


  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-2 p-3 sm:p-4">
        {/* Checkbox */}
        <div
          className={`w-5 h-5 cursor-pointer flex items-center justify-center rounded-sm transition border ${
            isChecked ? "bg-primary border-primary" : "bg-white border-gray-500"
          }`}
          onClick={onToggleChecked}
        >
          {isChecked && <span className="text-white text-xs font-bold">✓</span>}
        </div>

        {/* Image */}
      <img
  src={item.image || 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg'}
  alt={item.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg';
  }}
  className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover ml-3 mr-3"
/>


        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2">
            {item.name}
          </h3>

          {/* Color selector */}
        {/* Variant Values Display */}
{item.variantValues?.length > 0 && (
  <div className="text-xs text-gray-600">
    {item.variantValues.map((v, i) => (
      <div key={i}>
        <span className="font-medium">{v.variant}:</span> {v.value}
      </div>
    ))}
  </div>
)}

        </div>

        {/* Price */}
        <div className="text-right">
          <div className="text-red-600 font-bold text-sm md:text-base">
            {formatCurrencyVND(item.finalPrice)}
          </div>
          <div className="line-through text-gray-400 text-xs">
            {formatCurrencyVND(item.price)}
          </div>
        </div>

        {/* Quantity & Delete */}
        <div className="flex items-center justify-end gap-2">
          <div className="border rounded flex shadow-sm">
            <button
              className="w-8 h-8 border-r border-gray-300 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isUpdating}
            >
              −
            </button>
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-10 h-8 text-center border-0 text-sm focus:outline-none"
            />
            <button
              className="w-8 h-8 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(1)}
              disabled={isUpdating}
            >
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
