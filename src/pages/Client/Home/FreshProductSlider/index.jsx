import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FreshProductSlider.css';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const InlinedProductCard = ({ id, productId, name, price, oldPrice, discount, image, rating, slug, soldCount, inStock, badge }) => {
  
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
    <div className="product-card-item w-full h-full flex flex-col bg-white relative transition-all duration-300 ease-in-out group/productCard border-l border-r border-transparent hover:shadow-2xl hover:z-20 hover:border-l-gray-200 hover:border-r-gray-200 rounded-lg overflow-hidden">
      <div className="relative">
        {!inStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-t-lg pointer-events-none">
            <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
              Hết Hàng
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">
            -{discount}%
          </div>
        )}

        <Link
          to={`/product/${slug}`}
          className="product-card-image-link block w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3"
        >
          <img
            src={image || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'}
            alt={name}
            className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="product-card-info px-2 xs:px-1.5 sm:px-2.5 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        {renderBadge()}

        <h3
          className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 h-[38px] line-clamp-2"
          title={name}
        >
          <Link to={`/product/${slug}`} className="hover:underline">
            {name}
          </Link>
        </h3>

        <div className="mt-auto">
          <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
            {currentPriceNum > 0 ? (
              oldPrice && discount > 0 && oldPriceNum > currentPriceNum ? (
                <>
                  <span className="text-red-600 font-bold">{price}</span>
                  <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{oldPrice}</span>
                </>
              ) : (
                <span className="text-red-600 font-bold">{price}</span>
              )
            ) : oldPriceNum > 0 ? (
              <span className="text-red-600 font-bold">{oldPrice}</span>
            ) : (
              <span className="text-gray-400 text-[13px] sm:text-sm font-normal">Liên hệ</span>
            )}
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
            <div className="product-card-meta flex items-center justify-between mb-1.5 sm:mb-2 min-h-[18px]">
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

const FreshProductSlider = ({
  title: titleFromProp,
  bannersData: bannersFromProp,
  productsData: productsFromProp,
  linkedCategories = []
}) => {
  const productSliderRef = useRef(null);

  const [sectionTitle, setSectionTitle] = useState(titleFromProp || 'SẢN PHẨM NỔI BẬT');
  const [banners, setBanners] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    setSectionTitle(titleFromProp || 'SẢN PHẨM NỔI BẬT');

    const mappedBanners = (bannersFromProp || []).map((b, index) => ({
      id: b.id,
      imageUrl: b.imageUrl,
      link: b.linkValue
        ? b.linkType === 'URL' || (typeof b.linkValue === 'string' && b.linkValue.startsWith('http'))
          ? b.linkValue
          : b.linkType === 'product'
            ? `/san-pham/${b.linkValue}`
            : b.linkType === 'category'
              ? `/category/${b.linkValue}`
              : '#'
        : '#',
      altText: b.altText || `${titleFromProp || 'Banner'} ${index + 1}`
    }));
    setBanners(mappedBanners);

    const mappedProducts = (productsFromProp || []).map((p) => ({
      badge: p.badge || null,
      ...p,
      price: typeof p.price === 'number' ? p.price.toLocaleString('vi-VN') : String(p.price || '0'),
      oldPrice: typeof p.oldPrice === 'number' ? p.oldPrice.toLocaleString('vi-VN') : p.oldPrice ? String(p.oldPrice) : null
    }));
    setCurrentProducts(mappedProducts);
  }, [titleFromProp, bannersFromProp, productsFromProp]);

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
        settings: {
          slidesToShow: 4,
          arrows: currentProducts.length > 4,
          infinite: currentProducts.length > 4
        }
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          arrows: currentProducts.length > 3,
          infinite: currentProducts.length > 3
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };

  if ((!currentProducts || currentProducts.length === 0) && (!banners || banners.length === 0)) {
    return null;
  }

  return (
    <div className="fresh-slider-wrapper group max-w-[1200px] mx-auto bg-gray-50 rounded-lg shadow-md my-8">
      <div className="header-block px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-between items-center gap-y-2 mb-2 sm:mb-3">
          <h3 className="text-xl sm:text-xl font-bold uppercase whitespace-nowrap text-[#c51813]">{sectionTitle}</h3>

          <div className="flex items-center gap-1 sm:gap-2 mt-1 md:flex-wrap overflow-x-auto whitespace-nowrap hide-scrollbar">
            {linkedCategories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="inline-block text-[13px] sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-md shadow-sm border border-gray-300 transition flex-shrink-0"
              >
                {cat.name}
              </Link>
            ))}
            {linkedCategories.length > 5 && (
              <Link
                to={`/category/${linkedCategories[0]?.slug || ''}`}
                className="inline-block text-[13px] sm:text-sm font-medium text-primary bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md shadow-sm border border-blue-200 transition flex-shrink-0"
              >
                Xem tất cả
              </Link>
            )}
          </div>
        </div>
      </div>

      {banners && banners.length > 0 && (
        <div className="top-banner-container px-2 sm:px-4 pb-2 sm:pb-3">
          <div className="hidden md:grid md:grid-cols-12 gap-3 sm:gap-4">
            {banners[0] && (
              <a
                href={banners[0].link || '#'}
                className="block md:col-span-6 rounded-lg overflow-hidden shadow-sm group/banner hover:shadow-lg transition-shadow"
              >
                <img
                  src={banners[0].imageUrl}
                  alt={banners[0].altText}
                  className="w-full h-auto object-cover group-hover/banner:scale-105 transition-transform duration-300"
                  style={{ aspectRatio: '595 / 214' }}
                  loading="lazy"
                />
              </a>
            )}
            {banners[1] && (
              <a
                href={banners[1].link || '#'}
                className="block md:col-span-6 rounded-lg overflow-hidden shadow-sm group/banner hover:shadow-lg transition-shadow"
              >
                <img
                  src={banners[1].imageUrl}
                  alt={banners[1].altText}
                  className="w-full h-auto object-cover group-hover/banner:scale-105 transition-transform duration-300"
                  style={{ aspectRatio: '595 / 214' }}
                  loading="lazy"
                />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="fresh-slider-content-area pt-2 pb-5 px-2 sm:px-4">
        {!currentProducts || currentProducts.length === 0 ? (
          banners && banners.length > 0 ? null : (
            <p className="text-center py-10 text-gray-500">Không có sản phẩm nào để hiển thị.</p>
          )
        ) : (
          <Slider {...productSliderSettings} ref={productSliderRef} className="fresh-slick-slider">
            {currentProducts.map((product) => (
              <div key={product.id}>
                <InlinedProductCard {...product} productId={product.productId} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default FreshProductSlider;
