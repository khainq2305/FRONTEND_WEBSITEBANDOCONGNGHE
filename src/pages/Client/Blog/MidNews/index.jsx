import React from 'react';
import ihone from "../../../../assets/Client/images/News/video-thuc-te-iphone-17-air-1-600x338.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
const midNewsList = Array(4).fill({
  image: ihone,
  title: "Lộ video thực tế của iPhone 17 Air mỏng hơn cả khi gắn ốp lưng",
  date: "10/10/2002",
  views: 0,
  desc: "Chiếc iPhone 17 Air đang thu hút sự chú ý với tin đồn sẽ là mẫu iPhone mỏng nhất từ 5t4t4 4y44y493980t 35923t923t9329t..."
});

const MidNews = () => {
  return (
    <div>
      <div className="text-left">
        <div className="inline-block font-bold text-2xl border-b-4 border-yellow-300 rounded-b-md mb-3">
          Tin Tức Apple
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-2">
        {midNewsList.map((item, index) => (
          <div className="flex gap-3 items-start flex-nowrap">
  {/* Ảnh */}
  <div className="w-[120px] h-[68px] md:w-[260px] md:h-[160px] overflow-hidden rounded flex-shrink-0 bg-yellow-200">
  <img
    src={item.image}
    alt=""
    className="block w-full h-full object-cover"
    draggable={false}
    decoding="async"
    loading="lazy"
  />
</div>


  {/* Nội dung */}
  <div className="flex-1 text-left">
    <h1 className="font-bold text-xs sm:text-xl">{item.title}</h1>
    <div className="hidden sm:flex gap-3 my-2 text-sm text-gray-600 flex-wrap">
      <p className="flex items-center text-xs gap-1">
        <FontAwesomeIcon icon={faClock} style={{ color: "#000" }} />
        {item.date}
      </p>
      <span className="flex items-center gap-1">
        <FontAwesomeIcon icon={faComment} flip="horizontal" style={{ color: "#000" }} />
        {item.views}
      </span>
    </div>
    <p className="py-1 text-xs text-gray-700 line-clamp-2 hidden md:inline">{item.desc}</p>
  </div>
</div>



        ))}

      </div>
    </div>
  );
};

export default MidNews;
