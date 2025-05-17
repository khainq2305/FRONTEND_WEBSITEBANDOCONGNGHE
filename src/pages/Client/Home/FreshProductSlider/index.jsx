// FreshProductSlider.js
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './FreshProductSlider.css'; 

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const topBannersDataFixed = [
  { id: 'top_banner_1', imageUrl: 'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746670952033-595x214_Section-Banner-iPhone-12-pro.jpg&w=1080&q=75', link: '#', altText: 'iPhone 12 Pro Max Banner' },
  { id: 'top_banner_2', imageUrl: 'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746670952033-595x214_Section-Banner-iPhone-12-pro.jpg&w=1080&q=75', link: '#', altText: 'Samsung Galaxy A05 Banner' },
];

const realProductsData = [ 
  { id: "ap1", name: "iPhone 15 Pro Max 256GB Chính Hãng VN/A - Đây là một cái tên sản phẩm rất dài để kiểm tra xem nó có bị vỡ layout hay không khi hiển thị trên nhiều dòng", price: "29.790.000", oldPrice: "34.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 15, rating: 4.9, inStock: true, soldCount: 1234, isFavorite: false },
  { id: "ap2", name: "iPhone 15 Pro 128GB - Một Cái Tên Khác Cũng Dài Không Kém Phần Cạnh Tranh Để Xem Xuống Dòng Thế Nào", price: "24.190.000", oldPrice: "28.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro_3.png", discount: 17, rating: 5, inStock: true, soldCount: 850, isFavorite: true },
  { id: "ap3", name: "iPhone 13 128GB Chính hãng", price: "18.490.000", oldPrice: "22.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png", discount: 20, rating: 4.8, inStock: true, soldCount: 1500, isFavorite: false },
  { id: "ap4", name: "Samsung Galaxy S23 Ultra Camera Zoom Xa Tít Tắp", price: "21.790.000", oldPrice: "28.490.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s23-ultra.png", discount: 24, rating: 4.9, inStock: true, soldCount: 700, isFavorite: true },
  { id: "ap5", name: "iPad Gen 9 10.2 inch Wi-Fi Học Online Làm Việc Đều Tốt", price: "7.990.000", oldPrice: "9.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-gen-9-2_%20slanted.png", discount: 17, rating: 5, inStock: true, soldCount: 300, isFavorite: false },
  { id: "ap6", name: "Apple Watch SE 2022 GPS Theo Dõi Sức Khỏe", price: "6.790.000", oldPrice: "7.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/w/a/watch-se-2022_2.png", discount: 15, rating: 4.7, inStock: true, soldCount: 950, isFavorite: true },
  { id: "ap7", name: "AirPods 3 (Lightning) Nghe Nhạc Hay Pin Trâu", price: "4.190.000", oldPrice: "5.490.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-3-2_4.png", discount: 24, rating: 4.9, inStock: true, soldCount: 2000, isFavorite: false },
];

const filterCategoriesData = [ // Dữ liệu cho các nút lọc mới
  { id: 'apple', label: 'Apple', link: '#' },
  { id: 'samsung', label: 'Samsung', link: '#' },
  { id: 'xiaomi', label: 'Xiaomi', link: '#' },
  { id: 'oppo', label: 'OPPO', link: '#' },
  { id: 'vivo', label: 'Vivo', link: '#' },
  { id: 'realme', label: 'Realme', link: '#' },
  { id: 'all', label: 'Xem tất cả', link: '#' }
];

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
      <a href={`#product/${id}`} className="product-card-image-link block relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3">
        <img src={image} alt={name} className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300" loading="lazy"/>
      </a>
      <div className="product-card-info px-2 xs:px-1.5 sm:px-2.5 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        <h3 className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200" title={name}>
          <a href={`#product/${id}`} className="hover:underline">{name}</a>
        </h3>
        <div className="mt-auto">
          <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
            <span className="text-red-600 font-bold">{price}₫</span>
            {oldPrice && (<span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{oldPrice}₫</span>)}
          </div>
          {oldPrice && parseFloat(String(oldPrice).replaceAll(".", "")) > parseFloat(String(price).replaceAll(".", "")) && (
            <div className="product-card-saving text-gray-500 text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5">
              Giảm {(parseFloat(String(oldPrice).replaceAll(".", "")) - parseFloat(String(price).replaceAll(".", ""))).toLocaleString("vi-VN")}₫
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

const FreshProductSlider = ({ 
  products = realProductsData, 
  mainSectionTitle = "APPLE CHÍNH HÃNG GIÁ TỐT"
}) => {
  
  const productSliderRef = useRef(null);
  const topBannerSliderRef = useRef(null);

  const [currentProducts, setCurrentProducts] = useState(
    products.map(p => ({ ...p, isFavorite: p.isFavorite || false, inStock: p.inStock === undefined ? true : p.inStock, soldCount: p.soldCount || 0 }))
  );

  const handleAddToFavorites = (productId) => {
    setCurrentProducts(prev => prev.map(p => p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p));
  };
  const handleCompare = (productId) => {
    alert(`So sánh: ${productId} (chưa làm)`);
  };

  const topBannerSettings = {
    dots: topBannersDataFixed.length > 1,
    arrows: false,
    infinite: topBannersDataFixed.length > 1,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  };

  const productSliderSettings = {
    dots: false,
    infinite: currentProducts.length > 5, // Sẽ được ghi đè trong responsive
    speed: 500,
    slidesToShow: 5, // Mặc định cho desktop
    slidesToScroll: 1, 
    arrows: true, // Sẽ bị ghi đè trong responsive
    prevArrow: <CustomSlickArrow type="prev" />,
    nextArrow: <CustomSlickArrow type="next" />,
    centerMode: false,
    swipeToSlide: true, 
    responsive: [
      {
        breakpoint: 1279, 
        settings: { slidesToShow: 4, slidesToScroll: 1, arrows: currentProducts.length > 4, infinite: currentProducts.length > 4 }
      },
      {
        breakpoint: 1023, 
        settings: { slidesToShow: 3, slidesToScroll: 1, arrows: currentProducts.length > 3, infinite: currentProducts.length > 3 }
      },
      {
        breakpoint: 767, 
        settings: { slidesToShow: 2.2, slidesToScroll: 1, arrows: false, infinite: currentProducts.length > 2 }
      },
      {
        breakpoint: 639, 
        settings: { slidesToShow: 1.5, slidesToScroll: 1, arrows: false, infinite: currentProducts.length > 1 }
      },
      {
        breakpoint: 479, 
        settings: { 
          slidesToShow: 1.6, 
          slidesToScroll: 1, 
          arrows: false, 
          infinite: currentProducts.length > 1 
        }
      }
    ]
  };

  return (
    <div className="fresh-slider-wrapper group max-w-screen-xl mx-auto bg-gray-50 rounded-lg shadow-md my-8">
      {/* ---- HEADER BLOCK - START ---- */}
      <div className="header-block px-3 sm:px-4 pt-4 pb-3">
        <div className="flex flex-wrap justify-between items-center gap-y-2 mb-2 sm:mb-3"> {/* Thêm flex-wrap và gap-y */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">
            {mainSectionTitle}
          </h1>
          {/* Các nút lọc cho desktop - hiển thị khi màn hình md trở lên */}
          <div className="hidden md:flex flex-wrap items-center gap-x-1.5 gap-y-1.5"> {/* Thêm flex-wrap và gap-y */}
            {filterCategoriesData.map(category => (
              <a
                key={category.id}
                href={category.link || '#'}
                className="text-xs sm:text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium py-1.5 px-3 rounded-full transition-colors whitespace-nowrap"
              >
                {category.label}
              </a>
            ))}
          </div>
        </div>
        {/* Các nút lọc cho mobile - hiển thị khi màn hình nhỏ hơn md */}
        {/* Sử dụng overflow-x-auto để có thể cuộn ngang nếu không đủ chỗ */}
        <div className="md:hidden">
          <div className="flex space-x-2 overflow-x-auto pb-2 -mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filterCategoriesData.map(category => (
              <a
                key={category.id}
                href={category.link || '#'}
                className="flex-shrink-0 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium py-1.5 px-3 rounded-full transition-colors whitespace-nowrap"
              >
                {category.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* ---- HEADER BLOCK - END ---- */}

      {topBannersDataFixed && topBannersDataFixed.length > 0 && (
        <div className="top-banner-container px-3 sm:px-4 pb-3 sm:pb-4"> 
          <div className="hidden md:grid md:grid-cols-12 gap-3 sm:gap-4">
            {topBannersDataFixed[0] && (
              <a href={topBannersDataFixed[0].link || '#'} className="block md:col-span-6 rounded-lg overflow-hidden shadow-sm group/banner hover:shadow-lg transition-shadow">
                <img src={topBannersDataFixed[0].imageUrl} alt={topBannersDataFixed[0].altText} className="w-full h-auto object-cover group-hover/banner:scale-105 transition-transform duration-300" style={{aspectRatio: '595 / 214'}} loading="lazy"/>
              </a>
            )}
            {topBannersDataFixed[1] && (
              <a href={topBannersDataFixed[1].link || '#'} className="block md:col-span-6 rounded-lg overflow-hidden shadow-sm group/banner hover:shadow-lg transition-shadow">
                <img src={topBannersDataFixed[1].imageUrl} alt={topBannersDataFixed[1].altText} className="w-full h-auto object-cover group-hover/banner:scale-105 transition-transform duration-300" style={{aspectRatio: '595 / 214'}} loading="lazy"/>
              </a>
            )}
          </div>
          <div className="top-banner-slick-mobile-wrapper md:hidden relative mt-3">
            <Slider {...topBannerSettings} ref={topBannerSliderRef} className="top-banner-slick-mobile">
              {topBannersDataFixed.map((banner) => (
                <div key={banner.id} className="px-0.5"> 
                  <a 
                    href={banner.link || '#'} 
                    className="block w-full rounded-md sm:rounded-lg overflow-hidden shadow-sm"
                  >
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.altText} 
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </a>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      <div className="fresh-slider-content-area pt-2 pb-5 px-2 sm:px-4"> 
        <div className="fresh-slider-title-container flex justify-between items-center mb-3 sm:mb-5">
          {/* Nơi này trống, có thể bạn muốn thêm gì đó sau */}
        </div>

        {(!currentProducts || currentProducts.length === 0) ? (
            <p className="text-center py-10 text-gray-500">Không có sản phẩm nào để hiển thị.</p>
        ) : (
            <Slider {...productSliderSettings} ref={productSliderRef} className="fresh-slick-slider">
              {currentProducts.map(product => (
                <div key={product.id} className="p-1.5"> 
                  <InlinedProductCard 
                    {...product} 
                    onAddToFavorites={handleAddToFavorites} 
                    onCompare={handleCompare} 
                  /> 
                </div>
              ))}
            </Slider>
        )}
      </div>
    </div>
  );
};

export default FreshProductSlider;