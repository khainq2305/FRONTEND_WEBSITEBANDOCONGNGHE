import React from 'react';
import channel from '../../../../assets/Client/images/News/hqdefault.jpg'; // Đảm bảo đường dẫn đúng
import ytb from '../../../../assets/Client/images/News/YouTube.png';       // Đảm bảo đường dẫn đúng
import img4 from '../../../../assets/Client/images/News/deep-ai-la-gi-600x338.png'; // Đảm bảo đường dẫn đúng
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';

const SibarMid = () => {
  return (
    // Thêm padding y cho div bao ngoài nếu muốn có khoảng cách trên dưới với các component khác
    <div className="space-y-4 md:space-y-6 px-0 md:px-4">
      {/* Tiêu đề khuyến mãi */}
      {/* ĐỔI MÀU Ở ĐÂY */}
      <div className="bg-primary text-white px-3 sm:px-4 py-2 font-bold text-sm sm:text-base text-center sm:text-left rounded-md shadow"> {/* Thêm text-white, text-center/left, rounded, shadow */}
        TIN KHUYẾN MÃI
      </div>

      {/* Kênh YouTube */}
      {/* Cân nhắc thêm padding hoặc border cho khối này nếu muốn nó tách biệt hơn */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"> {/* Ví dụ: thêm nền và padding */}
        <img src={channel} alt="Channel Avatar" className='w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0'/>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">Shop công nghệ</h3> {/* Tăng font-weight, đổi màu chữ */}
          {/* Nút Subscribe YouTube - Style lại cho giống nút hơn */}
          <a 
            href="#" // Thay bằng link kênh YouTube của bạn
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center border border-gray-300 bg-white hover:bg-gray-100 transition-colors rounded-md px-2 py-1 mt-1 group"
          >
            <img
              src={ytb}
              alt="YouTube Logo"
              className="object-contain flex-shrink-0 mr-1.5" // Dùng object-contain
              style={{ width: '60px', height: '15px' }} // Điều chỉnh lại kích thước nếu cần
            />
            <div className="text-xs sm:text-sm text-red-600 font-medium group-hover:text-red-700">Đăng ký</div>
            <div className="text-xs text-gray-500 ml-2 pl-2 border-l border-gray-300 group-hover:text-gray-600">999N+</div>
          </a>
        </div>
      </div>

      {/* Tiêu đề tin nổi bật */}
      <div className="text-left mt-6 mb-3 sm:mb-4"> {/* Điều chỉnh margin */}
        {/* ĐỔI MÀU VIỀN Ở ĐÂY */}
        <div className="inline-block font-bold text-lg sm:text-xl text-gray-800 border-b-4 border-primary rounded-sm pb-1"> {/* Giảm text-2xl, pb, pt */}
          Tin nổi bật nhất
        </div>
      </div>

      {/* Danh sách tin */}
      <div className="space-y-4 sm:space-y-5">
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="pb-3 sm:pb-4 border-b border-gray-100 last:border-b-0 group"> {/* Thêm group cho hover effect */}
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
                  {/* Bọc tiêu đề bằng thẻ a nếu muốn click được */}
                  <a href="#" className="hover:underline"> 
                    {idx === 0
                      ? 'DeepAI là gì? Khám phá sức mạnh trí tuệ nhân tạo đằng sau sáng tạo không giới hạn'
                      : idx === 1
                        ? 'Lộ poster quảng cáo Galaxy S25 Edge, thông số gây bất ngờ về pin và hiệu năng'
                        : idx === 2
                            ? 'Lộ video thực tế của iPhone 17 Air mỏng hơn cả khi gắn ốp lưng, thiết kế độc đáo'
                            : 'Vision Board là gì? Cách làm bảng tầm nhìn chi tiết, dễ dàng đạt được mục tiêu'}
                  </a>
                </h4>
                <div className="text-xs text-gray-500 flex items-center gap-x-3 gap-y-1 mb-1 sm:mb-1.5">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} /> {/* Bỏ style color */}
                    09/05/2025
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faComment} flip="horizontal" /> {/* Bỏ style color */}
                    0
                  </span>
                </div>
              </div>
              <img
                src={img4}
                alt="Thumbnail bài viết"
                className="object-cover rounded-md flex-shrink-0" // Thêm rounded-md
                style={{ width: '100px', height: '60px' }} // Điều chỉnh kích thước cho nhất quán
              />
            </div>

            {/* Mô tả - chỉ hiển thị trên sm trở lên, thêm line-clamp */}
            <p className="text-left text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 hidden sm:block">
              Nhờ khả năng xử lý ngôn ngữ và hình ảnh linh hoạt, DeepAI đang dần trở thành một công cụ...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SibarMid;