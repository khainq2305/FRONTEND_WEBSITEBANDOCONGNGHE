// src/components/ProductHeaderComparison/index.jsx
import React from 'react';

// const ProductHeaderComparison = ({ products = [], onRemoveProduct, onAddProduct, sidebarWidthClass, productColumnClasses ,showOnlyDifferences,        // ✅ thêm dòng này
//   onToggleDifferences }) => {
//   const columnsToRender = [...products];
//   while (columnsToRender.length < 3) {
//     columnsToRender.push(null); 
//   }
//   }
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
// --- Kết thúc định nghĩa Component Icon ---


// --- Component Thẻ Sản Phẩm ---
const ProductCard = ({ product }) => (
  <div className="bg-white p-0 flex flex-col relative w-full flex-1 min-h-[260px] sm:min-h-[280px] border border-gray-200/70 rounded-sm shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]">
    {product.isNew && ( // Badge "Mẫu mới"
        <span className="absolute top-1.5 left-1.5 bg-gray-100 text-gray-600 text-[9px] font-medium px-1 py-[1px] rounded-sm leading-tight tracking-tighter border border-gray-200/80 z-10">
            Mẫu mới
        </span>
    )}
    <div className="absolute top-1.5 right-1.5 flex flex-col items-center text-[9px] space-y-1 w-10 text-center z-10">
      {product.topRightBadges?.map((badge, index) => ( // Sử dụng optional chaining
        <div key={index} className="flex flex-col items-center">
            <IconRenderer iconClass={badge.iconClass} />
            <span className="text-gray-500 leading-tight mt-0.5">
            {badge.text}
            </span>
        </div>
      ))}
    </div>
    <div className="h-[140px] sm:h-[150px] p-2 flex items-center justify-center border-b border-gray-200/70">
      <img
        src={product.imageUrl}
        alt={product.nameForSidebar}
        className="max-w-full max-h-full object-contain"
      />
    </div>
    <div className="p-2.5 pt-2 flex flex-col flex-grow text-left">
      <h3 className="text-[11px] sm:text-[12px] font-normal text-gray-800 leading-[1.35] h-[30px] sm:h-[32px] overflow-hidden webkit-box-2 mb-1">
        <span className="hover:text-blue-600 cursor-pointer">{product.nameInCard}</span>
      </h3>
      <div className="mt-auto">
        <div className="flex items-baseline space-x-1 mb-0.5">
          <p className="text-red-500 font-bold text-[13px] sm:text-[13.5px] leading-none">{product.currentPrice}</p>
          {product.originalPrice && (
            <>
              <p className="text-gray-400 line-through text-[10px] leading-none">{product.originalPrice}</p>
              <span className="text-red-500 font-semibold text-[10px] leading-none bg-red-100 px-[3px] py-[0.5px] rounded-sm">-{product.discountPercent}</span>
            </>
          )}
        </div>
        {product.promoText &&
            <div className="flex items-center text-gray-500 text-[10px] font-normal mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-red-500 mr-0.5 flex-shrink-0"> {/* Icon "i" */}
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0-2A5 5 0 1 0 8 3a5 5 0 0 0 0 10ZM9 5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm0 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z" clipRule="evenodd" />
                </svg>
                <span>{product.promoText}</span>
            </div>
        }
        <div className="flex items-center text-[10px] text-gray-500">
          <StarIconSolid />
          <span className="ml-0.5 mr-0.5 font-medium">{product.rating}</span>
          <span className="text-gray-300 mr-0.5">|</span>
          <span>Đã bán {product.reviewsCount}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Component Chính của File này ---
const ProductHeaderComparison = ({ products, showOnlyDifferences, onToggleDifferences, sidebarWidthClass }) => {
  return (
    <div className="flex border-b border-gray-300">
      {/* Sidebar cột nhãn */}
      <div className={`${sidebarWidthClass} flex-shrink-0 border-r border-gray-300 bg-white p-2`}>
        <span className="text-xm text-gray-700 block mb-2">So sánh sản phẩm</span>

        <div className="text-[12px] uppercase font-semibold text-gray-800 leading-snug">
          {products.map((p, idx) => (
            <span key={p.id}>
              {p.name}
              {idx < products.length - 1 && (
                <span className="mx-1 text-gray-500">
                  <br /> & <br />
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Checkbox: chỉ xem điểm khác biệt */}
        <div className="mt-2">
          <label className="flex items-center space-x-2 text-xs text-gray-700">
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

      {/* Khối Bên Phải: Chứa các Thẻ Sản Phẩm */}
      {/* Sử dụng flex flex-col trên mobile/tablet để các thẻ xếp chồng */}
      {/* Sử dụng grid grid-cols-3 trên desktop (lg) */}
      <div className="flex-grow flex flex-col lg:grid lg:grid-cols-3 lg:gap-px lg:bg-gray-300">
        {products.map((product, productIndex) => (
          <div
            key={product.id}
            // Trên mobile/tablet: mỗi thẻ một hàng, có border-b (trừ thẻ cuối)
            // Trên desktop: là một cell của grid, có border-r (trừ thẻ cuối trong grid)
            className={`p-0 bg-white 
                        ${productIndex < products.length - 1 ? 'lg:border-r lg:border-gray-300' : ''} 
                        border-b border-gray-300 lg:border-b-0 
                        ${productIndex > 0 ? 'border-t border-gray-300 lg:border-t-0' : 'lg:border-t-0'}
                        ${productIndex > 0 && productIndex < products.length && products.length > 1 && productIndex % 3 !==0 ? 'lg:border-l-0' : ''}
                        ${(products.length === 1 || products.length === 2 && productIndex === 0) ? 'lg:col-span-1' : ''}
                        ${products.length === 2 && productIndex === 1 ? 'lg:col-span-2' : ''}
                        `
                    }
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductHeaderComparison;
