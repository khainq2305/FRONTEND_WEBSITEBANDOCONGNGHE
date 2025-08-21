import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X as XIcon } from 'lucide-react';

// Import các services cần thiết cho việc lấy dữ liệu (đã loại bỏ vì không sử dụng)
// import { searchImageService } from '../../../services/client/searchImageService';
// import { brandService } from '../../../services/client/brandService';

// Import các component con
import Banner from '../ProductListByCategory/Banner';
import Breadcrumb from '../ProductListByCategory/Breadcrumb';
import SortBar from '../ProductListByCategory/SortBar';
import ViewedProducts from '../ProductListByCategory/ViewedProducts';

// =========================================================
// HÀM TIỆN ÍCH CHUNG (Giữ nguyên)
// =========================================================
const formatCurrencyVND = (num) => {
  if (typeof num !== 'number' || isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const renderBadge = (badge) => {
  if (!badge) return <div className="mb-2 h-[28px]"></div>;

  const badgeImageMap = {
    'GIAO NHANH': '/src/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp',
    'THU CŨ ĐỔI MỚI': '/src/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp',
    'TRẢ GÓP 0%': '/src/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp',
    'GIÁ TỐT': '/src/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif'
  };

  const upperCaseBadge = badge.toUpperCase();
  let imageUrl = null;

  if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
  else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
  else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
  else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];

  return imageUrl ? (
    <div className="flex justify-start items-center mb-2 h-[28px]">
      <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
    </div>
  ) : (
    <div className="mb-2 h-[28px]"></div>
  );
};

// =========================================================
// COMPONENT ProductListItem
// =========================================================

function ProductListItem({ product }) {
  const isProductTotallyOutOfStock = !product.inStock;
  const savings = product.discountAmount > 0 ? formatCurrencyVND(product.discountAmount) : null;

  return (
    <div className="w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white p-2.5 sm:p-3 relative transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group">
      {product.discount > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-20">
          -{product.discount}%
        </div>
      )}

      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative w-full h-[160px] sm:h-[200px] mb-2 flex items-center justify-center overflow-hidden">
          {isProductTotallyOutOfStock && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-30 rounded-lg pointer-events-none">
              <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
                Hết Hàng
              </span>
            </div>
          )}
          <img
            src={product.image || product.thumbnail || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'}
            alt={product.name}
            className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
              isProductTotallyOutOfStock ? 'grayscale opacity-80' : 'group-hover:scale-105'
            }`}
            loading="lazy"
            style={{ zIndex: 10 }}
          />
          {product.badgeImage && (
            <img
              src={product.badgeImage}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[205px] h-[190px] pointer-events-none select-none z-20"
            />
          )}
        </div>

        {renderBadge(product.badge)}

        <h3
          className={`font-medium text-xs sm:text-[13px] line-clamp-2 min-h-9 sm:min-h-[25px] leading-snug sm:leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-200 ${
            isProductTotallyOutOfStock ? 'text-gray-500' : ''
          }`}
          title={product.name}
        >
          {product.name}
        </h3>
      </Link>

      <div className="mt-auto flex flex-col flex-grow justify-end">
        <div className="product-card-price text-sm mb-1">
          {typeof product.price === 'number' && product.price > 0 ? (
            <>
              <span className="text-red-600 text-base font-bold">{formatCurrencyVND(product.price)}</span>
              {product.oldPrice > 0 && product.oldPrice > product.price ? (
                <span className="text-gray-400 text-[10px] sm:text-xs line-through ml-1.5">{formatCurrencyVND(product.oldPrice)}</span>
              ) : null}
            </>
          ) : (
            <span className="text-gray-500 italic">Liên hệ</span>
          )}
        </div>

        <div className="min-h-[20px] sm:min-h-[22px]">{savings && <div className="text-green-600 text-xs">Tiết kiệm {savings}</div>}</div>

        <div className="flex justify-between items-center text-[10px] sm:text-xs mb-1.5 sm:mb-2 min-h-[16px] sm:min-h-[18px]"></div>

        <div className="product-card-actions flex items-center justify-between min-h-[26px] pt-1">
          <button
            aria-label="So sánh sản phẩm"
            className={`flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 hover:text-blue-700 transition-colors focus:outline-none p-1 rounded-md hover:bg-gray-100 ${
              isProductTotallyOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isProductTotallyOutOfStock}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 21h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6m-3-3v12"
              />
            </svg>
            <span className="leading-none whitespace-nowrap">So sánh</span>
          </button>

          {isProductTotallyOutOfStock ? (
            <div className="flex items-center gap-1">
              <span className="text-red-500 font-semibold text-[10px] sm:text-xs leading-none whitespace-nowrap">Hết hàng</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-green-600 font-semibold text-[10px] sm:text-xs leading-none whitespace-nowrap">Còn hàng</span>
              <img src={'/src/assets/Client/images/icon-deli.webp'} alt="Còn hàng" className="w-4 h-4 object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// COMPONENT SearchResult (Main Component)
// =========================================================
const SearchResult = () => {
  const location = useLocation();
  // Lấy dữ liệu và loại tìm kiếm trực tiếp từ location.state
  const results = location.state?.results || [];
  const searchType = location.state?.searchType || 'image';

  // Dùng state giả để tránh lỗi cho các component con
  const [filters] = useState({ stock: false, price: null, brand: [] });
  const [sortOption] = useState('popular');
  const [brands] = useState([]);
  const [banners] = useState([]);

  // Hàm dummy để SortBar không báo lỗi
  const onApplyFilters = () => {};
  const onApplySort = () => {};

  return (
    <div className="max-w-[1200px] mx-auto ">
      <Breadcrumb
        categoryName={searchType === 'text' ? `Kết quả cho "${location.state?.q || ''}"` : 'Kết quả tìm kiếm hình ảnh'}
        categorySlug=""
      />

      <Banner banners={banners} />

      <SortBar
        currentFilters={filters}
        onApplyFilters={onApplyFilters}
        currentSortOption={sortOption}
        onApplySort={onApplySort}
        brandOptions={brands}
      />

      {results.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          {searchType === 'text' ? 'Không tìm thấy sản phẩm phù hợp với từ khóa.' : 'Không tìm thấy sản phẩm tương tự.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {results.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}
      
  {console.log('DEBUG: Cố gắng render ViewedProducts...')}
<ViewedProducts />
{console.log('DEBUG: Đã render xong ViewedProducts.')}
    </div>
  );
};

export default SearchResult;
