import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { cartService } from '../../../../services/client/cartService';
import { toast } from 'react-toastify';
import { confirmDelete as showConfirmDeleteDialog } from '../../../../components/common/ConfirmDeleteDialog';
import { Tooltip } from 'react-tooltip';

const CartItem = ({ item, isChecked, onToggleChecked, onQuantityChange, isLastItem }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const isOutOfStock = item.stock <= 0;
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
        position: 'top-right',
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
        position: 'top-right',
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
        position: 'top-right',
      });
      return;
    }

    if (newQty > item.stock) {
      toast.dismiss('cart-stock-warn');
      toast.warn(`Chỉ còn ${item.stock} sản phẩm trong kho.`, {
        toastId: 'cart-stock-warn',
        position: 'top-right',
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
          position: 'top-right',
        });
      }
      if (onQuantityChange) onQuantityChange();
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error);
      const msg = error.response?.data?.message || 'Không thể cập nhật số lượng sản phẩm.';
      toast.dismiss('cart-update-error');
      toast.error(msg, {
        toastId: 'cart-update-error',
        position: 'top-right',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateTotalPrice = () => {
    return item.price > 0 ? item.price * quantity : item.originalPrice * quantity;
  };

  return (
    <div className={`bg-white ${!isLastItem ? 'border-b border-gray-200' : ''} ${isOutOfStock ? 'bg-gray-50' : ''}`}>
      <div className="flex flex-col p-3 sm:hidden">
        <div className="flex items-start w-full">
          {isOutOfStock ? (
            <span className="text-red-600 font-bold text-sm flex-shrink-0 text-center pt-1 mr-3">HẾT</span>
          ) : (
            <div
              className={`w-5 h-5 mt-1 flex items-center justify-center rounded-sm transition border ${
                isChecked ? 'bg-primary border-primary text-white' : 'bg-white border-gray-500 text-transparent'
              } cursor-pointer text-xs font-bold flex-shrink-0 mr-3`}
              onClick={async () => {
                try {
                  await cartService.updateSelected({
                    cartItemId: item.id,
                    isSelected: !isChecked,
                  });
                  onToggleChecked();
                } catch (err) {
                  toast.error('Không thể cập nhật trạng thái chọn!', {
                    position: 'top-right',
                  });
                  console.error('Lỗi update isSelected:', err);
                }
              }}
            >
              {isChecked && <span>✓</span>}
            </div>
          )}
          
          <div className="flex items-start gap-3 flex-1">
            <img
              src={item.image || 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg'}
              alt={item.productName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg';
              }}
              className={`w-16 h-16 rounded object-cover flex-shrink-0 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
            />
            <div className="flex flex-col flex-1 min-w-0 space-y-1">
              <h3
                className={`text-sm font-medium text-gray-800 line-clamp-2 ${isOutOfStock ? 'text-gray-500 opacity-60' : ''}`}
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
              {isOutOfStock ? (
                <p className="text-red-600 font-semibold text-sm mt-1">Sản phẩm đã hết hàng, vui lòng chọn sản phẩm khác</p>
              ) : (
                <>
                  <div className={`text-left flex flex-col ${isOutOfStock ? 'opacity-50' : ''}`}>
                    {item.price > 0 && item.originalPrice > item.price && (
                      <p className="text-gray-400 text-xs line-through leading-none">{formatCurrencyVND(item.originalPrice)}</p>
                    )}
                    <p className="text-red-600 font-bold text-sm leading-none">{formatCurrencyVND(item.price > 0 ? item.price : item.originalPrice)}</p>
                  </div>
                  <p className="text-xs text-gray-500">Có thể bọc bằng Bookcare</p>
                </>
              )}
            </div>
        </div>
        </div>

        {!isOutOfStock && (
          <div className="flex justify-end items-center mt-2 w-full">
            <div className={`border rounded flex shadow-sm flex-shrink-0 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <button
                className="w-8 h-8 border-r border-gray-300 text-gray-400 disabled:opacity-50"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isUpdating || isOutOfStock}
              >
                −
              </button>
              <input type="text" value={quantity} readOnly className="w-10 h-8 text-center border-0 text-sm focus:outline-none" />
              <div
                data-tooltip-id="stock-limit-mobile-tooltip"
                data-tooltip-content={`Chỉ còn ${item.stock} sản phẩm trong kho.`}
                data-tooltip-hidden={!isQuantityAtStockLimit || isOutOfStock}
                className="relative"
              >
                <button
                  className="w-8 h-8 border-l border-gray-300 text-gray-600 disabled:opacity-50"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isUpdating || isOutOfStock || isQuantityAtStockLimit}
                >
                  +
                </button>
              </div>
              <Tooltip id="stock-limit-mobile-tooltip" place="top" effect="solid" />
            </div>
            <button className="text-gray-400 hover:text-red-600 p-1 transition flex-shrink-0 ml-4" onClick={handleDeleteItem} title="Xóa">
              <FiTrash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:grid sm:grid-cols-[40px_minmax(0,1fr)_140px_100px_140px_40px] sm:items-center sm:px-4 sm:gap-x-0 py-3 min-h-[100px]">
        {isOutOfStock ? (
          <span className="text-red-600 font-bold text-sm flex-shrink-0 text-center col-start-1 col-end-2">HẾT</span>
        ) : (
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-sm transition border ${
              isChecked ? 'bg-primary border-primary text-white' : 'bg-white border-gray-500 text-transparent'
            } cursor-pointer text-xs font-bold flex-shrink-0 col-start-1 col-end-2`}
            onClick={async () => {
              try {
                await cartService.updateSelected({
                  cartItemId: item.id,
                  isSelected: !isChecked,
                });
                onToggleChecked();
              } catch (err) {
                toast.error('Không thể cập nhật trạng thái chọn!', {
                  position: 'top-right',
                });
                console.error('Lỗi update isSelected:', err);
              }
            }}
          >
            {isChecked && <span>✓</span>}
          </div>
        )}

        <div className="flex items-center gap-3 w-full col-start-2 col-end-3">
          <img
            src={item.image || 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg'}
            alt={item.productName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg';
            }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded object-cover flex-shrink-0 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
          />
          <div className="flex flex-col flex-1 min-w-0 space-y-1">
            <h3
              className={`text-sm font-medium text-gray-800 line-clamp-2 ${isOutOfStock ? 'text-gray-500 opacity-60' : ''}`}
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
            {isOutOfStock && (
              <p className="text-red-600 font-semibold text-sm mt-1">Sản phẩm đã hết hàng, vui lòng chọn sản phẩm khác</p>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center h-full col-start-3 col-end-4">
          <div className={`flex flex-col items-center whitespace-nowrap ${isOutOfStock ? 'opacity-50' : ''}`}>
            {item.price > 0 && item.originalPrice > item.price && (
              <p className="text-gray-400 text-xs line-through leading-none">{formatCurrencyVND(item.originalPrice)}</p>
            )}
            <p className="text-red-600 font-bold text-sm leading-none">{formatCurrencyVND(item.price > 0 ? item.price : item.originalPrice)}</p>
          </div>
        </div>
        
        <div className="flex justify-center items-center h-full col-start-4 col-end-5">
          <div className={`border rounded flex shadow-sm flex-shrink-0 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
              className="w-8 h-8 border-r border-gray-300 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isUpdating || isOutOfStock}
            >
              −
            </button>
            <input type="text" value={quantity} readOnly className="w-10 h-8 text-center border-0 text-sm focus:outline-none" />
            <div
              data-tooltip-id="stock-limit-desktop-tooltip"
              data-tooltip-content={`Chỉ còn ${item.stock} sản phẩm trong kho.`}
              data-tooltip-hidden={!isQuantityAtStockLimit || isOutOfStock}
              className="relative"
            >
              <button
                className="w-8 h-8 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => handleQuantityChange(1)}
                disabled={isUpdating || isOutOfStock || isQuantityAtStockLimit}
              >
                +
              </button>
            </div>
            <Tooltip id="stock-limit-desktop-tooltip" place="top" effect="solid" />
          </div>
        </div>
        
        <div className="flex justify-center items-center h-full col-start-5 col-end-6">
          <div className={`font-bold text-red-600 text-sm ${isOutOfStock ? 'opacity-50' : ''}`}>
            {formatCurrencyVND(calculateTotalPrice())}
          </div>
        </div>

        <button className="hidden sm:flex w-full h-full p-1 transition-colors flex-shrink-0 items-center justify-center text-gray-400 hover:text-red-600 col-start-6 col-end-7" onClick={handleDeleteItem} title="Xóa">
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;