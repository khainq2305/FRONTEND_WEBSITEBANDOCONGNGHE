import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const mainSlideImage1 = 'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746670662906-984x395_Main-Banner.jpg&w=1080&q=75';
const mainSlideImage2 = 'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1747024324761-984x395_Galaxy-Tab-S10-Series_Update_0605.jpg&w=1080&q=75';
const mainSlideImage3 = 'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1745480836001-984x395_Main-Banner-redmi-note-14.jpg&w=1080&q=75';

const sidebarAdImage1 = 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F4%2F15%2F1%2F1747296919684_aaa_ipad_a16_1.png&w=1080&q=75';
const sidebarAdImage2 = 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F3%2F27%2F1%2F1745771236703_banner_gaac_phaaai_1_01.png&w=1080&q=75';
const sidebarAdImage3 = 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F3%2F14%2F1%2F1744603696930_398_x_252_2x.png&w=1080&q=75';

const SliderBanner = () => {
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

  const desktopSidebarHeight = 'h-[430px]';
  const mainGap = 'gap-4';
  

  return (
    
    <div className={`flex flex-col ${mainGap} lg:flex-row `}>
    
      <div className={`w-full lg:w-2/3 rounded-lg overflow-hidden shadow-lg aspect-[984/395]`}>
        <Swiper {...swiperParams} className="h-full w-full">
          {[mainSlideImage1, mainSlideImage2, mainSlideImage3].map((src, index) => (
            <SwiperSlide key={index} className="h-full w-full">
              <img src={src} alt={`Main Slide ${index + 1}`} className="h-full w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      
      
      <div className={`hidden lg:flex flex-col ${mainGap} w-full lg:w-1/3 ${desktopSidebarHeight}`}>
        {[sidebarAdImage1, sidebarAdImage2, sidebarAdImage3].map((src, index) => (
          <div key={index} className="flex-1 rounded-lg overflow-hidden shadow-lg">
            <img src={src} alt={`Sidebar Ad ${index + 1}`} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderBanner;