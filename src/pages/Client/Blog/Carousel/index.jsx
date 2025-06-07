import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import useInfiniteCarousel from '../useInfiniteCarousel';
import { Link } from 'react-router-dom';
const Carousel = ({ title, items, visibleCount, autoScroll }) => {
  const {
    currentIndex,
    isAnimating,
    clonedItems,
    totalCloned,
    next,
    prev,
  } = useInfiniteCarousel({ items, visibleCount, autoScroll });

  const itemWidthPercent = 100 / visibleCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-left">
        <h2 className="inline-block text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-wider pb-2 border-b-4 border-primary rounded-sm">
          {title}
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <button onClick={prev} className="absolute top-1/2 left-2 z-10 bg-red-600 w-10 h-10 text-white rounded-full">
          ←
        </button>
        <button onClick={next} className="absolute top-1/2 right-2 z-10 bg-red-600 w-10 h-10 text-white rounded-full">
          →
        </button>

        <div
          className="flex transition-transform ease-in-out"
          style={{
            width: `${(totalCloned * 100) / visibleCount}%`,
            transform: `translateX(-${(100 / totalCloned) * currentIndex}%)`,
            transitionDuration: isAnimating ? '500ms' : '0ms',
          }}
        >
          {clonedItems.map((post, index) => (
            <Link 
              to={`/tin-noi-bat/${post.slug}`}
              key={index}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / totalCloned}%` }}
            >
              <a href={post.link || '#'} className="block group">
                <div className="relative w-full h-22 sm:h-35 overflow-hidden rounded-md shadow-sm mb-2 sm:mb-3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-tight h-8 sm:h-10">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                    {post.createdAt}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
