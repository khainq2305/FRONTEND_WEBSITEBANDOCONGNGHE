import React from 'react';
import channel from '../../../../assets/Client/images/News/hqdefault.jpg';
import ytb from '../../../../assets/Client/images/News/YouTube.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';

/**
 */
const SibarMid = ({ items = [], title}) => {
  return (
    <div className="space-y-4 md:space-y-6 px-0 md:px-4">
      {/* Khối TIN KHUYẾN MÃI */}
      <div className="bg-primary text-white px-3 sm:px-4 py-2 font-bold text-sm sm:text-base text-center sm:text-left rounded-md shadow">
        TIN KHUYẾN MÃI
      </div>

      {/* Kênh YouTube */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
        <img src={channel} alt="Channel Avatar" className='w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0'/>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">Shop công nghệ</h3>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center border border-gray-300 bg-white hover:bg-gray-100 transition-colors rounded-md px-2 py-1 mt-1 group"
          >
            <img
              src={ytb}
              alt="YouTube Logo"
              className="object-contain flex-shrink-0 mr-1.5"
              style={{ width: '60px', height: '15px' }}
            />
            <div className="text-xs sm:text-sm text-red-600 font-medium group-hover:text-red-700">Đăng ký</div>
            <div className="text-xs text-gray-500 ml-2 pl-2 border-l border-gray-300 group-hover:text-gray-600">999N+</div>
          </a>
        </div>
      </div>

      {/* Tiêu đề danh sách tin */}
      <div className="text-left mt-6 mb-3 sm:mb-4">
        <div className="inline-block font-bold text-lg sm:text-xl text-gray-800 border-b-4 border-primary rounded-sm pb-1">
          {title}
        </div>
      </div>

      {/* Danh sách bài viết nổi bật */}
      <div className="space-y-4 sm:space-y-5">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="pb-3 sm:pb-4 border-b border-gray-100 last:border-b-0 group">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
                  <a href={item.link || "#"} className="hover:underline">
                    {item.title}
                  </a>
                </h4>
                <div className="text-xs text-gray-500 flex items-center gap-x-3 gap-y-1 mb-1 sm:mb-1.5">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} />
                    {item.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faComment} flip="horizontal" />
                    {item.views ?? 0}
                  </span>
                </div>
              </div>
              <img
                src='https://caodang.fpt.edu.vn/wp-content/uploads/2023/12/FPT-Polytechnic_-Tri-tue-nhan-tao-AI.jpeg'
                alt={item.title}
                className="object-cover rounded-md flex-shrink-0"
                style={{ width: '100px', height: '60px' }}
              />
            </div>

            <p className="text-left text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 hidden sm:block">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SibarMid;
