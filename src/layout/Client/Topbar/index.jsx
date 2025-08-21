import React, { useEffect, useState } from 'react';
import { bannerService } from '../../../services/client/bannerService';

const Topbar = () => {
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  useEffect(() => {
    const fetchTopbarBanner = async () => {
      try {
        const res = await bannerService.getByType('topbar');
        const banners = res?.data?.data || [];
        if (banners.length > 0) {
          setBannerImageUrl(banners[0].imageUrl);
        }
      } catch (err) {
        console.error('Lỗi khi lấy banner topbar:', err);
      }
    };

    fetchTopbarBanner();
  }, []);

  if (!bannerImageUrl) return null; 

  return (
    <div 
      // style={{ backgroundColor: 'rgb(58, 140, 239)' }} 
      className="w-full flex justify-center items-center overflow-hidden relative"
    >
      <img
        src={bannerImageUrl}
        alt="Topbar Banner"
        className="w-full object-cover h-[44px] sm:h-[60px] md:h-[80px] lg:h-[44px] xl:h-[44px] transition-all duration-300 ease-in-out"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '100%',
        }}
      />
    </div>
  );
};

export default Topbar;
