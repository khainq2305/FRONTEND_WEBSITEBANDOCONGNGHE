import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { cartService } from '../../../../services/client/cartService';
import { toast } from 'react-toastify';
import { confirmDelete as showConfirmDeleteDialog } from '../../../../components/common/ConfirmDeleteDialog';

// Thêm thư viện tooltip nếu bạn chưa có. Ví dụ: React-tooltip.
// Nếu chưa cài, bạn có thể chạy: npm install react-tooltip
import { Tooltip } from 'react-tooltip';

const CartItem = ({ item, isChecked, onToggleChecked, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const isOutOfStock = item.stock <= 0;
  // Kiểm tra xem số lượng hiện tại đã đạt giới hạn tồn kho chưa
  const isQuantityAtStockLimit = quantity >= item.stock;

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleDeleteItem = async () => {
    const isConfirmed = await showConfirmDeleteDialog('xoá', `sản phẩm "${item.productName}" này`);
    if (!isConfirmed) return;

    try {
      await cartService.deleteItem(item.id);
      if (toast.isActive('cart-delete-success')) {
        toast.dismiss('cart-delete-success');
      }
      toast.success('Sản phẩm đã được xóa khỏi giỏ hàng!', {
        toastId: 'cart-delete-success',
        position: 'top-right'
      });
      if (onQuantityChange) onQuantityChange();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      const msg = error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng.';
      if (toast.isActive('cart-delete-error')) {
        toast.dismiss('cart-delete-error');
      }
      toast.error(msg, {
        toastId: 'cart-delete-error',
        position: 'top-right'
      });
    }
  };

  const handleQuantityChange = async (delta) => {
    const newQty = quantity + delta;
    if (isUpdating || newQty < 1) return;

    if (isOutOfStock) {
      toast.dismiss('cart-stock-warn-disabled');
      toast.warn('Sản phẩm đã hết hàng, không thể thay đổi số lượng.', {
        toastId: 'cart-stock-warn-disabled',
        position: 'top-right'
      });
      return;
    }

    if (newQty > item.stock) {
      toast.dismiss('cart-stock-warn');
      toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`, {
        toastId: 'cart-stock-warn',
        position: 'top-right'
      });
      return;
    }

    try {
      setIsUpdating(true);
      const res = await cartService.updateQuantity({
        cartItemId: item.id,
        quantity: newQty
      });

      setQuantity(newQty); // Cập nhật số lượng trên UI ngay lập tức

      const backendMessage = res?.data?.message || 'Cập nhật số lượng thành công.';
      const flashSaleWarning = res?.data?.flashNotice || '';

      toast.dismiss('cart-update-success');
      toast.dismiss('cart-update-flash-warning');
      toast.dismiss('cart-update-error');

      if (flashSaleWarning) {
        toast.info(flashSaleWarning, {
          toastId: 'cart-update-flash-warning',
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.success(backendMessage, {
          toastId: 'cart-update-success',
          position: 'top-right'
        });
      }
      if (onQuantityChange) onQuantityChange();

    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error);
      const msg = error.response?.data?.message || 'Không thể cập nhật số lượng sản phẩm.';
      toast.dismiss('cart-update-error');
      toast.error(msg, {
        toastId: 'cart-update-error',
        position: 'top-right'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col ${isOutOfStock ? 'bg-gray-50' : ''}`}>
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2 p-3 sm:flex-nowrap sm:items-center sm:p-4 sm:gap-x-4">

        {/* 1. Checkbox / HẾT HÀNG (Áp dụng cho CẢ MOBILE & DESKTOP) */}
        {isOutOfStock ? (
          <span className="text-red-600 font-bold text-sm flex-shrink-0 w-5 text-center order-1 sm:order-none">HẾT</span>
        ) : (
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-sm transition border ${
              isChecked ? 'bg-primary border-primary text-white' : 'bg-white border-gray-500 text-transparent'
            } cursor-pointer text-xs font-bold flex-shrink-0 order-1 sm:order-none`}
            onClick={async () => {
              try {
                await cartService.updateSelected({
                  cartItemId: item.id,
                  isSelected: !isChecked
                });
                onToggleChecked();
              } catch (err) {
                toast.error('Không thể cập nhật trạng thái chọn!', {
                  position: 'top-right'
                });
                console.error('Lỗi update isSelected:', err);
              }
            }}
          >
            {isChecked && <span>✓</span>}
          </div>
        )}

        {/* 2. Ảnh sản phẩm */}
        <img
          src={item.image || 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg'}
          alt={item.productName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg';
          }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0 order-2 sm:order-none ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
        />

        {/* 3. Thông tin sản phẩm (Tên, Biến thể, VÀ THÔNG BÁO HẾT HÀNG) */}
        <div className="flex flex-col flex-1 min-w-[120px] sm:min-w-0 sm:max-w-md space-y-1 order-3 sm:order-none">
          <h3
            className={`text-sm md:text-base font-medium text-gray-800 line-clamp-2 ${isOutOfStock ? 'text-gray-500 opacity-60' : ''}`}
          >
            {item.productName}
          </h3>
          {item.variantValues?.length > 0 && (
            <div className={`text-xs text-gray-600 ${isOutOfStock ? 'text-gray-400 opacity-60' : ''}`}>
              {item.variantValues.map((v, i) => (
                <div key={i}>
                  <span className="font-medium">{v.variant}:</span> {v.value}
                </div>
              ))}
            </div>
          )}

          {/* Dòng thông báo HẾT HÀNG - HIỂN THỊ KHI isOutOfStock là TRUE */}
          {isOutOfStock && (
            <p className="text-red-600 font-semibold text-sm mt-1">Sản phẩm đã hết hàng, vui lòng chọn sản phẩm khác</p>
          )}

          {/* 4. Khối giá tiền - MOBILE ONLY (luôn hiển thị, mờ/disabled nếu hết hàng) */}
         {/* MOBILE - Khối giá tiền */}
<div className={`text-left mt-1 ${isOutOfStock ? 'opacity-50' : ''} sm:hidden`}>
  {item.price > 0 && item.originalPrice > item.price && (
    <p className="text-gray-400 text-xs line-through leading-none">
      {formatCurrencyVND(item.originalPrice)}
    </p>
  )}
  <p className="text-red-600 font-bold text-sm leading-none">
    {formatCurrencyVND(item.price > 0 ? item.price : item.originalPrice)}
  </p>
</div>


          {/* 5. Cụm tăng/giảm số lượng - MOBILE ONLY (luôn hiển thị, mờ/disabled nếu hết hàng) */}
          <div className={`flex items-center justify-start mt-2 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''} sm:hidden`}> {/* Chỉ hiện trên mobile */}
            <div className="border rounded flex shadow-sm flex-shrink-0">
              <button
                className="w-8 h-8 border-r border-gray-300 text-gray-400 disabled:opacity-50"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isUpdating || isOutOfStock} // Disabled khi hết hàng
              >
                −
              </button>
              <input type="text" value={quantity} readOnly className="w-10 h-8 text-center border-0 text-sm focus:outline-none" />
              {/* Thêm wrapper div và tooltip cho nút + (MOBILE) */}
              <div
                data-tooltip-id="stock-limit-mobile-tooltip"
                data-tooltip-content={`Chỉ còn ${item.stock} sản phẩm trong kho.`}
                data-tooltip-hidden={!isQuantityAtStockLimit || isOutOfStock} // Ẩn tooltip nếu không đạt giới hạn hoặc hết hàng
                className="relative" // Thêm relative để tooltip có thể định vị
              >
                <button
                  className="w-8 h-8 border-l border-gray-300 text-gray-600 disabled:opacity-50"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isUpdating || isOutOfStock || isQuantityAtStockLimit} // Disabled khi hết hàng hoặc đạt giới hạn tồn kho
                >
                  +
                </button>
              </div>
              <Tooltip id="stock-limit-mobile-tooltip" place="top" effect="solid" />
            </div>
          </div>
        </div> {/* END Thông tin sản phẩm block */}

        {/* 6. Nút xóa (Mobile) */}
        <button className="text-gray-400 hover:text-red-600 p-1 transition flex-shrink-0 ml-auto order-4 sm:hidden" onClick={handleDeleteItem} title="Xóa">
          <FiTrash2 size={18} />
        </button>
        
        {/* 7. Phần GIÁ và SỐ LƯỢNG cho DESKTOP - LUÔN HIỂN THỊ, mờ/disabled nếu hết hàng */}
        <div className="hidden sm:flex items-center gap-x-4 sm:ml-auto sm:order-4">
            {/* Khối giá tiền cho desktop */}
        {/* DESKTOP - Khối giá tiền */}
<div className="text-right flex-shrink-0 flex flex-col justify-center">
  {item.price > 0 && item.originalPrice > item.price && (
    <p className={`text-gray-400 text-xs line-through leading-none ${isOutOfStock ? 'opacity-50' : ''}`}>
      {formatCurrencyVND(item.originalPrice)}
    </p>
  )}
  <p className={`text-red-600 font-bold text-sm md:text-base leading-none ${isOutOfStock ? 'opacity-50' : ''}`}>
    {formatCurrencyVND(item.price > 0 ? item.price : item.originalPrice)}
  </p>
</div>


            {/* Cụm tăng/giảm số lượng cho desktop */}
            <div className="flex flex-col items-center flex-shrink-0">
                <div className={`border rounded flex shadow-sm flex-shrink-0 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <button
                        className="w-8 h-8 border-r border-gray-300 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1 || isUpdating || isOutOfStock}
                    >
                        −
                    </button>
                    <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-10 h-8 text-center border-0 text-sm focus:outline-none"
                    />
                    {/* Thêm wrapper div và tooltip cho nút + (DESKTOP) */}
                    <div
                      data-tooltip-id="stock-limit-desktop-tooltip"
                      data-tooltip-content={`Chỉ còn ${item.stock} sản phẩm trong kho.`}
                      data-tooltip-hidden={!isQuantityAtStockLimit || isOutOfStock} // Ẩn tooltip nếu không đạt giới hạn hoặc hết hàng
                      className="relative" // Thêm relative để tooltip có thể định vị
                    >
                      <button
                          className="w-8 h-8 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          onClick={() => handleQuantityChange(1)}
                          disabled={isUpdating || isOutOfStock || isQuantityAtStockLimit} // Disabled khi hết hàng hoặc đạt giới hạn tồn kho
                      >
                          +
                      </button>
                    </div>
                    <Tooltip id="stock-limit-desktop-tooltip" place="top" effect="solid" />
                </div>
            </div>
        </div>
        
        {/* 8. Nút xóa (Desktop) */}
        <button className="hidden sm:block text-gray-400 hover:text-red-600 p-1 transition flex-shrink-0 sm:ml-auto sm:order-5" onClick={handleDeleteItem} title="Xóa">
            <FiTrash2 size={18} />
        </button>

      </div> {/* END Main Container */}
    </div>
  );
};

export default CartItem;