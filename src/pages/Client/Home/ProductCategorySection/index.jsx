import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductCategorySection.css'; 

const categoriesData = [

  { id: 1, name: "Thời Trang Nam Dài Tên Hơn Một Chút Để Test Xuống Dòng", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "thoi-trang-nam" },
  { id: 2, name: "Thời Trang Nữ", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "thoi-trang-nu" },
  { id: 3, name: "Điện Thoại Thông Minh", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "dien-thoai" },
  { id: 4, name: "Laptop & Máy Tính", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "laptop-may-tinh" },
  { id: 5, name: "Thiết Bị Gia Dụng", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "gia-dung" },
  { id: 6, name: "Sức Khỏe & Sắc Đẹp", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "suc-khoe-sac-dep" },
  { id: 7, name: "Mẹ & Bé", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "me-be" },
  { id: 8, name: "Đồ Chơi", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "do-choi" },
  { id: 9, name: "Thể Thao & Dã Ngoại", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "the-thao" },
  { id: 10, name: "Sách & Văn Phòng Phẩm", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "sach-vpp" },
  { id: 11, name: "Xe Máy & Phụ Kiện", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "xe-may" },
  { id: 12, name: "Thời Trang Nam 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "thoi-trang-nam-2" },
  { id: 13, name: "Thời Trang Nữ 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "thoi-trang-nu-2" },
  { id: 14, name: "Điện Thoại 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "dien-thoai-2" },
  { id: 15, name: "Laptop 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "laptop-2" },
  { id: 16, name: "Gia Dụng 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "gia-dung-2" },
  { id: 17, name: "Sức Khỏe 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "suc-khoe-2" },
  { id: 18, name: "Mẹ & Bé 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "me-be-2" },
  { id: 19, name: "Đồ Chơi 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "do-choi-2" },
  { id: 20, name: "Thể Thao 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "the-thao-2" },
  { id: 21, name: "Sách 2", imageUrl: "https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/b9/0ab938f5b5b2993d568351bceb721407.png", slug: "sach-2" },
];

const ProductCategorySection = () => {
  const ITEMS_PER_ROW_LG_GRID = 10; 
  const NUM_ROWS_GRID = 2; 
  const THRESHOLD_FOR_SLIDER = ITEMS_PER_ROW_LG_GRID * NUM_ROWS_GRID;

  const shouldUseSlider = categoriesData.length > THRESHOLD_FOR_SLIDER;

  const CustomSliderArrow = (props) => {
    const { className, onClick, type } = props;
    return (
      <button
        type="button"
        className={className} 
        onClick={onClick}
        aria-label={type === 'prev' ? "Previous Categories" : "Next Categories"}
      >
        {type === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    );
  };

  const sliderSettings = {
  dots: false,
  infinite: false, // Không vòng lặp để ẩn mũi tên khi hết
  speed: 300,
  rows: NUM_ROWS_GRID,
  slidesPerRow: 1,
  autoplay: false,
  arrows: categoriesData.length > THRESHOLD_FOR_SLIDER, // Chỉ hiện mũi tên nếu đủ item
  prevArrow: <CustomSliderArrow type="prev" />,
  nextArrow: <CustomSliderArrow type="next" />,
  slidesToShow: ITEMS_PER_ROW_LG_GRID,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1280, 
      settings: {
        slidesToShow: 10,
        slidesToScroll: 1,
        rows: NUM_ROWS_GRID,
      }
    },
    {
      breakpoint: 1024, 
      settings: {
        slidesToShow: 8,
        slidesToScroll: 1,
        rows: NUM_ROWS_GRID,
      }
    },
    {
      breakpoint: 768, 
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        rows: NUM_ROWS_GRID,
      }
    },
    {
      breakpoint: 640, 
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        rows: NUM_ROWS_GRID,
      }
    },
    {
      breakpoint: 480, 
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        rows: NUM_ROWS_GRID,
      }
    }
  ]
};

  
  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group">
 
      <div className="p-3 md:p-4 border-b border-gray-200">
        <h2 className="text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">
          DANH MỤC
        </h2>
      </div>

      {shouldUseSlider ? (
        <div className="category-slider-wrapper pt-2 pb-1 md:pt-3 md:pb-2">
          <Slider {...sliderSettings}>
            {categoriesData.map((category, index) => (
              <div key={category.id + '-' + index} className="h-full outline-none p-1"> {/* Thêm p-1 ở đây nếu muốn bù trừ margin của .slick-slider */}
                <a
                  href={category.slug ? `/category/${category.slug}` : '#'}
                  className="text-center p-2.5 md:p-3 text-gray-700 no-underline
                                 bg-white flex flex-col items-center justify-center h-full
                                 transition-colors duration-150 ease-in-out group hover:bg-gray-100
                                 focus:outline-none focus:ring-1 focus:ring-red-400 focus:z-10 relative"
                  title={category.name}
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-14 h-14 md:w-16 md:h-16 object-cover mb-1.5 group-hover:opacity-80 transition-opacity"
                    loading="lazy"
                  />
                  <span
                    className="text-[10px] sm:text-[11px] md:text-xs leading-tight flex items-center justify-center text-center"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '2.8em', 
                    }}
                  >
                    {category.name}
                  </span>
                </a>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-${ITEMS_PER_ROW_LG_GRID} gap-0`}>
          {displayedCategoriesForStaticGrid.map((item, index) => (
            <div key={item.id + '-static-' + index} className="h-full outline-none p-1"> 
              <a
                href={item.slug ? `/category/${item.slug}` : '#'}
                className="text-center p-2.5 md:p-3 text-gray-700 no-underline
                               bg-white flex flex-col items-center justify-center h-full
                               transition-colors duration-150 ease-in-out group hover:bg-gray-100
                               focus:outline-none focus:ring-1 focus:ring-red-400 focus:z-10 relative"
                title={item.name}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain mb-1.5 group-hover:opacity-80 transition-opacity"
                  loading="lazy"
                />
                <span
                  className="text-[10px] sm:text-[11px] md:text-xs leading-tight flex items-center justify-center text-center"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '2.8em',
                  }}
                >
                  {item.name}
                </span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategorySection;