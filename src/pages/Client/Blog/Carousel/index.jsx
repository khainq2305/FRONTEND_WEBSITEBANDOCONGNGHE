import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import useInfiniteCarousel from '../useInfiniteCarousel';
import { Link } from 'react-router-dom';

const Carousel = ({ title, items, autoScroll }) => {
  const [visibleCount, setVisibleCount] = useState(4); // mặc định desktop 4

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2); // mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3); // iPad nhỏ
      } else if (window.innerWidth < 1280) {
        setVisibleCount(4); // iPad Pro
      } else {
        setVisibleCount(5); // desktop rộng
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const {
    currentIndex,
    isAnimating,
    clonedItems,
    totalCloned,
    next,
    prev,
  } = useInfiniteCarousel({ items, visibleCount, autoScroll });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 text-left">
        <h2 className="inline-block text-md md:text-2xl font-bold text-gray-800 tracking-wider border-b-4 border-primary rounded-sm">
          {title}
        </h2>
      </div>

      <div className="relative overflow-hidden">
  {/* wrapper carousel */}
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
        <div className="block group">
          <div className="relative w-full h-22 sm:h-35 overflow-hidden rounded-md shadow-sm mb-2 sm:mb-3">
            <img
              src={post.thumbnail}
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
              {post.publishAt
                ? new Date(post.publishAt).toLocaleDateString('vi-VN')
                : post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                : 'Chưa có ngày'}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </div>

  {/* Nút điều hướng đặt ở ngoài */}
  <button
    onClick={prev}
    className="absolute top-[40%] left-2 z-10 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 w-6 h-6 lg:w-10 lg:h-10 text-black transform -translate-y-1/2 flex items-center justify-center transition-colors duration-300"
  >
    ←
  </button>
  <button
    onClick={next}
    className="absolute top-[40%] right-2 z-10 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 w-6 h-6 lg:w-10 lg:h-10 text-black transform -translate-y-1/2 flex items-center justify-center transition-colors duration-300"
  >
    →
  </button>
</div>

    </div>
  );
};

export default Carousel;
