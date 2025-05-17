// ViewedProducts.js
import React, { useRef } from 'react';
import Slider from "react-slick";

// Import CSS cho component này (hoặc đảm bảo style đã được import toàn cục)
import './ViewedProducts.css'; 

// Icons cho mũi tên
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Dữ liệu sản phẩm đã xem (ví dụ)
const viewedProductsData = [ 
  {
    id: 'vp1',
    name: 'Samsung Galaxy A06 4GB/128GB Chính Hãng - BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung Galaxy A06 4GB/128GB Chính Hãng - BHĐT',
    price: '2.390.000',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1746613789982-Realme-14-Si.jpg',
  },
  {
    id: 'vp2',
    name: 'Realme Note 60 4GB/128GB Chính Hãng Ngắn Gọn',
    price: '2.490.000',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1746613789982-Realme-14-Si.jpg',
  },
  {
    id: 'vp3',
    name: 'Realme Note 60 4GB/128GB Chính Hãng tên sản phẩm này khá là dài và sẽ cần phải xuống dòng',
    price: '2.490.000',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1746613789982-Realme-14-Si.jpg',
  },
  {
    id: 'vp4',
    name: 'Xiaomi Redmi Pad Pro 5G Siêu phẩm Cấu Hình Khủng Màn Hình Lớn Pin Trâu Giá Rẻ Vô Địch Trong Tầm Giá',
    price: '5.490.000',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1715765839607-6644893710879-redmi-pad-pro-5g.JPG',
  },
  {
    id: 'vp5',
    name: 'iPhone 15 Pro Max 256GB Chính hãng (VN/A) - Giá siêu tốt',
    price: '27.790.000',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1694668766214-iPhone-15-Pro-Max-natural-titanium.png',
  },
  {
    id: 'vp6',
    name: 'Another Viewed Product - Example Item 6',
    price: '1.990.000',
    image: 'https://placehold.co/160x160/E91E63/FFFFFF?text=VP6',
  },
  {
    id: 'vp7',
    name: 'Yet Another One - Item 7 - Very Long Name to Test Overflow and Clamping if Necessary',
    price: '12.345.000',
    image: 'https://placehold.co/160x160/3F51B5/FFFFFF?text=VP7',
  }
];

// Component CustomSlickArrow (giống các slider trước)
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

export default function ViewedProducts() {
  const sliderRef = useRef(null);

  const sliderSettings = {
    dots: false,
    infinite: viewedProductsData.length > 4, 
    speed: 500,
    slidesToShow: 4, 
    slidesToScroll: 1, 
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true, 
    prevArrow: <CustomSlickArrow type="prev" />,
    nextArrow: <CustomSlickArrow type="next" />,
    responsive: [
      {
        breakpoint: 1280, 
        settings: {
          slidesToShow: 3,
          arrows: viewedProductsData.length > 3,
          infinite: viewedProductsData.length > 3,
        }
      },
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 2.5, 
          arrows: viewedProductsData.length > 2, // Chỉ hiện mũi tên nếu có đủ item để cuộn
          infinite: viewedProductsData.length > 2,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1.8, 
          arrows: false, // Ẩn mũi tên trên màn hình nhỏ hơn
          infinite: viewedProductsData.length > 1,
        }
      },
      {
        breakpoint: 640, 
        settings: {
          slidesToShow: 1.3, 
          arrows: false,
          infinite: viewedProductsData.length > 1,
        }
      }
    ]
  };

  return (
    <div className="viewed-products-section group mt-8 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="font-bold text-[16px] sm:text-lg text-gray-800">Sản phẩm bạn đã xem</h3>
        <button className="text-gray-600 text-sm hover:text-red-500 transition-colors duration-200 group/clear flex items-center gap-1">
          <span className="font-semibold group-hover/clear:underline">Xóa Lịch Sử</span>
          <span className="text-red-500 text-base group-hover/clear:text-red-600 transition-colors duration-200">✖</span>
        </button>
      </div>

      <div className="viewed-products-slider-container py-3 px-2 sm:px-3"> {/* Container cho slider */}
        {viewedProductsData.length > 0 ? (
          <Slider {...sliderSettings} ref={sliderRef} className="viewed-products-slick-slider"> {/* Class cho Slider */}
            {viewedProductsData.map((item) => (
              <div key={item.id || item.name} className="px-1.5 h-full"> {/* Padding tạo gap giữa các item */}
                <div
                  className="w-full h-[88px] bg-white rounded-lg px-3 py-2
                             flex items-center gap-3 shrink-0 shadow hover:shadow-lg
                             transition-all duration-200 hover:-translate-y-0.5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between h-full text-sm overflow-hidden">
                    <a href="#" className="block hover:text-blue-600 transition-colors duration-150">
                      <p className="text-[13px] text-gray-800 line-clamp-2 min-h-[40px] leading-5">
                      {item.name}
                      </p>
                    </a>
                    <p className="text-red-600 font-bold text-[15px] mt-auto">{item.price}đ</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-500 py-4">Chưa có sản phẩm nào được xem.</p>
        )}
      </div>
    </div>
  );
}
