import React, { useRef, useState, useEffect } from 'react'; 
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './TestResponsiveSlider.css'; 
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import CountdownTimer from './CountdownTimer';

const InlinedProductCard = ({ id, slug, name, price, oldPrice, discount,badgeImage, image, rating, soldCount, inStock, badge, quantity }) => {
  
  const renderStars = (rate) => {
    const stars = [];
    const numRating = parseFloat(rate);
    if (isNaN(numRating) || numRating <= 0) return <div className="h-[14px] sm:h-[16px] w-auto"></div>;
    for (let i = 1; i <= 5; i++) {
      if (numRating >= i) stars.push(<FaStar key={`star-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else if (numRating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={`half-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
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

    const badgeImageMap = {
      'GIAO NHANH': 'src/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp',
      'THU CŨ ĐỔI MỚI': 'src/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp',
      'TRẢ GÓP 0%': 'src/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp',
      'GIÁ TỐT': 'src/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif'
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
    <div
      className={`product-card-item w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white relative transition-shadow duration-200 ease-in-out group/productCard hover:shadow-md
            ${!inStock ? 'border-gray-300 bg-gray-50' : ''}`}
    >
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">
          -{discount}%
        </div>
      )}

      <Link
        to={`/product/${slug}`}
        className="product-card-image-link block relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3"
      >
        <img
          src={image}
          alt={name}
          className={`max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-all duration-300 ${!inStock ? 'opacity-40' : ''}`}
          loading="lazy"
        />
      
{badgeImage && (
  <img
    src={badgeImage}
    alt="badge overlay"
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[205px] h-[180px] pointer-events-none select-none z-20"
    loading="lazy"
  />
)}

        {!inStock && (
          <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
            <div className="border-2 border-red-400 rounded-md px-4 py-1 -rotate-12 transform">
              <span className="text-red-500 font-bold text-base tracking-wider">Hết hàng</span>
            </div>
          </div>
        )}
      </Link>

      <div className="product-card-info px-2 xs:px-1.5 sm:px-2 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        {renderBadge()}

        <h3
          className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 h-[38px] line-clamp-2"
          title={name}
        >
          <Link to={`/product/${slug}`} className="hover:underline">
            {name}
          </Link>
        </h3>

        <div className="mt-auto">
          <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
            <span className="text-red-600 font-bold">{price}</span>
            {oldPrice && <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{oldPrice}</span>}
          </div>

          <div
            className="product-card-saving text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5 min-h-[16px]"
            style={{ color: 'rgb(80, 171, 95)' }}
          >
            {price && currentPriceNum > 0 && oldPriceNum > currentPriceNum
              ? `Tiết kiệm ${(oldPriceNum - currentPriceNum).toLocaleString('vi-VN')}₫`
              : ''}
          </div>
          

          <div className="pt-1.5">
            <div className="product-card-meta flex items-center justify-between min-h-[18px]">
              <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">
                <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating)}</div>
                {rating > 0 && <span className="text-gray-500">({parseFloat(rating).toFixed(1)})</span>}
              </div>

              {inStock && soldCount > 0 && (
                <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium">
                  Đã bán {soldCount > 999 ? `${(soldCount / 1000).toFixed(0)}k+` : soldCount}
                </span>
              )}
            </div>
          </div>
          {typeof quantity === 'number' && typeof soldCount === 'number' ? (
            <div className="relative w-full h-[24px] mb-1">
              
              <div className="absolute inset-0 bg-gray-200 rounded-full overflow-hidden" />

      
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
                style={{
                  width: `${Math.min(100, ((quantity - soldCount) / quantity) * 100)}%`
                }}
              />

            
              <img
                src="src/assets/Client/images/flash-sale.png"
                alt="🔥"
                className="absolute top-[-4px] left-[-4px] h-[27px] w-[24px] select-none pointer-events-none" 
              />

             
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-orange-800">
                Còn {quantity - soldCount}/{quantity} suất
              </span>
            </div>
          ) : (
            <div className="h-[24px] mb-1" />
          )}

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
      aria-label={type === 'prev' ? 'Previous products' : 'Next products'}
    >
      {type === 'prev' ? <ChevronLeftIcon className="slick-arrow-icon" /> : <ChevronRightIcon className="slick-arrow-icon" />}
    </button>
  );
};

