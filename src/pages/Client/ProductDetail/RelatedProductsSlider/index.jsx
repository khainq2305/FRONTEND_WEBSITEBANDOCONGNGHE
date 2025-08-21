// src/components/RelatedProductsSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';

import giaoNhanhImg from '@/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp';
import thuCuDoiMoiImg from '@/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp';
import traGopImg from '@/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp';
import giaTotImg from '@/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif';
import giaKhoImg from '@/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './RelatedProductsSlider.css';
import { Link } from 'react-router-dom';
import { productService } from '../../../../services/client/productService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
const BADGE_IMAGE_MAP = {
  'GIAO NHANH': giaoNhanhImg,
  'THU CŨ ĐỔI MỚI': thuCuDoiMoiImg,
  'TRẢ GÓP 0%': traGopImg,
  'GIÁ TỐT': giaTotImg,
  'GIÁ KHO': giaKhoImg
};
const renderBadge = (badge) => {
  if (!badge) {
    return <div className="mb-2 h-[28px]"></div>;
  }

  const upperCaseBadge = badge.toUpperCase();
  let imageUrl = null;

  if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = BADGE_IMAGE_MAP['GIAO NHANH'];
  else if (upperCaseBadge.includes('THU CŨ')) imageUrl = BADGE_IMAGE_MAP['THU CŨ ĐỔI MỚI'];
  else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = BADGE_IMAGE_MAP['TRẢ GÓP 0%'];
  else if (upperCaseBadge.includes('GIÁ KHO')) imageUrl = BADGE_IMAGE_MAP['GIÁ KHO'];
  else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = BADGE_IMAGE_MAP['GIÁ TỐT'];

  if (imageUrl) {
    return (
      <div className="flex justify-start items-center mb-2 h-[28px]">
        <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
      </div>
    );
  }

  return <div className="mb-2 h-[28px]"></div>;
};

const renderStars = (rate, productId) => {
  const stars = [];
  const numRating = parseFloat(rate);
  if (isNaN(numRating) || numRating <= 0) return <div className="h-[14px] sm:h-[16px] w-auto"></div>;
  for (let i = 1; i <= 5; i++) {
    if (numRating >= i) stars.push(<FaStar key={`star-${i}-${productId}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
    else if (numRating >= i - 0.5)
      stars.push(<FaStarHalfAlt key={`half-${i}-${productId}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
    else stars.push(<FaRegStar key={`empty-${i}-${productId}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
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
const InlinedProductCard = ({ id, name, price, slug, oldPrice, discount, image, rating, soldCount, inStock, badge, badgeImage }) => {
  const currentPriceNum = parsePrice(price);
  const oldPriceNum = oldPrice ? parsePrice(oldPrice) : 0;

  const overlaySrc = badgeImage || BADGE_IMAGE_MAP[badge?.toUpperCase()] || null;

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
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-20">
            -{discount}%
          </div>
        )}

        <Link
          to={`/product/${slug ?? id}`}
          className="product-card-image-link block w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3 relative"
        >
          <img
            src={image || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'}
            alt={name}
            className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {overlaySrc && (
            <img
              src={overlaySrc}
              alt="badge overlay"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[205px] h-[180px] z-20 pointer-events-none select-none"
              loading="lazy"
            />
          )}
        </Link>
      </div>

      <div className="product-card-info px-2 xs:px-1.5 sm:px-2.5 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        {renderBadge(badge)}

        <h3
          className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 h-[38px] line-clamp-2"
          title={name}
        >
          <Link to={`/product/${slug ?? id}`} className="hover:underline">
            {name}
          </Link>
        </h3>

        <div className="mt-auto">
          <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
            {currentPriceNum > 0 ? (
              oldPrice && discount > 0 && oldPriceNum > currentPriceNum ? (
                <>
                  <span className="text-red-600 font-bold">{formatCurrencyVND(currentPriceNum)}</span>
                  <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">
                    {formatCurrencyVND(oldPriceNum)}
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-bold">{formatCurrencyVND(currentPriceNum)}</span>
              )
            ) : oldPriceNum > 0 ? (
              <span className="text-red-600 font-bold">{formatCurrencyVND(oldPriceNum)}</span>
            ) : (
              <span className="text-gray-400 text-[13px] sm:text-sm font-normal">Liên hệ</span>
            )}
          </div>

          <div
            className="product-card-saving text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5 min-h-[16px]"
            style={{ color: 'rgb(80, 171, 95)' }}
          >
            {currentPriceNum > 0 && oldPriceNum > currentPriceNum ? `Tiết kiệm ${formatCurrencyVND(oldPriceNum - currentPriceNum)}` : ''}
          </div>

          <div className="pt-1.5">
            <div className="product-card-meta flex items-center justify-between mb-1.5 sm:mb-2 min-h-[18px]">
              <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">
                <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating, id)}</div>
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

const CustomSlickArrow = ({ type, onClick, className, style }) => (
  <button type="button" className={className} style={style} onClick={onClick}>
    {type === 'prev' ? <ChevronLeftIcon className="w-6 h-6 text-gray-700" /> : <ChevronRightIcon className="w-6 h-6 text-gray-700" />}
  </button>
);

export default function RelatedProductsSlider({ categoryId, currentProductId, mainSectionTitle = 'SẢN PHẨM TƯƠNG TỰ' }) {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const SLIDES_THRESHOLD = 5;

  useEffect(() => {
    (async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await productService.getRelated(categoryId, currentProductId, 12);
        setProducts(res.data.products || []);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId, currentProductId]);

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Đang tải sản phẩm tương tự...</div>;
  }
  if (!products.length) return null;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(products.length, SLIDES_THRESHOLD),
    slidesToScroll: 1,
    arrows: products.length > SLIDES_THRESHOLD,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <CustomSlickArrow type="prev" />,
    nextArrow: <CustomSlickArrow type="next" />,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(products.length, 4) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(products.length, 3) } },
      { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } }
    ]
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-gray-50 rounded-lg shadow-md my-8">
      <h2 className="px-4 py-4 pt-4 text-xl font-bold text-[#c51813]">{mainSectionTitle}</h2>
      <div className="px-2 pb-4">
        {products.length <= SLIDES_THRESHOLD ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {products.map((p) => (
              <InlinedProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          <Slider ref={sliderRef} {...settings}>
            {products.map((p) => (
              <div key={p.id} className="p-1.5">
                <InlinedProductCard key={p.id} {...p} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}
