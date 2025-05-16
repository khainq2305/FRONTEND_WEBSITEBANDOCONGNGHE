import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

const features = [
  {
    label: "Tính năng nổi bật",
    imageThumb:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-7.png",
    imageFull:
      "https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-7.png",
  },
  {
    imageThumb:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
    imageFull:
      "https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
  },
  {
    imageThumb:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-3.png",
    imageFull:
      "https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-3.png",
  },
  {
    imageThumb:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-4.png",
    imageFull:
      "https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-4.png",
  },
  {
    imageThumb:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-5.png",
    imageFull:
      "https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-5.png",
  },
];

export default function FeatureSlider({ onSelect }) {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView="auto"
      freeMode
      modules={[FreeMode]}
      className="py-2"
    >
      {features.map((item, index) => (
        <SwiperSlide
          key={index}
          className="!w-[70px] !h-[70px] rounded overflow-hidden border-gray-400-gray-200 cursor-pointer"
          onClick={() => onSelect?.(item.imageFull)}
        >
          <img
            src={item.imageThumb}
            alt=""
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
