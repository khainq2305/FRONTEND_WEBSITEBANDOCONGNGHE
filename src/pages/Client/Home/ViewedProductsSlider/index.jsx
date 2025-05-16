// src/components/ViewedProductsSlider.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react';

const productsData = [
  { id: 1, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 14 Pro 128GB | Chính hãng VN/A", price: "24.590.000₫", slug: "iphone-14-pro" },
  { id: 2, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 11 Pro 128GB | Chính hãng VN/A", price: "14.590.000₫", slug: "iphone-11-pro" },
  { id: 3, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 12 Pro 128GB | Chính hãng VN/A", price: "18.590.000₫", slug: "iphone-12-pro" },
  { id: 4, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 13 Pro 128GB | Chính hãng VN/A", price: "20.590.000₫", slug: "iphone-13-pro" },
  { id: 5, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone X Pro 128GB | Chính hãng VN/A", price: "10.590.000₫", slug: "iphone-x-pro" },
  { id: 6, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone XS Pro 128GB | Chính hãng VN/A", price: "12.590.000₫", slug: "iphone-xs-pro" },
];

// CustomArrow vẫn là một hàm riêng ở cấp module
const CustomArrow = (props) => {
  const { className, onClick, type } = props;
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={type === 'prev' ? "Previous viewed products" : "Next viewed products"}
    >
      {type === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
};

const ViewedProductsSlider = () => {
  

  const settings = {
    dots: false,
    infinite: productsData.length > 4,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomArrow type="next" />,
    prevArrow: <CustomArrow type="prev" />,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4, slidesToScroll: 1, arrows: productsData.length > 4 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1, arrows: productsData.length > 3 }
      },
      {
        breakpoint: 768,  
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: productsData.length > 2 }
      },
      {
        breakpoint: 640, 
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          arrows: false,
          centerMode: false,
        }
      },
      {
        breakpoint: 480,  
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          arrows: false,
          centerMode: false,
        }
      }
    ]
  };

  if (productsData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md max-w-screen-xl mx-auto text-center text-gray-500">
        <h2 className="text-xl font-semibold mb-2 text-primary">A.Khải đã xem</h2>
        <p>Chưa có sản phẩm nào được xem gần đây.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow-md w-full viewed-products-slider-container group relative">
      <style jsx global>{`
        /* Các CSS variables và class tiện ích như .text-primary, .text-secondary 
           được giả định đã định nghĩa trong file CSS global của bạn.
        */

        .viewed-products-slider-container .slick-slider {
          position: relative;
          margin: 0 -3px; 
        }

        .viewed-products-slider-container .slick-list {}
        .viewed-products-slider-container .slick-slide {
          box-sizing: border-box;
          height: auto;
        }
        .viewed-products-slider-container .slick-slide > div {
          height: 100%;
          display: flex;
        }

        .viewed-products-slider-container .slick-arrow {
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          z-index: 10;
          cursor: pointer;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex !important;
          align-items: center;
          justify-content: center;
          background-color: var(--arrow-button-bg-normal, #FFFFFF);
          border: 1px solid var(--arrow-button-border-normal, #e5e7eb);
          color: var(--primary-color, #1CA7EC); 
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease-in-out;
          opacity: 0; 
          pointer-events: none;
        }
        .viewed-products-slider-container.group:hover .slick-arrow {
          opacity: 1; 
          pointer-events: auto;
        }
        .viewed-products-slider-container .slick-arrow.slick-disabled {
          opacity: 0 !important; 
          pointer-events: none !important;
        }
        .viewed-products-slider-container .slick-arrow:hover:not(.slick-disabled) {
          background-color: var(--arrow-button-bg-hover, var(--primary-color));
          border-color: var(--arrow-button-bg-hover, var(--primary-color));
          color: var(--arrow-icon-hover, #FFFFFF); 
        }
        .viewed-products-slider-container .slick-arrow:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(28, 167, 236, 0.3);
        }
        .viewed-products-slider-container .slick-prev {
          left: 8px; 
        }
        .viewed-products-slider-container .slick-next {
          right: 8px; 
        }
        .viewed-products-slider-container .slick-prev:before,
        .viewed-products-slider-container .slick-next:before {
          display: none !important;
        }

        @media (max-width: 1023.98px) {
          .viewed-products-slider-container .slick-arrow {
            display: none !important;
          }
          .viewed-products-slider-container .slick-slider {
            margin-left: -3px; 
            margin-right: -3px;
          }
        }
      `}</style>
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-lg md:text-xl font-bold text-primary">A.Khải đã xem</h2>
        {productsData.length > 0 && (
          <button 
            type="button" 
            onClick={() => alert('Xóa tất cả UI (không xóa data thật)')} 
            className="text-primary hover:text-secondary text-xs md:text-sm font-medium"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <Slider {...settings}>
        {productsData.map((product) => (
   
          <div key={product.id} className="h-full p-1.5">
            <div className="flex items-center bg-white rounded-md shadow-sm relative p-2.5 border border-gray-200 h-full hover:shadow-lg transition-shadow duration-200">
              <a href={product.slug ? `#/${product.slug}` : '#'} className="flex-shrink-0 mr-2.5">
                <img src={product.image} alt={product.title} className="w-16 h-16 object-contain rounded" loading="lazy"/>
              </a>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <a href={product.slug ? `#/${product.slug}` : '#'} title={product.title}>
                  <p className="text-xs font-medium text-gray-800 hover:text-primary line-clamp-2 leading-snug mb-0.5">
                    {product.title}
                  </p>
                </a>
                <p className="text-sm text-red-600 font-semibold">{product.price}</p>
              </div>
              <button
                type="button"
                onClick={() => console.log("Remove UI only:", product.id)}
                className="absolute top-1 right-1 p-0.5 text-primary hover:text-secondary focus:outline-none opacity-60 hover:opacity-100 focus:opacity-100 transition-all"
                aria-label="Xóa sản phẩm"
              >
                <XIcon size={14} />
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ViewedProductsSlider;