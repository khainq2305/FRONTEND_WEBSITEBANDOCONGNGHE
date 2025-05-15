import React, { useEffect, useState } from 'react';
import steam from "../../../../assets/Client/images/News/cach-vao-steam-khi-bi-chan.jpg";
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
const Carousel2 = ({ title }) => {
  const data = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    image: steam,
    name: "GK-Games",
    headline: `Cách vào Steam khi bị chặn - Mẹo #${i + 1}`,
    date: `10/${20 + i}/2001`
  }));

  const visibleCount = 5;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data.length]);

  // Lấy danh sách item cần hiển thị
  const getVisibleItems = () => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(data[(currentIndex + i) % data.length]);
    }
    return result;
  };

  // ✅ Fix lỗi gọi nhầm biến posts
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + data.length) % data.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % data.length
    );
  };

  const visibleItems = getVisibleItems();

  return (
    <div className="bg-gray-200 rounded-md shadow-md p-2 md:p-4 overflow-hidden relative group">
      {/* Nút tiến lùi */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button icon="‹" w="40px" h="40px" className="border-r rounded-l-md bg-gray-200 opacity-70" onClick={prevSlide} />
        <Button icon="›" w="40px" h="40px" className="rounded-r-md bg-gray-200 opacity-70" onClick={nextSlide} />
      </div>

      {/* Tiêu đề */}
      <div className="text-left">
        <div className="inline-block font-bold text-md md:text-2xl border-b-4 border-yellow-300 rounded-b-md mb-3">
          {title}
        </div>

        {/* Danh sách item */}
        <div className="flex justify-center gap-4 transition-all duration-700 ease-in-out">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center rounded-md max-w-[350px] w-[300px] flex-shrink-0"
            >
              <div className='w-[320px] h-[160px] overflow-hidden rounded flex-shrink-0'>
                <img
                src={item.image}
                alt=""
                className="rounded w-full h-full object-cover"
              />
              </div>
              <div className="py-3 px-4">
                <p className="py-2 text-sm md:text-md">{item.name}</p>
                <h1 className="text-sm md:text-md">{item.headline}</h1>
                <p className="pt-3 text-sm text-gray-700"><FontAwesomeIcon icon={faClock} style={{ color: "#000" }} /> {item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel2;
