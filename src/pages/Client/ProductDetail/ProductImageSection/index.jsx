// ProductImageSection.js
import React, { useState } from "react";
import FeatureSlider from "../FeatureSlider"; // Đảm bảo đường dẫn này chính xác

// Icons (WishlistHeartStyledIcon, ChevronLeftIcon, ChevronRightIcon - giữ nguyên)
const WishlistHeartStyledIcon = ({ isFavoritedState, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill={isFavoritedState ? "currentColor" : "white"}
    stroke="currentColor"
    strokeWidth={isFavoritedState ? "0" : "2"}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </svg>
);
const ChevronLeftIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const ChevronRightIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function ProductImageSection({
  mainImage,
  setMainImage,
  allImages = [],
  productName,
  stickyTopOffset = "md:top-6",
  infoBoxContent, // <-- Prop mới để nhận ProductInfoBox
}) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
  };

  const currentIndex = Array.isArray(allImages)
    ? allImages.findIndex(imgObj => imgObj.imageFull === mainImage)
    : -1;

  const handlePreviousImage = () => {
    if (!Array.isArray(allImages) || allImages.length <= 1 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setMainImage(allImages[prevIndex].imageFull);
  };

  const handleNextImage = () => {
    if (!Array.isArray(allImages) || allImages.length <= 1 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % allImages.length;
    setMainImage(allImages[nextIndex].imageFull);
  };

  const showArrows = Array.isArray(allImages) && allImages.length > 1;

  const arrowButtonBaseClasses = "absolute top-1/2 transform -translate-y-1/2 p-2.5 rounded-full shadow-lg focus:outline-none z-10 transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100";
  const arrowButtonDefaultAppearance = "bg-white text-gray-700";
  const arrowButtonHoverAppearance = "hover:bg-primary hover:text-white";

  return (
    // Khối div gốc của ProductImageSection, có thể không cần padding lớn ở đây nữa
    // vì ProductInfoBox sẽ có padding riêng.
    <div className={`md:sticky ${stickyTopOffset} md:z-10 `}>
      <div className="bg-white md:shadow-xl md:rounded-lg md:p-4 space-y-4"> {/* Di chuyển shadow, rounded, p-4 vào đây */}
        {/* Khối ảnh chính và các nút */}
        <div className="group w-full aspect-[4/3] border border-gray-200 rounded-lg overflow-hidden relative shadow-sm p-15"> {/* Giữ padding cho ảnh chính nếu muốn ảnh nhỏ */}
          <img
            src={mainImage}
            alt={productName || "Product image"}
            className="w-full h-full object-contain"
          />
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-3 left-3 sm:top-5 sm:left-5 p-1 text-red-600 transition-opacity duration-150 hover:opacity-80 z-20`}
            aria-label={isFavorited ? "Xóa khỏi Yêu thích" : "Thêm vào Yêu thích"}
          >
            <WishlistHeartStyledIcon isFavoritedState={isFavorited} className="w-7 h-7"/>
          </button>
          {showArrows && (
            <>
              <button
                onClick={handlePreviousImage}
                className={`${arrowButtonBaseClasses} left-3 sm:left-5 ${arrowButtonDefaultAppearance} ${arrowButtonHoverAppearance}`}
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className={`${arrowButtonBaseClasses} right-3 sm:right-5 ${arrowButtonDefaultAppearance} ${arrowButtonHoverAppearance}`}
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        
        {/* FeatureSlider */}
        {FeatureSlider && (
            <FeatureSlider
                images={allImages}
                currentImage={mainImage}
                onSelect={(imgFullUrl) => setMainImage(imgFullUrl)}
            />
        )}

        {/* Render khối thông tin sản phẩm (ProductInfoBox) nếu được truyền vào */}
        {infoBoxContent && (
          <div className="mt-4"> {/* Thêm khoảng cách với FeatureSlider nếu cần */}
            {infoBoxContent}
          </div>
        )}
      </div>
    </div>
  );
}