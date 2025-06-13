import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './RelatedProductsSlider.css';

import { productService } from '../../../../services/client/productService'; 
import useFavorites from '../../../../hooks/useFavorites';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const InlinedProductCard = ({ id, name, price, oldPrice, discount, image, rating, soldCount, inStock, onAddToFavorites, onCompare, isFavorite }) => {
  
    const renderStars = (rate) => {
      const stars = [];
      const numRating = parseFloat(rate);
      if (isNaN(numRating) || numRating <= 0) return <div className="h-[14px] sm:h-[16px] w-auto"></div>;
      for (let i = 1; i <= 5; i++) {
        if (numRating >= i) stars.push(<FaStar key={`star-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
        else if (numRating >= i - 0.5) stars.push(<FaStarHalfAlt key={`half-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
        else stars.push(<FaRegStar key={`empty-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      }
      return stars;
    };
    return (
      <div className="product-card-item w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white relative transition-shadow duration-200 ease-in-out group/productCard hover:shadow-md">
        {discount && (<div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">-{discount}%</div>)}
        <a href={`/product/${id}`} className="product-card-image-link block relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3">
          <img src={image} alt={name} className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300" loading="lazy"/>
        </a>
        <div className="product-card-info px-2 xs:px-1.5 sm:px-2.5 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
          <h3 className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200" title={name}>
            <a href={`/product/${id}`} className="hover:underline">{name}</a>
          </h3>
          <div className="mt-auto">
            <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
              <span className="text-red-600 font-bold">{formatCurrencyVND(price)}</span>
              {oldPrice && (<span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{formatCurrencyVND(oldPrice)}</span>)}
            </div>
            {oldPrice && price && oldPrice > price && (
              <div className="product-card-saving text-gray-500 text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5">
                Giảm {formatCurrencyVND(oldPrice - price)}
              </div>
            )}
            <div className="pt-1.5">
              <div className="product-card-meta flex items-center justify-between mb-1.5 sm:mb-2 min-h-[18px]">
                <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">
                  <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating)}</div>
                  {rating !== null && rating !== undefined && parseFloat(rating) > 0 && (<span className="text-gray-500">({parseFloat(rating).toFixed(1)})</span>)}
                </div>
                {inStock && typeof soldCount === 'number' && soldCount > 0 ? (
                  <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium">
                    Đã bán {soldCount > 999 ? `${(soldCount / 1000).toFixed(0)}k+` : soldCount}
                  </span>
                ) : !inStock ? (
                  <span className="text-red-500 text-[9.5px] sm:text-[10.5px] font-semibold">Hết hàng</span>
                ) : (
                  <span className="text-green-600 text-[9.5px] sm:text-[10.5px] font-semibold">Mới về</span>
                )}
              </div>
              <div className="product-card-actions flex items-center justify-between min-h-[26px]">
                <button onClick={(e) => { e.stopPropagation(); onCompare(id); }} aria-label="So sánh sản phẩm" className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-blue-700 transition-colors focus:outline-none p-1 rounded hover:bg-gray-100"><CompareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="leading-none whitespace-nowrap">So sánh</span></button>
                <button onClick={(e) => { e.stopPropagation(); onAddToFavorites(id); }} aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"} className={`flex items-center gap-1 text-[10px] sm:text-xs p-1 transition-colors focus:outline-none rounded hover:bg-gray-100 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}>{isFavorite ? <HeartSolidIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" /> : <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}<span className="leading-none whitespace-nowrap">{isFavorite ? "Đã thích" : "Yêu thích"}</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
const CustomSlickArrow = (props) => {
    
    const { type, onClick, className, style } = props;
    return (
      <button
        type="button"
        className={className}
        style={{ ...style }}
        onClick={onClick}
        aria-label={type === 'prev' ? "Previous products" : "Next products"}
      >
        {type === 'prev' ? <ChevronLeftIcon className="slick-arrow-icon" /> : <ChevronRightIcon className="slick-arrow-icon" />}
      </button>
    );
};

const RelatedProductsSlider = ({
  categoryId,
  currentProductId,
  mainSectionTitle = "SẢN PHẨM TƯƠNG TỰ"
}) => {

  const productSliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  

  const SLIDER_THRESHOLD = 5;

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await productService.getRelated(categoryId, currentProductId, 12);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm tương tự:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  const handleCompare = (productId) => {
    alert(`So sánh sản phẩm: ${productId} (chưa làm)`);
  };
  
  const productSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <CustomSlickArrow type="prev" />,
    nextArrow: <CustomSlickArrow type="next" />,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1279, settings: { slidesToShow: 4 } },
      { breakpoint: 1023, settings: { slidesToShow: 3 } },
      { breakpoint: 767, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 479, settings: { slidesToShow: 1, arrows: false } }
    ]
  };
  
  if (isLoading) {
    return (
        <div className="max-w-[1200px] mx-auto my-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap px-4 mb-4">{mainSectionTitle}</h1>
            <p className="text-center py-10 text-gray-500">Đang tải các sản phẩm tương tự...</p>
        </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }
  
 
  const renderContent = () => {
    if (products.length < SLIDER_THRESHOLD) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {products.map(product => (
            <div key={product.id} className="p-1.5">
              <InlinedProductCard
                {...product}
                isFavorite={isFavorite(product.id)}
                onAddToFavorites={toggleFavorite}
                onCompare={handleCompare}
              />
            </div>
          ))}
        </div>
      );
    }
    return (
      <Slider {...productSliderSettings} ref={productSliderRef} className="fresh-slick-slider">
        {products.map(product => (
          <div key={product.id} className="p-1.5">
            <InlinedProductCard
              {...product}
              isFavorite={isFavorite(product.id)}
              onAddToFavorites={toggleFavorite}
              onCompare={handleCompare}
            />
          </div>
        ))}
      </Slider>
    );
  };
  
  return (
    <div className="category-slider-wrapper group max-w-[1200px] mx-auto bg-gray-50 rounded-lg shadow-md my-8">
      <div className="header-block px-3 sm:px-4 pt-4 pb-3">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">{mainSectionTitle}</h1>
        </div>
      </div>
      <div className="product-slider-content-area pt-2 pb-5 px-2 sm:px-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default RelatedProductsSlider;