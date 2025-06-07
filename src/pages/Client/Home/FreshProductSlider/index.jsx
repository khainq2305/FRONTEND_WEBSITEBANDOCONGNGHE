// FreshProductSlider.js
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
// KHÔNG CẦN import sectionService ở đây nữa
// import { sectionService } from '../../../../services/client/sectionService'; 

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './FreshProductSlider.css'; // Đảm bảo file CSS này tồn tại và đúng đường dẫn

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const InlinedProductCard = ({
  id,
  productId, // ✅ Thêm dòng này
  name,
  price,
  oldPrice,
  discount,
  image,
  rating,
   slug, // ✅ THÊM DÒNG NÀY
  soldCount,
  inStock,
  onAddToFavorites,
  onCompare,
  isFavorite
}) => {

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

    const parsePrice = (priceString) => {
        if (typeof priceString === 'number') return priceString;
        if (typeof priceString === 'string') {
            return parseFloat(priceString.replace(/\./g, '').replace(',', '.'));
        }
        return 0;
    };

    const currentPriceNum = parsePrice(price);
    const oldPriceNum = oldPrice ? parsePrice(oldPrice) : 0;

    return (
        <div className="product-card-item w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white relative transition-shadow duration-200 ease-in-out group/productCard hover:shadow-md">
            {discount > 0 && (<div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">-{discount}%</div>)}
         <Link to={`/product/${slug}`} className="product-card-image-link block relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3">
                <img src={image || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'} alt={name} className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300" loading="lazy"/>
        </Link>
            <div className="product-card-info px-2 xs:px-1.5 sm:px-2.5 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
                <h3 className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200" title={name}>
                 <Link to={`/product/${slug}`} className="hover:underline">{name} </Link>
                </h3>
                <div className="mt-auto">
                    <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
                        <span className="text-red-600 font-bold">{price}₫</span>
                        {oldPrice && (<span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{oldPrice}₫</span>)}
                    </div>
                    {oldPriceNum > 0 && oldPriceNum > currentPriceNum && (
                        <div className="product-card-saving text-gray-500 text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5">
                            Tiết kiệm {(oldPriceNum - currentPriceNum).toLocaleString("vi-VN")}₫
                        </div>
                    )}
                    <div className="pt-1.5">
                        <div className="product-card-meta flex items-center justify-between mb-1.5 sm:mb-2 min-h-[18px]">
                            <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">
                                <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating)}</div>
                                {rating !== null && rating !== undefined && parseFloat(rating) > 0 && (<span className="text-gray-500">({parseFloat(rating).toFixed(1)})</span>)}
                            </div>
                            {inStock && typeof soldCount === 'number' && soldCount >= 0 ? (
                                soldCount > 0 ? (
                                <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium">
                                    Đã bán {soldCount > 999 ? `${(soldCount / 1000).toFixed(0)}k+` : soldCount}
                                </span>
                                ) : (
                                <span className="text-green-600 text-[9.5px] sm:text-[10.5px] font-semibold">Mới về</span>
                                )
                            ) : !inStock ? (
                                <span className="text-red-500 text-[9.5px] sm:text-[10.5px] font-semibold">Hết hàng</span>
                            ) : (
                                <span className="text-green-600 text-[9.5px] sm:text-[10.5px] font-semibold">Còn hàng</span>
                            )}
                        </div>
                        <div className="product-card-actions flex items-center justify-between min-h-[26px]">
                            <button onClick={(e) => { e.stopPropagation(); onCompare(id); }} aria-label="So sánh sản phẩm" className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-blue-700 transition-colors focus:outline-none p-1 rounded hover:bg-gray-100"><CompareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="leading-none whitespace-nowrap">So sánh</span></button>
                          <button
  onClick={(e) => {
    e.stopPropagation();
    onAddToFavorites(productId); // ✅ Dùng productId thay vì id
  }}
  aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
  className={`flex items-center gap-1 text-[10px] sm:text-xs p-1 transition-colors focus:outline-none rounded hover:bg-gray-100 ${
    isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
  }`}
>
  {isFavorite ? (
    <HeartSolidIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
  ) : (
    <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
  )}
  <span className="leading-none whitespace-nowrap">
    {isFavorite ? "Đã thích" : "Yêu thích"}
  </span>
</button>

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

// Nhận props từ HomePage (ví dụ: `title`, `bannersData`, `productsData`)
// HomePage.js sẽ truyền: title={section.title}, bannersData={section.banners}, productsData={productsForSlider}
const FreshProductSlider = ({
  title: titleFromProp,
  bannersData: bannersFromProp,
  productsData: productsFromProp,
  onToggleFavorite = () => {} // ✅ NHẬN THÊM PROP NÀY
}) => {

    const productSliderRef = useRef(null);
    const topBannerSliderRef = useRef(null);

    // State nội bộ của component, khởi tạo từ props
    const [sectionTitle, setSectionTitle] = useState(titleFromProp || "SẢN PHẨM NỔI BẬT");
    const [banners, setBanners] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);

    useEffect(() => {
        // Cập nhật state nội bộ khi props thay đổi
        setSectionTitle(titleFromProp || "SẢN PHẨM NỔI BẬT");

        const mappedBanners = (bannersFromProp || []).map((b, index) => ({
            id: b.id,
            imageUrl: b.imageUrl,
            link: b.linkValue ? (
                b.linkType === 'URL' || (typeof b.linkValue === 'string' && b.linkValue.startsWith('http')) ? b.linkValue :
                b.linkType === 'PRODUCT_DETAIL' ? `#/product/${b.linkValue}` :
                b.linkType === 'CATEGORY' ? `#/category/${b.linkValue}` :
                '#'
            ) : '#',
            altText: b.altText || `${titleFromProp || 'Banner'} ${index + 1}`
        }));
        setBanners(mappedBanners);

        const mappedProducts = (productsFromProp || []).map(p => ({
            ...p, // Giữ lại id, name, image, discount, rating, inStock, soldCount, isFavorite từ prop
            // Format lại giá từ số (nhận từ prop) thành chuỗi có dấu phẩy cho InlinedProductCard
            price: (typeof p.price === 'number' ? p.price.toLocaleString('vi-VN') : String(p.price || '0')),
            oldPrice: (typeof p.oldPrice === 'number' ? p.oldPrice.toLocaleString('vi-VN') : (p.oldPrice ? String(p.oldPrice) : null)),
            isFavorite: p.isFavorite === undefined ? false : p.isFavorite,
        }));
        setCurrentProducts(mappedProducts);

    }, [titleFromProp, bannersFromProp, productsFromProp]); // Chạy lại khi các prop này thay đổi

const handleAddToFavorites = async (productId) => {
  await onToggleFavorite(productId);
  setCurrentProducts(prev =>
    prev.map(p => p.productId === productId ? { ...p, isFavorite: !p.isFavorite } : p)
  );
};



    const handleCompare = (productId) => {
        alert(`So sánh: ${productId} (chưa làm)`);
    };

    // --- BỎ HOÀN TOÀN filterCategoriesData VÀ PHẦN RENDER CỦA NÓ ---

    const topBannerSettings = {
        dots: banners.length > 1,
        arrows: false,
        infinite: banners.length > 1,
        autoplay: true,
        autoplaySpeed: 3500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
    };

    const productSliderSettings = {
        dots: false,
        infinite: currentProducts.length > 5,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
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
                settings: { slidesToShow: 2.2, slidesToScroll: 1, arrows: false, infinite: currentProducts.length > 2.2 }
            },
            {
                breakpoint: 639,
                settings: { slidesToShow: 1.5, slidesToScroll: 1, arrows: false, infinite: currentProducts.length > 1.5 }
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 1.6,
                    slidesToScroll: 1,
                    arrows: false,
                    infinite: currentProducts.length > 1.6
                }
            }
        ]
    };

    // Nếu không có sản phẩm VÀ không có banner nào thì không render gì cả
    if ((!currentProducts || currentProducts.length === 0) && (!banners || banners.length === 0)) {
        return null; 
    }

    return (
        <div className="fresh-slider-wrapper group max-w-screen-xl mx-auto bg-gray-50 rounded-lg shadow-md my-8">
            {/* ---- HEADER BLOCK - START ---- */}
            <div className="header-block px-3 sm:px-4 pt-4 pb-3">
                <div className="flex flex-wrap justify-between items-center gap-y-2 mb-2 sm:mb-3">
                    {/* Hiển thị sectionTitle (đã được cập nhật từ prop titleFromProp) */}
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">
                        {sectionTitle}
                    </h1>
                    {/* --- PHẦN FILTER ĐÃ ĐƯỢC BỎ --- */}
                </div>
                {/* --- PHẦN FILTER TRÊN MOBILE ĐÃ ĐƯỢC BỎ --- */}
            </div>
            {/* ---- HEADER BLOCK - END ---- */}

            {banners && banners.length > 0 && (
                <div className="top-banner-container px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="hidden md:grid md:grid-cols-12 gap-3 sm:gap-4">
                        {banners[0] && (
                            <a href={banners[0].link || '#'} className="block md:col-span-6 rounded-lg overflow-hidden shadow-sm group/banner hover:shadow-lg transition-shadow">
                                <img src={banners[0].imageUrl} alt={banners[0].altText} className="w-full h-auto object-cover group-hover/banner:scale-105 transition-transform duration-300" style={{ aspectRatio: '595 / 214' }} loading="lazy"/>
                            </a>
                        )}
                        {banners[1] && (
                            <a href={banners[1].link || '#'} className="block md:col-span-6 rounded-lg overflow-hidden shadow-sm group/banner hover:shadow-lg transition-shadow">
                                <img src={banners[1].imageUrl} alt={banners[1].altText} className="w-full h-auto object-cover group-hover/banner:scale-105 transition-transform duration-300" style={{ aspectRatio: '595 / 214' }} loading="lazy"/>
                            </a>
                        )}
                    </div>
                    <div className="top-banner-slick-mobile-wrapper md:hidden relative mt-3">
                        {banners.length > 0 && (
                             <Slider {...topBannerSettings} ref={topBannerSliderRef} className="top-banner-slick-mobile">
                             {banners.map((banner) => (
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
                        )}
                    </div>
                </div>
            )}

            <div className="fresh-slider-content-area pt-2 pb-5 px-2 sm:px-4">
                <div className="fresh-slider-title-container flex justify-between items-center mb-3 sm:mb-5">
                    {/* Chỗ này trống theo code gốc của bạn */}
                </div>

                {(!currentProducts || currentProducts.length === 0) ? (
                    (banners && banners.length > 0) ? null : 
                    <p className="text-center py-10 text-gray-500">Không có sản phẩm nào để hiển thị.</p>
                ) : (
                    <Slider {...productSliderSettings} ref={productSliderRef} className="fresh-slick-slider">
                    {currentProducts.map(product => (
                        <div key={product.id} className="p-1.5">
                     <InlinedProductCard
  {...product}
  productId={product.productId} // ✅ thêm dòng này
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