const HorizontalProductSlider = ({ productsInput = [], imageBannerUrl, endTime, bgColor = '#007BFF' }) => {
  const sliderRef = useRef(null);
  const totalProducts = productsInput.length;

  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const getIdealSlidesToShow = () => {
    if (windowWidth >= 1279) return 5;
    if (windowWidth >= 767) return 4;  
    if (windowWidth >= 479) return 2; 
    return 1; 
  };

  const idealSlidesToShow = getIdealSlidesToShow();

  const sliderSettings = {
    dots: false,
    speed: 600,
    slidesToScroll: 1,
    
   
    
    slidesToShow: idealSlidesToShow,
    
    infinite: totalProducts > idealSlidesToShow, 
    arrows: totalProducts > idealSlidesToShow,   

    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    prevArrow: <CustomSlickArrow type="prev" />,
    nextArrow: <CustomSlickArrow type="next" />,
    swipeToSlide: true,

    responsive: [
      
      {
        breakpoint: 1279, 
        settings: {
          slidesToShow: Math.min(5, totalProducts), 
          infinite: totalProducts > 5, 
          arrows: totalProducts > 5,
        },
      },
     
      {
        breakpoint: 767, 
        settings: {
          slidesToShow: Math.min(4, totalProducts), 
          infinite: totalProducts > 4,
          arrows: totalProducts > 4,
        },
      },
      // Smaller Tablets
      {
        breakpoint: 479, 
        settings: {
          slidesToShow: Math.min(2, totalProducts), 
          infinite: totalProducts > 2,
          arrows: false, 
        },
      },
      
      {
        breakpoint: 0, 
        settings: {
          slidesToShow: 1,
          infinite: totalProducts > 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="main-event-block max-w-[1200px] mx-auto my-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {imageBannerUrl && (
          <a href="#flash-sale-link">
            {' '}
            <img src={imageBannerUrl} alt="Sự kiện khuyến mãi" className="w-full h-auto md:h-[200px] object-cover" />{' '}
          </a>
        )}

        <div className="two-row-slider-wrapper product-showcase-area group p-4 pt-14 relative" style={{ backgroundColor: bgColor }}>
          {endTime && (
            <div className="absolute top-3 left-4 flex items-center justify-center gap-x-3 z-10">
              <span className="text-lg font-bold text-white whitespace-nowrap">Kết thúc sau:</span>
              <CountdownTimer expiryTimestamp={endTime} />
            </div>
          )}

          <div className="slider-inner-content">
            {!productsInput || productsInput.length === 0 ? (
              <p className="text-center py-10 text-white font-semibold text-lg">Không có sản phẩm nào trong chương trình.</p>
            ) : (
            
                totalProducts <= idealSlidesToShow && totalProducts > 0 ? ( 
                    <div className="flex justify-start items-stretch gap-x-4"> 
                        {productsInput.map((product) => (
                           
                            <div 
                                key={product.id} 
                                className={`
                                    w-full 
                                    ${idealSlidesToShow === 5 ? 'md:w-1/5' : ''}
                                    ${idealSlidesToShow === 4 ? 'lg:w-1/4' : ''}
                                    ${idealSlidesToShow === 2 ? 'sm:w-1/2' : ''}
                                    ${idealSlidesToShow === 1 ? 'w-full' : ''}
                                `}
                            >
                                <InlinedProductCard {...product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Slider {...sliderSettings} ref={sliderRef} className="horizontal-slick-slider">
                        {productsInput.map((product) => (
                            <div key={product.id} className="px-1 md:px-1"> 
                                <InlinedProductCard {...product} />
                            </div>
                        ))}
                    </Slider>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalProductSlider;