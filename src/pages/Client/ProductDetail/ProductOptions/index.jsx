import React, { useEffect } from 'react';
import { CheckCircleIcon, CubeIcon, XCircleIcon, TagIcon } from '@heroicons/react/24/solid';
import CountdownTimer from '../../Home/TwoRowMarketSlider/CountdownTimer';

import GiaoNhanhBadge from '@/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp';
import TraGopBadge from '@/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp';
import GiaTotBadge from '@/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif';
import GiaKhoBadge from '@/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif';
import ThuCuDoiMoiBadge from '@/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp';

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

const StockStatusBadge = ({ inStock }) => {
  if (inStock) {
    return (
      <div className="inline-flex items-center gap-x-1.5 bg-green-100/60 text-green-700 font-semibold text-xs px-2 py-1 rounded-full border border-green-200">
        <CubeIcon className="w-4 h-4" />
        <span>Còn Hàng Giao Nhanh</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-x-1.5 bg-gray-100 text-gray-500 font-semibold text-xs px-2 py-1 rounded-full border border-gray-200">
      <XCircleIcon className="w-4 h-4" />
      <span>Tạm hết hàng</span>
    </div>
  );
};

export default function ProductOptions({
  productName,
  rating,
  reviewCount,
  onBuyNow,
  badge,
  productOptionsData = [],
  selectedOption,
  setSelectedOption,
  onAddToCart,
  banners = []
}) {
  const renderBadge = () => {
    if (!badge) return null;
    const badgeImageMap = {
  'GIAO NHANH': GiaoNhanhBadge,
  'THU CŨ ĐỔI MỚI': ThuCuDoiMoiBadge,
  'TRẢ GÓP 0%': TraGopBadge,
  'GIÁ TỐT': GiaTotBadge,
  'GIÁ KHO': GiaKhoBadge
};

    const upperCaseBadge = badge.toUpperCase();
    let imageUrl = null;
    if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
    else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
    else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
    else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];
    else if (upperCaseBadge.includes('GIÁ KHO')) imageUrl = badgeImageMap['GIÁ KHO'];


    if (imageUrl) {
      return (
        <div className="flex justify-start items-center h-[28px]">
          <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
        </div>
      );
    }
    return null;
  };
useEffect(() => {
  console.log('📦 banners trong ProductOptions:', banners);
}, [banners]);

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
  useEffect(() => {
    if (productOptionsData.length > 0) {
      const currentlySelected = productOptionsData.find((opt) => opt.label === selectedOption);

      if (!currentlySelected || !currentlySelected.inStock) {
        const firstAvailableOption = productOptionsData.find((opt) => opt.inStock);

        if (firstAvailableOption) {
          setSelectedOption(firstAvailableOption.label);
        }
      }
    }
  }, [productOptionsData, selectedOption, setSelectedOption]);

  const areAllOptionsOutOfStock = productOptionsData.length > 0 && productOptionsData.every((opt) => !opt.inStock);

  return (
    <div
      className="p-2 rounded-lg border border-gray-200 shadow-sm space-y-4 text-gray-800 md:sticky md:top-4 h-fit"
      style={{
        background: 'linear-gradient(180deg, rgb(255,89,0), rgb(255,226,129), rgb(255,255,255))',
      }}
    >
      <div className="p-4 space-y-4 text-gray-800 bg-white rounded-lg">
   
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{productName}</h1>
          <div className="mt-2 space-y-2">
            {reviewCount > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <StarRating rating={rating} />
                <span className="font-bold text-gray-800">{parseFloat(rating).toFixed(1)}</span>
                <span className="text-gray-400">|</span>
                <a href="#reviews" className="hover:underline">
                  {reviewCount} Đánh giá
                </a>
              </div>
            )}
            <div className="flex items-center gap-x-2">
              {renderBadge()}

              {!areAllOptionsOutOfStock && <StockStatusBadge inStock={isCurrentInStock} />}
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          {current.flashSaleInfo ? (
            <div className="rounded-md bg-gradient-to-r from-yellow-300 to-yellow-400 p-4 flex justify-between items-center shadow-inner">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-base mb-1 uppercase">
                  <img src="/src/assets/Client/images/flash-sale.png" alt="🔥" className="h-6 w-6" />
                 <span className="text-white text-[16px] md:text-[18px]">Flash Sale</span>
                </div>
                <div className="text-red-700 font-extrabold text-3xl">{current.price}</div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-xs font-medium text-white">Ưu đãi kết thúc sau</p>
                <CountdownTimer expiryTimestamp={current.flashSaleInfo.endTime} />
                <p className="text-xs text-white/90">Số lượng có hạn</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-x-3">
                <p className="text-red-600 font-bold text-2xl">{current.price}</p>
                {current.originalPrice && <p className="text-base line-through text-gray-500">{current.originalPrice}</p>}
              </div>
              {discountAmount > 0 && (
                <div className="inline-flex items-center gap-x-1.5 bg-amber-100/60 text-red-600 font-semibold text-sm px-2.5 py-1 rounded-md">
                  <TagIcon className="w-4 h-4" />
                  <span>
                    Giảm {discountAmount.toLocaleString('vi-VN')}đ (-{discountPercentage}
                    %)
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-2">Chọn phiên bản:</p>
          <div className="flex flex-wrap gap-3">
            {productOptionsData.map((opt) => {
              const isSelected = selectedOption === opt.label;
              let swatch = null;

              if (opt.colorCode) {
                swatch = (
                  <div
                    className={`w-8 h-8 rounded-md border border-gray-300 ${!opt.inStock ? 'grayscale' : ''}`}
                    style={{ backgroundColor: opt.colorCode }}
                  />
                );
              } else if (opt.imageUrl) {
                swatch = (
                  <img
                    src={opt.imageUrl}
                    alt={opt.label}
                    className={`w-8 h-8 rounded-md object-cover border border-gray-300 ${!opt.inStock ? 'grayscale' : ''}`}
                  />
                );
              } else if (opt.variantImage) {
                swatch = (
                  <img
                    src={opt.variantImage}
                    alt={opt.label}
                    className={`w-8 h-8 rounded-md object-cover border border-gray-300 ${!opt.inStock ? 'grayscale' : ''}`}
                  />
                );
              } else {
                swatch = (
                  <div
                    className={`w-8 h-8 flex items-center justify-center text-xs border rounded-md bg-gray-100 font-semibold ${!opt.inStock ? 'grayscale' : ''}`}
                  >
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
                                            ${isSelected && opt.inStock ? 'border-primary bg-primary/5' : ''}
                                            ${!isSelected && opt.inStock ? 'border-gray-300 bg-white hover:border-primary' : ''}
                                            ${!opt.inStock ? 'cursor-not-allowed border-gray-300 bg-gray-50' : ''} /* Viền xám đơn sắc khi hết hàng */
                                `}
                >
                  <div className="flex-shrink-0 mr-3">{swatch}</div>
                  <div className="flex flex-col">
                    <span
                      className={`font-semibold text-sm ${isSelected && opt.inStock ? 'text-primary' : opt.inStock ? 'text-gray-800' : 'text-gray-600'}`}
                    >
                      {opt.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <div
                        className={`font-bold mt-0.5 text-xs ${isSelected && opt.inStock ? 'text-primary' : opt.inStock ? 'text-red-600' : 'text-gray-600'} ${!opt.inStock ? 'line-through' : ''}`}
                      >
                        {opt.price}
                      </div>

                      {!opt.inStock && <span className="text-gray-400 text-[10px] font-normal mt-0.5 whitespace-nowrap">(Hết hàng)</span>}
                    </div>
                  </div>

                  {isSelected && opt.inStock && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full z-30">
                      <CheckCircleIcon className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
              {banners.length > 0 && (
 <div className="w-full mb-3">
  {banners?.map((banner) => (
    <img
      key={banner.id}
      src={banner.imageUrl}
      alt={banner.title || 'Banner'}
      className="w-full rounded-sm "
      loading="lazy"
    />
  ))}
</div>

   
  )}
        <div className="space-y-2 pt-2">
          {areAllOptionsOutOfStock ? (
            <button
              disabled={true}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold text-base transition-all duration-150 flex flex-col items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>LIÊN HỆ</span>
              <span className="text-xs font-normal mt-0.5 opacity-90">Để biết thông tin về hàng về</span>
            </button>
          ) : (
            <>
              <button
                disabled={!isCurrentInStock}
                onClick={() => onBuyNow(selectedOption)}
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
            </>
          )}
        </div>

      </div>
    </div>
  );
}
