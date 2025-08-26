import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
const MidNews = ({ title = "Tin Tức", items = [], visibleCount = 3 }) => {
  const [startIndex, setStartIndex] = useState(0);

  const next = () => {
    if (startIndex + visibleCount < items.length) {
      setStartIndex(startIndex + visibleCount);
    }
  };

  const prev = () => {
    if (startIndex - visibleCount >= 0) {
      setStartIndex(startIndex - visibleCount);
    }
  };

  const currentItems = items.slice(startIndex, startIndex + visibleCount);

  return (
    <div>
      {/* Title + Buttons */}
      <div className="flex items-center justify-between mb-3">
        <div className="inline-block font-bold text-md md:text-2xl border-b-4 border-yellow-300 rounded-b-md">
          {title}
        </div>

        {/* Nút trái phải */}
        <div className="space-x-2">
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={startIndex + visibleCount >= items.length}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>

      {/* List news */}
      <div className="flex flex-col gap-4 pt-2">
        {currentItems.map((item, index) => (
          <Link to={`/tin-noi-bat/${item.slug}`} className="flex gap-3 items-start flex-nowrap" key={index}>
            {/* Image */}
            <div className="w-[120px] h-[68px] md:w-[260px] md:h-[160px] overflow-hidden rounded flex-shrink-0 bg-yellow-200">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="block w-full h-full object-cover"
                draggable={false}
                decoding="async"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-left min-w-0">
  <h1 className="font-bold text-xs sm:text-xl line-clamp-2 sm:line-clamp-3">{item.title}</h1>
  <div className="hidden sm:flex gap-3 my-2 text-sm text-gray-600 flex-wrap">
    <p className="flex items-center text-xs gap-1">
      <FontAwesomeIcon icon={faClock} style={{ color: "#000" }} />
      {item.publishAt
        ? new Date(item.publishAt).toLocaleDateString('vi-VN')
        : item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('vi-VN')
        : 'Chưa có ngày'}
    </p>
    <span className="flex items-center gap-1">
      <FontAwesomeIcon icon={faComment} flip="horizontal" style={{ color: "#000" }} />
      {item.views || 0}
    </span>
  </div>
  <p className="py-1 text-xs text-gray-700 line-clamp-2 md:line-clamp-4 overflow-hidden">
    {item.content}
  </p>
</div>

          </Link>
        ))}
      </div>
    </div>
  );
};

export default MidNews;
