import React, { useEffect, useRef, useState } from 'react';
import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { bannerService } from '../../../../services/client/bannerService';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './MainBannerSlider.css';

const MainBannerArrow = ({ type, onClick, className, style }) => (
  <button
    type="button"
    className={`${className} main-banner-arrow main-banner-arrow-${type}`}
    style={{ ...style }}
    onClick={onClick}
    aria-label={type === 'prev' ? "Previous Banner" : "Next Banner"}
  >
    {type === 'prev'
      ? <ChevronLeftIcon className="main-banner-arrow-icon" />
      : <ChevronRightIcon className="main-banner-arrow-icon" />
    }
  </button>
);

const MainBannerSlider = () => {
  const sliderRef = useRef(null);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getByType('slider-footer'); 
        setBanners(res?.data?.data || []);
      } catch (err) {
        console.error('Lỗi lấy banner chính:', err);
      }
    };

    fetchBanners();
  }, []);

  if (!banners.length) return null;

  const settings = {
    dots: true,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    cssEase: 'linear',
    arrows: banners.length > 1, // Mặc định hiển thị nếu có nhiều hơn 1 banner
    prevArrow: <MainBannerArrow type="prev" />,
    nextArrow: <MainBannerArrow type="next" />,
    pauseOnHover: true,
    responsive: [
        {
            breakpoint: 640, // Dưới 640px (cho mobile và các màn hình rất nhỏ)
            settings: {
                arrows: false, // Tắt mũi tên
                dots: true, // Vẫn giữ dots nếu bạn muốn
            }
        },
        // Bạn có thể thêm các breakpoints khác ở đây nếu cần tùy chỉnh further
    ]
  };

 return (
  
  <div className="main-banner-slider-wrapper group relative w-full mx-auto my-4 rounded-lg overflow-hidden max-h-[250px] sm:max-h-[350px] md:max-h-[400px]">
    <Slider {...settings} ref={sliderRef} className="main-banner-slick-slider h-full">
      {banners.map((banner) => (
        <div key={banner.id} className="banner-slide-item h-full">
          <a href={banner.linkUrl || '#'} className="block w-full h-full">
            <img
              src={banner.imageUrl}
              alt={banner.altText || banner.title || 'Banner'}
              className="w-full h-auto object-contain"
            />
          </a>
        </div>
      ))}
    </Slider>
  </div>
);

};

export default MainBannerSlider;