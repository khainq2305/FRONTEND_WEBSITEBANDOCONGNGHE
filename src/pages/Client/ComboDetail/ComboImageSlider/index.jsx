import React, { forwardRef } from 'react';
import Slider from 'react-slick';
import './ComboImageSlider.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const ArrowButton = ({ direction, onClick }) => {
  return (
    <button onClick={onClick} className={`combo-arrow slick-${direction}`} type="button">
      {direction === 'prev' ? <ChevronLeftIcon className="slick-arrow-icon text-white" /> : <ChevronRightIcon className="slick-arrow-icon text-white" />}
    </button>
  );
};

const ComboImageSlider = forwardRef(({ images = [], onImageChange }, sliderRef) => {
  if (!images.length) return null;

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <ArrowButton direction="prev" />,
    nextArrow: <ArrowButton direction="next" />,
    className: 'combo-image-slider',
    afterChange: (index) => {
      if (onImageChange) onImageChange(images[index], index); // trả cả index
    },
  };

  return (
    <div className="combo-slider-wrapper">
      <Slider ref={sliderRef} {...settings}>
        {images.map((img, idx) => (
          <div key={idx} className="combo-slide-item">
            <img src={img.imageFull} alt={`Combo image ${idx}`} className="w-full h-auto object-contain max-h-[450px] mx-auto" />
          </div>
        ))}
      </Slider>
    </div>
  );
});

export default ComboImageSlider;
