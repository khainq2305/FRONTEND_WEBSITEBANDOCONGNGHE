// src/components/ProductSection.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
    { id: 1, image: "https://via.placeholder.com/300x400/FFCA28/000000?Text=iPhone+1", discount: "-15%", price: "29.790.000đ", oldPrice: "34.990.000đ", save: "Giảm 5.200.000đ", title: "iPhone 16 Pro Max 256GB Chính Hãng VN/A", status: "Còn hàng", rating: 4.9, },
    { id: 2, image: "https://via.placeholder.com/300x400/66BB6A/FFFFFF?Text=iPhone+2", discount: "-17%", price: "24.190.000đ", oldPrice: "28.990.000đ", save: "Giảm 4.800.000đ", title: "iPhone 16 Pro 128GB Chính Hãng VN/A", status: "Còn hàng", rating: 5, },
    { id: 3, image: "https://via.placeholder.com/300x400/EF5350/FFFFFF?Text=iPhone+3", discount: "-19%", price: "18.590.000đ", oldPrice: "22.990.000đ", save: "Giảm 4.400.000đ", title: "iPhone 16 128GB Chính Hãng VN/A", status: "Còn hàng", rating: 5, },
    { id: 4, image: "https://via.placeholder.com/300x400/42A5F5/FFFFFF?Text=iPhone+4", discount: "-39%", price: "11.490.000đ", oldPrice: "18.990.000đ", save: "Giảm 7.500.000đ", title: "iPhone 13 128GB Chính Hãng VN/A", status: "Còn hàng", rating: 4.9, },
    { id: 5, image: "https://via.placeholder.com/300x400/AB47BC/FFFFFF?Text=iPhone+5", discount: "-14%", price: "27.490.000đ", oldPrice: "31.990.000đ", save: "Giảm 4.500.000đ", title: "iPhone 16 Pro 256GB Chính Hãng VN/A", status: "Còn hàng", rating: 5, },
    { id: 6, image: "https://via.placeholder.com/300x400/FFEE58/000000?Text=iPhone+6", discount: "-10%", price: "19.990.000đ", oldPrice: "25.990.000đ", save: "Giảm 6.000.000đ", title: "iPhone 15 Pro 128GB Chính Hãng VN/A", status: "Còn hàng", rating: 4.8, },
    { id: 7, image: "https://via.placeholder.com/300x400/26A69A/FFFFFF?Text=iPhone+7", discount: "-10%", price: "19.990.000đ", oldPrice: "25.990.000đ", save: "Giảm 6.000.000đ", title: "iPhone 15 Pro 128GB Chính Hãng VN/A", status: "Yêu thích", rating: 4.8, },
];

const bannerImages = [
    { id: 'banner1', src: "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F4%2F9%2F1%2F1746790325724_main_spham_01.jpg&w=1920&q=75", alt: "Banner 1" },
    { id: 'banner2', src: "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2025%2F4%2F9%2F1%2F1746790325724_main_spham_01.jpg&w=1920&q=75", alt: "Banner 2" },
];

const CustomArrow = (props) => {
  const { className, onClick, type, iconSize = 24, iconStrokeWidth = 2 } = props;
  return (
    <button
      type="button"
      className={`${className} custom-slick-arrow custom-slick-arrow-${type}`}
      onClick={onClick}
      aria-label={type === 'prev' ? "Previous products" : "Next products"}
    >
      {type === 'prev' ? <ChevronLeft size={iconSize} strokeWidth={iconStrokeWidth} /> : <ChevronRight size={iconSize} strokeWidth={iconStrokeWidth}/>}
    </button>
  );
};

