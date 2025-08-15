import React, { useState, useEffect } from 'react';
import { recommendationService } from '../../../../services/client/recommendationService';
import { API_BASE_URL } from '../../../../constants/environment';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import giaoNhanh from '@/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp';
import thuCuDoiMoi from '@/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp';
import traGop0 from '@/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp';
import giaTot from '@/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif';
import giaKho from '@/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif';

const RecommendedProductsSection = ({ userId, currentProductId = null }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const constructImageUrl = (path) => {
    if (!path) {
      return 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image';
    }
    if (path.startsWith('http')) {
      return path;
    }
    return `${API_BASE_URL}${path}`;
  };

  const renderStars = (rate, productIdForId) => {
    const stars = [];
    const numRating = parseFloat(rate);
    if (isNaN(numRating) || numRating <= 0) return <div className="h-[14px] sm:h-[16px] w-auto"></div>;
    for (let i = 1; i <= 5; i++) {
      if (numRating >= i)
        stars.push(<FaStar key={`star-${i}-${productIdForId}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else if (numRating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={`half-${i}-${productIdForId}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
      else stars.push(<FaRegStar key={`empty-${i}-${productIdForId}`} className="text-yellow-400 text-[10.5px] sm:text-[11.5px]" />);
    }
    return stars;
  };

  const renderBadge = (badge, badgeImage) => {
    if (!badge) {
      return <div className="mb-2 h-[28px]"></div>;
    }

    const badgeImageMap = {
      'GIAO NHANH': giaoNhanh,
      'THU CŨ ĐỔI MỚI': thuCuDoiMoi,
      'TRẢ GÓP 0%': traGop0,
      'GIÁ TỐT': giaTot,
      'GIÁ KHO': giaKho
    };

    const upperCaseBadge = badge.toUpperCase();
    let imageUrl = null;

    if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
    else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
    else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
    else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];
    else if (upperCaseBadge.includes('GIÁ KHO')) imageUrl = badgeImageMap['GIÁ KHO'];

    if (badgeImage && !imageUrl) imageUrl = constructImageUrl(badgeImage);

    if (imageUrl) {
      return (
        <div className="flex justify-start items-center mt-4 mb-2 h-[28px]">
          <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
        </div>
      );
    }

    return <div className="mb-2 h-[28px]"></div>;
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const recommendations = await recommendationService.getRecommendations(userId, currentProductId);

        if (Array.isArray(recommendations)) {
          setRecommendations(recommendations);
        }
      } catch (err) {
        setError('Không thể tải gợi ý sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, currentProductId]);

  // Lọc các sản phẩm hợp lệ để tránh lỗi hiển thị
  const validRecommendations = recommendations.filter(
    (product) =>
      product &&
      product.id !== undefined &&
      product.id !== null &&
      product.name &&
      product.slug &&
      product.thumbnail !== undefined &&
      product.thumbnail !== null &&
      product.price !== undefined &&
      product.price !== null
  );

  if (loading || error || validRecommendations.length === 0) {
    return null;
  }

  const geminiGradientStyle = {
    background: `radial-gradient(circle at 670.447px 474.006px, #1BA1E3 0%, #5489D6 30%, #9B72CB 55%, #D96570 82%, #F49C46 100%)`
  };

  return (
    <section className="p-2 rounded-lg shadow-md my-4" style={geminiGradientStyle}>
      <h2 className="flex items-center text-2xl font-bold mb-4 gap-2 text-white mt-2 uppercase">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1080 1080" fill="none">
          <path
            d="M515.09 725.824L472.006 824.503C455.444 862.434 402.954 862.434 386.393 824.503L343.308 725.824C304.966 638.006 235.953 568.104 149.868 529.892L31.2779 477.251C-6.42601 460.515 -6.42594 405.665 31.2779 388.929L146.164 337.932C234.463 298.737 304.714 226.244 342.401 135.431L386.044 30.2693C402.239 -8.75637 456.159 -8.75646 472.355 30.2692L515.998 135.432C553.685 226.244 623.935 298.737 712.234 337.932L827.121 388.929C864.825 405.665 864.825 460.515 827.121 477.251L708.53 529.892C622.446 568.104 553.433 638.006 515.09 725.824Z"
            fill="white"
          ></path>
        </svg>
        SẢN PHẨM GỢI Ý CHO BẠN
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {validRecommendations.map((product) => (
          <div
            key={product.id}
            className="product-card-item w-full h-full flex flex-col bg-white relative transition-all duration-300 ease-in-out group/productCard border-l border-r border-transparent hover:shadow-2xl hover:z-20 hover:border-l-gray-200 hover:border-r-gray-200 rounded-lg overflow-hidden p-2"
          >
            <div className="relative">
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-t-lg pointer-events-none">
                  <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
                    Hết Hàng
                  </span>
                </div>
              )}

              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-30">
                  -{product.discount}%
                </div>
              )}

              <Link
                to={`/product/${product.slug}`}
                className="product-card-image-link block w-full h-[140px] xs:h-[160px] sm:h-[180px] mt-3 mb-2 flex items-center justify-center px-3"
              >
                <img
                  src={constructImageUrl(product.thumbnail)}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {product.badgeImage && (
                  <img
                    src={constructImageUrl(product.badgeImage)}
                    alt="badge overlay"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               w-full h-full object-contain z-20 pointer-events-none select-none hidden sm:block
               transform scale-[1.1]"
                    loading="lazy"
                  />
                )}
              </Link>
            </div>

            <div className="product-card-info px-1 pt-1 pb-2 flex flex-col flex-grow overflow-hidden">
              {renderBadge(product.badge, product.badgeImage)}

              <h3
                className="product-card-name font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 h-[38px] line-clamp-2"
                title={product.name}
              >
                <Link to={`/product/${product.slug}`} className="hover:underline">
                  {product.name}
                </Link>
              </h3>

              <div className="mt-auto">
                <div className="product-card-price text-[13px] sm:text-sm mb-0.5">
                  {product.price !== null ? (
                    product.oldPrice && product.discount > 0 ? (
                      <>
                        <span className="text-red-600 font-bold">{product.price}</span>
                        <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-2">{product.oldPrice}</span>
                      </>
                    ) : (
                      <span className="text-red-600 font-bold">{product.price}</span>
                    )
                  ) : (
                    <span className="text-gray-400 text-[13px] sm:text-sm font-normal">Liên hệ</span>
                  )}
                </div>

                <div
                  className="product-card-saving text-[10px] sm:text-[10.5px] font-medium mb-1.5 min-h-[16px]"
                  style={{ color: 'rgb(80, 171, 95)' }}
                >
                  {product.price !== null && product.oldPrice !== null && product.discount > 0
                    ? `Tiết kiệm ${(parseFloat(String(product.oldPrice).replace(/[^0-9.-]+/g, '')) - parseFloat(String(product.price).replace(/[^0-9.-]+/g, ''))).toLocaleString('vi-VN')}₫`
                    : ''}
                </div>

                <div className="pt-1.5">
                  <div className="product-card-meta flex items-center justify-between min-h-[18px]">
                    <div className="flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-[10.5px] text-gray-600">
                      {renderStars(product.averageRating, product.id)}
                    </div>

                    {product.inStock && product.soldCount > 0 && (
                      <span className="text-gray-500 text-[9.5px] sm:text-[10.5px] font-medium">
                        Đã bán {product.soldCount > 999 ? `${(product.soldCount / 1000).toFixed(0)}k+` : product.soldCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedProductsSection;
