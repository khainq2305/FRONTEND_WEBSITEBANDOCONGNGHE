// MainBannerSlider.js
import React, { useRef } from 'react';
import Slider from "react-slick";

// Import CSS cơ bản của Slick (BẮT BUỘC)
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Import file CSS riêng cho component này (nếu cần style phức tạp cho nút)
import './MainBannerSlider.css'; 

// Icons cho nút (ví dụ dùng Heroicons)
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Dữ liệu mẫu cho Main Banner (bạn sẽ thay bằng dữ liệu từ backend hoặc props)
const mainBannerItems = [
  { id: 'main_banner_1', imageUrl: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F3%2F8%2F1%2F1744110121412_form_banner_615x104_3.jpg&w=1080&q=75', link: '#', altText: 'Galaxy S24 Series Banner' },
  { id: 'main_banner_2', imageUrl: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F3%2F2%2F1%2F1743567856200_main_615x104.jpg&w=1080&q=75', link: '#', altText: 'Fold Flip 6 Banner' },
  { id: 'main_banner_3', imageUrl: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F4%2F9%2F1%2F1746775614977_z6581089627250_c3a4d4b128965dcde66d35ba04bf001f.jpg&w=1080&q=75', link: '#', altText: 'Watch Series 9 Banner' },
  // Thêm các banner khác nếu có
];

// Component CustomArrow cho Main Banner
const MainBannerArrow = (props) => {
    const { type, onClick, className, style } = props;
    // className sẽ chứa các class mặc định của slick như slick-arrow, slick-prev, slick-next, slick-disabled
    // style sẽ chứa các style inline từ slick (ví dụ display: 'block')
    return (
      <button
        type="button"
        className={`${className} main-banner-arrow main-banner-arrow-${type}`} // Thêm class tùy chỉnh
        style={{ ...style }} // Giữ lại style từ Slick
        onClick={onClick}
        aria-label={type === 'prev' ? "Previous Banner" : "Next Banner"}
      >
        {type === 'prev' ? <ChevronLeftIcon className="main-banner-arrow-icon" /> : <ChevronRightIcon className="main-banner-arrow-icon" />}
      </button>
    );
};

const MainBannerSlider = ({ banners = mainBannerItems }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true, // Bật dots ở dưới (giống ảnh của bạn thường có)
    infinite: banners.length > 1,
    speed: 500, // Tốc độ chuyển slide
    slidesToShow: 1, // Luôn chỉ hiển thị 1 banner chính
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000, // Thời gian tự động chuyển slide
    fade: true, // Hiệu ứng mờ dần khi chuyển slide
    cssEase: 'linear',
    arrows: banners.length > 1, // Chỉ hiển thị nút nếu có nhiều hơn 1 banner
    prevArrow: <MainBannerArrow type="prev" />,
    nextArrow: <MainBannerArrow type="next" />,
    pauseOnHover: true,
  };

  if (!banners || banners.length === 0) {
    return null; // Hoặc một placeholder nếu không có banner
  }

  return (
    // Container ngoài cùng cho slider, thêm class 'group' để có thể style nút khi hover vào container
    <div className="main-banner-slider-wrapper group relative w-full mx-auto my-4"> {/* Ví dụ: my-4 để có margin trên dưới */}
      <Slider {...settings} ref={sliderRef} className="main-banner-slick-slider">
        {banners.map((banner) => (
          <div key={banner.id} className="banner-slide-item">
            <a href={banner.link || '#'} className="block w-full h-full">
              <img 
                src={banner.imageUrl} 
                alt={banner.altText} 
                className="w-full h-auto object-cover" // object-cover để ảnh lấp đầy, có thể bị cắt nếu tỷ lệ không khớp
                                                      // Hoặc object-contain nếu muốn thấy toàn bộ ảnh (có thể có khoảng trống)
                // Bạn có thể cần đặt chiều cao cố định hoặc tỷ lệ khung hình cho banner ở đây hoặc trong CSS
                // Ví dụ: style={{ aspectRatio: '984 / 395' }} nếu bạn muốn giữ tỷ lệ này
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MainBannerSlider;