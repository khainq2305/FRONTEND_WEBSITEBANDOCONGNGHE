import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductCategorySection.css';
import { highlightedCategoryService } from "../../../../services/client/highlightedCategoryService";
 import { API_BASE_URL } from '../../../../constants/environment';

const ProductCategorySection = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const sliderRef = useRef(null);

  const ITEMS_PER_ROW_LG_GRID = 10;
  const NUM_ROWS_GRID = 2;
  const THRESHOLD_FOR_SLIDER = ITEMS_PER_ROW_LG_GRID * NUM_ROWS_GRID;

  const shouldUseSlider = categoriesData.length > THRESHOLD_FOR_SLIDER;
const getImageUrl = (fileName) =>
  !fileName
    ? ''
    : fileName.startsWith('http')
    ? fileName
    : `${API_BASE_URL}/uploads/highlighted/${fileName}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await highlightedCategoryService.list();
          console.log("✅ Highlighted category data:", res.data?.data); // 👈 THÊM DÒNG NÀ
        // --- Test slider với nhiều mục ---
        // const exampleManyItems = Array.from({ length: 25 }, (_, i) => ({ id: `cat${i}`, name: `Danh mục ${i} (Test ${i+1})`, slug: `danh-muc-${i}`, imageUrl: `https://via.placeholder.com/100/0000FF/FFFFFF?Text=DM${i+1}` }));
        // setCategoriesData(exampleManyItems);
        setCategoriesData(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Lỗi khi tải danh mục nổi bật:", err);
      }
    };
    fetchData();
  }, []);

  const displayedCategoriesForStaticGrid = categoriesData.slice(0, THRESHOLD_FOR_SLIDER);

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
    infinite: false, // <<<< THAY ĐỔI CHÍNH: Đặt là false
    speed: 500,
    rows: NUM_ROWS_GRID,
    slidesPerRow: 1,
    autoplay: true,      // Autoplay sẽ chạy đến hết rồi dừng
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    waitForAnimate: true, // Giữ true để ổn định, hoặc false nếu muốn click liên tục (ít quan trọng hơn khi infinite: false)
    arrows: categoriesData.length > THRESHOLD_FOR_SLIDER,
    prevArrow: <CustomSliderArrow type="prev" />,
    nextArrow: <CustomSliderArrow type="next" />,
    slidesToShow: ITEMS_PER_ROW_LG_GRID,
    slidesToScroll: ITEMS_PER_ROW_LG_GRID,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 10, slidesToScroll: 10, rows: NUM_ROWS_GRID } },
      { breakpoint: 1024, settings: { slidesToShow: 8, slidesToScroll: 8, rows: NUM_ROWS_GRID } },
      { breakpoint: 768,  settings: { slidesToShow: 5, slidesToScroll: 5, rows: NUM_ROWS_GRID } },
      { breakpoint: 640,  settings: { slidesToShow: 4, slidesToScroll: 4, rows: NUM_ROWS_GRID } },
      { breakpoint: 480,  settings: { slidesToShow: 3, slidesToScroll: 3, rows: NUM_ROWS_GRID } }
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
          <Slider ref={sliderRef} {...sliderSettings} key={categoriesData.length}>
            {categoriesData.map((category, index) => (
              <div key={category.id + '-' + index} className="h-full outline-none p-1">
                <a
                  href={category.slug ? `/category/${category.slug}` : '#'}
                  className="text-center p-2.5 md:p-3 text-gray-700 no-underline
                                   bg-white flex flex-col items-center justify-center h-full
                                   transition-colors duration-150 ease-in-out group hover:bg-gray-100
                                   focus:outline-none focus:ring-1 focus:ring-red-400 focus:z-10 relative"
                  title={category.name}
                >
                 

<div className="relative w-14 h-14 md:w-16 md:h-16 mb-1.5">
  {/* Badge */}
  {category.label && (
    <div className={`
      absolute top-0 right-0 z-10 text-white text-[9px] md:text-[10px] font-bold px-1 py-0.5 rounded-tr-md rounded-bl-md
      ${category.label === 'hot' ? 'bg-red-600' : category.label === 'new' ? 'bg-green-600' : 'bg-blue-600'}
    `}>
      {category.label === 'hot' ? 'HOT' : category.label === 'new' ? 'MỚI' : 'NỔI BẬT'}
    </div>
  )}

  <img
    src={category.imageUrl}
    alt={category.name}
    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
    loading="lazy"
  />
</div>


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
        <div
          className={`inline-grid grid-cols-3 sm:grid-cols-4 md:grid-cols-10 lg:grid-cols-${ITEMS_PER_ROW_LG_GRID} gap-0`}
        >
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
    <div className="relative w-14 h-14 md:w-16 md:h-16 mb-1.5">
      {item.label && (
        <div className={`
          absolute top-0 right-0 z-10 text-white text-[9px] md:text-[10px] font-bold px-1 py-0.5 rounded-tr-md rounded-bl-md
          ${item.label === 'hot' ? 'bg-red-600' : item.label === 'new' ? 'bg-green-600' : 'bg-blue-600'}
        `}>
          {item.label === 'hot' ? 'HOT' : item.label === 'new' ? 'MỚI' : 'NỔI BẬT'}
        </div>
      )}

      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-full object-contain group-hover:opacity-80 transition-opacity"
        loading="lazy"
      />
    </div>

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