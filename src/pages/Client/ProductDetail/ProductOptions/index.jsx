// src/components/ProductDetail/ProductOptions.jsx

import React from "react";

// Icon ngọn lửa cho nhãn giảm giá
const FlameIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12.25 4.062a2.5 2.5 0 00-5 0v.063c.24.08 1.154.54 1.154 1.344 0 .5-.21 1.02-.625 1.5-.416.48-1.02.875-1.02 1.531 0 .657.604 1.057 1.02 1.531.416.48.625 1 .625 1.5 0 .805-.914 1.265-1.154 1.344V4.062a2.5 2.5 0 105 0v-.063c-.24-.08-1.154-.54-1.154-1.344 0-.5.21-1.02.625-1.5.416-.48 1.02-.875 1.02-1.531 0-.657-.604-1.057-1.02-1.531-.416-.48-.625-1-.625-1.5 0-.805.914-1.265 1.154-1.344V4.062z" clipRule="evenodd" />
  </svg>
);


export default function ProductOptions({
  productOptionsData = [],
  selectedOption,
  setSelectedOption,
  onAddToCart,
  stickyTopOffset = "md:top-11",
  banners = [], // Nhận prop banners
}) {
  // Nếu chưa có dữ liệu thì hiển thị loading
  if (!productOptionsData || productOptionsData.length === 0) {
    return <div className="text-gray-500 text-sm">Đang tải biến thể sản phẩm…</div>;
  }

  // Tìm biến thể đang được chọn
  const current = productOptionsData.find(o => o.label === selectedOption) || productOptionsData[0];
  if (!current) return null;

  // --- Tính toán giảm giá ---
  let discountAmount = 0;
  let discountPercentage = 0;
  if (current.numericOriginalPrice && current.numericPrice && current.numericOriginalPrice > current.numericPrice) {
    discountAmount = current.numericOriginalPrice - current.numericPrice;
    discountPercentage = Math.round((discountAmount / current.numericOriginalPrice) * 100);
  }
  // --- Kết thúc tính toán ---

  return (
    <div className={`bg-white p-4 rounded border border-gray-200 shadow-sm space-y-4 text-sm text-gray-800 md:sticky ${stickyTopOffset} h-fit`}>
      
      {/* Phần chọn biến thể sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {productOptionsData.map(opt => {
          const isSelected = selectedOption === opt.label;
          let swatch = null; 
          if (opt.colorCode) { swatch = ( <div className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: opt.colorCode }} /> ); } 
          else if (opt.imageUrl) { swatch = ( <img src={opt.imageUrl} alt={opt.colorLabel || opt.label} className="w-4 h-4 rounded-full object-cover border border-gray-300" /> ); } 
          else { swatch = ( <div className="w-4 h-4 flex items-center justify-center text-xs border rounded border-gray-300 bg-gray-100"> {opt.colorLabel ? opt.colorLabel.charAt(0).toUpperCase() : opt.label.charAt(0).toUpperCase()} </div> ); }

          return (
            <button key={opt.label} onClick={() => setSelectedOption(opt.label)} className={`border rounded p-2 flex flex-col items-center justify-center text-center text-xs transition-colors duration-150 ${ isSelected ? "bg-blue-50 border-primary ring-1 ring-primary" : "border-gray-200 hover:border-primary text-gray-700"}`} >
              <div className="flex items-center space-x-1 mb-1">
                {swatch}
                <span className={`font-semibold ${isSelected ? "text-primary" : "text-gray-700"}`}>
                  {opt.label}
                </span>
              </div>
              <div className={`font-bold ${isSelected ? "text-primary" : "text-red-600"}`}>
                {opt.price}
              </div>
            </button>
          );
        })}
      </div>

      {/* --- Khu vực hiển thị giá và nhãn giảm giá --- */}
      <div className="border border-gray-200 rounded p-3 space-y-2 bg-gray-50/80">
        <div className="flex justify-between items-baseline">
          <p className="text-primary font-bold text-2xl">{current.price}</p>
          {current.originalPrice && (
            <p className="text-sm line-through text-gray-500">{current.originalPrice}</p>
          )}
        </div>
        {discountAmount > 0 && (
          <div className="inline-flex items-center gap-1 bg-red-100/80 text-red-600 font-semibold text-xs px-2 py-1 rounded-md">
            <FlameIcon className="w-3.5 h-3.5" />
            <span>
              Giảm {discountAmount.toLocaleString('vi-VN')}đ (-{discountPercentage}%)
            </span>
          </div>
        )}
      </div>

      {/* --- KHỐI HIỂN THỊ BANNER --- */}
      {banners && banners.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-2">
          {banners.slice(0, 2).map((banner) => (
            <a 
              key={banner.id} 
              href={banner.linkUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block rounded overflow-hidden shadow hover:shadow-md transition-shadow"
            >
              <img 
                src={banner.imageUrl} 
                alt={banner.altText || banner.title} 
                className="w-full h-auto object-cover aspect-[200/75]"
              />
            </a>
          ))}
        </div>
      )}

      {/* --- Khu vực nút bấm --- */}
      <div className="space-y-2">
         <button className="w-full bg-primary text-white py-2.5 rounded font-semibold text-sm transition-all duration-150 hover:opacity-80 flex flex-col items-center justify-center">
          <span>
            MUA NGAY
          </span>
          <span className="text-xs font-normal mt-0.5 opacity-90">
            Giao tận nơi hoặc nhận tại cửa hàng
          </span>
        </button>
        <button onClick={() => onAddToCart(selectedOption)} className="w-full bg-white text-primary border border-primary py-2.5 rounded font-semibold text-sm">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}