import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductCategorySection.css'; 
import { highlightedCategoryService } from '../../../../services/client/highlightedCategoryService';

const ProductCategorySection = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const sliderRef = useRef(null);

  const getItemsPerRow = () => {
    if (window.innerWidth >= 1280) return 10;
    if (window.innerWidth >= 1024) return 8;
    if (window.innerWidth >= 768) return 6;
    if (window.innerWidth >= 640) return 5;
    return 4;
  };

  const NUM_ROWS = 2;

  const [currentItemsPerRow, setCurrentItemsPerRow] = useState(getItemsPerRow());

  useEffect(() => {
    const handleResize = () => {
      setCurrentItemsPerRow(getItemsPerRow());
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await highlightedCategoryService.list();
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        const dataWithLabels = data.map((item, index) => {
          if (index === 5) return { ...item, label: 'new' };
          if (index === 7) return { ...item, label: 'hot' };
          if (index === 8) return { ...item, label: 'nổi bật' };
          return item;
        });
        setCategoriesData(dataWithLabels);
      } catch (err) {
        console.error('Lỗi khi tải danh mục nổi bật:', err);
      }
    };
    fetchData();
  }, []);

  const THRESHOLD_FOR_SLIDER = currentItemsPerRow * NUM_ROWS;
  const shouldUseSlider = categoriesData.length > THRESHOLD_FOR_SLIDER;


  const CustomSliderArrow = ({ className, onClick, type }) => {
    
    const isHidden = className.includes('slick-disabled') || className.includes('slick-hidden'); 

    return (
      <button 
        type="button" 
        className={`${className} custom-arrow`} 
        onClick={isHidden ? null : onClick} 
        aria-label={type === 'prev' ? 'Previous' : 'Next'}
        style={{ display: isHidden ? 'none' : 'block' }} 
      >
        {type === 'prev' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
    );
  };


  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    rows: NUM_ROWS,
    slidesPerRow: 1,
    arrows: true, 
    nextArrow: <CustomSliderArrow type="next" />,
    slidesToShow: currentItemsPerRow,
    slidesToScroll: currentItemsPerRow,
    responsive: [
      { 
        breakpoint: 1280, 
        settings: { 
          slidesToShow: 10, 
          slidesToScroll: 10, 
          infinite: categoriesData.length > 10 * NUM_ROWS,
          arrows: categoriesData.length > 10 * NUM_ROWS 
        } 
      },
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: 8, 
          slidesToScroll: 8, 
          infinite: categoriesData.length > 8 * NUM_ROWS,
          arrows: categoriesData.length > 8 * NUM_ROWS 
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: 6, 
          slidesToScroll: 6, 
          infinite: categoriesData.length > 6 * NUM_ROWS,
          arrows: categoriesData.length > 6 * NUM_ROWS 
        } 
      },
      { 
        breakpoint: 640, 
        settings: { 
          slidesToShow: 5, 
          slidesToScroll: 5, 
          infinite: categoriesData.length > 5 * NUM_ROWS,
          arrows: categoriesData.length > 5 * NUM_ROWS 
        } 
      },
      { 
        breakpoint: 480, 
        settings: { 
          slidesToShow: 4, 
          slidesToScroll: 4, 
          infinite: categoriesData.length > 4 * NUM_ROWS,
          arrows: categoriesData.length > 4 * NUM_ROWS 
        } 
      },
      { 
        breakpoint: 320, 
        settings: { 
          slidesToShow: 3, 
          slidesToScroll: 3, 
          infinite: categoriesData.length > 3 * NUM_ROWS,
          arrows: categoriesData.length > 3 * NUM_ROWS 
        } 
      }
    ]
  };

  const CategoryItem = ({ item }) => {
    const itemClasses = `
      text-center text-gray-800 no-underline bg-transparent
      flex flex-col items-center justify-start h-full group
      transition-all duration-300 ease-in-out rounded-xl
      hover:shadow-lg hover:bg-white hover:-translate-y-1.5
      p-2.5
    `;

    return (
      <a href={item.slug ? `/category/${item.slug}` : '#'} className={itemClasses} title={item.name}>
        <div className="relative w-16 h-20 md:w-20 md:h-20 mb-2"> 
          {item.label && (
            <span
              className={`
                absolute -top-1 -right-1 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md
                ${item.label === 'hot' ? 'bg-rose-500' : item.label === 'new' ? 'bg-cyan-500' : 'bg-amber-500'}
              `}
            >
              {item.label === 'hot' ? 'HOT' : item.label === 'new' ? 'MỚI' : 'NỔI BẬT'}
            </span>
          )}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
    
        <div className="flex-grow flex items-center justify-center">
            <span
                className="category-item-title text-xs md:text-sm leading-tight text-center font-medium line-clamp-2"
                style={{ minHeight: '2.5em' }} 
            >
                {item.title}
            </span>
        </div>
      </a>
    );
  };

  return (
    <div className="w-full bg-gray-50 rounded-xl shadow-sm overflow-hidden category-section-container">
      <div className="p-2 md:p-4">
        {shouldUseSlider ? (
          <div className="category-slider-wrapper">
            <Slider {...sliderSettings} ref={sliderRef}>
              {categoriesData.map((category) => (
                <div key={category.id} className="h-full category-slide-item">
                  <CategoryItem item={category} />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-2 gap-y-3 category-static-grid`}>
            {categoriesData.slice(0, THRESHOLD_FOR_SLIDER).map((item) => ( // Đảm bảo chỉ hiển thị đủ số lượng cho grid tĩnh
              <div key={item.id} className="category-grid-item">
                <CategoryItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategorySection;