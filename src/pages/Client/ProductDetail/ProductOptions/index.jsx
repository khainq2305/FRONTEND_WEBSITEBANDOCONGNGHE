import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const StarRating = ({ rating, totalStars = 5 }) => (
  <div className="flex items-center">
    {[...Array(totalStars)].map((_, index) => {
      const numRating = parseFloat(rating);
      const starKey = `star-${index}`;
      if (numRating >= index + 1) {
        return (
          <svg key={starKey} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
      return (
        <svg key={starKey} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    })}
  </div>
);

export default function ProductOptions({
  productName,
  rating,
  reviewCount,
  productOptionsData = [],
  selectedOption,
  setSelectedOption,
  onAddToCart,
  banners = []
}) {
  if (!productOptionsData || productOptionsData.length === 0) {
    return <div className="text-gray-500 text-sm">Đang tải...</div>;
  }

  const current = productOptionsData.find((o) => o.label === selectedOption) || productOptionsData[0];
  if (!current) return null;

  const isCurrentInStock = current.inStock;

  let discountAmount = 0;
  let discountPercentage = 0;
  if (current.numericOriginalPrice && current.numericPrice && current.numericOriginalPrice > current.numericPrice) {
    discountAmount = current.numericOriginalPrice - current.numericPrice;
    discountPercentage = Math.round((discountAmount / current.numericOriginalPrice) * 100);
  }

  return (
    <div
      className={`p-4 rounded-lg border border-gray-200 shadow-sm space-y-4 text-gray-800 md:sticky md:top-4 h-fit bg-gradient-to-b from-white via-white to-amber-50/20`}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{productName}</h1>
        {reviewCount > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
            <StarRating rating={rating} />
            <span>({reviewCount} đánh giá)</span>
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-lg bg-gray-100 p-4">
        <div className="flex items-baseline gap-x-3">
          <p className="text-red-600 font-bold text-3xl">{current.price}</p>
          {current.originalPrice && <p className="text-lg line-through text-gray-500">{current.originalPrice}</p>}
        </div>
        {discountAmount > 0 && (
          <div className="inline-block bg-red-100 text-red-700 font-bold text-sm px-2.5 py-1 rounded-md">
            <span>
              Giảm {discountAmount.toLocaleString('vi-VN')}đ (-{discountPercentage}%)
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="font-semibold text-gray-700 mb-2">Chọn phiên bản:</p>
        <div className="flex flex-wrap gap-3">
          {productOptionsData.map((opt) => {
            const isSelected = selectedOption === opt.label;

            let swatch = null;
            if (opt.colorCode) {
              swatch = <div className="w-8 h-8 rounded-md border border-gray-300" style={{ backgroundColor: opt.colorCode }} />;
            } else if (opt.imageUrl) {
              swatch = <img src={opt.imageUrl} alt={opt.label} className="w-8 h-8 rounded-md object-cover border border-gray-300" />;
            } else if (opt.variantImage) {
              swatch = <img src={opt.variantImage} alt={opt.label} className="w-8 h-8 rounded-md object-cover border border-gray-300" />;
            } else {
              swatch = (
                <div className="w-8 h-8 flex items-center justify-center text-xs border rounded-md bg-gray-100 font-semibold">
                  {opt.label.charAt(0).toUpperCase()}
                </div>
              );
            }

            return (
              <button
                key={opt.label}
                onClick={() => setSelectedOption(opt.label)}
                disabled={!opt.inStock}
              
                className={`rounded-lg px-3 py-2 flex flex-row items-center text-left transition-all duration-150 relative border-2
                                ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'} 
                                ${!opt.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
              >
                <div className="flex-shrink-0 mr-3">{swatch}</div>

                <div className="flex flex-col">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-gray-800'}`}>{opt.label}</span>
                  <div className={`font-bold mt-0.5 text-xs ${isSelected ? 'text-primary' : 'text-red-600'}`}>{opt.price}</div>
                </div>

                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full">
                    <CheckCircleIcon className="w-5 h-5 text-primary" />
                  </div>
                )}
                {!opt.inStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                    <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-0.5 rounded-full">Hết hàng</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>


      <div className="space-y-2 pt-2">
        <button
          disabled={!isCurrentInStock}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-base transition-all duration-150 flex flex-col items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span>{isCurrentInStock ? 'MUA NGAY' : 'Sản phẩm đã hết hàng'}</span>
          {isCurrentInStock && <span className="text-xs font-normal mt-0.5 opacity-90">Giao hàng tận nơi</span>}
        </button>
        <button
          onClick={() => onAddToCart(selectedOption)}
          disabled={!isCurrentInStock}
          className="hover:opacity-90 w-full bg-primary text-white hover:bg-secondary font-semibold text-base py-2 rounded-lg transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed flex flex-col items-center justify-center"
        >
          <span>Thêm vào giỏ hàng</span>

          {isCurrentInStock && <span className="text-xs font-normal mt-0.5 opacity-90">Xem lại và thanh toán sau</span>}
        </button>
      </div>
    </div>
  );
}
