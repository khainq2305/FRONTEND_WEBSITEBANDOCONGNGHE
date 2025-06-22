// src/components/RelatedProductsSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './RelatedProductsSlider.css';

import { productService } from '../../../../services/client/productService'; 
import useFavorites from '../../../../hooks/useFavorites';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { HeartIcon, ArrowPathIcon as CompareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const badgeImageMap = {
  'GIAO NHANH': 'src/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp',
  'THU CŨ ĐỔI MỚI': 'src/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp',
  'TRẢ GÓP 0%': 'src/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp',
  'GIÁ TỐT': 'src/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif',
};

const InlinedProductCard = ({
  id, name, price, oldPrice, discount, image,
  rating, soldCount, inStock, badge,
  onAddToFavorites, onCompare, isFavorite
}) => {
  const renderStars = rate => {
    const stars = [];
    const num = parseFloat(rate);
    if (isNaN(num) || num <= 0) return <div className="h-[14px] sm:h-[16px]" />;
    for (let i = 1; i <= 5; i++) {
      if (num >= i) stars.push(<FaStar key={i} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else if (num >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
    }
    return <div className="flex gap-px sm:gap-0.5">{stars}</div>;
  };

  const badgeUrl = badgeImageMap[badge?.toUpperCase()] || null;

  return (
    <div className="product-card-item flex flex-col border rounded-lg shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow">
      {discount != null && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded z-10">
          -{discount}%
        </div>
      )}
      {badgeUrl && (
        <img
          src={badgeUrl}
          alt={badge}
          className="absolute top-2 right-2 w-6 h-6 object-contain z-10"
        />
      )}
      <a href={`/product/${id}`} className="block h-40 flex items-center justify-center p-2">
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </a>
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <a href={`/product/${id}`} className="hover:underline">{name}</a>
        </h3>
        <div className="mt-auto">
          <div className="text-base font-bold text-red-600">
            {formatCurrencyVND(isNaN(price) ? oldPrice : price)}
            {oldPrice > price && (
              <span className="line-through text-gray-400 text-xs ml-1">
                {formatCurrencyVND(oldPrice)}
              </span>
            )}
          </div>
          <div className="text-xs text-green-600 mt-1">
            {oldPrice > price && `Tiết kiệm ${formatCurrencyVND(oldPrice - price)}`}
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
            {renderStars(rating)}
            {inStock
              ? soldCount > 0
                ? <span>Đã bán {soldCount > 999 ? `${(soldCount/1000).toFixed(0)}k+` : soldCount}</span>
                : <span className="text-green-600">Mới về</span>
              : <span className="text-red-500">Hết hàng</span>}
          </div>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={e => { e.stopPropagation(); onCompare(id); }}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-700 p-1 rounded transition-colors"
            >
              <CompareIcon className="w-4 h-4" /> So sánh
            </button>
            <button
              onClick={e => { e.stopPropagation(); onAddToFavorites(id); }}
              className={`flex items-center gap-1 p-1 rounded transition-colors ${
                isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              {isFavorite
                ? <HeartSolidIcon className="w-4 h-4" />
                : <HeartIcon className="w-4 h-4" />
              }
              {isFavorite ? 'Đã thích' : 'Yêu thích'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomSlickArrow = ({ type, onClick, className, style }) => (
  <button type="button" className={className} style={style} onClick={onClick}>
    {type === 'prev'
      ? <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
      : <ChevronRightIcon className="w-6 h-6 text-gray-700" />}
  </button>
);

export default function RelatedProductsSlider({
  categoryId,
  currentProductId,
  mainSectionTitle = "SẢN PHẨM TƯƠNG TỰ"
}) {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const SLIDES_THRESHOLD = 5;

  useEffect(() => {
    (async () => {
      if (!categoryId) { setLoading(false); return; }
      setLoading(true);
      try {
        const res = await productService.getRelated(categoryId, currentProductId, 12);
        setProducts(res.data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Đang tải sản phẩm tương tự...
      </div>
    );
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
      { breakpoint: 1280, settings: { slidesToShow: Math.min(products.length, 4) }},
      { breakpoint: 1024, settings: { slidesToShow: Math.min(products.length, 3) }},
      { breakpoint: 768, settings: { slidesToShow: 2, arrows: false }},
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false }}
    ]
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-gray-50 rounded-lg shadow-md my-8">
      <h2 className="px-4 pt-4 text-xl font-bold text-gray-800">{mainSectionTitle}</h2>
      <div className="px-2 pb-4">
        {products.length <= SLIDES_THRESHOLD
          ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {products.map(p => (
                <InlinedProductCard
                  key={p.id}
                  {...p}
                  onAddToFavorites={toggleFavorite}
                  onCompare={() => alert(`So sánh ${p.id}`)}
                  isFavorite={isFavorite(p.id)}
                />
              ))}
            </div>
          ) : (
            <Slider ref={sliderRef} {...settings}>
              {products.map(p => (
                <div key={p.id} className="p-1.5">
                  <InlinedProductCard
                    {...p}
                    onAddToFavorites={toggleFavorite}
                    onCompare={() => alert(`So sánh ${p.id}`)}
                    isFavorite={isFavorite(p.id)}
                  />
                </div>
              ))}
            </Slider>
          )
        }
      </div>
    </div>
  );
}
