// src/components/Cart/CartItem.jsx

import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { formatCurrencyVND } from "../../../../utils/formatCurrency";
import { cartService } from "../../../../services/client/cartService";
import { toast } from "react-toastify";
import { confirmDelete as showConfirmDeleteDialog } from "../../../../components/common/ConfirmDeleteDialog";

const CartItem = ({ item, isChecked, onToggleChecked, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  // Khi prop item.quantity thay đổi, đồng bộ lại state quantity
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleDeleteItem = async () => {
    const isConfirmed = await showConfirmDeleteDialog(
      "xoá",
      `sản phẩm "${item.productName}" này`
    );
    if (!isConfirmed) return;

    try {
      await cartService.deleteItem(item.id);

      // Nếu đã có toast xóa thành công đang hiển thị, đóng nó trước
      if (toast.isActive("cart-delete-success")) {
        toast.dismiss("cart-delete-success");
      }
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!", {
        toastId: "cart-delete-success",
        position: "top-right",
      });

      if (onQuantityChange) onQuantityChange();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      const msg =
        error.response?.data?.message ||
        "Không thể xóa sản phẩm khỏi giỏ hàng.";

      // Nếu đã có toast lỗi xóa đang hiển thị, đóng nó trước
      if (toast.isActive("cart-delete-error")) {
        toast.dismiss("cart-delete-error");
      }
      toast.error(msg, {
        toastId: "cart-delete-error",
        position: "top-right",
      });
    }
  };

  const handleQuantityChange = async (delta) => {
    const newQty = quantity + delta;
    if (isUpdating) return;
    if (newQty < 1) return;
    if (newQty > item.stock) {
      // Nếu đã có toast warning tồn tại, đóng nó trước
      if (toast.isActive("cart-stock-warn")) {
        toast.dismiss("cart-stock-warn");
      }
      toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`, {
        toastId: "cart-stock-warn",
        position: "top-right",
      });
      return;
    }

    try {
      setIsUpdating(true);
      await cartService.updateQuantity({
        cartItemId: item.id,
        quantity: newQty,
      });

      setQuantity(newQty);

      // Nếu đã có toast cập nhật thành công đang hiển thị, đóng nó trước
      if (toast.isActive("cart-update-success")) {
        toast.dismiss("cart-update-success");
      }
      toast.success("Cập nhật số lượng thành công.", {
        toastId: "cart-update-success",
        position: "top-right",
      });

      if (onQuantityChange) onQuantityChange();
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      const msg =
        error.response?.data?.message ||
        "Không thể cập nhật số lượng sản phẩm.";

      // Nếu đã có toast lỗi cập nhật đang hiển thị, đóng nó trước
      if (toast.isActive("cart-update-error")) {
        toast.dismiss("cart-update-error");
      }
      toast.warn(msg, {
        toastId: "cart-update-error",
        position: "top-right",
      });
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
          src={
            item.image ||
            "https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg"
          }
          alt={item.productName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg";
          }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover ml-3 mr-3"
        />

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2">
            {item.productName}
          </h3>

          {/* Variant Values */}
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
            {/* Decrease button */}
            <button
              className="w-8 h-8 border-r border-gray-300 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isUpdating}
            >
              −
            </button>

            {/* Quantity input */}
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-10 h-8 text-center border-0 text-sm focus:outline-none"
            />

            {/* Increase button */}
            <button
              className="w-8 h-8 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= item.stock || isUpdating}
            >
              +
            </button>
          </div>

          {/* Delete button */}
          <button
            className="text-gray-400 hover:text-red-600 p-1 transition disabled:opacity-50"
            onClick={handleDeleteItem}
            title="Xóa"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