// Renamed the component here
const ProductShowcase = () => {
    const productSliderSettings = {
        dots: false,
        infinite: products.length > 5, // Default infinite based on largest slidesToShow
        speed: 500,
        slidesToShow: 5, // Default for screens > 1535px
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <CustomArrow type="next" />,
        prevArrow: <CustomArrow type="prev" />,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        swipeToSlide: true,
        responsive: [
            { // Desktop lớn جداً (>=1536px) - 5 items
                breakpoint: 5000,
                settings: { slidesToShow: 5, arrows: products.length > 5, infinite: products.length > 5 }
            },
            { // Desktop (xl: >=1280px đến 1535px) - 4 items
                breakpoint: 1535,
                settings: { slidesToShow: 4, arrows: products.length > 4, infinite: products.length > 4 }
            },
            { // Desktop nhỏ / Tablet lớn ngang (lg: >=1024px đến 1279px) - 3 items
                breakpoint: 1279,
                settings: { slidesToShow: 3, arrows: products.length > 3, infinite: products.length > 3 }
            },
            { // Tablet (md: >=768px đến 1023px) - 4 ITEMS
                breakpoint: 1023,
                settings: { slidesToShow: 4, arrows: true, infinite: products.length > 4 }
            },
            { // Mobile lớn (sm: >=640px đến 767px) - 2 ITEMS
                breakpoint: 767,
                settings: { slidesToShow: 2, arrows: false, infinite: products.length > 2 }
            },
            { // Mobile nhỏ (xs: < 640px) - 1 ITEM (QUAN TRỌNG)
                breakpoint: 639,
                settings: {
                    slidesToShow: 1, // CHỈ 1 ITEM
                    arrows: false,
                    infinite: products.length > 1
                }
            }
        ],
    };

    const renderRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) { stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>); }
            else if (i - 0.5 <= rating) { stars.push(<span key={`half-${i}`} className="text-yellow-400">★</span>); } // Giả sử làm tròn lên
            else { stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>); }
        }
        return <div className="flex items-center">{stars}</div>;
    };

    return (
        <div className="bg-white product-section-container group">
            <div className="max-w-screen-xl mx-auto p-3 md:p-4">
                <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 md:mb-4">APPLE CHÍNH HÃNG GIÁ TỐT</h2>

                {/* --- Banner Section --- */}
                <div className="flex overflow-x-auto sm:overflow-visible sm:flex-row gap-3 md:gap-4 mb-3 md:mb-4 hide-scrollbar">
                    {bannerImages.map((banner) => (
                        // sm:w-1/2 -> cho 2 banner trên sm trở lên
                        // w-full -> cho 1 banner chiếm hết chiều rộng trên mobile (dưới sm), cho phép cuộn
                        <div key={banner.id} className="flex-shrink-0 w-full sm:w-1/2">
                            <img
                                src={banner.src}
                                alt={banner.alt}
                                className="w-full rounded-lg object-cover h-auto max-h-[150px] sm:max-h-[200px] md:max-h-[250px]"
                            />
                        </div>
                    ))}
                </div>

                <style jsx global>{`
                    /* CSS cho Product Slider và Mũi tên */
                    .product-section-container .slick-slider {
                        margin-left: -6px; /* Bù trừ cho p-1.5 của ProductCardWrapper */
                        margin-right: -6px;
                    }
                    .custom-slick-arrow {
                        position: absolute; top: 40%; transform: translateY(-50%); z-index: 10;
                        cursor: pointer; border-radius: 50%; width: 40px; height: 40px;
                        display: flex !important; align-items: center; justify-content: center;
                        background-color: rgba(255, 255, 255, 0.9); border: 1px solid #e5e7eb;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s ease-in-out;
                        color: #4B5563; opacity: 0; pointer-events: none;
                    }
                    /* Mũi tên của Product Slider hiện từ md (768px) trở lên KHI HOVER */
                    @media (min-width: 768px) {
                        .product-section-container.group .product-slider-wrapper:hover .custom-slick-arrow {
                            opacity: 1; pointer-events: auto;
                        }
                        .product-section-container.group .product-slider-wrapper:hover .custom-slick-arrow.slick-disabled {
                            opacity: 0.3 !important; pointer-events: none !important; cursor: default;
                        }
                    }
                    /* Ẩn mũi tên của Product Slider dưới md (do arrows: false trong responsive settings) */
                     @media (max-width: 767.98px) {
                         .product-slider-wrapper .custom-slick-arrow {
                            display: none !important;
                         }
                     }
                    .custom-slick-arrow:hover:not(.slick-disabled) {
                        background-color: #ffffff; border-color: #d1d5db; color: #ef4444; box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                    }
                    .custom-slick-arrow.custom-slick-arrow-prev { left: -10px; }
                    .custom-slick-arrow.custom-slick-arrow-next { right: -10px; }
                    .custom-slick-arrow::before { display: none !important; }

                    .slick-slide > div { height: 100%; display: flex; flex-direction: column; align-items: stretch; }

                    /* Tiện ích ẩn thanh cuộn cho banner */
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                {/* Product Slider Wrapper */}
                <div className="relative product-slider-wrapper">
                    <Slider {...productSliderSettings}>
                        {products.map((product) => (
                            // Thẻ div bọc ngoài mỗi card trong slider (có p-1.5)
                            <div key={product.id} className="p-1.5 h-full">
                                {/* THÊM 1 DIV BỌC Ở ĐÂY ĐỂ KIỂM SOÁT KÍCH THƯỚC */}
                                <div className="product-card-inner-wrapper h-full flex"> {/* Thêm class mới và flex */}
                                    {/* Card sản phẩm */}
                                    <div
                                        className={`
                                          bg-white rounded-lg shadow-md p-3 relative border h-full flex flex-col
                                          w-full /* Cho phép chiếm hết div bọc mới này */
                                          /* Bỏ max-w ở đây, để CSS global xử lý */
                                          ${products.length === 1 ? 'mx-auto max-w-[300px]' : 'mx-0'}
                                        `}
                                    >
                                        {/* ... (nội dung card giữ nguyên) ... */}
                                        <div className="absolute top-2 left-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-r-md z-10">
                                            {product.discount}
                                        </div>
                                        {product.id % 2 === 0 && (
                                            <div className="absolute top-2 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-l-md z-10">
                                                Trả góp 0%
                                            </div>
                                        )}
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-40 sm:h-48 object-contain rounded mb-2"
                                        />
                                        <div className="flex flex-col flex-grow">
                                            <a href={`/product/${product.id}`} className="hover:text-red-500">
                                                <p className="text-sm font-semibold mt-1 line-clamp-2 leading-relaxed min-h-[2.75em]">
                                                    {product.title}
                                                </p>
                                            </a>
                                            <div className="mt-1 mb-0.5">{renderRating(product.rating)}</div>
                                            <p className="text-red-600 font-bold text-lg mt-auto">{product.price}</p>
                                            <div className="flex items-center">
                                                <p className="text-gray-500 line-through text-xs mr-2">{product.oldPrice}</p>
                                            </div>
                                            <p className={`text-xs mt-1 font-semibold ${product.status === "Yêu thích" ? "text-pink-500" : "text-green-600"}`}>{product.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

// Updated the export statement
export default ProductShowcase;