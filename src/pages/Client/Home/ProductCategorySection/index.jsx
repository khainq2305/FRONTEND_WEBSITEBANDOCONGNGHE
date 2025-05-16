import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categoriesData = [
  // Dữ liệu mẫu, bạn có thể thay thế bằng dữ liệu thực tế
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
 // Thêm các mục khác nếu cần để kiểm tra slider
];

const ProductCategorySection = () => {
  const ITEMS_PER_ROW_LG_GRID = 10; // Số item mỗi hàng trên grid tĩnh (desktop)
  const NUM_ROWS_GRID = 2; // Số hàng cho cả slider và grid tĩnh
  const THRESHOLD_FOR_SLIDER = ITEMS_PER_ROW_LG_GRID * NUM_ROWS_GRID; // Ngưỡng để chuyển sang slider

  const shouldUseSlider = categoriesData.length > THRESHOLD_FOR_SLIDER;

  // CustomSliderArrow is now defined inside ProductCategorySection
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
    infinite: categoriesData.length > (ITEMS_PER_ROW_LG_GRID * NUM_ROWS_GRID),
    speed: 1000, 
    rows: NUM_ROWS_GRID,
    slidesPerRow: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <CustomSliderArrow type="prev" />,
    nextArrow: <CustomSliderArrow type="next" />,
    slidesToShow: ITEMS_PER_ROW_LG_GRID, 
    slidesToScroll: 2, 
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 10,
          slidesToScroll: 2, 
          rows: NUM_ROWS_GRID,
          arrows: categoriesData.length > (NUM_ROWS_GRID * 10)
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 8,
          slidesToScroll: 2, 
          rows: NUM_ROWS_GRID,
          arrows: categoriesData.length > (NUM_ROWS_GRID * 8)
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1, 
          rows: NUM_ROWS_GRID,
          arrows: false
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1, 
          rows: NUM_ROWS_GRID,
          arrows: false
        }
      },
      {
        breakpoint: 480, // xs
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1, 
          rows: NUM_ROWS_GRID,
          arrows: false
        }
      }
    ]
  };
  const displayedCategoriesForStaticGrid = categoriesData.slice(0, THRESHOLD_FOR_SLIDER);

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group">
      <style jsx global>{`
        /* CSS CHO SLIDER CATEGORY */
        .category-slider-wrapper .slick-slider {
          position: relative;
          margin: 0 -4px; /* Bù lại padding p-1 của SliderCategoryItem để item sát viền */
        }

        .category-slider-wrapper .slick-list {
          overflow: hidden; /* Quan trọng để không bị tràn */
        }

        .category-slider-wrapper .slick-slide {
          height: auto; /* Để slide co giãn theo nội dung của SliderCategoryItem */
          box-sizing: border-box;
          padding: 0 !important; /* Bỏ padding mặc định của slick-slide */
        }

        .category-slider-wrapper .slick-slide > div {
          height: 100%;
          width: 100%;
          display: flex; /* Để SliderCategoryItem (vốn đã là flex col) có thể stretch */
        }

        /* CSS Mũi tên Slider */
        .category-slider-wrapper .slick-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          cursor: pointer;
          border-radius: 50%;
          width: 36px; /* Kích thước nút */
          height: 36px; /* Kích thước nút */
          display: flex !important; /* Quan trọng để căn giữa icon */
          align-items: center;
          justify-content: center;
          background-color: var(--arrow-button-bg-normal, #FFFFFF); /* Nền trắng mặc định */
          border: 1px solid var(--arrow-button-border-normal, #e5e7eb); /* Viền xám nhạt */
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.2s ease-in-out;
          color: var(--primary-color, #1CA7EC) !important; /* MÀU MŨI TÊN XANH */
          opacity: 0; /* Mặc định ẩn */
          pointer-events: none; /* Mặc định không tương tác được */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .group:hover .category-slider-wrapper .slick-arrow {
            opacity: 1;
            pointer-events: auto;
          }
          .group:hover .category-slider-wrapper .slick-arrow.slick-disabled {
            opacity: 0.3 !important;
            pointer-events: none !important;
            cursor: default;
            background-color: #f0f0f0 !important;
            border-color: #e0e0e0 !important;
            color: #999999 !important;
          }
        }

        .category-slider-wrapper .slick-arrow:hover:not(.slick-disabled) {
          background-color: var(--primary-color, #1CA7EC) !important;
          border-color: var(--primary-color, #1CA7EC) !important;
          color: var(--text-primary, #FFFFFF) !important;
          box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        }

        .category-slider-wrapper .slick-prev { left: 8px; }
        .category-slider-wrapper .slick-next { right: 8px; }

        .category-slider-wrapper .slick-prev:before,
        .category-slider-wrapper .slick-next:before {
          display: none !important;
        }

        @media (max-width: 767.98px) {
          .category-slider-wrapper .slick-arrow {
            display: none !important;
          }
          .category-slider-wrapper .slick-slider {
             margin-left: -2px;
             margin-right: -2px;
          }
        }
      `}</style>

      <div className="p-3 md:p-4 border-b border-gray-200">
        <h2 className="text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">
          DANH MỤC
        </h2>
      </div>

      {shouldUseSlider ? (
        <div className="category-slider-wrapper pt-2 pb-1 md:pt-3 md:pb-2">
          <Slider {...sliderSettings}>
            {categoriesData.map((category, index) => (
              // SliderCategoryItem JSX is now inlined here
              <div key={category.id + '-' + index} className="h-full outline-none p-1">
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
                    // THAY ĐỔI KÍCH THƯỚC ẢNH Ở ĐÂY
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
                      height: '2.8em', // Giữ nguyên chiều cao của text để layout không bị vỡ nếu tên quá dài
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
            // SliderCategoryItem JSX is now inlined here as well
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
                  // THAY ĐỔI KÍCH THƯỚC ẢNH Ở ĐÂY
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
                    height: '2.8em', // Giữ nguyên chiều cao của text
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