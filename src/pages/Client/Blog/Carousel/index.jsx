import React, { useEffect, useState } from 'react';
import samsumg from "../../../../assets/Client/images/News/dung-luong-pin-z-fold-7-1-350x250.jpg";
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
const posts = Array.from({ length: 10 }, (_, i) => ({
  title: `Lộ poster quảng cáo Galaxy S25 Edge #${i + 1}`,
  date: "09/05/2025",
  image: samsumg
}));

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  // Responsive visibleCount
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newCount = width < 640 ? 2 : 5;
      setVisibleCount(newCount);
      setCurrentIndex((prev) => Math.min(prev, posts.length - newCount));
    };

    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev + 1 > posts.length - visibleCount ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [visibleCount]);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 < 0 ? posts.length - visibleCount : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1 > posts.length - visibleCount ? 0 : prev + 1));
  };

  const currentItems = posts.slice(currentIndex, currentIndex + visibleCount);

  return (
    <div className="px-4 mb-5">
      <div className="text-left">
        <div className="inline-block font-bold text-md md:text-2xl border-b-4 border-yellow-300 rounded-b-md mb-3 pt-4">
          Tin nổi bật nhất
        </div>
      </div>

     <div className="flex justify-center gap-1 py-2 md:py-4 transition-all duration-500">
  {currentItems.map((post, idx) => (
    <div key={idx}>
      <div className='w-[150px] h-[80px] md:w-[240px] md:h-[120px] overflow-hidden rounded flex-shrink-0 bg-gray-200'> {/* Thêm màu nền để thấy khoảng trống nếu có */}
        <img
          src={post.image}
          alt="Galaxy S25"
          className="w-full h-full rounded object-center" 
        />
      </div>
      <div className="px-2">
        <h3 className="text-xs md:text-sm tracking-tight font-medium mt-2 text-justify">{post.title}</h3>
        <span className="text-xs text-gray-500"><FontAwesomeIcon icon={faClock} style={{ color: "#000" }} /> {post.date}</span>
      </div>
    </div>
  ))}
</div>

      <div className="flex justify-start gap-2">
        <Button icon="‹" w="30px" h="30px" className="border-r rounded-l-md" onClick={prevSlide} />
        <Button icon="›" w="30px" h="30px" className="rounded-r-md" onClick={nextSlide} />
      </div>
    </div>
  );
};

export default Carousel;
