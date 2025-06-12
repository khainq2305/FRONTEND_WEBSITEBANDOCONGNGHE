// src/components/Banners/PopupBanner.js

import React, { useState, useEffect } from 'react';
import { bannerService } from '../../../services/client/bannerService'; // Điều chỉnh đường dẫn nếu cần

const PopupBanner = () => {
    const [banner, setBanner] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // useEffect để fetch dữ liệu (giữ nguyên)
    useEffect(() => {
        const fetchPopupBanner = async () => {
            try {
                const response = await bannerService.getByType('popup-banner');
                const bannersArray = response?.data?.data || [];
                if (bannersArray.length > 0) {
                    const firstBanner = bannersArray[0];
                    setBanner(firstBanner);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error('Lỗi khi tải popup banner:', error);
            }
        };
        fetchPopupBanner();
    }, []);

    // ====================================================================
    // CẬP NHẬT useEffect NÀY
    // ====================================================================
    useEffect(() => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (isOpen) {
            // Thêm class vào cả <html> và <body>
            htmlElement.classList.add('overflow-hidden');
            bodyElement.classList.add('overflow-hidden');
        } else {
            // Xóa class khỏi cả <html> và <body>
            htmlElement.classList.remove('overflow-hidden');
            bodyElement.classList.remove('overflow-hidden');
        }

        // Hàm cleanup để đảm bảo luôn trả lại trạng thái cuộn
        return () => {
            htmlElement.classList.remove('overflow-hidden');
            bodyElement.classList.remove('overflow-hidden');
        };
    }, [isOpen]); // useEffect này sẽ chạy mỗi khi state `isOpen` thay đổi

    const handleClose = (e) => {
        e.stopPropagation();
        setIsOpen(false);
    };

    if (!isOpen || !banner) {
        return null;
    }

    return (
        // Lớp phủ (overlay)
        <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]"
            onClick={() => setIsOpen(false)}
        >
            {/* Container chính */}
            <div
                className="max-w-2xl w-[90%] max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative inline-block align-middle">
                    {/* Nút đóng */}
                    <button
                        onClick={handleClose}
                        className="absolute top-[-3px] right-[-14px] bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-3xl z-20"
                        aria-label="Đóng popup"
                    >
                        &times;
                    </button>

                    {/* Hình ảnh banner */}
                    {banner.linkUrl ? (
                        <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                            <img
                                src={banner.imageUrl}
                                alt={banner.title || 'Popup Banner'}
                                className="object-contain w-full max-h-[85vh] rounded-md"
                            />
                        </a>
                    ) : (
                        <img
                            src={banner.imageUrl}
                            alt={banner.title || 'Popup Banner'}
                            className="object-contain w-full max-h-[85vh] rounded-md"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupBanner;