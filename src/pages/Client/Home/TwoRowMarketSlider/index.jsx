import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './TestResponsiveSlider.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import CountdownTimer from './CountdownTimer';
import giaoNhanh from '@/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp';
import thuCuDoiMoi from '@/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp';
import traGop0 from '@/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp';
import giaTot from '@/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif';
import giaKho from '@/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif';
import flashSaleImg from '@/assets/Client/images/flash-sale.png';

const InlinedProductCard = ({
  id,
  slug,
  name,
  price,
  oldPrice,
  discount,
  badgeImage,
  image,
  rating,
  soldCount,
  flashSaleInfo,
  inStock,
  badge,
  quantity,
  isCategoryDeal = false,
  saleStatus
}) => {
  const parsePrice = (val) => {
    if (typeof val === 'number' && Number.isFinite(val)) return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/[^\d,.,-]/g, '');
      const normalized = cleaned.replace(/\./g, '').replace(',', '.');
      const n = parseFloat(normalized);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const renderStars = (rate) => {
    const stars = [];
    const numRating = parseFloat(rate);
    if (!Number.isFinite(numRating) || numRating <= 0) {
      return <div className="h-[14px] sm:h-[16px] w-auto" />;
    }
    for (let i = 1; i <= 5; i++) {
      if (numRating >= i) stars.push(<FaStar key={`star-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else if (numRating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={`half-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else stars.push(<FaRegStar key={`empty-${i}-${id}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
    }
    return stars;
  };
  // ------------------------------------------------------------

  const currentPriceNum = parsePrice(price);
  const oldPriceNum = oldPrice ? parsePrice(oldPrice) : 0;

  const badgeImageMap = {
    'GIAO NHANH': giaoNhanh,
    'THU CŨ ĐỔI MỚI': thuCuDoiMoi,
    'TRẢ GÓP 0%': traGop0,
    'GIÁ TỐT': giaTot,
    'GIÁ KHO': giaKho
  };

  const renderBadge = () => {
    if (!badge) return <div className="mb-2 h-[28px]"></div>;
    const upper = String(badge).toUpperCase();
    let imageUrl = null;
    if (upper.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
    else if (upper.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
    else if (upper.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
    else if (upper.includes('GIÁ TỐT') || upper.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];
    else if (upper.includes('GIÁ KHO')) imageUrl = badgeImageMap['GIÁ KHO'];
    return imageUrl ? (
      <div className="flex justify-start mt-2 items-center mb-2 h-[28px]">
        <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
      </div>
    ) : (
      <div className="mb-2 h-[28px]" />
    );
  };

  const displayDiscount = discount;
  const rawDisplayPrice = saleStatus === 'upcoming' ? (flashSaleInfo?.salePrice ?? currentPriceNum) : currentPriceNum;

  const displayOldPrice = (() => {
    if (flashSaleInfo?.originalPrice && flashSaleInfo.salePrice < flashSaleInfo.originalPrice) {
      return flashSaleInfo.originalPrice.toLocaleString('vi-VN') + '₫';
    }
    if (oldPrice && currentPriceNum < oldPriceNum) return oldPrice;
    return null;
  })();

  const obfuscatePrice = (priceNum) => {
    if (priceNum < 1_000_000) return `${Math.floor(priceNum / 1_000)}xx₫`;
    const millions = Math.floor(priceNum / 1_000_000);
    const hundredThousands = Math.floor((priceNum % 1_000_000) / 100_000);
    return `${millions}.${hundredThousands}xx.000 ₫`;
  };

  const displayPrice = saleStatus === 'upcoming' ? obfuscatePrice(rawDisplayPrice) : formatCurrencyVND(currentPriceNum);

  const soldCountDisplay =
    inStock && soldCount > 0 ? (
      <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium">
        Đã bán {soldCount > 999 ? `${(soldCount / 1000).toFixed(0)}k+` : soldCount}
      </span>
    ) : null;

  const ratingDisplay = (
    <>
      <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">{renderStars(rating)}</div>
      {rating > 0 && <span className="text-gray-500">({parseFloat(rating).toFixed(1)})</span>}
    </>
  );
  const originalQuantity = Number(typeof flashSaleInfo?.originalQuantity === 'number' ? flashSaleInfo.originalQuantity : (quantity ?? 0));
  const sold = Number(flashSaleInfo?.soldQuantity ?? flashSaleInfo?.sold ?? soldCount ?? 0);
  const soldCountSafe = Math.min(originalQuantity, Math.max(0, sold));
  const remainingQuantity = Math.max(0, originalQuantity - soldCountSafe);
  const remainingPercentage = originalQuantity > 0 ? (remainingQuantity / originalQuantity) * 100 : 0;

  const displaySoldQuantityText = (() => {
    if (saleStatus === 'upcoming') return 'Sắp mở bán';
    if (typeof originalQuantity !== 'number' || originalQuantity <= 0) return '';
    if (remainingQuantity > 0 && saleStatus === 'live') {
      return `Còn ${remainingQuantity}/${originalQuantity} suất`;
    }
    return 'Đã bán hết';
  })();

  const shouldImageBeOpaque = saleStatus === 'ended' || (saleStatus === 'live' && !inStock);

  const yellowProgressBarStyle = { width: `${Math.min(100, remainingPercentage)}%` };

  return (
    <div
      className={`product-card-item w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white relative transition-shadow duration-200 ease-in-out group/productCard hover:shadow-md
        ${!inStock || saleStatus === 'ended' ? 'border-gray-300 bg-gray-50' : ''}`}
    >
      {saleStatus === 'upcoming' ? (
        <div className="absolute top-2 left-2 border border-red-500 bg-white text-red-600 text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-25">
          Sắp mở bán
        </div>
      ) : (
        displayDiscount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-25">
            -{displayDiscount}%
          </div>
        )
      )}

      <Link
        to={`/product/${slug}`}
        className="product-card-image-link block relative w-full h-[120px] xs:h-[140px] sm:h-[160px] md:h-[180px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3"
      >
        <img
          src={image}
          alt={name}
          className={`max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-all duration-300 ${shouldImageBeOpaque ? 'opacity-40' : ''}`}
          loading="lazy"
        />
        {badgeImage && (
          <img
            src={badgeImage}
            alt="badge overlay"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain z-25 pointer-events-none select-none hidden sm:block transform scale-[1.15]"
            loading="lazy"
          />
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-t-lg pointer-events-none">
            <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
              Hết Hàng
            </span>
          </div>
        )}
      </Link>

      <div className="product-card-info px-1 xs:px-1.5 sm:px-2 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        {renderBadge()}
        <h3
          className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 h-[38px] overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          title={name}
        >
          <Link to={`/product/${slug}`} className="hover:underline inline-block min-w-max">
            {name}
          </Link>
        </h3>


        <div className="mt-auto">
          <div className="product-card-price text-[13px] sm:text-sm mb-1.5">
            <span className="text-red-600 font-bold">{displayPrice}</span>
            {displayOldPrice && (
              <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{displayOldPrice}</span>
            )}
          </div>

          <div
            className="product-card-saving text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5 min-h-[16px]"
            style={{ color: 'rgb(80, 171, 95)' }}
          >
            {saleStatus === 'upcoming'
              ? ''
              : price && currentPriceNum > 0 && oldPriceNum > currentPriceNum
                ? `Tiết kiệm ${(oldPriceNum - currentPriceNum).toLocaleString('vi-VN')}₫`
                : ''}
          </div>

          <div className="pt-2">
            <div className="product-card-meta flex items-center justify-between min-h-[18px]">
              <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">{ratingDisplay}</div>
              {soldCountDisplay}
            </div>
          </div>

          <div className="mt-2 mb-1 text-center h-[28px] relative">
            {!isCategoryDeal && (
              <>
                {saleStatus === 'upcoming' ? (
                  <span className="inline-block border border-red-500 text-red-600 text-[12px] px-18 py-1.5 rounded-full font-bold shadow-sm">
                    Sắp diễn ra
                  </span>
                ) : typeof originalQuantity === 'number' && originalQuantity > 0 ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gray-200 rounded-full overflow-hidden" />
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full z-10"
                      style={{ width: `${Math.min(100, remainingPercentage)}%` }}
                    />
                    {saleStatus === 'live' && (
                      <img
                        src={flashSaleImg}
                        alt="🔥"
                        className="absolute top-[-2px] left-[-2px] h-[29px] w-[24px] select-none pointer-events-none z-20"
                      />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-orange-800 z-10">
                      {displaySoldQuantityText}
                    </span>
                  </div>
                ) : (
                  <span className="inline-block text-[13px] font-semibold text-orange-800">{displaySoldQuantityText}</span>
                )}
              </>
            )}
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

const HorizontalProductSlider = ({ flashSales = [], bgColor = '#007BFF' }) => {
  const sliderRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  const events = (flashSales || []).filter((e) => !!e).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const getDefaultIndex = () => {
    const liveIdx = events.findIndex((e) => e.status === 'live');
    if (liveIdx !== -1) return liveIdx;
    return events.length ? 0 : -1;
  };

  const [activeIdx, setActiveIdx] = useState(getDefaultIndex());

  useEffect(() => {
    const next = getDefaultIndex();
    if (activeIdx === -1 || activeIdx >= events.length) {
      setActiveIdx(next);
    } else if (events[activeIdx]?.status === 'ended' && next !== -1) {
      setActiveIdx(next);
    }
  }, [JSON.stringify(events)]);

  const activeEvent = events[activeIdx] || null;
  const saleStatus = activeEvent?.status;
  const targetCountdownTime = activeEvent ? (saleStatus === 'live' ? activeEvent.endTime : activeEvent.startTime) : null;
  const countdownMode = saleStatus === 'live' ? 'end' : 'start';

  const productsInput = (() => {
    if (!activeEvent) return [];
    const isLive = saleStatus === 'live';
    const skuMap = new Map();

    (activeEvent.flashSaleItems || []).forEach((item) => {
      const sku = item?.sku;
      if (!sku) return;
      const product = sku.product || sku.Product || {};
      const image = sku.ProductMedia?.find((m) => m.type === 'image')?.mediaUrl || product.thumbnail || '';
      const price = Number(item?.salePrice ?? sku?.salePrice ?? sku?.price ?? 0);
      const originalPrice = Number(sku?.originalPrice ?? sku?.price ?? price);
      const sold = Math.max(0, Number(item?.originalQuantity || 0) - Number(item?.quantity || 0));
      skuMap.set(sku.id, {
        id: sku.id,
        productId: product.id,
        name: product.name || 'N/A',
        slug: product.slug || '',
        price,
        oldPrice: originalPrice > price ? originalPrice : null,
        discount: originalPrice > 0 ? Math.round(100 - (price * 100) / originalPrice) : 0,
        image,
        badge: product.badge || null,
        badgeImage: product.badgeImage || null,
        rating: Number(sku?.averageRating || 0),
        inStock: Number(sku?.stock || 0) > 0,
        soldCount: sold,
        quantity: Number(item?.quantity ?? 0),
        flashSaleInfo: {
          originalQuantity: Number(item?.originalQuantity ?? 0),
          soldQuantity: sold,
          salePrice: Number(item?.salePrice ?? 0),
          originalPrice: originalPrice
        },
        isCategoryDeal: false,
        saleStatus
      });
    });

    (activeEvent.categories || []).forEach((cat) => {
      const discountType = cat?.discountType;
      const discountValue = Number(cat?.discountValue || 0);
      const maxPerUser = Number(cat?.maxPerUser || 0);
      (cat?.category?.products || []).forEach((prod) => {
        (prod?.skus || []).forEach((sku) => {
          if (skuMap.has(sku.id)) return;
          const product = sku.product || sku.Product || prod || {};
          const image = sku.ProductMedia?.find((m) => m.type === 'image')?.mediaUrl || product.thumbnail || '';
          const basePrice = Number(sku?.originalPrice ?? sku?.price ?? 0);
          let salePrice = null;
          if (isLive) {
            if (discountType === 'percent') {
              salePrice = Math.max(0, Math.round((basePrice * (100 - discountValue)) / 100 / 1000) * 1000);
            } else if (discountType === 'fixed') {
              salePrice = Math.max(0, Math.round((basePrice - discountValue) / 1000) * 1000);
            }
          }
          const price = Number(salePrice ?? sku?.salePrice ?? sku?.price ?? 0);
          const originalPrice = Number(sku?.originalPrice ?? basePrice);
          skuMap.set(sku.id, {
            id: sku.id,
            productId: product.id,
            name: product.name || 'N/A',
            slug: product.slug || '',
            price,
            oldPrice: originalPrice > price ? originalPrice : null,
            discount: originalPrice > 0 ? Math.round(100 - (price * 100) / originalPrice) : 0,
            image,
            badge: product.badge || null,
            badgeImage: product.badgeImage || null,
            rating: Number(sku?.averageRating || 0),
            inStock: Number(sku?.stock || 0) > 0,
            soldCount: Number(sku?.totalSoldCount || 0),
            quantity: Number(sku?.stock || 0),
            flashSaleInfo: isLive
              ? {
                originalQuantity: Number(sku?.stock || 0),
                soldQuantity: Number(sku?.totalSoldCount || 0),
                salePrice: Number(price || 0),
                originalPrice,
                limitPerUser: maxPerUser
              }
              : null,
            isCategoryDeal: true,
            saleStatus
          });
        });
      });
    });

    return Array.from(skuMap.values());
  })();

  const imageBannerUrl = activeEvent?.bannerUrl || '';
  const totalProducts = productsInput.length;

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getIdealSlidesToShow = () => {
    if (windowWidth >= 1279) return 5;
    if (windowWidth >= 1024) return 4;
    if (windowWidth >= 768) return 3;
    if (windowWidth >= 479) return 2;
    return 1;
  };

  const sliderSettings = {
    dots: false,
    speed: 600,
    slidesToScroll: 1,
    slidesToShow: 5,
    infinite: totalProducts > 5,
    arrows: totalProducts > 5,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    prevArrow: <CustomSlickArrow type="prev" />,
    nextArrow: <CustomSlickArrow type="next" />,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1279, settings: { slidesToShow: 4, arrows: totalProducts > 4, infinite: totalProducts > 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, arrows: totalProducts > 3, infinite: totalProducts > 3 } },
      // iPad Mini 768px => vẫn 3 sp
      { breakpoint: 768, settings: { slidesToShow: 3, arrows: false, infinite: totalProducts > 3, centerMode: false } },
      { breakpoint: 640, settings: { slidesToShow: 2, arrows: false, infinite: totalProducts > 2 } },
      { breakpoint: 360, settings: { slidesToShow: 1, arrows: false, infinite: totalProducts > 1 } },
    ],
  };


  if (events.length === 0) {
    return (
      <div className="main-event-block max-w-[1200px] mx-auto my-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <p className="text-center py-10">Không có chương trình Flash Sale.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-event-block max-w-[1200px] mx-auto my-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-center gap-3 p-3 border-b overflow-x-auto">
          {events.map((ev, idx) => {
            const label = ev.title?.trim() || `${moment(ev.startTime).format('HH:mm DD/MM')} → ${moment(ev.endTime).format('HH:mm DD/MM')}`;
            return (
              <button
                key={ev.id ?? idx}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded whitespace-nowrap ${idx === activeIdx ? 'bg-primary text-white' : 'bg-gray-200'}`}
                title={`${ev.status === 'live' ? 'Đang diễn ra' : ev.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {imageBannerUrl && (
          <a href="#flash-sale-link">
            <img src={imageBannerUrl} alt="Sự kiện khuyến mãi" className="w-full h-auto md:h-[200px] object-cover" />
          </a>
        )}

        <div className="p-2" style={{ backgroundColor: activeEvent?.bgColor || bgColor }}>
          {activeEvent && targetCountdownTime && saleStatus !== 'ended' && (
            <div className="mb-3 text-white flex items-center gap-2">
              <span className="text-base font-bold">{countdownMode === 'start' ? 'Sắp mở bán sau: ' : 'Kết thúc sau: '}</span>
              <CountdownTimer expiryTimestamp={targetCountdownTime} mode={countdownMode} />
            </div>
          )}

          {totalProducts === 0 ? (
            <p className="text-center text-white py-10">Không có sản phẩm nào.</p>
          ) : totalProducts <= getIdealSlidesToShow() ? (
            <div className="flex flex-wrap gap-2">
              {productsInput.map((p) => (
                <div key={p.id} className="w-1/2 sm:w-1/3 md:w-1/4 xl:w-1/5">
                  <InlinedProductCard {...p} saleStatus={saleStatus} />
                </div>
              ))}
            </div>
          ) : (
            <Slider {...sliderSettings} ref={sliderRef} className="two-row-slick-slider">
              {productsInput.map((p) => (
                <div key={p.id}>
                  <InlinedProductCard {...p} saleStatus={saleStatus} />
                </div>
              ))}
            </Slider>

          )}
        </div>
      </div>
    </div>
  );
};


export default HorizontalProductSlider;
