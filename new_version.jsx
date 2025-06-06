import React, { useEffect, useState, useCallback, useRef } from 'react';
import steam from "../../../../assets/Client/images/News/cach-vao-steam-khi-bi-chan.jpg";
import Button from '../Button'; // Giả sử component Button của bạn hoạt động tốt
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Carousel2 = ({ title }) => {
  const data = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    image: steam,
    name: "GK-Games",
    headline: `Cách vào Steam khi bị chặn - Mẹo #${i + 1}`,
    date: `10/${String(i + 1).padStart(2, '0')}/2024`
  }));

  const [visibleCount, setVisibleCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const maxIndex = data.length > visibleCount ? data.length - visibleCount : 0;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newCount;
      if (width < 640) newCount = 1;
      else if (width < 768) newCount = 2;
      else if (width < 1024) newCount = 3;
      else if (width < 1280) newCount = 4;
      else newCount = 5;
      setVisibleCount(newCount);
      const newMaxIndex = data.length > newCount ? data.length - newCount : 0;
      setCurrentIndex(prev => Math.min(prev, newMaxIndex));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data.length]);

  const nextSlideCallback = useCallback(() => {
    if (data.length <= visibleCount) return;
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : prev));
  }, [maxIndex, visibleCount, data.length]);

  const prevSlideCallback = useCallback(() => {
    if (data.length <= visibleCount) return;
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : 0));
  }, [visibleCount, data.length]);

  const handleSlideTransition = useCallback((slideFunction) => {
    if (isTransitioning || data.length <= visibleCount) return;

    const currentCanSlideNext = currentIndex < maxIndex;
    const currentCanSlidePrev = currentIndex > 0;

    if (slideFunction === nextSlideCallback && !currentCanSlideNext && data.length > visibleCount) return;
    if (slideFunction === prevSlideCallback && !currentCanSlidePrev && data.length > visibleCount) return;
    
    setIsTransitioning(true);
    slideFunction();
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, visibleCount, data.length, currentIndex, maxIndex, nextSlideCallback, prevSlideCallback]);

  useEffect(() => {
    if (isHovering || data.length <= visibleCount) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1)); 
    }, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, maxIndex, isHovering, data.length, visibleCount]);

  const canSlidePrev = currentIndex > 0 && data.length > visibleCount;
  const canSlideNext = currentIndex < maxIndex && data.length > visibleCount;

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mb-4 sm:mb-6 text-left">
        <h2 className="inline-block text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-wider pb-2 border-b-4 border-primary rounded-sm">
          {title}
        </h2>
      </div>

      <div className="relative">
        <div className="overflow-hidden"> 
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `calc(${(100 / visibleCount) * data.length}%)`, 
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {data.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0"
                style={{ width: `calc(100% / ${data.length})` }}
              >
                <div className="p-1.5 sm:p-2 w-full h-full flex flex-col">
                    <div className='w-full h-32 sm:h-40 overflow-hidden rounded-md shadow-sm mb-2 sm:mb-3 flex-shrink-0 bg-gray-100'>
                    <img
                        src={item.image}
                        alt={item.headline}
                        className="rounded w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600 group-hover:text-primary transition-colors">{item.name}</p>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-tight h-10 sm:h-12 mt-1">
                                {item.headline}
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-1.5 flex items-center self-start">
                            <FontAwesomeIcon icon={faClock} className="mr-1.5" /> 
                            {item.date}
                        </p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút điều khiển */}
        {/* Chỉ hiển thị cụm nút nếu có nhiều item hơn số lượng hiển thị */}
        {data.length > visibleCount && (
          <>
            {/* Nút Previous - Chỉ render nếu canSlidePrev là true */}
            {canSlidePrev && (
              <Button 
                icon={<FiChevronLeft size={20} className='text-gray-700' />}
                onClick={() => handleSlideTransition(prevSlideCallback)}
                disabled={isTransitioning} // Vẫn disable khi đang transition để tránh click nhanh
                className="absolute top-1/2 -translate-y-1/2 left-0 -ml-0 sm:ml-0 transform hover:scale-110 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all z-20 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Previous Slide"
              />
            )}
            
            {/* Nút Next - Chỉ render nếu canSlideNext là true */}
            {canSlideNext && (
              <Button 
                icon={<FiChevronRight size={20} className='text-gray-700' />}
                onClick={() => handleSlideTransition(nextSlideCallback)}
                disabled={isTransitioning} // Vẫn disable khi đang transition
                className="absolute top-1/2 -translate-y-1/2 right-0 -mr-0 sm:mr-0 transform hover:scale-110 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all z-20 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Next Slide"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel2;