import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import GiaoNhanhBadge from '@/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp';
import TraGopBadge from '@/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp';
import GiaTotBadge from '@/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif';
import GiaKhoBadge from '@/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif';
import ThuCuDoiMoiBadge from '@/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp';

const InlinedProductCardForChat = ({ id, slug, name, price, oldPrice, discount, badgeImage, image, rating, soldCount, inStock, badge, quantity }) => {

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

  const renderBadge = () => {
    if (!badge) {
      return <div className="mb-2 h-[28px]"></div>;
    }

   const badgeImageMap = {
  'GIAO NHANH': GiaoNhanhBadge,
  'THU CŨ ĐỔI MỚI': ThuCuDoiMoiBadge,
  'TRẢ GÓP 0%': TraGopBadge,
  'GIÁ TỐT': GiaTotBadge,
  'GIÁ KHO': GiaKhoBadge
};


    const upperCaseBadge = badge.toUpperCase();
    let imageUrl = null;

    if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
    else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
    else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
    else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];
    else if (upperCaseBadge.includes('GIÁ KHO')) imageUrl = badgeImageMap['GIÁ KHO'];
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
                 ${!inStock ? 'border-gray-300 bg-gray-50' : ''}`}
    >
      <div className="relative">
        {!inStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-t-lg pointer-events-none">
            <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
              Hết Hàng
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-30">
            -{discount}%
          </div>
        )}

        <Link
          to={`/product/${slug}`}
          className="product-card-image-link block relative w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3"
        >
          <img
            src={image || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'}
            alt={name}
            className={`max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-all duration-300 ${!inStock ? 'opacity-40' : ''}`}
            loading="lazy"
          />

          {badgeImage && (
              <img
                  src={badgeImage}
                  alt="badge overlay"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                              w-[195px] h-[180px] pointer-events-none select-none z-20"
                  loading="lazy"
              />
          )}

        </Link>


      </div>

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
            {price !== null && price !== undefined ? (
              oldPrice !== null && oldPrice !== undefined && oldPrice > price ? (
                <>
                  <span className="text-red-600 font-bold">{formatCurrencyVND(price)}</span>
                  <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">{formatCurrencyVND(oldPrice)}</span>
                </>
              ) : (
                <span className="text-red-600 font-bold">{formatCurrencyVND(price)}</span>
              )
            ) : oldPrice !== null && oldPrice !== undefined ? (
              <span className="text-red-600 font-bold">{formatCurrencyVND(oldPrice)}</span>
            ) : (
              <span className="text-gray-400 text-[13px] sm:text-sm font-normal">Liên hệ</span>
            )}
          </div>

          {(price !== null && price !== undefined && oldPrice !== null && oldPrice !== undefined && oldPrice > price) ? (
            <div className="product-card-saving text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5 min-h-[16px]" style={{ color: 'rgb(80, 171, 95)' }}>
              Tiết kiệm {(oldPrice - price).toLocaleString('vi-VN')}₫
            </div>
          ) : (
            <div className="h-[24px] mb-1" />
          )}


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

        </div>
      </div>
    </div>
  );
};


export default function ProductGridDisplay({ title, products }) {
    if (!products || products.length === 0) {
        return <div className="text-center text-gray-500 italic py-8">Không tìm thấy sản phẩm phù hợp.</div>;
    }

    return (
        <div className="product-grid-display">
            {title && <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h3>}
            {/* CHANGED gap-4 to gap-2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {products.map((p, idx) => (
                    <InlinedProductCardForChat
                        key={p.id || idx}
                        id={p.id}
                        slug={p.slug}
                        name={p.name}
                        price={p.price}
                        oldPrice={p.oldPrice}
                        discount={p.discount}
                        badgeImage={p.badgeImage}
                        image={p.image}
                        rating={p.rating}
                        soldCount={p.soldCount}
                        inStock={p.status === "Còn hàng"}
                        badge={p.badge}
                        quantity={p.quantity}
                    />
                ))}
            </div>
            <style jsx>{`
                .product-price-wrap {
                    display: flex;
                    align-items: flex-end;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .price-main {
                    color: #dc2626;
                    font-size: 1rem;
                    font-weight: 700;
                    font-family: system-ui, sans-serif;
                    font-feature-settings: "tnum";
                }
                .price-old {
                    text-decoration: line-through;
                    color: #6b7280;
                    font-size: 0.8rem;
                    font-feature-settings: "tnum";
                }
                .price-contact {
                    display: inline-block;
                    background: #f3f4f6;
                    color: #6b7280;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
            `}</style>
        </div>
    );
}