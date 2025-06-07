// FeatureSlider.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

// Import CSS của Swiper
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

// Component Icon (giữ nguyên)
const ChevronLeftIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function FeatureSlider({ images = [], currentImage, onSelect }) {
  if (!images || images.length === 0) {
    return null;
  }

  // --- CSS classes cho nút điều hướng, đã được cập nhật ---
  const navButtonClasses = `
    absolute top-1/2 -translate-y-1/2 
    w-8 h-8 flex items-center justify-center
    bg-white/80 backdrop-blur-sm rounded-full shadow-lg cursor-pointer 
    z-10 
    hover:bg-white transition-all duration-200
    swiper-button-disabled:opacity-0 swiper-button-disabled:scale-90
  `;

  return (
    <div className="relative"> 
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        freeMode={true}
        navigation={{
          nextEl: '.image-swiper-button-next',
          prevEl: '.image-swiper-button-prev',
        }}
        modules={[FreeMode, Navigation]}
        // Bỏ padding ngang để các nút nằm đè lên ảnh một cách tự nhiên
        className="py-2" 
      >
        {images.map((item, index) => (
          <SwiperSlide
            key={index}
            className={`
              !w-[70px] !h-[70px] rounded-md overflow-hidden border-2 cursor-pointer
              transition-all duration-150 ease-in-out
              ${currentImage === item.imageFull
                ? 'border-blue-500 ring-2 ring-blue-300'
                : 'border-gray-300 hover:border-blue-400'
              }
            `}
            onClick={() => onSelect?.(item.imageFull)}
          >
            <img
              src={item.imageThumb}
              alt={item.label || `Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- CÁC NÚT ĐIỀU HƯỚNG ---
        * Vị trí đã được đổi thành 'left-2' và 'right-2' để nằm gọn bên trong.
        * Kích thước icon và nút đã được tinh chỉnh.
      */}
      <button className={`image-swiper-button-prev ${navButtonClasses} left-2`}>
         <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
      </button>
      <button className={`image-swiper-button-next ${navButtonClasses} right-2`}>
         <ChevronRightIcon className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
}