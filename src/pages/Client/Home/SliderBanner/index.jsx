import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { bannerService } from '../../../../services/client/bannerService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SliderBanner = () => {
  const [mainSlides, setMainSlides] = useState([]);
  const [sidebarAds, setSidebarAds] = useState([]);

  const swiperParams = {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    navigation: true,
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const [mainRes, sideRes] = await Promise.all([
          bannerService.getByType('slider-main'),
          bannerService.getByType('slider-side'),
        ]);
        setMainSlides(mainRes?.data?.data || []);
        setSidebarAds(sideRes?.data?.data || []);
      } catch (err) {
        console.error('Lỗi khi lấy banner:', err);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Slider chính */}
      <div className="w-full lg:w-3/4 rounded-lg overflow-hidden shadow-lg aspect-[984/395]">
        <Swiper {...swiperParams} className="h-full w-full">
          {mainSlides.map((item, index) => (
            <SwiperSlide key={index} className="h-full w-full">
              <img src={item.imageUrl} alt={item.title || `Slide ${index + 1}`} className="h-full w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Ads nhỏ bên phải */}
      <div className="hidden lg:flex flex-col gap-4 w-full lg:w-1/4 h-[430px]">
        {sidebarAds.slice(0, 3).map((item, index) => (
          <div key={index} className="flex-1 rounded-lg overflow-hidden shadow-lg">
            <img src={item.imageUrl} alt={item.title || `Ad ${index + 1}`} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderBanner;
