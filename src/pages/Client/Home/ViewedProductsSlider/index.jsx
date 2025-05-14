// src/components/ViewedProductsSlider.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react';

const productsData = [ // Đổi tên biến cho rõ ràng hơn
  { id: 1, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 14 Pro 128GB | Chính hãng VN/A", price: "24.590.000₫", slug: "iphone-14-pro" },
  { id: 2, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 11 Pro 128GB | Chính hãng VN/A", price: "14.590.000₫", slug: "iphone-11-pro" },
  { id: 3, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 12 Pro 128GB | Chính hãng VN/A", price: "18.590.000₫", slug: "iphone-12-pro" },
  { id: 4, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone 13 Pro 128GB | Chính hãng VN/A", price: "20.590.000₫", slug: "iphone-13-pro" },
  { id: 5, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone X Pro 128GB | Chính hãng VN/A", price: "10.590.000₫", slug: "iphone-x-pro" },
  { id: 6, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png", title: "iPhone XS Pro 128GB | Chính hãng VN/A", price: "12.590.000₫", slug: "iphone-xs-pro" },
];

const CustomArrow = (props) => {
  const { className, onClick, type } = props;
  return (
    <button
      type="button"
      className={className} // Giữ nguyên className do react-slick cung cấp để CSS global target được
      onClick={onClick}
      aria-label={type === 'prev' ? "Previous viewed products" : "Next viewed products"}
    >
      {type === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
};

const ViewedProductItem = ({ product }) => {
  return (
    <div className="h-full p-1.5">
      <div className="flex items-center bg-white rounded-md shadow-sm relative p-2.5 border border-gray-200 h-full hover:shadow-lg transition-shadow duration-200">
        <a href={product.slug ? `#/${product.slug}` : '#'} className="flex-shrink-0 mr-2.5">
          <img src={product.image} alt={product.title} className="w-16 h-16 object-contain rounded" loading="lazy"/>
        </a>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <a href={product.slug ? `#/${product.slug}` : '#'} title={product.title}>
            <p className="text-xs font-medium text-gray-700 hover:text-red-500 line-clamp-2 leading-snug mb-0.5">
              {product.title}
            </p>
          </a>
          <p className="text-sm text-red-600 font-semibold">{product.price}</p>
        </div>
        <button
          type="button"
          onClick={() => console.log("Remove UI only:", product.id)}
          className="absolute top-1 right-1 p-0.5 text-gray-300 hover:text-red-500 rounded-full focus:outline-none opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Xóa sản phẩm"
        >
          <XIcon size={14} />
        </button>
      </div>
    </div>
  );
};

const ViewedProductsSlider = () => {
  // Bỏ state nếu chỉ làm giao diện tĩnh
  // const [viewedProducts, setViewedProducts] = React.useState(productsData);

  const settings = {
    dots: false,
    infinite: productsData.length > 4, // Giữ nguyên logic infinite dựa trên số lượng
    speed: 700, // Tăng tốc độ trượt một chút
    slidesToShow: 4,
    slidesToScroll: 1, // Để 1 cho autoplay mượt hơn, và click mũi tên cũng qua 1
    arrows: true,      // Sẽ được kiểm soát bởi CSS cho hover và responsive settings
    nextArrow: <CustomArrow type="next" />,
    prevArrow: <CustomArrow type="prev" />,
    swipeToSlide: true,
    // --- THÊM AUTOPLAY ---
    autoplay: true,
    autoplaySpeed: 4000, // Trượt sau mỗi 4 giây
    pauseOnHover: true,  // Dừng khi hover chuột vào slider
    // --------------------
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: { slidesToShow: 4, slidesToScroll: 1, arrows: productsData.length > 4 }
      },
      {
        breakpoint: 1024, // lg
        settings: { slidesToShow: 3, slidesToScroll: 1, arrows: productsData.length > 3 }
      },
      {
        breakpoint: 768,  // md (tablet)
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: productsData.length > 2 }
      },
      {
        breakpoint: 640,  // sm (mobile lớn)
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          arrows: false, // Tắt mũi tên trên mobile
          centerMode: false,
        }
      },
       {
        breakpoint: 480,  // xs (mobile nhỏ)
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
        <h2 className="text-xl font-semibold mb-2">A.Khải đã xem</h2>
        <p>Chưa có sản phẩm nào được xem gần đây.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow-md w-full viewed-products-slider-container group relative"> {/* Thêm group và relative */}
      <style jsx global>{`
    .viewed-products-slider-container .slick-slider {
  position: relative;
  margin: 0 -2px; /* Cho p-0.5 */
}
@media (min-width: 1024px) { /* lg breakpoint - Desktop */
  .viewed-products-slider-container .slick-slider {
    margin: 0 -4px; /* Cho lg:p-1 */
  }
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

        /* MŨI TÊN */
        .viewed-products-slider-container .slick-arrow { /* Style trực tiếp class của react-slick */
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          z-index: 10;
          cursor: pointer;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex !important; /* Đảm bảo display */
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease-in-out;
          color: #4B5563;
          /* --- CSS CHO HIỆN MŨI TÊN KHI HOVER (DESKTOP) --- */
          opacity: 0; /* Mặc định ẩn */
          pointer-events: none; /* Không cho tương tác khi ẩn */
        }
        .viewed-products-slider-container:hover .slick-arrow {
          opacity: 1; /* Hiện khi hover vào container cha */
          pointer-events: auto;
        }
        .viewed-products-slider-container .slick-arrow.slick-disabled { /* Khi mũi tên bị vô hiệu hóa */
          opacity: 0 !important; /* Luôn ẩn nếu disabled, ngay cả khi đang hover */
          pointer-events: none !important;
        }

        .viewed-products-slider-container .slick-arrow:hover {
          background-color: #f3f4f6;
          border-color: #d1d5db;
          color: #ef4444;
        }
        .viewed-products-slider-container .slick-arrow:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
        }
        .viewed-products-slider-container .slick-prev {
          left: 8px; /* Đặt sát lề trong của padding container */
        }
        .viewed-products-slider-container .slick-next {
          right: 8px; /* Đặt sát lề trong của padding container */
        }
        .viewed-products-slider-container .slick-prev:before,
        .viewed-products-slider-container .slick-next:before {
          display: none !important;
        }

        /* --- ẨN MŨI TÊN TRÊN MOBILE (< LG breakpoint - 1024px) --- */
        /* react-slick responsive settings sẽ đặt arrows:false, nhưng CSS này đảm bảo hơn */
        @media (max-width: 1023.98px) {
          .viewed-products-slider-container .slick-arrow {
            display: none !important;
          }
          .viewed-products-slider-container .slick-slider {
            margin-left: -6px; /* Vẫn giữ margin âm để bù padding của item nếu không có mũi tên */
            margin-right: -6px;
          }
        }
      `}</style>
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">A.Khải đã xem</h2>
        {productsData.length > 0 && (
            <button type="button" onClick={() => alert('Xóa tất cả UI (không xóa data thật)')} className="text-red-500 hover:text-red-700 text-xs md:text-sm font-medium">
                Xóa tất cả
            </button>
        )}
      </div>

      <Slider {...settings}>
        {productsData.map((product) => (
          <ViewedProductItem key={product.id} product={product} onRemove={(id) => console.log("UI Remove:", id)} />
        ))}
      </Slider>
    </div>
  );
};

export default ViewedProductsSlider;