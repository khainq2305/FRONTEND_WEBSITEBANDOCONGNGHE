import React, { useRef } from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './TestResponsiveSlider.css'; // Đảm bảo bạn có file CSS này
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import CountdownTimer from './CountdownTimer';

const InlinedProductCard = ({
    id, slug, name, price, oldPrice, discount, image, rating, soldCount, inStock, badge, quantity
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

    const renderBadge = () => {
        if (!badge) {
            return <div className="mb-2 h-[28px]"></div>;
        }
        // Thay thế bằng đường dẫn ảnh thực tế trong project của bạn
        const badgeImageMap = {
            'GIAO NHANH': '/images/badges/Giao-Nhanh.webp',
            'THU CŨ ĐỔI MỚI': '/images/badges/TCDM.webp',
            'TRẢ GÓP 0%': '/images/badges/Tra-Gop-0.webp',
            'GIÁ TỐT': '/images/badges/Bestprice.gif',
        };
        const upperCaseBadge = badge.toUpperCase();
        let imageUrl = null;
        if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
        else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
        else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
        else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];

        if (imageUrl) {
            return (
                <div className="flex justify-start items-center mb-2 h-[28px]">
                    <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
                </div>
            );
        }
        return <div className="mb-2 h-[28px]"></div>;
    };

    return (
        <div className={`product-card-item w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white relative transition-shadow duration-200 ease-in-out group/productCard hover:shadow-md
            ${!inStock ? 'border-gray-300 bg-gray-50' : ''}`}> {/* Thêm style cho toàn bộ card khi hết hàng */}
            {discount > 0 && (<div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">-{discount}%</div>)}

            <Link to={`/product/${slug}`} className="product-card-image-link block relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3">
                {/* Ảnh sản phẩm */}
                <img src={image} alt={name} className={`max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-all duration-300 ${!inStock ? 'opacity-40' : ''}`} loading="lazy" />
                
                {/* Overlay "Hết hàng" trên ảnh - GIẢM ĐỘ ĐẬM Ở ĐÂY */}
                {!inStock && (
                    <div className="absolute inset-0 bg-white/10 flex items-center justify-center"> {/* Giảm độ đậm của lớp phủ */}
                        <div className="border-2 border-red-400 rounded-md px-4 py-1 -rotate-12 transform">
                            <span className="text-red-500 font-bold text-base tracking-wider">
                                Hết hàng
                            </span>
                        </div>
                    </div>
                )}
            </Link>

            <div className="product-card-info px-2 xs:px-1.5 sm:px-2 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
                {renderBadge()}
                
                <h3 className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 h-[38px] line-clamp-2" title={name}>
                    <Link to={`/product/${slug}`} className="hover:underline">{name}</Link>
                </h3>

                <div className="mt-auto">
                    <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
                        <span className="text-red-600 font-bold">{price}</span>
                        {oldPrice && (<span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{oldPrice}</span>)}
                    </div>
                    
                    <div className="product-card-saving text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5 min-h-[16px]" style={{ color: 'rgb(80, 171, 95)' }}>
                        {(price && currentPriceNum > 0 && oldPriceNum > currentPriceNum)
                            ? `Tiết kiệm ${(oldPriceNum - currentPriceNum).toLocaleString('vi-VN')}₫`
                            : ''}
                    </div>
{/* 🔥 Flash Sale slot giống hình minh họa */}
{typeof quantity === 'number' && typeof soldCount === 'number' && (
  <div className="relative w-full h-[24px] rounded-full bg-gray-200 overflow-hidden mb-1 text-[11px] font-semibold">
    {/* Thanh màu vàng hiển thị phần còn lại */}
    <div
      className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-400 flex items-center justify-center gap-1 text-orange-800"
      style={{
        width: `${Math.min(100, ((quantity - soldCount) / quantity) * 100)}%`,
        borderTopLeftRadius: '9999px',
        borderBottomLeftRadius: '9999px',
      }}
    >
      <img src="src/assets/Client/images/flash-sale.png" alt="🔥" className="h-[14px] w-[14px]" />
      <span className="leading-none">Còn {quantity - soldCount}/{quantity} suất</span>
    </div>
  </div>
)}


                    <div className="pt-1.5">
                        <div className="product-card-meta flex items-center justify-between min-h-[18px]">
                            {/* Rating Stars */}
                            <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">
                                <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating)}</div>
                                {rating > 0 && (<span className="text-gray-500">({parseFloat(rating).toFixed(1)})</span>)}
                            </div>
                            
                            {/* ✅ Chỉ hiển thị soldCount nếu inStock, không hiển thị gì nếu out of stock */}
                            {inStock && soldCount > 0 && (
                                <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium">
                                    Đã bán {soldCount > 999 ? `${(soldCount / 1000).toFixed(0)}k+` : soldCount}
                                </span>
                            )}
                            {/* Nếu inStock là false, sẽ không hiển thị gì ở đây, đúng như yêu cầu của bạn */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductColumn = ({ productTop, productBottom }) => {
    return (
        <div className="flex flex-col space-y-1.5 h-full">
            {productTop && (
                <div className="flex-1 min-h-0">
                    <InlinedProductCard {...productTop} />
                </div>
            )}
            {productBottom && (
                <div className="flex-1 min-h-0">
                    <InlinedProductCard {...productBottom} />
                </div>
            )}
        </div>
    );
};

const CustomSlickArrow = (props) => {
    const { type, onClick, className, style } = props;
    return (
        <button type="button" className={className} style={{ ...style }} onClick={onClick} aria-label={type === 'prev' ? "Previous products" : "Next products"}>
            {type === 'prev' ? <ChevronLeftIcon className="slick-arrow-icon" /> : <ChevronRightIcon className="slick-arrow-icon" />}
        </button>
    );
};

const TwoRowMarketSlider = ({
    productsInput = [],
    imageBannerUrl,
    endTime,
    bgColor = '#007BFF',
}) => {
    const sliderRef = useRef(null);
    
    const pairedProducts = [];
    for (let i = 0; i < productsInput.length; i += 2) {
        pairedProducts.push({
            id: `pair-${productsInput[i].id}`,
            top: productsInput[i],
            bottom: productsInput[i + 1] || null
        });
    }

    const sliderSettings = {
        dots: false,
        infinite: pairedProducts.length > 5,
        speed: 600,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 7000,
        pauseOnHover: true,
        prevArrow: <CustomSlickArrow type="prev" />,
        nextArrow: <CustomSlickArrow type="next" />,
        swipeToSlide: true,
        responsive: [
            { breakpoint: 1279, settings: { slidesToShow: 4, infinite: pairedProducts.length > 4 } },
            { breakpoint: 1023, settings: { slidesToShow: 3, infinite: pairedProducts.length > 3, arrows: false } },
            { breakpoint: 767, settings: { slidesToShow: 2.2, slidesToScroll: 1, arrows: false, infinite: true } },
            { breakpoint: 639, settings: { slidesToShow: 2.4, slidesToScroll: 1, arrows: false, infinite: true } },
            { breakpoint: 479, settings: { slidesToShow: 1.7, slidesToScroll: 1, arrows: false, infinite: true } }
        ]
    };

    return (
        <div className="main-event-block max-w-[1200px] mx-auto my-6">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                {imageBannerUrl && ( <a href="#flash-sale-link"> <img src={imageBannerUrl} alt="Sự kiện khuyến mãi" className="w-full h-auto md:h-[200px] object-cover" /> </a> )}
                
                <div className="two-row-slider-wrapper product-showcase-area group p-4 pt-14 relative" style={{ backgroundColor: bgColor }}>
                    {endTime && (
                        <div className="absolute top-3 left-4 flex items-center justify-center gap-x-3 z-10">
                            <span className="text-lg font-bold text-white whitespace-nowrap">Kết thúc sau:</span>
                            <CountdownTimer expiryTimestamp={endTime} />
                        </div>
                    )}
                    
                    <div className="slider-inner-content">
                        {(!productsInput || productsInput.length === 0) ? (
                            <p className="text-center py-10 text-white font-semibold text-lg">Không có sản phẩm nào trong chương trình.</p>
                        ) : (
                            <Slider {...sliderSettings} ref={sliderRef} className="two-row-slick-slider">
                                {pairedProducts.map(pair => (
                                    <div key={pair.id} className="px-1 sm:px-1.5">
                                        <ProductColumn productTop={pair.top} productBottom={pair.bottom} />
                                    </div>
                                ))}
                            </Slider>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoRowMarketSlider;