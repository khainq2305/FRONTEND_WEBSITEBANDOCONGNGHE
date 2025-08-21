
import React from 'react';

const StickyBannerItem = ({ banner }) => {
  if (!banner) return null;

  return (
    <div className="stickyi w-[100px] rounded-lg overflow-hidden shadow-lg">
      <a
        href={banner.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block group cursor-pointer"
      >
        <img
          src={banner.imageUrl}
          alt={banner.altText || 'Quảng cáo'}
          className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </a>
    </div>
  );
};

export default StickyBannerItem;
