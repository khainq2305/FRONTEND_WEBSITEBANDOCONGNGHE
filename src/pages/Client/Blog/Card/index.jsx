import React from 'react';
import dienthoai from '../../../../assets/Client/images/News/Danh-gia-Oppo-Reno12-5G-Dien-thoai-tam-trung-so-huu-AI-dinh-cao-350x250.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
const Card = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-0 md:px-4">
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="text-left">
            {/* Tiêu đề */}
            <div className="relative mb-2 w-fit">
              <h1 className="block text-justify font-bold pb-1 pr-4 text-md md:text-2xl">
                Đánh giá
              </h1>
              <div
                className="absolute bottom-0 left-0 w-full h-[2px]"
                style={{
                  background: "linear-gradient(to right, #facc15 0px, #facc15 70px, #d1d5db 40px, #d1d5db 100%)", height: "2px"
                }}
              ></div>
            </div>




            {/* Ảnh + nội dung chính */}
            <div className="flex items-center gap-3 mb-2">
              {/* Ảnh */}
              <div className="w-[100px] h-[60px]" >
                <img
                  src={dienthoai}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Nội dung */}
              <div className="flex-1 text-left">
                <h1 className="font-bold text-sm pb-1">
                  Đánh giá Oppo Reno12 5G: Điện thoại tầm trung sở hữu AI đỉnh cao
                </h1>
                <p className="text-xs text-gray-500"><FontAwesomeIcon icon={faClock} style={{ color: "#000" }} /> 10/20/2001</p>
              </div>
            </div>

            {/* Danh sách bài phụ */}
            <div className="space-y-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <p key={i} className="text-sm text-justify">
                  Đánh giá Oppo A5 Pro: Hiệu năng siêu vượt trội, thiết kế tinh tế{' '}
                  <span className="text-xs text-gray-500"><FontAwesomeIcon icon={faClock} style={{ color: "#000" }} /> 08/05/2025</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
