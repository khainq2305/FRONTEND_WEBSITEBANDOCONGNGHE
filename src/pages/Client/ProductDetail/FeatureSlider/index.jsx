// предположим, это FeatureSlider.js
import React from "react"; // Добавлен импорт React
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

export default function FeatureSlider({ images = [], currentImage, onSelect }) {
  if (!images || images.length === 0) {
    return null; // Не отображать, если нет изображений
  }

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView="auto" // Позволяет Swiper определять количество видимых слайдов
      freeMode={true} // Используйте true для freeMode
      modules={[FreeMode]}
      className="py-2" // Существующая стилизация
    >
      {images.map((item, index) => (
        <SwiperSlide
          key={index}
          className={`!w-[70px] !h-[70px] rounded overflow-hidden border-2 cursor-pointer transition-all duration-150 ease-in-out
                      ${currentImage === item.imageFull 
                        ? 'border-blue-500 ring-2 ring-blue-300' // Стиль для активного слайда
                        : 'border-gray-300 hover:border-gray-400' // Стиль для неактивных слайдов
                      }`}
          onClick={() => onSelect?.(item.imageFull)} // Вызвать onSelect с URL полного изображения
        >
          {/* Можно добавить item.label сюда, если он есть и нужен */}
          <img
            src={item.imageThumb} // Использовать imageThumb для отображения
            alt={item.label || `Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}