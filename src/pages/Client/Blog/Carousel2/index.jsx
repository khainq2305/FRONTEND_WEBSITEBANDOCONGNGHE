import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import useCarouselLogic from '../useCarouselLogic';
import { Link } from 'react-router-dom';

const Carousel2 = ({ title, items = [], visibleCount = 5 }) => {
  const [count, setCount] = useState(visibleCount);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCount(1); // mobile <768px: 1 item
      else if (window.innerWidth < 1024) setCount(3); // tablet: 3 items
      else setCount(visibleCount); // desktop: mặc định
    };

    handleResize(); // chạy lần đầu
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visibleCount]);

  const { currentSlide, next, prev, resetInterval } = useCarouselLogic({
    totalSlides: items.length,
    delay: 4000
  });

  const handleNext = () => { next(); resetInterval(); };
  const handlePrev = () => { prev(); resetInterval(); };

  return (
    <div className="bg-gray-200 rounded-md shadow-md p-2 md:py-4 lg:px-0 overflow-hidden relative group">
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button icon="‹" w="40px" h="40px" className="border-r rounded-l-md bg-gray-200 opacity-70" onClick={handlePrev} />
        <Button icon="›" w="40px" h="40px" className="rounded-r-md bg-gray-200 opacity-70" onClick={handleNext} />
      </div>

      <div className="text-left">
        <div className="inline-block font-bold text-md md:text-2xl border-b-4 border-yellow-300 rounded-b-md mb-3">{title}</div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${(100 / count) * currentSlide}%)`,
              width: `${(100 / count) * items.length}%`
            }}
          >
            {items.map((item) => (
              <Link
                to={`/tin-noi-bat/${item.slug}`}
                key={item.id}
                className="flex flex-col items-center text-center rounded-md w-full flex-shrink-0 px-2"
                style={{ width: `${100 / items.length}%` }}
              >
                <div className="w-full h-[160px] overflow-hidden rounded">
                  <img src={item.thumbnail || '/default.jpg'} alt={item.title} className="rounded w-full h-full object-cover" />
                </div>
                <div className="py-3 px-4">
                  <p className="text-sm md:text-md">{item?.author?.fullName ?? 'GK-Games'}</p>
                  <h1 className="text-sm md:text-md line-clamp-2">{item.title}</h1>
                  <p className="pt-3 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faClock} /> {item.publishAt 
                      ? new Date(item.publishAt).toLocaleDateString('vi-VN') 
                      : 'Chưa có ngày'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel2;
