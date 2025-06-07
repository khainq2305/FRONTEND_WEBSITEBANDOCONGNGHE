import React, { useEffect, useState } from 'react';
import { bannerService } from '../../../../services/client/bannerService';

const PromoGridSection = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchMidPosters = async () => {
      try {
        const res = await bannerService.getByType('mid-poster'); // hoặc 'mid' tùy bạn set trong DB
        setBanners(res?.data?.data || []);
      } catch (err) {
        console.error('Lỗi khi lấy banner giữa:', err);
      }
    };

    fetchMidPosters();
  }, []);

  return (
    <div className="max-w-screen-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.linkUrl || '#'}
            className="relative block rounded-lg overflow-hidden group"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title || 'Banner'}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default PromoGridSection;
