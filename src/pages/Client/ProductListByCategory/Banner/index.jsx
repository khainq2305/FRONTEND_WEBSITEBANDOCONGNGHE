// src/pages/client/ProductListByCategory/Banner.js

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Banner({ banners = [] }) {
  // Nếu không có banner thì không hiển thị gì cả
  if (banners.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: banners.length > 1, // Chỉ lặp lại nếu có nhiều hơn 1 banner
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="mt-4">
      {/* Mobile: slider */}
      <div className="block md:hidden">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner.id}>
              <a href={banner.linkUrl || '#'} target="_blank" rel="noopener noreferrer">
                <img
                  src={banner.imageUrl}
                  alt={banner.altText || banner.title}
                  className="w-full h-auto object-cover rounded"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>

      {/* Desktop: 2 cột */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {banners.map((banner) => (
          <a key={banner.id} href={banner.linkUrl || '#'} target="_blank" rel="noopener noreferrer">
            <img
              src={banner.imageUrl}
              alt={banner.altText || banner.title}
              className="w-full h-auto object-cover rounded"
            />
          </a>
        ))}
      </div>
    </div>
  );
}