import React from 'react';
import imgItem from '../../../../assets/Client/images/News/qua-tang-thieu-nhi-12-750x422.jpg';
import imgList from '../../../../assets/Client/images/News/google-map-quet-anh-chup-man-hinh-1-600x338.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComment } from '@fortawesome/free-regular-svg-icons';
const TopNews = () => {
    return (
        <div className="bg-white h-fit">
            {/* Thanh tiêu đề hot */}
            <div className="flex items-stretch w-full overflow-hidden mb-4">
                {/* TIN TỨC HOT */}
                <div className="flex-shrink-0 bg-yellow-400 px-2 md:px-4 py-1 md:py-2 font-bold text-xs md:text-sm flex items-center gap-1 md:gap-2 rounded">
                    ⚡
                    <span className="hidden md:inline">TIN TỨC HOT</span>
                </div>

                {/* Nội dung + nút chuyển */}
                <div className="flex flex-1 min-w-0">
                    <div className="flex-1 flex items-center justify-around opacity-90 border border-gray-400 rounded rounded-r-none px-3 py-2 min-w-0">
                        <span className="truncate text-xs">
                            Cách chỉnh camera iPhone 16 Pro Max chụp hình đẹp như máy cơ
                        </span>
                        <span className="text-gray-500 text-xs flex-shrink-0 ml-4 hidden md:inline">12/03/2025</span>
                    </div>

                    {/* Nút chuyển */}
                    <div className="flex border-t border-b border-r border-gray-400 flex-shrink-0 rounded-r-md">
                        <button className="px-3 border-r border-gray-400 rounded-l-md">‹</button>
                        <button className="px-3 my-auto rounded-r-md">›</button>
                    </div>
                </div>
            </div>


            {/* Thanh tiêu đề khuyến mãi */}
            <div className="text-left">
                <div className="inline-block font-bold text-2xl border-b-4 border-yellow-300 rounded-b-md mb-3 pt-4">
                    Tin nổi bật nhất
                </div>
            </div>

            {/* Nội dung nổi bật */}
            <div className="flex flex-col lg:flex-row gap-5">

                {/* Bài viết lớn bên trái */}

                <div className=" mb-6 lg:mb-0" >
                    <img src={imgItem} alt="Bài viết nổi bật" className="w-full rounded mb-3" />
                    <h3 className="text-xl font-bold mb-2 text-justify pr-4">Top 10+ quà tặng thiếu nhi ngày 1/6 ý nghĩa cho bé trai bé gái</h3>
                    <div className="text-sm text-gray-500 flex gap-4 mb-2">
                        <span className="flex items-center gap-1"><FontAwesomeIcon icon={faClock} style={{ color: "#000" }} />09/05/2025</span>
                        <span><FontAwesomeIcon icon={faComment} flip="horizontal" style={{ color: "#000" }} /> 0</span>
                    </div>
                    <p className="text-sm mb-3 text-gray-700 text-justify pr-4">
                        Ngày Quốc tế Thiếu nhi 1/6 là dịp đặc biệt để các bậc phụ huynh thể hiện tình yêu thương...
                    </p>
                    <div className="text-left">
                        <button className="border border-gray-300 px-4 py-1 text-sm uppercase">READ MORE</button>
                    </div>

                </div>

                {/* Danh sách bài viết nhỏ */}
                <div className="w-full bg-white flex flex-col space-y-2 ">
                    {[1, 2, 3, 4].map((_, idx) => (
                        <div key={idx} className="flex gap-3 pb-3 items-start">
                            <img
                                src={imgList}
                                alt="thumb"
                                style={{ width: '120px', height: '70px', objectFit: 'cover' }}
                                className="rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium mb-1 text-left line-clamp-2">
                                    {idx === 0
                                        ? 'Google Map ra mắt tính năng quét ảnh chụp màn hình, lưu vị trí tự động'
                                        : idx === 1
                                            ? 'Lộ poster quảng cáo Galaxy S25 Edge, thông số gây bất ngờ về pin'
                                            : idx === 2
                                                ? 'Lộ video thực tế của iPhone 17 Air mỏng hơn cả khi gắn ốp lưng'
                                                : 'Vision Board là gì? Cách làm bảng tầm nhìn chi tiết, dễ dàng'}
                                </h4>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faClock} style={{ color: "#000" }} />
                                    09/05/2025
                                </span>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopNews;
