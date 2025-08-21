import React, { useState, useEffect } from 'react';
import { bannerService } from '../../../services/client/bannerService';

const PopupBanner = () => {
  const [banner, setBanner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const POPUP_DISPLAY_INTERVAL = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchPopupBanner = async () => {
      try {
        const response = await bannerService.getByType('popup-banner');
        const bannersArray = response?.data?.data || [];

        if (bannersArray.length > 0) {
          const firstBanner = bannersArray[0];
          setBanner(firstBanner);

          const lastDisplayTime = localStorage.getItem('lastPopupDisplayTime');
          const currentTime = new Date().getTime();

          if (!lastDisplayTime || (currentTime - parseInt(lastDisplayTime, 10)) > POPUP_DISPLAY_INTERVAL) {
            setIsOpen(true);
            localStorage.setItem('lastPopupDisplayTime', currentTime.toString());
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải popup banner:', error);
      }
    };
    fetchPopupBanner();
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (isOpen) {
      htmlElement.classList.add('overflow-hidden');
      bodyElement.classList.add('overflow-hidden');
    } else {
      htmlElement.classList.remove('overflow-hidden');
      bodyElement.classList.remove('overflow-hidden');
    }

    return () => {
      htmlElement.classList.remove('overflow-hidden');
      bodyElement.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    localStorage.setItem('lastPopupDisplayTime', new Date().getTime().toString());
  };

  if (!isOpen || !banner) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]" onClick={handleClose}>
      <div className="max-w-2xl w-[90%] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <div className="relative inline-block align-middle">
          <button
            onClick={handleClose}
            className="absolute top-[-3px] right-[-14px] bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-3xl z-20"
            aria-label="Đóng popup"
          >
            &times;
          </button>

          {banner.linkUrl ? (
            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
              <img src={banner.imageUrl} alt={banner.title || 'Popup Banner'} className="object-contain w-full max-h-[85vh] rounded-md" />
            </a>
          ) : (
            <img src={banner.imageUrl} alt={banner.title || 'Popup Banner'} className="object-contain w-full max-h-[85vh] rounded-md" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupBanner;