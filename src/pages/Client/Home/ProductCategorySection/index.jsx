// src/components/ProductCategorySection.jsx
import React from "react";
import Slider from "react-slick"; // Thêm lại Slider
import "slick-carousel/slick/slick.css"; // Thêm lại CSS Slider
import "slick-carousel/slick/slick-theme.css"; // Thêm lại CSS Slider
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Thêm lại Icon mũi tên

// Dữ liệu categories (Thêm lại item 21-24 để đủ > 20 cho Slider chạy)
const categoriesData = [
    { id: 1, name: "Thời Trang Nam", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/6c/a8/8a/d7cd7f483209d2812577075030058905.png.webp", slug: "thoi-trang-nam" },
    { id: 2, name: "Điện Thoại & Phụ Kiện", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/c8/27/3a/573d69033479823a1900b8bc9f353925.png.webp", slug: "dien-thoai-phu-kien" },
    { id: 3, name: "Thiết Bị Điện Tử", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/17/1a/70/79c45ae83a480f0c3bd1370500f949bf.png.webp", slug: "thiet-bi-dien-tu" },
    { id: 4, name: "Máy Tính & Laptop", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/af/73/5e/c72c4d34a537d83b3cc996997737559C.png.webp", slug: "may-tinh-laptop" },
    { id: 5, name: "Máy Ảnh & Máy Quay Phim", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/77/49/95/2ac043577496167e5636f490225871af.png.webp", slug: "may-anh" },
    { id: 6, name: "Đồng Hồ", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/ce/95/ea/a3b355c3447d20dd89882837d5398035.png.webp", slug: "dong-ho" },
    { id: 7, name: "Giày Dép Nam", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/73/73/c7/09a42ac78f5e91602148d93675300655.png.webp", slug: "giay-dep-nam" },
    { id: 8, name: "Thiết Bị Điện Gia Dụng", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/68/e9/10/b37777025255002808ef067812906d71.png.webp", slug: "dien-gia-dung" },
    { id: 9, name: "Thể Thao & Du Lịch", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/43/a9/3a/5590513a0a007731f2200c82377b5491.png.webp", slug: "the-thao-du-lich" },
    { id: 10, name: "Ô Tô & Xe Máy & Xe Đạp", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/08/75/83/d96ab873d8877882763003d302337439.png.webp", slug: "o-to-xe-may-xe-dap" },
    { id: 11, name: "Thời Trang Nữ", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/13/9A/D5/de492353945125300e1bcdABEC1D4DEA.png.webp", slug: "thoi-trang-nu" },
    { id: 12, name: "Mẹ & Bé", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/3c/42/98/53595d24538de97893517613d5345590.png.webp", slug: "me-be" },
    { id: 13, name: "Nhà Cửa & Đời Sống", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/1e/18/7a/9e2c94afa374b29c46adcb0060d98671.png.webp", slug: "nha-cua-doi-song" },
    { id: 14, name: "Sắc Đẹp", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/20/68/f9/11ac4f2d935eb00913673b935197860f.png.webp", slug: "sac-dep" },
    { id: 15, name: "Sức Khỏe", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/66/09/68/731144667636587499083d2317c90185.png.webp", slug: "suc-khoe" },
    { id: 16, name: "Giày Dép Nữ", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/0f/7a/aa/56599326077a7301795351549829b764.png.webp", slug: "giay-dep-nu" },
    { id: 17, name: "Túi Ví Nữ", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/ba/95/ac/285c09c21989ff8f6c4df877909f5316.png.webp", slug: "tui-vi-nu" },
    { id: 18, name: "Phụ Kiện & Trang Sức Nữ", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/f0/83/9f/0eb31675031599440293721d0a3888c3.png.webp", slug: "phu-kien-trang-suc-nu" },
    { id: 19, name: "Bách Hóa Online", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/d3/43/09/2ac9f33362d0f7731219359e0a18028c.png.webp", slug: "bach-hoa-online" },
    { id: 20, name: "Nhà Sách Online", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/ff/4c/aa/5788de79b2ef053a5a5d43c3d5dd319a.png.webp", slug: "nha-sach-online" },
    { id: 21, name: "Đồ Chơi", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/46/aa/1c/f02a9a55a45101f73281add6936acc33.png.webp", slug: "do-choi" },
    { id: 22, name: "Thể Thao Dã Ngoại", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/category/61/d4/9c/343c61055c12ef9038370e09f300510d.png.webp", slug: "the-thao-da-ngoai" },
    { id: 23, name: "Voucher Dịch Vụ", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/1f/73/e5/0f15f8c0de762c0508c84f37769f2052.png.webp", slug: "voucher" },
    { id: 24, name: "Hàng Quốc Tế", imageUrl: "https://salt.tikicdn.com/cache/100x100/ts/upload/3c/0e/03/c392f2594c6835144464551d0921ba64.png.webp", slug: "hang-quoc-te" },
];

// --- Thêm lại Component Mũi tên tùy chỉnh ---
const CustomSliderArrow = (props) => {
  const { className, onClick, type } = props;
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={type === 'prev' ? "Previous Categories" : "Next Categories"}
    >
      {type === 'prev' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
    </button>
  );
};

// --- Component Item Dùng RIÊNG CHO SLIDER ---
const SliderCategoryItem = ({ category }) => {
  return (
    <div className="h-full outline-none p-1">
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
          className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full bg-gray-100 mb-1.5 group-hover:opacity-80 transition-opacity"
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
  );
};


const ProductCategorySection = () => {
  const ITEMS_PER_ROW_LG_GRID = 10;
  const NUM_ROWS_GRID = 2;
  const THRESHOLD_FOR_SLIDER = ITEMS_PER_ROW_LG_GRID * NUM_ROWS_GRID;

  const shouldUseSlider = categoriesData.length > THRESHOLD_FOR_SLIDER;

const sliderSettings = {
  dots: false,
  infinite: categoriesData.length > THRESHOLD_FOR_SLIDER,
  speed: 700, // Tốc độ của hiệu ứng chuyển slide (ms)
  rows: 2,
  slidesPerRow: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  arrows: true,
  prevArrow: <CustomSliderArrow type="prev" />,
  nextArrow: <CustomSliderArrow type="next" />,
  slidesToShow: ITEMS_PER_ROW_LG_GRID, // Vẫn hiển thị 10 item mỗi trang (trên desktop)
  slidesToScroll: 1, // SỬA Ở ĐÂY: Mỗi lần click/autoplay sẽ cuộn 1 item
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 10,
        slidesToScroll: 1, // SỬA Ở ĐÂY
        rows: 2,
        arrows: categoriesData.length > (NUM_ROWS_GRID * 10)
      }
    },
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 8,
        slidesToScroll: 1, // SỬA Ở ĐÂY
        rows: 2,
        arrows: categoriesData.length > (NUM_ROWS_GRID * 8)
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1, // SỬA Ở ĐÂY
        rows: 2,
        arrows: false
      }
    },
    {
      breakpoint: 639,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1, // SỬA Ở ĐÂY
        rows: 2,
        arrows: false
      }
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1, // SỬA Ở ĐÂY
        rows: 2,
        arrows: false
      }
    }
  ]
};
  const displayedCategoriesForStaticGrid = categoriesData.slice(0, THRESHOLD_FOR_SLIDER);

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group">

      <style jsx global>{`
        /* CSS CHO SLIDER */
        .category-slider-wrapper .slick-slider {
          position: relative; margin: 0 -4px;
        }
        /* CSS cũ cho slick-list, track, slide - có thể gây lỗi 1 hàng */
        /* Tạm thời comment out để ưu tiên CSS mặc định của react-slick cho layout đa hàng */

        /*
        .category-slider-wrapper .slick-list {
          overflow: hidden !important;
          height: auto !important;
        }
        .category-slider-wrapper .slick-track {
          display: flex;
          flex-wrap: wrap !important; // Quan trọng cho nhiều hàng
          align-items: stretch;
          height: auto !important;
        }
        .category-slider-wrapper .slick-slide {
          height: auto !important; // Để slide tự co giãn theo nội dung
          box-sizing: border-box;
          display: flex !important;
          align-items: stretch !important;
          padding: 0 !important;
        }
        */

        /* Đảm bảo div con trực tiếp của slick-slide chiếm đủ không gian */
        /* và các item bên trong được căn chỉnh đúng */
        .category-slider-wrapper .slick-slide > div {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column; /* Đảm bảo nội dung trong SliderCategoryItem được xếp dọc */
          align-items: stretch; /* Kéo dãn theo chiều ngang */
          justify-content: space-between; /* Phân bố không gian nếu cần */
        }


        /* CSS Mũi tên Slider */
        .category-slider-wrapper .slick-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; cursor: pointer;
          border-radius: 50%; width: 36px; height: 36px; display: flex !important; align-items: center; justify-content: center;
          background-color: rgba(255, 255, 255, 0.95); border: 1px solid #e5e7eb; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.2s ease-in-out; color: #4B5563; opacity: 0; pointer-events: none;
        }
        @media (min-width: 768px) {
           .group:hover .category-slider-wrapper .slick-arrow { opacity: 1; pointer-events: auto; }
           .group:hover .category-slider-wrapper .slick-arrow.slick-disabled { opacity: 0 !important; pointer-events: none !important; cursor: default; }
         }
        .category-slider-wrapper .slick-arrow:hover {
          background-color: #ffffff; border-color: #d1d5db; color: #ef4444; box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        }
        .category-slider-wrapper .slick-prev { left: 8px; }
        .category-slider-wrapper .slick-next { right: 8px; }
        .category-slider-wrapper .slick-prev:before, .category-slider-wrapper .slick-next:before { display: none !important; }
        @media (max-width: 767.98px) {
          .category-slider-wrapper .slick-arrow { display: none !important; }
          .category-slider-wrapper .slick-slider { margin-left: -2px; margin-right: -2px; }
        }
      `}</style>

      <div className="p-3 md:p-4 border-b border-gray-200">
        <h2 className="text-sm md:text-base font-semibold text-gray-700 uppercase">
          DANH MỤC
        </h2>
      </div>

      {shouldUseSlider ? (
        <div className="category-slider-wrapper pt-2 pb-1 md:pt-3 md:pb-2">
          <Slider {...sliderSettings}>
            {categoriesData.map((category) => (
              <SliderCategoryItem key={category.id} category={category} />
            ))}
          </Slider>
        </div>
      ) : (
        <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-${ITEMS_PER_ROW_LG_GRID} border-t border-l border-gray-200`}>
          {displayedCategoriesForStaticGrid.map((item) => (
            <a
              href={item.slug ? `/category/${item.slug}` : '#'}
              key={item.id}
              className="text-center p-2.5 md:p-3 text-gray-700 no-underline
                         bg-white flex flex-col items-center justify-center h-full
                         transition-colors duration-150 ease-in-out group hover:bg-gray-100
                         border-b border-r border-gray-200
                         focus:outline-none focus:ring-1 focus:ring-red-400 focus:z-10 relative
                        "
               title={item.name}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full bg-gray-100 mb-1.5 group-hover:opacity-80 transition-opacity"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategorySection;