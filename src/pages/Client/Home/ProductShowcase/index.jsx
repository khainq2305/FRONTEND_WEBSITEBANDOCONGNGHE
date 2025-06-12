// src/components/ProductShowcase.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const InlinedProductCard = ({ id, name, price, oldPrice, discount, image, rating, inStock, onAddToFavorites, onCompare, isFavorite }) => {
  const renderStars = (rate) => {
    const stars = [];
    const numRating = parseFloat(rate);
    if (isNaN(numRating) || numRating <= 0) return <div className="h-[14px] sm:h-[16px] w-full"></div>;
    for (let i = 1; i <= 5; i++) {
      if (numRating >= i) stars.push(<FaStar key={`star-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else if (numRating >= i - 0.5) stars.push(<FaStarHalfAlt key={`half-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else stars.push(<FaRegStar key={`empty-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
    }
    return stars;
  };
  return (
    <div className="w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white relative transition-shadow duration-200 ease-in-out group/productCard hover:shadow-md">
      {discount && (<div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">-{discount}%</div>)}
      <div className="relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3"><img src={image} alt={name} className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300" loading="lazy"/></div>
 <div className="px-2.5 sm:px-3 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        <h3
          className="font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200"
          style={{
            width: '200px',         // <--- GIẢI PHÁP CHIỀU RỘNG CỐ ĐỊNH ĐÃ HOẠT ĐỘNG
            whiteSpace: 'normal',  // Quan trọng: Cho phép văn bản xuống dòng
            display: "-webkit-box",
            WebkitLineClamp: 2,      // Giới hạn 2 dòng
            WebkitBoxOrient: "vertical",
            overflow: "hidden",      // Ẩn phần thừa
            textOverflow: "ellipsis",  // Hiển thị dấu "..."
            maxHeight: "2.6rem",     // Chiều cao tối đa cho 2 dòng
            lineHeight: "1.3rem"     // Chiều cao mỗi dòng
          }}
        >
          {name}
        </h3>
        <div className="mt-auto">
          <div className="text-[13px] sm:text-sm mb-0.5"><span className="text-red-600 font-bold">{price}₫</span>{oldPrice && (<span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{oldPrice}₫</span>)}</div>
          {oldPrice && parseFloat(String(oldPrice).replaceAll(".", "")) > parseFloat(String(price).replaceAll(".", "")) && (<div className="text-gray-500 text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5">Giảm {(parseFloat(String(oldPrice).replaceAll(".", "")) - parseFloat(String(price).replaceAll(".", ""))).toLocaleString("vi-VN")}₫</div>)}
          <div className="pt-1.5">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 min-h-[18px]">
              <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600"><div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating)}</div>{rating !== null && rating !== undefined && parseFloat(rating) > 0 && (<span className="text-gray-500">({parseFloat(rating).toFixed(1)})</span>)}</div>
              {inStock && (<span className="text-green-600 text-[9.5px] sm:text-[10.5px] font-semibold">Còn hàng</span>)}
            </div>
            <div className="flex items-center justify-between min-h-[26px]">
              <button onClick={(e) => { e.stopPropagation(); onCompare(id); }} aria-label="So sánh sản phẩm" className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-blue-700 transition-colors focus:outline-none p-1 rounded hover:bg-gray-100"><CompareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="leading-none whitespace-nowrap">So sánh</span></button>
              <button onClick={(e) => { e.stopPropagation(); onAddToFavorites(id); }} aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"} className={`flex items-center gap-1 text-[10px] sm:text-xs p-1 transition-colors focus:outline-none rounded hover:bg-gray-100 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}>{isFavorite ? <HeartSolidIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" /> : <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}<span className="leading-none whitespace-nowrap">{isFavorite ? "Đã thích" : "Yêu thích"}</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const initialAppleProducts = [
  { id: "ap1", name: "iPhone 15 Pro Max 256GB Chính Hãng VN/A Siêu Dài Dòng Test Giao Diện", price: "29.790.000", oldPrice: "34.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 15, rating: 4.9, inStock: true, isFavorite: false, },
  { id: "ap2", name: "iPhone 15 Pro 128GB Chính Hãng VN/A", price: "24.190.000", oldPrice: "28.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 17, rating: 5, inStock: true, isFavorite: true, },
  { id: "ap3", name: "iPhone 14 128GB (Hồng)", price: "18.490.000", oldPrice: "22.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 20, rating: 0, inStock: false, isFavorite: false, },
  { id: "ap4", name: "iPhone 14 Plus 128GB (Xanh)", price: "11.490.000", oldPrice: "18.836.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 39, rating: 4.9, inStock: true, isFavorite: false, },
  { id: "ap5", name: "iPhone 15 256GB (Tím)", price: "27.490.000", oldPrice: "31.965.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 14, rating: 5, inStock: true, isFavorite: true, },
  { id: "ap6", name: "iPhone 13 Pro Max 128GB Cũ", price: "15.790.000", oldPrice: "19.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 21, rating: 4.8, inStock: true, isFavorite: false, },
  { id: "ap7", name: "iPhone 13 64GB Chính hãng", price: "9.990.000", oldPrice: "11.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 17, rating: 4.7, inStock: false, isFavorite: false, },
  { id: "ap8", name: "iPhone SE (2022) 128GB", price: "11.290.000", oldPrice: "13.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 19, rating: 4.5, inStock: true, isFavorite: true, }
];

export default function ProductShowcase({
  productsData = initialAppleProducts,
  sectionTitle = "APPLE CHÍNH HÃNG GIÁ TỐT",
}) {

  const [products, setProducts] = React.useState(
    productsData.map(p => ({
      ...p,
      isFavorite: p.isFavorite || false,
      inStock: p.inStock === undefined ? true : p.inStock
    }))
  );

  const productSliderPrevRef = React.useRef(null);
  const productSliderNextRef = React.useRef(null);

  const handleAddToFavorites = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };
  const handleCompare = (productId) => {
    alert(`So sánh sản phẩm: ${productId} (chức năng chưa hoàn thiện)`);
  };
  
  const getSlidesPerViewForLoopCondition = (slidesPerViewSettings) => {
    let maxSlides = 0;
    if (typeof slidesPerViewSettings === 'number') {
      maxSlides = slidesPerViewSettings;
    } else if (typeof slidesPerViewSettings === 'object') {
      Object.values(slidesPerViewSettings).forEach(val => {
        if (typeof val === 'object' && val.slidesPerView > maxSlides) {
          maxSlides = val.slidesPerView;
        } else if (typeof val === 'number' && val > maxSlides) {
           // This case might not be typical for breakpoints but good to have
           maxSlides = val;
        }
      });
      // Check base slidesPerView if not in breakpoints
      if (swiperSettings && swiperSettings.slidesPerView > maxSlides) {
          maxSlides = swiperSettings.slidesPerView;
      }
    }
    return maxSlides;
  };

  const swiperSettings = {
    modules: [Navigation, Autoplay],
    navigation: { 
      prevEl: productSliderPrevRef.current,
      nextEl: productSliderNextRef.current 
    },
    onBeforeInit: (swiper) => { 
      swiper.params.navigation.prevEl = productSliderPrevRef.current;
      swiper.params.navigation.nextEl = productSliderNextRef.current;
      // swiper.navigation.update(); // Consider re-adding if nav buttons are an issue
    },
    slidesPerView: 1.2, 
    spaceBetween: 8,   
    loop: false, 
    autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
    breakpoints: {
      375: { slidesPerView: 1.5, spaceBetween: 8, loop: false, arrows: false },
      640: { slidesPerView: 2.5, spaceBetween: 10, loop: false, arrows: false }, 
      768: { slidesPerView: 4, spaceBetween: 10, arrows: true },
      1024: { slidesPerView: 5, spaceBetween: 10, arrows: true },
    }
  };
  
  const maxConfiguredSlides = getSlidesPerViewForLoopCondition(swiperSettings.breakpoints);
  const loopCondition = products.length > (maxConfiguredSlides > 0 ? maxConfiguredSlides : (swiperSettings.slidesPerView || 0)) ;


  return (
    <div className="product-showcase-wrapper max-w-[1200px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
  <style>{`
    .product-showcase-wrapper {
      position: relative;
      padding: 0 15px;
      max-width: 100%;
      overflow: hidden;
    }
    .product-showcase-wrapper .swiper-slide {
      width: auto !important;
      flex-shrink: 0;
    }
    .product-showcase-wrapper .swiper-button-prev,
    .product-showcase-wrapper .swiper-button-next {
      color: #007aff;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }
    .product-showcase-wrapper .swiper-button-prev {
      left: -10px;
    }
    .product-showcase-wrapper .swiper-button-next {
      right: -10px;
    }
    .product-showcase-wrapper .swiper-button-prev:hover,
    .product-showcase-wrapper .swiper-button-next:hover {
      background-color: #007aff;
      color: #fff;
    }
  `}</style>

  <div className="content-area py-4 sm:py-5 px-3 sm:px-4">
    <div className="section-title-container mb-3 sm:mb-4">

<h3
  className="font-semibold text-xs sm:text-[13px] text-gray-800 overflow-hidden text-ellipsis ..." // các class khác
  style={{
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxHeight: "2.6rem", // Phù hợp với 2 dòng
    lineHeight: "1.3rem"  // Khoảng cách giữa các dòng
  }}
>
  {sectionTitle} {/* Chỗ này là sectionTitle nhé */}
</h3>


    </div>

    <div className="products-swiper-row overflow-hidden relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          prevEl: productSliderPrevRef.current,
          nextEl: productSliderNextRef.current,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={products.length > 4}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 10 },
          480: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 2.5, spaceBetween: 12 },
          768: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 16 },
          1280: { slidesPerView: 5, spaceBetween: 16 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="flex flex-col">
            <InlinedProductCard {...product} onAddToFavorites={handleAddToFavorites} onCompare={handleCompare} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div ref={productSliderPrevRef} className="swiper-button-prev"></div>
      <div ref={productSliderNextRef} className="swiper-button-next"></div>
    </div>
  </div>
</div>

  );
}