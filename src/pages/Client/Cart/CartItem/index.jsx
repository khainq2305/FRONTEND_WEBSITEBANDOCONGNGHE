import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { formatCurrencyVND } from "../../../../utils/formatCurrency";
import { cartService } from "../../../../services/client/cartService";
import { toast } from "react-toastify";
import { confirmDelete as showConfirmDeleteDialog } from "../../../../components/common/ConfirmDeleteDialog";

const CartItem = ({ item, isChecked, onToggleChecked, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const isOutOfStock = item.stock <= 0;

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
            const msg = error.response?.data?.message || "Không thể xóa sản phẩm khỏi giỏ hàng.";
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
  if (isUpdating || newQty < 1) return;

  if (newQty > item.stock) {
    toast.dismiss("cart-stock-warn");
    toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`, {
      toastId: "cart-stock-warn",
      position: "top-right",
    });
    return;
  }

  try {
    setIsUpdating(true);
    const res = await cartService.updateQuantity({
      cartItemId: item.id,
      quantity: newQty,
    });

    setQuantity(newQty);

    toast.dismiss("cart-update-success");
    toast.success(res?.data?.message || "Cập nhật số lượng thành công.", {
      toastId: "cart-update-success",
      position: "top-right",
    });

    if (onQuantityChange) onQuantityChange();
  } catch (error) {
    console.error("Lỗi cập nhật số lượng:", error);
    const msg = error.response?.data?.message || "Không thể cập nhật số lượng sản phẩm.";
    toast.dismiss("cart-update-error");
    toast.warn(msg, {
      toastId: "cart-update-error",
      position: "top-right",
    });
  } finally {
    setIsUpdating(false);
  }
};


    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col ${isOutOfStock ? 'bg-gray-50' : ''}`}>
            <div className="flex items-center justify-between flex-wrap gap-2 p-3 sm:p-4">
                {/* Conditional rendering for Checkbox or "HẾT" text only */}
                {isOutOfStock ? (
                    // Hiển thị chữ "HẾT" thuần túy ở vị trí checkbox
                    <span className="text-red-600 font-bold text-sm flex-shrink-0" style={{ minWidth: '24px', textAlign: 'center' }}>
                        HẾT
                    </span>
                ) : (
                    // Checkbox bình thường
                    <div
                        className={`w-5 h-5 flex items-center justify-center rounded-sm transition border ${
                            isChecked ? "bg-primary border-primary" : "bg-white border-gray-500"
                        } cursor-pointer text-xs font-bold flex-shrink-0`}
                        onClick={async () => {
                            try {
                                await cartService.updateSelected({
                                    cartItemId: item.id,
                                    isSelected: !isChecked,
                                });
                                onToggleChecked(); // vẫn gọi để cập nhật UI
                            } catch (err) {
                                toast.error("Không thể cập nhật trạng thái chọn!", {
                                    position: "top-right",
                                });
                                console.error("Lỗi update isSelected:", err);
                            }
                        }}
                    >
                        {isChecked && <span>✓</span>}
                    </div>
                )}
                
                {/* Image */}
                <img
                    src={item.image || "https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg"}
                    alt={item.productName}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg";
                    }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded object-cover ml-3 mr-3 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
                />

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                    <h3 
                        className={`text-sm md:text-base max-w-[270px] font-medium text-gray-800 line-clamp-2 ${isOutOfStock ? 'text-gray-500 opacity-60' : ''}`}
                    >
                        {item.productName}
                    </h3>
                    {item.variantValues?.length > 0 && (
                        <div 
                            className={`text-xs text-gray-600 ${isOutOfStock ? 'text-gray-400 opacity-60' : ''}`}
                        >
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
                    <div 
                        className={`text-red-600 font-bold text-sm md:text-base ${isOutOfStock ? 'text-gray-500 line-through opacity-60' : ''}`}
                    >
                        {formatCurrencyVND(item.finalPrice)}
                    </div>
                    {item.finalPrice < item.price && (
                        <div 
                            className={`line-through text-gray-400 text-xs ${isOutOfStock ? 'text-gray-400 opacity-60' : ''}`}
                        >
                            {formatCurrencyVND(item.price)}
                        </div>
                    )}
                </div>

                {/* Quantity & Delete */}
                <div className="flex items-center justify-end gap-2">
                    {isOutOfStock ? (
                        // ✅ Đã thêm lại dòng "Hết hàng" ở đây, cạnh nút xóa
                        <div className="text-red-600 font-semibold text-sm px-4 whitespace-nowrap flex-shrink-0">
                            Hết hàng
                        </div>
                    ) : (
                        <div className="border rounded flex shadow-sm flex-shrink-0">
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
                                disabled={quantity >= item.stock || isUpdating}
                            >
                                +
                            </button>
                        </div>
                    )}
                    <button
                        className="text-gray-400 hover:text-red-600 p-1 transition"
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