import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X as XIcon } from 'lucide-react';
import { brandService } from '../../../services/client/brandService';
import giaoNhanh from '@/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp';
import thuCuDoiMoi from '@/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp';
import traGop0 from '@/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp';
import giaTot from '@/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif';
import giaKho from '@/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif';

import Banner from '../ProductListByCategory/Banner';
import Breadcrumb from '../ProductListByCategory/Breadcrumb';
import SortBar from '../ProductListByCategory/SortBar';
import ViewedProducts from '../ProductListByCategory/ViewedProducts';
import FilterBar from '../ProductListByCategory/FilterBar';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const renderStars = (rate, id) => {
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

const formatCurrencyVND = (num) => {
  if (typeof num !== 'number' || isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const findBrandInName = (productName = '') => {
  const knownBrands = ['Daikiosan', 'Mitsubishi Electric', 'HPW'];
  const foundBrand = knownBrands.find((brand) => productName.toLowerCase().includes(brand.toLowerCase()));
  return foundBrand || null;
};

const getDiscountInfo = (product = {}) => {
  const current = Number(product?.price) || 0;
  const old = Number(product?.oldPrice || product?.originalPrice) || 0;

  let percent = Number(product?.discount) || 0;
  let amount = Number(product?.discountAmount) || 0;

  if ((!percent || percent <= 0) && old > 0 && current > 0 && current < old) {
    percent = Math.round(((old - current) / old) * 100);
  }
  if ((!amount || amount <= 0) && old > 0 && current > 0 && current < old) {
    amount = old - current;
  }

  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  if (amount < 0) amount = 0;

  return { percent, amount };
};

const renderBadge = (badge) => {
  if (!badge) return <div className="mb-2 h-[28px]"></div>;

  const badgeImageMap = {
    'GIAO NHANH': giaoNhanh,
    'THU CŨ ĐỔI MỚI': thuCuDoiMoi,
    'TRẢ GÓP 0%': traGop0,
    'GIÁ TỐT': giaTot,
    'GIÁ KHO': giaKho
  };

  const upperCaseBadge = (badge || '').toUpperCase();
  let imageUrl = null;

  if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
  else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
  else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
  else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE')) imageUrl = badgeImageMap['GIÁ TỐT'];
  else if (upperCaseBadge.includes('GIÁ KHO')) imageUrl = badgeImageMap['GIÁ KHO'];

  return imageUrl ? (
    <div className="flex justify-start items-center mb-2 h-[28px]">
      <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
    </div>
  ) : (
    <div className="mb-2 h-[28px]"></div>
  );
};

function ProductListItem({ product }) {
  const isProductTotallyOutOfStock = !product.inStock;
  const { percent: discountPercent, amount: discountAmount } = getDiscountInfo(product);
  const savings = discountAmount > 0 ? formatCurrencyVND(discountAmount) : null;

  return (
    <div className="w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white p-2.5 sm:p-3 relative transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group">
      {/* Badge -xx% */}
      {discountPercent > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-20">
          -{discountPercent}%
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
        {/* Giá hiện tại + giá gạch */}
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

        {/* Tiết kiệm … (xx%) */}
        <div className="min-h-[20px] sm:min-h-[22px]">
          {savings && (
            <div className="text-green-600 text-xs">
              Tiết kiệm {savings}
              {discountPercent > 0}
            </div>
          )}
        </div>

<div className="flex justify-between items-center text-[10px] sm:text-[10.5px] text-gray-600">
  {/* Cột bên trái: rating */}
  <div className="flex items-center gap-px sm:gap-0.5 text-yellow-400">
    {renderStars(product.rating, product.id)}
    {product.rating > 0 && (
      <span className="text-gray-500 ml-1">
        ({parseFloat(product.rating).toFixed(1)})
      </span>
    )}
  </div>

  {/* Cột bên phải: số đơn đã bán */}
  {product.deliveredOrderCount > 0 && (
    <span className="text-gray-500">
      Đã bán {product.deliveredOrderCount}
    </span>
  )}
</div>

      </div>
    </div>
  );
}
const SearchResult = () => {
  const location = useLocation();
  const results = location.state?.results || [];
  const searchType = location.state?.searchType || 'image';
  const initialResults = location.state?.results || [];
  console.log('Dữ liệu sản phẩm ban đầu:', initialResults);

  // State giả cho các component con
  const [filters, setFilters] = useState({ stock: true, price: null, brand: [] });
  const [sortOption, setSortOption] = useState('popular');
  const [brands, setBrands] = useState([]);
  const [banners] = useState([]);

  const [products, setProducts] = useState(initialResults);
  const [loading, setLoading] = useState(false);

  const onApplyFilters = (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }));
  const onApplySort = (opt) => setSortOption(opt);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      let filteredAndSortedProducts = [...initialResults];

      if (filters.stock) {
        filteredAndSortedProducts = filteredAndSortedProducts.filter((p) => p.inStock);
      }

      if (filters.price) {
        const getPriceRange = (priceString) => {
          if (priceString === 'Dưới 10 Triệu') return { min: 0, max: 10000000 };
          if (priceString === 'Từ 10 - 16 Triệu') return { min: 10000000, max: 16000000 };
          if (priceString === 'Từ 16 - 22 Triệu') return { min: 16000000, max: 22000000 };
          if (priceString === 'Trên 22 Triệu') return { min: 22000000, max: Infinity };
          return null;
        };
        const priceRange = getPriceRange(filters.price);
        if (priceRange) {
          filteredAndSortedProducts = filteredAndSortedProducts.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
        }
      }

      if (filters.brand.length > 0) {
        filteredAndSortedProducts = filteredAndSortedProducts.filter((p) => {
          const productBrand = p.brand || findBrandInName(p.name);
          return productBrand && filters.brand.includes(productBrand);
        });
      }

      if (sortOption === 'asc') filteredAndSortedProducts.sort((a, b) => a.price - b.price);
      else if (sortOption === 'desc') filteredAndSortedProducts.sort((a, b) => b.price - a.price);

      const extractedBrands = filteredAndSortedProducts.map((p) => p.brand || findBrandInName(p.name));
      const uniqueBrands = [...new Set(extractedBrands)].filter(Boolean);
      const brandListForFilter = uniqueBrands.map((brandName) => ({
        id: brandName.toLowerCase().replace(/\s/g, '-'),
        name: brandName
      }));

      setProducts(filteredAndSortedProducts);
      setBrands(brandListForFilter);
    } catch (error) {
      console.error('Lỗi khi xử lý sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [filters, sortOption, initialResults]);

  return (
    <div className="max-w-[1200px] mx-auto ">
      <Breadcrumb
        categoryName={searchType === 'text' ? `Kết quả cho "${location.state?.q || ''}"` : 'Kết quả tìm kiếm hình ảnh'}
        categorySlug=""
      />

      <FilterBar filters={filters} setFilters={setFilters} brands={brands} />

      <Banner banners={banners} />

      <SortBar
        currentFilters={filters}
        onApplyFilters={onApplyFilters}
        currentSortOption={sortOption}
        onApplySort={onApplySort}
        brandOptions={brands}
      />

      {loading ? (
        <p className="text-center py-10 text-gray-500">Đang tải sản phẩm...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {products.map((product) => (
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
