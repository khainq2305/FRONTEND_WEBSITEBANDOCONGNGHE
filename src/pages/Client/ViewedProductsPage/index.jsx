import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { EyeIcon } from 'lucide-react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { productViewService } from '../../../services/client/productViewService';

const InlinedProductCard = ({ id, badgeImage, productId, name, price, oldPrice, discount, image, rating, slug, soldCount, inStock, badge }) => {

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
      'GIÁ TỐT': 'src/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif',
      'GIÁ KHO': 'src/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif'
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
        <div className="flex justify-start items-center mt-4 mb-2 h-[28px]">
          <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
        </div>
      );
    }

    return <div className="mb-2 h-[28px]"></div>;
  };

  return (
    <div className="product-card-item w-full h-full flex flex-col bg-white relative transition-all duration-300 ease-in-out group/productCard rounded-lg overflow-hidden p-2
                     border border-gray-200/70 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 z-10">
      <div className="relative">
        {!inStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-t-lg pointer-events-none">
            <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
              Hết Hàng
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-25">
            -{discount}%
          </div>
        )}

        <Link
          to={`/product/${slug}`}
          className="product-card-image-link block w-full h-[125px] xs:h-[140px] sm:h-[160px] mt-3 mb-1.5 sm:mt-4 sm:mb-2
                     flex items-center justify-center px-3 relative"
        >
          <img
            src={image || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'}
            alt={name}
            className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {badgeImage && (
            <img
              src={badgeImage}
              alt="badge overlay"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-full h-full object-contain z-20 pointer-events-none select-none
                         transform scale-[1.3]"
              loading="lazy"
            />
          )}
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


const ViewedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViewedProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const viewedIds = JSON.parse(localStorage.getItem('viewed_products')) || [];

        if (!Array.isArray(viewedIds) || viewedIds.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        const response = await productViewService.getByIds(viewedIds);
        const rawProducts = response.data.products || [];

        const formattedProducts = viewedIds
          .map((id) => rawProducts.find((p) => p.id === id))
          .filter(Boolean)
          .map(p => ({
            id: p.id,
            productId: p.id,
            name: p.name,
            slug: p.slug,
            thumbnail: p.thumbnail,
            image: p.thumbnail,
            price: p.price ? p.price.toLocaleString('vi-VN') : null,
            oldPrice: p.originalPrice ? p.originalPrice.toLocaleString('vi-VN') : null,
            discount:
              p.originalPrice && p.price && p.price < p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 0,
            rating: p.rating || 0,
            soldCount: p.soldCount || 0,

            inStock: p.inStock ?? true,
            badge: p.badge,
            badgeImage: p.badgeImage,
          }));

        setProducts(formattedProducts);
      } catch (err) {

        setError(err.message || 'Lỗi không xác định');
        toast.error(err.message || 'Lỗi khi tải sản phẩm đã xem');
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto bg-white p-6 rounded-md shadow border border-gray-200 text-center text-gray-500 mb-20">
        <div className="flex items-center justify-center mb-3">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        Đang tải sản phẩm đã xem...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto bg-white p-6 rounded-md shadow border border-gray-200 text-center text-red-500 mb-20">
        <h2 className="text-xl font-semibold mb-2">Lỗi</h2>
        <p>{error}</p>
        <p className="text-gray-500 text-sm mt-2">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto bg-white p-2 rounded-md shadow border border-gray-200 mb-20">
      <h2 className="pl-3 py-4 pt-4 text-xl font-bold text-[#c51813] uppercase">
        Sản phẩm đã xem
      </h2>


      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg mb-2">Bạn chưa xem sản phẩm nào gần đây.</p>
          <p className="text-sm">Hãy duyệt qua các sản phẩm của chúng tôi để bắt đầu!</p>
        </div>
      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-4">
          {products.map((product) => (
            <InlinedProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewedProductsPage;