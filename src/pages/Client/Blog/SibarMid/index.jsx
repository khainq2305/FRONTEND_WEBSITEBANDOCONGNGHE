import React from 'react';
import channel from '../../../../assets/Client/images/News/hqdefault.jpg';
import ytb from '../../../../assets/Client/images/News/YouTube.png';
import img4 from '../../../../assets/Client/images/News/deep-ai-la-gi-600x338.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
const SibarMid = () => {
  return (
    <div className="space-y-4 px-0 md:px-4">
      {/* Tiêu đề khuyến mãi */}
      <div className="bg-yellow-400 px-4 py-2 font-bold text-justify rounded">
        TIN KHUYẾN MÃI
      </div>

      {/* Kênh YouTube */}
      <div className="flex justify-start gap-2 mb-3">
        <img src={channel} alt=""className='w-[50px] h-[50px]'/>
        <div>
          <h1 className="text-sm text-gray-400">Shop công nghệ</h1>
          <div className="flex items-center border mt-1">
            <img
              src={ytb}
              alt=""
              className="object-cover object-center flex-shrink-0"
              style={{ width: '70px', height: '15px' }}
            />
            <div className="text-sm px-2 text-gray-400">999+</div>
          </div>
        </div>
      </div>

      {/* Tiêu đề tin nổi bật */}
      <div className="text-left">
        <div className="inline-block font-bold text-md md:text-2xl border-b-4 border-yellow-300 rounded-b-md mb-3 pt-4">
          Tin nổi bật nhất
        </div>
      </div>

      {/* Danh sách tin */}
      {[1, 2, 3, 4].map((_, idx) => (
        <div key={idx} className="pb-3">
          <div className="flex gap-3">
            <div className="flex-1 text-left">
              <h1 className="font-bold text-sm">
                DeepAI là gì? Khám phá sức mạnh trí tuệ nhân tạo đằng sau sáng tạo
              </h1>
              <div className="hidden text-sm text-gray-500 sm:flex gap-4 mb-1 mt-1">
                <span className="flex items-center gap-1  "><FontAwesomeIcon icon={faClock} style={{ color: "#000" }} /> 09/05/2025</span>
                <span><FontAwesomeIcon icon={faComment} flip="horizontal" style={{ color: "#000" }} /> 0</span>
              </div>
            </div>
            <img
              src={img4}
              alt=""
              className="object-cover object-center flex-shrink-0 rounded"
              style={{ width: '120px', height: '67px' }}
            />
          </div>

          {/* Mô tả - chỉ hiển thị trên sm trở lên */}
          <p className="text-left text-sm pr-3 mt-1 hidden sm:block">
            Nhờ khả năng xử lý ngôn ngữ và hình ảnh linh hoạt, DeepAI đang dần trở thành một công cụ...
          </p>
        </div>
      ))}
    </div>
  );
};

export default SibarMid;
