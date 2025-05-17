import React, { useEffect, useState, useCallback, useRef } from 'react';
import samsumg from "../../../../assets/Client/images/News/dung-luong-pin-z-fold-7-1-350x250.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const postsData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: i % 3 === 0 ? `Samsung Galaxy S25 FE: Exynos 2400e và nhiều cải tiến #${i + 1}` : `Ốp lưng Galaxy S25 Edge chính thức #${i + 1}`,
  date: "15/05/2025",
  image: samsumg,
  link: `/news/post-slug-${i + 1}`
}));

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayRef = useRef(null);

  // Tính toán maxIndex dựa trên postsData.length và visibleCount
  // maxIndex là chỉ số cuối cùng mà slide có thể bắt đầu để hiển thị đủ visibleCount items
  const maxIndex = postsData.length > visibleCount ? postsData.length - visibleCount : 0;

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
      const newMaxIndex = postsData.length > newCount ? postsData.length - newCount : 0;
      setCurrentIndex(prev => Math.min(prev, newMaxIndex));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [postsData.length]);

  // Cập nhật logic slide: không quay vòng
  const nextSlideCallback = useCallback(() => {
    if (postsData.length <= visibleCount) return;
    // Chỉ tăng currentIndex nếu chưa phải là slide cuối cùng có thể hiển thị
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : prev));
  }, [maxIndex, visibleCount, postsData.length]);

  const prevSlideCallback = useCallback(() => {
    if (postsData.length <= visibleCount) return;
    // Chỉ giảm currentIndex nếu chưa phải là slide đầu tiên
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : 0));
  }, [visibleCount, postsData.length]); // Bỏ maxIndex vì chỉ cần kiểm tra prev > 0

  const handleSlideTransition = useCallback((slideFunction) => {
    if (isTransitioning || postsData.length <= visibleCount) return;
    
    // Kiểm tra trước khi gọi slideFunction để không setIsTransitioning nếu không slide
    const currentCanSlideNext = currentIndex < maxIndex;
    const currentCanSlidePrev = currentIndex > 0;

    if (slideFunction === nextSlideCallback && !currentCanSlideNext) return;
    if (slideFunction === prevSlideCallback && !currentCanSlidePrev) return;

    setIsTransitioning(true);
    slideFunction();
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); 
  }, [isTransitioning, visibleCount, postsData.length, currentIndex, maxIndex, nextSlideCallback, prevSlideCallback]);


  useEffect(() => {
    if (postsData.length <= visibleCount || isHovering) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }
    autoPlayRef.current = setInterval(() => {
      // Nếu đang ở slide cuối, dừng autoPlay hoặc quay về đầu (tuỳ chọn)
      // Hiện tại, nếu nextSlideCallback không làm gì (do ở cuối), autoPlay sẽ không đổi slide
      if (currentIndex >= maxIndex && postsData.length > visibleCount) {
        // Tùy chọn: Dừng autoPlay khi đến cuối
        // clearInterval(autoPlayRef.current); 
        // Hoặc quay về đầu (nếu muốn autoplay lặp lại)
         setCurrentIndex(0); 
      } else {
        nextSlideCallback();
      }
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [visibleCount, currentIndex, isHovering, nextSlideCallback, postsData.length, maxIndex]);

  const canSlidePrev = currentIndex > 0 && postsData.length > visibleCount;
  const canSlideNext = currentIndex < maxIndex && postsData.length > visibleCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div 
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="mb-4 sm:mb-6 text-left">
          <h2 className="inline-block text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-wider pb-2 border-b-4 border-primary rounded-sm">
            TIN TỨC SAMSUNG
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `calc(${(100 / visibleCount) * postsData.length}%)`, 
                transform: `translateX(-${currentIndex * (100 / postsData.length)}%)`,
              }}
            >
              {postsData.map((post) => (
                <div
                  key={post.id}
                  className="flex-shrink-0 px-1.5 sm:px-2"
                  style={{ 
                    width: `calc(100% / ${postsData.length})` 
                  }}
                >
                  <a href={post.link} className="block group">
                    <div className="relative w-full h-32 sm:h-40 overflow-hidden rounded-md shadow-sm mb-2 sm:mb-3">
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
                      <p className="text-xs text-gray-500 mt-1 sm:mt-1.5 flex items-center">
                        <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                        {post.date}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {postsData.length > visibleCount && (
            <>
          
              <button
                onClick={() => handleSlideTransition(prevSlideCallback)}
                disabled={!canSlidePrev || isTransitioning}
                className={`absolute top-1/2 -translate-y-1/2 left-0 -ml-1 sm:ml-0 transform hover:scale-110 bg-white/80 rounded-full p-2 shadow-md transition-all z-20 
                            group-hover:opacity-100 focus:opacity-100 
                            ${canSlidePrev ? 'opacity-0 hover:bg-white' : 'opacity-0 group-hover:opacity-50 cursor-not-allowed'}`}
                aria-label="Previous Slide"
              >
                <FiChevronLeft size={20} className={`${canSlidePrev ? 'text-gray-700' : 'text-gray-400'}`} />
              </button>
              
             
              <button
                onClick={() => handleSlideTransition(nextSlideCallback)}
                disabled={!canSlideNext || isTransitioning}
                className={`absolute top-1/2 -translate-y-1/2 right-0 -mr-1 sm:mr-0 transform hover:scale-110 bg-white/80 rounded-full p-2 shadow-md transition-all z-20 
                            group-hover:opacity-100 focus:opacity-100
                            ${canSlideNext ? 'opacity-0 hover:bg-white' : 'opacity-0 group-hover:opacity-50 cursor-not-allowed'}`}
                aria-label="Next Slide"
              >
                <FiChevronRight size={20} className={`${canSlideNext ? 'text-gray-700' : 'text-gray-400'}`} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Carousel;