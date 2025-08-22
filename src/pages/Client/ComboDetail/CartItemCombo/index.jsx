// src/pages/Client/Cart/CartItemCombo.jsx
import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import { toast } from 'react-toastify';
const ImageThumb = ({ src, className = '' }) => (
  <img
    src={src || 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg'}
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = 'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg';
    }}
    alt=""
    // className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gray-200"
    className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gray-200 ${className}`}
  />
);

export default function CartItemCombo({
  item, // { comboId, name, price, quantity, image }  (+ bạn có thể truyền imageGroup nếu muốn)
  isChecked,
  onToggleChecked,
  onQuantityChange, // (comboId, newQty)
  onRemove, // (comboId)
  isLastItem
}) {
  const getChildStock = (ch) => {
    const v = ch?.stock ?? ch?.quantity ?? ch?.availableQuantity ?? ch?.inventory ?? ch?.Sku?.stock ?? ch?.Sku?.quantity;
    return typeof v === 'number' ? v : null;
  };

  const rawTotal = item?.combo?.quantity ?? item?.totalQuantity;
  const rawSold = item?.combo?.sold ?? item?.sold ?? item?.soldInDb;
  const quotaKnown = Number.isFinite(Number(rawTotal)) && Number.isFinite(Number(rawSold));
  const remainingSlots = quotaKnown ? Math.max(0, Number(rawTotal) - Number(rawSold)) : Infinity;
  // Hết do SKU con hoặc hết suất
  // const hasChildOOS = Array.isArray(item.children)
  //   ? item.children.some((ch) => {
    const rawChildren = Array.isArray(item.children)
    ? item.children
    : Array.isArray(item.items)
    ? item.items
    : Array.isArray(item.comboSkus)
    ? item.comboSkus
    : [];

  const hasChildOOS = rawChildren.length
    ? rawChildren.some((ch) => {
        const s = getChildStock(ch);
        return s !== null && s <= 0;
      })
    : false;

  const isOutOfStock = hasChildOOS || (quotaKnown && remainingSlots <= 0);
  // Hết hàng khi BẤT KỲ SKU con nào có stock xác định và <= 0
  // const children = Array.isArray(item.children) ? item.children : [];
  const children = rawChildren;

  const guardInc = () => {
    if (isOutOfStock) return false;
    const current = Number(item.quantity || 1);
    // if (current >= remainingSlots) {
    if (Number.isFinite(remainingSlots) && current >= remainingSlots) {
      toast.dismiss('combo-quota');
      toast.warn(remainingSlots > 0 ? `Combo chỉ còn ${remainingSlots} suất. Vui lòng giảm số lượng.` : 'Combo đã hết suất.', {
        toastId: 'combo-quota',
        position: 'top-right'
      });
      return false;
    }
    return true;
  };
  // MOBILE ( < sm )
  const Mobile = () => (
    <div className="sm:hidden px-4 py-4">
      <div className="flex items-start gap-3">
        {/* <div */}
        {isOutOfStock ? (
          <span className="text-red-600 font-bold text-sm flex-shrink-0 text-center pt-1 mr-3">HẾT</span>
        ) : (
          <div
            className={`w-5 h-5 mt-1 flex items-center justify-center rounded-sm transition border 
    ${isChecked ? 'bg-primary border-primary text-white' : 'bg-white border-gray-500 text-transparent'} 
    cursor-pointer`}
            onClick={onToggleChecked}
          >
            {isChecked && <span>✓</span>}
          </div>
        )}

        <ImageThumb src={item.image} className={isOutOfStock ? 'grayscale opacity-80' : ''} />
        <div className="flex-1 min-w-0">
          {/* <p className="font-semibold text-gray-800 line-clamp-2">Combo: {item.name}</p> */}
          <p className={`font-semibold line-clamp-2 ${isOutOfStock ? 'text-gray-500 opacity-60' : 'text-gray-800'}`}>Combo: {item.name}</p>
          {/* <div className="mt-2 flex items-center justify-between"> */}
          <div className="mt-2 flex items-center justify-between">
            {isOutOfStock && <p className="text-red-600 font-semibold text-sm">Sản phẩm đã hết hàng, vui lòng chọn sản phẩm khác</p>}
            <div className="leading-tight text-right">
              <div className="text-red-600 font-semibold">{formatCurrencyVND(item.price)}</div>
              {Number(item.originalPrice) > Number(item.price) && (
                <div className="text-xs text-gray-400 line-through">{formatCurrencyVND(item.originalPrice)}</div>
              )}
            </div>{' '}
            <div className="flex items-center gap-2">
              <button
                onClick={() => !isOutOfStock && onQuantityChange(item.comboId, item.quantity - 1)}
                disabled={isOutOfStock || Number(item.quantity) <= 1}
                className="px-2 py-1 border rounded"
              >
                -
              </button>

              <input className="w-12 text-center border rounded py-1" value={item.quantity} readOnly />

              <button
                onClick={() => {
                  if (!guardInc()) return;
                  onQuantityChange(item.comboId, item.quantity + 1);
                }}
                disabled={isOutOfStock || (Number.isFinite(remainingSlots) && Number(item.quantity) >= remainingSlots)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-red-600 font-semibold">{formatCurrencyVND(item.price * item.quantity)}</p>
            <button onClick={() => onRemove(item.comboId)} className="text-gray-500 hover:text-red-600 p-1" title="Xoá">
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // DESKTOP ( >= sm ) — cột khớp CartHeader: 40 | info | 140 | 100 | 140 | 40
  const Desktop = () => (
    <div className="hidden sm:grid grid-cols-[40px_minmax(0,1fr)_140px_100px_140px_40px] items-center px-4 py-4">
      <div className="flex items-center justify-start">
        {isOutOfStock ? (
          <span className="text-red-600 font-bold text-sm">HẾT</span>
        ) : (
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-sm transition border 
         ${isChecked ? 'bg-primary border-primary text-white' : 'bg-white border-gray-500 text-transparent'} 
         cursor-pointer`}
            onClick={onToggleChecked}
          >
            {isChecked && <span>✓</span>}
          </div>
        )}
      </div>

      {/* info (ảnh + tên) */}
      <div className="flex items-center gap-3 min-w-0">
        <ImageThumb src={item.image} className={isOutOfStock ? 'grayscale opacity-80' : ''} />
        <div className="min-w-0">
          <p className={`font-semibold line-clamp-2 ${isOutOfStock ? 'text-gray-500 opacity-60' : 'text-gray-800'}`}>Combo: {item.name}</p>
          {isOutOfStock && <p className="text-red-600 font-semibold text-sm mt-1">Sản phẩm đã hết hàng, vui lòng chọn sản phẩm khác</p>}
        </div>
      </div>

      {/* đơn giá */}
      <div className="text-center leading-tight">
        <div className="text-red-600 font-semibold">{formatCurrencyVND(item.price)}</div>
        {Number(item.originalPrice ?? item.compareAtPrice) > Number(item.price) && (
          <div className="text-xs text-gray-400 line-through">{formatCurrencyVND(Number(item.originalPrice ?? item.compareAtPrice))}</div>
        )}
      </div>

      {/* số lượng */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => !isOutOfStock && onQuantityChange(item.comboId, item.quantity - 1)}
          disabled={isOutOfStock || Number(item.quantity) <= 1}
          className="px-2 py-1 border rounded"
        >
          -
        </button>
        <input className="w-12 text-center border rounded py-1" value={item.quantity} readOnly />
        <button
          onClick={() => {
            if (!guardInc()) return;
            onQuantityChange(item.comboId, item.quantity + 1);
          }}
          disabled={isOutOfStock || (Number.isFinite(remainingSlots) && Number(item.quantity) >= remainingSlots)}
          className="px-2 py-1 border rounded"
        >
          +
        </button>
      </div>

      {/* thành tiền */}
      <div className="text-center text-red-600 font-semibold">{formatCurrencyVND(item.price * item.quantity)}</div>

      {/* xoá */}
      <button
        onClick={() => onRemove(item.comboId)}
        className="text-gray-500 hover:text-red-600 p-1 flex items-center justify-center"
        title="Xoá"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className={`border-b border-gray-200 ${isLastItem ? 'last:border-b-0' : ''}`}>
      <Mobile />
      <Desktop />
    </div>
  );
}
