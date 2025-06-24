import React from 'react';
import { ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import InStockIcon from '../../../../assets/Client/images/icon-deli.webp';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

export default function ProductCard({
  id,
  slug,
  name,
  price,
  oldPrice,
  priceNum,
  oldPriceNum,
  originalPriceNum,
  discount,
  image,
  onCompare,
  badge,
  skus
}) {
  const calculateSavings = () => {
    if (!isNaN(priceNum) && !isNaN(originalPriceNum) && originalPriceNum > priceNum) {
      const diff = originalPriceNum - priceNum;
      return formatCurrencyVND(diff);
    }
    return null;
  };

  const renderBadge = () => {
    if (!badge) return <div className="mb-2 h-[28px]"></div>;

    const badgeImageMap = {
      'GIAO NHANH': '/src/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp',
      'THU CŨ ĐỔI MỚI': '/src/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp',
      'TRẢ GÓP 0%': '/src/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp',
      'GIÁ TỐT': '/src/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif'
    };

    const upperCaseBadge = badge.toUpperCase();
    let imageUrl = null;

    if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
    else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
    else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
    else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];

    return imageUrl ? (
      <div className="flex justify-start items-center mb-2 h-[28px]">
        <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
      </div>
    ) : (
      <div className="mb-2 h-[28px]"></div>
    );
  };

  const savings = calculateSavings();
  const totalStock = skus ? skus.reduce((sum, sku) => sum + (sku.stock || 0), 0) : 0;
  const isProductTotallyOutOfStock = totalStock <= 0;

  return (
    <div className="w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white p-2.5 sm:p-3 relative transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group">
      {discount && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-40">-{discount}%</div>
      )}

      <Link to={`/product/${slug}`} className="block">
        <div className="relative w-full h-[160px] sm:h-[200px] mb-2 flex items-center justify-center overflow-hidden">
          {isProductTotallyOutOfStock && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-30 rounded-lg pointer-events-none">
              <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
                Hết Hàng
              </span>
            </div>
          )}
          <img
            src={image || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'}
            alt={name}
            className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
              !isProductTotallyOutOfStock ? 'group-hover:scale-105' : 'grayscale opacity-80'
            }`}
            loading="lazy"
            style={{ zIndex: 10 }}
          />
        </div>

        {renderBadge()}

        <h3
          className={`font-medium text-xs sm:text-[13px] line-clamp-2 min-h-9 sm:min-h-[25px] leading-snug sm:leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-200 ${
            isProductTotallyOutOfStock ? 'text-gray-500' : ''
          }`}
          title={name}
        >
          {name}
        </h3>
      </Link>

      <div className="mt-auto flex flex-col flex-grow justify-end">
        <div className="product-card-price text-sm mb-1">
          {typeof priceNum === 'number' && priceNum > 0 ? (
            <>
              <span className="text-red-600 font-bold">{formatCurrencyVND(priceNum)}</span>

             
              {originalPriceNum && originalPriceNum > priceNum ? (
                <span className="text-gray-400 text-[10px] sm:text-xs line-through ml-1.5">{formatCurrencyVND(originalPriceNum)}</span>
              ) : oldPriceNum && oldPriceNum > priceNum ? (
                <span className="text-gray-400 text-[10px] sm:text-xs line-through ml-1.5">{formatCurrencyVND(oldPriceNum)}</span>
              ) : null}
            </>
          ) : (
            <span className="text-gray-500 italic">Liên hệ</span>
          )}
        </div>

        <div className="min-h-[20px] sm:min-h-[22px]">{savings && <div className="text-green-600 text-xs">Tiết kiệm {savings}</div>}</div>

        <div className="flex justify-between items-center text-[10px] sm:text-xs mb-1.5 sm:mb-2 min-h-[16px] sm:min-h-[18px]">
          <div className="min-h-[14px] sm:min-h-[16px]"></div>
          <div className="min-h-[14px] sm:min-h-[16px]"></div>
        </div>

        <div className="product-card-actions flex items-center justify-between min-h-[26px] pt-1 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onCompare) onCompare(id);
            }}
            aria-label="So sánh sản phẩm"
            className={`flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 hover:text-blue-700 transition-colors focus:outline-none p-1 rounded-md hover:bg-gray-100 ${
              isProductTotallyOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isProductTotallyOutOfStock}
          >
            <CompareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="leading-none whitespace-nowrap">So sánh</span>
          </button>

          {isProductTotallyOutOfStock ? (
            <div className="flex items-center gap-1">
              <span className="text-red-500 font-semibold text-[10px] sm:text-xs leading-none whitespace-nowrap">Hết hàng</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-green-600 font-semibold text-[10px] sm:text-xs leading-none whitespace-nowrap">Còn hàng</span>
              <img src={InStockIcon} alt="Còn hàng" className="w-4 h-4 object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
