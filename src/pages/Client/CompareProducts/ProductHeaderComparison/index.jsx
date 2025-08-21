import React from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid';

const FanSpeedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 mx-auto">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a5.25 5.25 0 0 1 0 10.5m0-10.5a5.25 5.25 0 0 0 0 10.5m0-10.5V4.5m0 15V19.5m0-15a5.25 5.25 0 0 1 5.25 5.25m-5.25-5.25a5.25 5.25 0 0 0-5.25 5.25m10.5 0a5.25 5.25 0 0 1-5.25 5.25m5.25-5.25a5.25 5.25 0 0 0-5.25 5.25M12 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z" />
  </svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 mx-auto">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const IconRenderer = ({ iconClass }) => {
  if (iconClass === 'fan-speed-icon') return <FanSpeedIcon />;
  if (iconClass === 'timer-icon') return <TimerIcon />;
  return <div className="w-4 h-4 bg-gray-200 rounded-full opacity-70 mx-auto"></div>;
};

const ProductCard = ({ product, onRemoveProduct }) => (
  <div className="bg-white p-0 flex flex-col relative w-full flex-1 min-h-[260px] sm:min-h-[280px]">
    {product.isNew && (
      <span className="absolute top-1.5 left-1.5 bg-gray-100 text-gray-600 text-[9px] font-medium px-1 py-[1px] rounded-sm leading-tight tracking-tighter border border-gray-200/80 z-10">
        Mẫu mới
      </span>
    )}
    <div className="absolute top-1.5 right-1.5 flex flex-col items-center text-[9px] space-y-1 w-10 text-center z-10">
      {product.topRightBadges?.map((badge, index) => (
        <div key={index} className="flex flex-col items-center">
          <IconRenderer iconClass={badge.iconClass} />
          <span className="text-gray-500 leading-tight mt-0.5">{badge.text}</span>
        </div>
      ))}
    </div>
    <div className="h-[160px] sm:h-[180px] p-3 flex items-center justify-center border-b border-gray-200/70 relative">
      <img
        src={product.thumbnail}
        alt={product.nameForSidebar}
        className="max-w-full max-h-full object-contain"
      />
      <button
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white/70"
        onClick={() => onRemoveProduct(product.id)}
        aria-label="Xóa sản phẩm khỏi so sánh"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div className="p-2 flex flex-col flex-grow text-left">
      <h3 className="text-[12px] sm:text-[13px] font-normal text-gray-800 leading-[1.35] h-[30px] sm:h-[32px] overflow-hidden webkit-box-2 -mb-0.5">
        <span className="hover:text-blue-600 cursor-pointer">{product.nameInCard}</span>
      </h3>
      <div className="mt-auto">
        <div className="flex items-baseline space-x-1 mb-0.5">
          <p className="text-red-500 font-bold text-[14px] sm:text-[15px] leading-none">{product.currentPrice}</p>
          {product.originalPrice && (
            <>
              <p className="text-gray-400 line-through text-[11px] leading-none">{product.originalPrice}</p>
              <span className="text-red-500 font-semibold text-[11px] leading-none bg-red-100 px-[3px] py-[0.5px] rounded-sm">
                -{product.discountPercent}
              </span>
            </>
          )}
        </div>
        {product.promoText && (
          <div className="flex items-center text-gray-500 text-[10px] font-normal mb-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-red-500 mr-0.5 flex-shrink-0">
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM9 5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm0 4a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z" clipRule="evenodd" />
            </svg>
            <span>{product.promoText}</span>
          </div>
        )}
        <div className="flex items-center text-[10px] px-0.5 text-gray-500 mt-2">
          <StarIconSolid className="w-3 h-3 text-yellow-400" />
          <span className="ml-0.5 font-medium">{product.rating}</span>
          <span className="text-gray-300 mx-0.5">|</span>
          <span>Đã bán {product.reviewsCount}</span>
        </div>
      </div>
    </div>
  </div>
);

const ProductHeaderComparison = ({
  products,
  showOnlyDifferences,
  onToggleDifferences,
  sidebarWidthClass,
  onAddProduct,
  onRemoveProduct
}) => {
  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null);
  }

  return (
    <div className="flex flex-col md:flex-row border-b border-gray-300">
      <div className={`${sidebarWidthClass} flex-shrink-0 border-r border-gray-300 bg-white p-2 md:py-4 md:px-3`}>
        <span className="text-sm md:text-base text-gray-700 block mb-2 font-semibold">So sánh sản phẩm</span>

        <div className="text-[13px] sm:text-[14px] md:text-base uppercase font-semibold text-gray-800 leading-snug">
          {products.map((p, idx) => (
            <span key={p?.id || `sidebar-empty-${idx}`}>
              {p ? (p.nameForSidebar || p.nameInCard) : ''}
              {idx < products.filter(Boolean).length - 1 && (
                <span className="mx-1 text-gray-500">
                  <br className="block sm:hidden" />
                  & <br />
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="mt-2 md:mt-4">
          <label className="flex items-center space-x-2 text-xs md:text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showOnlyDifferences}
              onChange={onToggleDifferences}
              className="w-4 h-4 rounded border-gray-300 focus:ring-0"
            />
            <span>Chỉ xem điểm khác biệt</span>
          </label>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-3 overflow-x-auto"> {/* Changed to grid-cols-3 and added overflow-x-auto */}
        {columnsToRender.map((product, productIndex) => (
          <div
            key={product?.id || `empty-${productIndex}`}
            className={`
              bg-white 
              border-b border-gray-300 md:border-b-0
              ${productIndex < columnsToRender.length - 1 ? 'border-r border-gray-300' : ''} {/* Removed sm:border-r */}
              ${productIndex > 0 ? 'border-t border-gray-300 sm:border-t-0' : ''}
              min-w-[180px] lg:min-w-0
            `} // Added min-w for smaller screens
          >
            {product ? (
              <ProductCard product={product} onRemoveProduct={onRemoveProduct} />
            ) : (
              <div
                className="flex flex-col items-center justify-center h-full text-gray-400 cursor-pointer p-4"
                onClick={() => onAddProduct(productIndex)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Thêm sản phẩm</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHeaderComparison;