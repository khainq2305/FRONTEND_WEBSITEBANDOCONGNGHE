// TestResponsiveSlider.js
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './TestResponsiveSlider.css'; // File CSS bạn đã cung cấp

// Icons
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Dữ liệu sản phẩm (không đổi)
const testProductsData = [
  { id: "ap1", name: "iPhone 15 Pro Max 256GB Chính Hãng VN/A - Tên Rất Rất Dài Để Kiểm Tra Xem Có Bị Vỡ Layout Không Khi Hiển Thị Trên Nhiều Dòng Và Cần Phải Xuống Dòng Thật Chính Xác", price: "29.790.000", oldPrice: "34.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png", discount: 15, rating: 4.9, inStock: true, soldCount: 1234, isFavorite: false },
  { id: "ap2", name: "iPhone 15 Pro 128GB - Một Cái Tên Khác Cũng Dài Không Kém Phần Cạnh Tranh Để Xem Xuống Dòng Thế Nào", price: "24.190.000", oldPrice: "28.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro_3.png", discount: 17, rating: 5, inStock: true, soldCount: 850, isFavorite: true },
  { id: "ap3", name: "iPhone 13 128GB Chính hãng - Tên Ngắn Một Dòng", price: "18.490.000", oldPrice: "22.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png", discount: 20, rating: 4.8, inStock: true, soldCount: 1500, isFavorite: false },
  { id: "ap4", name: "Samsung Galaxy S23 Ultra Camera Zoom Xa Tít Tắp Luôn Nhé Đảm Bảo Chất Lượng Hình Ảnh Vượt Trội So Với Đối Thủ Cùng Phân Khúc", price: "21.790.000", oldPrice: "28.490.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s23-ultra.png", discount: 24, rating: 4.9, inStock: true, soldCount: 700, isFavorite: true },
  { id: "ap5", name: "iPad Gen 9 10.2 inch Wi-Fi", price: "7.990.000", oldPrice: "9.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-gen-9-2_%20slanted.png", discount: 17, rating: 5, inStock: true, soldCount: 300, isFavorite: false },
  { id: "ap6", name: "Apple Watch SE 2022 GPS", price: "6.790.000", oldPrice: "7.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/w/a/watch-se-2022_2.png", discount: 15, rating: 4.7, inStock: true, soldCount: 950, isFavorite: true },
  { id: "ap7", name: "AirPods 3 (Lightning) Nghe Nhạc Hay Pin Trâu", price: "4.190.000", oldPrice: "5.490.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-3-2_4.png", discount: 24, rating: 4.9, inStock: true, soldCount: 2000, isFavorite: false },
  { id: "ap8", name: "Macbook Air M2 2023 Mới Nhất Siêu Mỏng Nhẹ", price: "25.790.000", oldPrice: "30.000.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m2-1.png", discount: 14, rating: 5.0, inStock: true, soldCount: 150, isFavorite: false },
  { id: "ap9", name: "Oppo Reno10 5G Camera Chân Dung Tuyệt Đẹp", price: "9.490.000", oldPrice: "10.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno-10-5g-blue-thumb-600x600.png", discount: 13, rating: 4.7, inStock: true, soldCount: 400, isFavorite: true },
  { id: "ap10", name: "Xiaomi 13T Pro Hiệu Năng Đỉnh Cao Chơi Game Cực Đã", price: "13.990.000", oldPrice: "16.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-13t-pro_2__1_1.png", discount: 18, rating: 4.8, inStock: false, soldCount: 220, isFavorite: false },
  { id: "ap11", name: "Realme C55 8GB 256GB Thiết Kế Thời Trang", price: "4.590.000", oldPrice: "5.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/r/e/realme-c55_2_.png", discount: 23, rating: 4.5, inStock: true, soldCount: 750, isFavorite: false },
  { id: "ap12", name: "Vivo Y36 128GB Màn Hình Lớn Pin Khủng", price: "5.290.000", oldPrice: "6.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/i/vivo-y36_%20trang.jpg", discount: 24, rating: 4.6, inStock: true, soldCount: 320, isFavorite: true },
];

// Component InlinedProductCard (Giữ nguyên như phiên bản bạn cung cấp)
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
      <div className="product-card-info px-2 xs:px-1.5 sm:px-2 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        <h3 className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200" title={name}>
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

// Component ProductColumn (không đổi)
const ProductColumn = ({ productTop, productBottom, onAddToFavorites, onCompare }) => {
  return (
    <div className="flex flex-col space-y-1.5 h-full">
      {productTop && (
        <div className="flex-1 min-h-0">
          <InlinedProductCard {...productTop} onAddToFavorites={onAddToFavorites} onCompare={onCompare} />
        </div>
      )}
      {productBottom && (
        <div className="flex-1 min-h-0">
          <InlinedProductCard {...productBottom} onAddToFavorites={onAddToFavorites} onCompare={onCompare} />
        </div>
      )}
      {!productBottom && productTop && (
        <div className="flex-1 min-h-0 invisible">
          <InlinedProductCard {...productTop} />
        </div>
      )}
    </div>
  );
};

// Component CustomSlickArrow (không đổi)
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

const TwoRowMarketSlider = ({
  productsInput = testProductsData,
  imageBannerUrl = "https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1747363363284-1200x193_Banner-Hot-Section-Homepage-Desktop.jpg&w=1920&q=75",
  saleTimeText = "CHỈ TRONG 3 NGÀY: 17/05 - 20/05!",
}) => {

  const sliderRef = useRef(null);
  const [products, setProducts] = useState(
    productsInput.map(p => ({ ...p, isFavorite: p.isFavorite || false }))
  );

  useEffect(() => {
    setProducts(productsInput.map(p => ({ ...p, isFavorite: p.isFavorite || false })))
  }, [productsInput]);

  const handleAddToFavorites = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleCompare = (productId) => {
    alert(`So sánh: ${productId}`);
  };

  const pairedProducts = [];
  for (let i = 0; i < products.length; i += 2) {
    pairedProducts.push({
      id: `pair-${products[i].id}`,
      top: products[i],
      bottom: products[i + 1] || null
    });
  }

  const desktopColumns = 5;
  const sliderSettings = {
    dots: false,
    infinite: true, // Đặt infinite: true để cuộn vòng, giúp slidesToScroll nhất quán hơn
    speed: 600, 
    slidesToShow: desktopColumns,
    slidesToScroll: 1, // <<<< THAY ĐỔI slidesToScroll thành 1 cho tất cả
    arrows: true, 
    autoplay: true, 
    autoplaySpeed: 7000, 
    pauseOnHover: true,
    prevArrow: <CustomSlickArrow type="prev" />,
    nextArrow: <CustomSlickArrow type="next" />,
    centerMode: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1279,
        settings: { 
            slidesToShow: 4, 
            slidesToScroll: 1, // <<<< THAY ĐỔI
            arrows: pairedProducts.length > 4, // Giữ nguyên logic hiển thị arrows
            infinite: true 
        }
      },
      {
        breakpoint: 1023,
        settings: { 
            slidesToShow: 3, 
            slidesToScroll: 1, // <<<< THAY ĐỔI
            arrows: pairedProducts.length > 3,
            infinite: true 
        }
      },
      {
        breakpoint: 767,
        settings: { 
            slidesToShow: 2.2, 
            slidesToScroll: 1, // Giữ nguyên là 1
            arrows: false, 
            infinite: true 
        }
      },
      {
        breakpoint: 639,
        settings: { 
            slidesToShow: 2.4, 
            slidesToScroll: 1, // Giữ nguyên là 1
            arrows: false, 
            infinite: true 
        }
      },
      {
        breakpoint: 479,
        settings: { 
            slidesToShow: 1.7, 
            slidesToScroll: 1, // Giữ nguyên là 1
            arrows: false, 
            infinite: true 
        }
      }
    ]
  };

  return (
    <div className="main-event-block max-w-screen-xl mx-auto my-6 bg-white rounded-xl shadow-xl overflow-hidden">
        {imageBannerUrl && (
            <img src={imageBannerUrl} alt="Sự kiện khuyến mãi" className="w-full h-auto object-cover" />
        )}
        {saleTimeText && (
            <div className="sale-time-info text-center py-3 px-4 bg-red-100">
                <p className="text-xl sm:text-2xl font-bold text-red-700 uppercase tracking-wider">{saleTimeText}</p>
            </div>
        )}
        <div className="two-row-slider-wrapper product-showcase-area group bg-[#AA495A] p-2 sm:p-4">
            <div className="slider-inner-content">
                {(!pairedProducts || pairedProducts.length === 0) ? (
                    <p className="text-center py-10 text-white font-semibold text-lg">Không có sản phẩm nào.</p>
                ) : (
                    <Slider {...sliderSettings} ref={sliderRef} className="two-row-slick-slider">
                    {pairedProducts.map(pair => (
                        <div key={pair.id} className="px-1 sm:px-1.5">
                        <ProductColumn
                            productTop={pair.top}
                            productBottom={pair.bottom}
                            onAddToFavorites={handleAddToFavorites}
                            onCompare={handleCompare}
                        />
                        </div>
                    ))}
                    </Slider>
                )}
            </div>
        </div>
    </div>
  );
};

export default TwoRowMarketSlider;