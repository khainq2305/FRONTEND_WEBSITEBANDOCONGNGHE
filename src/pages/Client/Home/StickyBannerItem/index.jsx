// src/components/Banners/StickyBannerItem.js

import React from 'react';

const StickyBannerItem = ({ banner }) => {
    // Nếu không có dữ liệu banner thì không hiển thị gì cả
    if (!banner) {
        return null;
    }

    return (
        // Container chính sẽ xác định kích thước và chứa hiệu ứng
        // Thêm rounded-lg, overflow-hidden và shadow ở đây
        <div className="sticky top-24 w-[100px] rounded-lg overflow-hidden shadow-lg">
            {/* Thêm class 'group' vào thẻ <a> để nó trở thành mục tiêu hover */}
            <a href={banner.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block group cursor-pointer">
                <img
                    src={banner.imageUrl}
                    alt={banner.altText || 'Quảng cáo'}
                    // THAY ĐỔI CÁC CLASS Ở ĐÂY
                    // - Bỏ hover:opacity-90
                    // - Thêm transition-transform để tạo hiệu ứng mượt mà
                    // - Thêm group-hover:scale-110 để phóng to ảnh khi hover vào thẻ a
                    className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-100"
                />
            </a>
        </div>
    );
};

export default StickyBannerItem;