  import React from 'react';
  import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // From react-icons
  import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline'; // Outline icons from Heroicons
  import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'; // Solid heart icon from Heroicons
import { Link } from 'react-router-dom'; // Thêm ở đầu file
export default function ProductCard({
  id,
  slug, // ✅ THÊM DÒNG NÀY
  name,
  price,
  oldPrice,
  discount,
  image,
  rating,
  isFavorite,
  onAddToFavorites,
  onCompare,
  inStock,
  soldCount
}) {

    const renderStars = (rate) => {
      const stars = [];
      const numRating = parseFloat(rate);
      const keyId = id || Math.random().toString(36).substr(2, 9); 

      for (let i = 1; i <= 5; i++) {
        if (numRating >= i) {
          stars.push(<FaStar key={`star-${i}-${keyId}`} className="text-yellow-400 text-xs" />);
        } else if (numRating >= i - 0.5) {
          stars.push(<FaStarHalfAlt key={`half-${i}-${keyId}`} className="text-yellow-400 text-xs" />);
        } else {
          stars.push(<FaRegStar key={`empty-${i}-${keyId}`} className="text-yellow-400 text-xs" />);
        }
      }
      return stars;
    };

    const parseAndFormatPrice = (priceString) => {
      const numericString = String(priceString).replace(/\D/g, '');
      const number = parseFloat(numericString);
      if (isNaN(number)) return '';
      return number.toLocaleString('vi-VN');
    };

    const currentPriceFormatted = parseAndFormatPrice(price);
    const oldPriceFormatted = parseAndFormatPrice(oldPrice);

    const calculateSavings = () => {
      const current = parseFloat(String(price).replace(/\D/g, ''));
      const old = parseFloat(String(oldPrice).replace(/\D/g, ''));
      if (!isNaN(current) && !isNaN(old) && old > current) {
        return (old - current).toLocaleString('vi-VN');
      }
      return null;
    };

    const savings = calculateSavings();

    return (
      <div className="w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white p-2.5 sm:p-3 relative transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group">
        {discount && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
            -{discount}%
          </div>
        )}
        <Link to={`/product/${slug}`} className="block">
          <div className="relative w-full h-[160px] sm:h-[200px] mb-2 flex items-center justify-center">
            <img
              src={image}
              alt={name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <h3
            className="font-medium text-xs sm:text-[13px] line-clamp-2 min-h-9 sm:min-h-[25px] leading-snug sm:leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-200"
            title={name}
          >
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex flex-col flex-grow justify-end">
          <div className="text-sm sm:text-[15px] mb-1">
            <span className="text-red-600 font-bold">{currentPriceFormatted}₫</span>
            {oldPrice && (
              <span className="text-gray-400 text-[10px] sm:text-xs line-through ml-1.5 sm:ml-2">
                {oldPriceFormatted}₫
              </span>
            )}
          </div>
          {savings && (
            <div className="text-green-600 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">
              Tiết kiệm {savings}₫
            </div>
          )}
          <div className="flex justify-between items-center text-[10px] sm:text-xs mb-1.5 sm:mb-2 min-h-[16px] sm:min-h-[18px]">
            {rating && parseFloat(rating) > 0 ? (
              <div className="flex items-center gap-x-0.5 sm:gap-x-1 text-gray-600">
                <div className="flex items-center gap-px">{renderStars(rating)}</div>
                <span className="text-gray-500 text-[9px] sm:text-[10px]">({parseFloat(rating).toFixed(1)})</span>
              </div>
            ) : (
              <div className="min-h-[14px] sm:min-h-[16px]"></div> // Placeholder for consistent height
            )}
            {inStock && typeof soldCount === 'number' && soldCount > 0 ? (
              <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium whitespace-nowrap">
                Đã bán {soldCount > 999 ? `${(soldCount / 1000).toFixed(0)}k+` : soldCount}
              </span>
            ) : !inStock ? (
              <span className="text-red-500 text-[9.5px] sm:text-[10.5px] font-semibold whitespace-nowrap">Hết hàng</span>
            ) : (
              <span className="text-green-600 text-[9.5px] sm:text-[10.5px] font-semibold whitespace-nowrap">Mới về</span>
            )}
          </div>
          <div className="product-card-actions flex items-center justify-between min-h-[26px] pt-1 border-t border-gray-100 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onCompare) onCompare(id);
              }}
              aria-label="So sánh sản phẩm"
              className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 hover:text-blue-700 transition-colors focus:outline-none p-1 rounded-md hover:bg-gray-100"
            >
              <CompareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="leading-none whitespace-nowrap">So sánh</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onAddToFavorites) onAddToFavorites(id);
              }}
              aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              className={`flex items-center gap-1 text-[10px] sm:text-xs p-1 transition-colors focus:outline-none rounded-md hover:bg-gray-100 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
            >
              {isFavorite ? (
                <HeartSolidIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
              <span className="leading-none whitespace-nowrap">{isFavorite ? 'Đã thích' : 'Yêu thích'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }