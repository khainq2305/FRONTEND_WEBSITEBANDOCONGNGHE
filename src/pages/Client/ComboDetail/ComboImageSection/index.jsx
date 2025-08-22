import React, { useState, useRef } from 'react';
import ComboImageSlider from '../ComboImageSlider';
import PopupModal from '@/layout/Client/Header/PopupModal';

const ComboImageSection = ({
  comboId,
  comboName,
  mainImage,
  setMainImage,
  allImages = [],
  stickyTopOffset = 'xl:top-6',
  infoBoxContent
}) => {
  const [activeLabel, setActiveLabel] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const handleChange = (item, idx) => {
    setActiveIndex(idx);
    setMainImage(item.imageFull);
    setActiveLabel(item.isMain ? '' : item.label || '');
  };

  return (
    <>
      <div className={`relative xl:sticky ${stickyTopOffset} xl:z-10 min-w-0`}>
        <div className="bg-white md:shadow-xl md:rounded-lg md:p-4 space-y-4">
          {/* Slider */}
          <div className="relative">
            <ComboImageSlider ref={sliderRef} images={allImages} onImageChange={(item, idx) => handleChange(item, idx)} />
          </div>

          {/* Nhãn động + Thumbnails */}
          {Boolean(allImages?.length) && (
            <div className="px-4">
              {activeLabel && (
                <div className="px-4 mt-2">
                  <div className="text-sm font-medium text-gray-800">{activeLabel}</div>
                </div>
              )}

              <div className="flex gap-2 overflow-x-auto py-2">
                {allImages.map((img, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sliderRef.current?.slickGoTo(idx);
                        handleChange(img, idx);
                      }}
                      className={[
                        'w-14 h-14 rounded-md overflow-hidden border bg-white transition-colors duration-150',
                        isActive ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
                      ].join(' ')}
                      title={img.label || comboName}
                    >
                      <img src={img.imageFull} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {infoBoxContent && <div className="mt-4">{infoBoxContent}</div>}
        </div>

        <PopupModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    </>
  );
};

export default ComboImageSection;
