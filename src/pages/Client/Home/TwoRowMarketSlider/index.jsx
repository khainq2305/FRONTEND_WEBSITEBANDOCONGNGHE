import React, { useRef } from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './TestResponsiveSlider.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import CountdownTimer from './CountdownTimer';
import useFavorites from '../../../../hooks/useFavorites';
const InlinedProductCard = ({ id, slug, name, price, oldPrice, discount, image, rating, soldCount, inStock, onAddToFavorites, onCompare, isFavorite }) => {
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
            {discount > 0 && (<div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">-{discount}%</div>)}
            
          
            <Link to={`/product/${slug}`} className="product-card-image-link block relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3">
                <img src={image} alt={name} className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300" loading="lazy" />
            </Link>

            <div className="product-card-info px-2 xs:px-1.5 sm:px-2 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
                <h3 className="min-h-[38px] product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200" title={name}>
                    <Link to={`/product/${slug}`} className="hover:underline">{name}</Link>
                </h3>
                <div className="mt-auto">
                    <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
                        <span className="text-red-600 font-bold">{price}</span>
                        {oldPrice && (<span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{oldPrice}</span>)}
                    </div>
                    <div className="pt-1.5">
                        <div className="product-card-meta flex items-center justify-between mb-1.5 sm:mb-2 min-h-[18px]">
                            <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">
                                <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating)}</div>
                                {rating > 0 && (<span className="text-gray-500">({parseFloat(rating).toFixed(1)})</span>)}
                            </div>
                            {inStock && soldCount > 0 ? (
                                <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium">
                                    Đã bán {soldCount > 999 ? `${(soldCount / 1000).toFixed(0)}k+` : soldCount}
                                </span>
                            ) : !inStock ? (
                                <span className="text-red-500 text-[9.5px] sm:text-[10.5px] font-semibold">Hết hàng</span>
                            ) : null}
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

const ProductColumn = ({ productTop, productBottom, onAddToFavorites, onCompare }) => {
    return (
        <div className="flex flex-col space-y-1.5 h-full">
            {productTop && (
                <div className="flex-1 min-h-0">
                    <InlinedProductCard
                        {...productTop}
                        isFavorite={productTop?.isFavorite}
                        onAddToFavorites={onAddToFavorites}
                        onCompare={onCompare}
                    />
                </div>
            )}
            {productBottom && (
                <div className="flex-1 min-h-0">
                    <InlinedProductCard
                        {...productBottom}
                        isFavorite={productBottom?.isFavorite}
                        onAddToFavorites={onAddToFavorites}
                        onCompare={onCompare}
                    />
                </div>
            )}
            {!productBottom && productTop && (
                <div className="flex-1 min-h-0 invisible">
                    <InlinedProductCard {...productTop} onAddToFavorites={() => { }} onCompare={() => { }} />
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
    bgColor = '#AA495A',
}) => {
    const sliderRef = useRef(null);
    const { toggleFavorite, isFavorite } = useFavorites();

    const handleCompare = (productId) => {
        alert(`So sánh: ${productId}`);
    };

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
                {imageBannerUrl && (
                    <a href="#flash-sale-link">
                        <img src={imageBannerUrl} alt="Sự kiện khuyến mãi" className="w-full h-[200px] object-cover" />
                    </a>
                )}
                <div className="two-row-slider-wrapper product-showcase-area group p-4 relative" style={{ backgroundColor: bgColor }}>
                    {endTime && (
                        <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 w-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center justify-center gap-x-3 z-10">
                            <span className="text-lg font-semibold text-gray-800 whitespace-nowrap">Kết thúc sau:</span>
                            <CountdownTimer expiryTimestamp={endTime} />
                        </div>
                    )}
                    <div className="h-10 w-full"></div>
                    <div className="slider-inner-content">
                        {(!pairedProducts || pairedProducts.length === 0) ? (
                            <p className="text-center py-10 text-white font-semibold text-lg">Không có sản phẩm nào trong chương trình.</p>
                        ) : (
                            <Slider {...sliderSettings} ref={sliderRef} className="two-row-slick-slider">
                                {pairedProducts.map(pair => (
                                    <div key={pair.id} className="px-1 sm:px-1.5">
                                        <ProductColumn
                                            productTop={{ ...pair.top, isFavorite: isFavorite(pair.top?.id) }}
                                            productBottom={pair.bottom ? { ...pair.bottom, isFavorite: isFavorite(pair.bottom?.id) } : null}
                                            onAddToFavorites={toggleFavorite}
                                            onCompare={handleCompare}
                                        />
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