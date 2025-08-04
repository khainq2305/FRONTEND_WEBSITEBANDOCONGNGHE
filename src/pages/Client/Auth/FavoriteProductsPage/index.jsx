import React, { useState, useEffect, useRef, useCallback } from 'react';
import HighlightText from '@/components/Admin/HighlightText';

import { PackageOpen, Search, ShoppingCart, Trash2, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import { wishlistService } from '@/services/client/wishlistService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { cartService } from '../../../../services/client/cartService';
import AddToCartSuccessToast from '../../ProductDetail/AddToCartSuccessToast';
import PopupModal from '../../../../layout/Client/Header/PopupModal';

const LoadingSkeleton = () => (
  <div className="flex space-x-4 md:space-x-0 md:flex-col md:space-y-5 overflow-x-auto md:overflow-visible pb-4 -mb-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="flex-shrink-0 w-[80vw] sm:w-80 md:w-full bg-white border border-gray-200 rounded-lg p-4 animate-pulse shadow-sm dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row sm:gap-6">
          <div className="flex flex-1 items-start gap-4">
            <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 dark:bg-gray-700"></div>
              <div className="h-8 bg-gray-300 rounded w-1/4 mt-2 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="w-full sm:w-auto flex items-center justify-end gap-2 mt-4 sm:mt-0">
            <div className="h-10 w-32 bg-gray-300 rounded-lg dark:bg-gray-700"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ searchTerm }) => (
  <div className="w-full text-center py-20 px-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
    <PackageOpen size={60} className="mx-auto text-gray-400 mb-4 dark:text-gray-500" />
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
      {searchTerm ? 'Không tìm thấy sản phẩm' : 'Danh sách yêu thích của bạn trống'}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
      {searchTerm
        ? `Rất tiếc, không có sản phẩm nào khớp với từ khóa "${searchTerm}".`
        : 'Hãy khám phá và thêm sản phẩm bạn yêu thích vào đây để dễ theo dõi và mua sắm!'}
    </p>
    {!searchTerm && (
      <Link
        to="/"
        className="mt-6 inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm hover:shadow-md"
      >
        Khám phá sản phẩm
      </Link>
    )}
  </div>
);

const FavoriteProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const visibleProducts = expanded ? favoriteProducts : favoriteProducts.slice(0, 5);

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const isLoggedIn = () => !!(localStorage.getItem('token') || sessionStorage.getItem('token'));

  const formatCurrency = (value) => {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(number)) return '0₫';
    if (number === 0) return '0₫';
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !loading && favoriteProducts.length > 0) {
      checkScrollability();
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [loading, favoriteProducts, checkScrollability]);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const firstCard = container.querySelector(':scope > div');
      if (firstCard) {
        const gap = 16;
        const scrollAmount = firstCard.offsetWidth + gap;
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchFavorites = async () => {
        setLoading(true);
        try {
          const res = await wishlistService.getAll({ keyword: searchTerm });
          setFavoriteProducts(res.data || []);
        } catch (err) {
          console.error('❌ Lỗi lấy danh sách yêu thích:', err);
          toast.error('Không thể tải danh sách sản phẩm yêu thích.');
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleRemoveItem = async (productId, skuId, productName) => {
    try {
      await wishlistService.remove(productId, skuId);
      setFavoriteProducts((prev) => prev.filter((item) => !(item.productId === productId && item.skuId === skuId)));
      toast.info(
        <div>
          Đã xóa <strong>{productName}</strong> khỏi danh sách yêu thích
        </div>
      );
    } catch (err) {
      console.error('❌ Lỗi khi xoá khỏi yêu thích:', err);
      toast.error('Không thể xoá sản phẩm.');
    }
  };

  const handleAddToCart = async (skuId, productName, productImage, productPrice) => {
    if (!isLoggedIn()) {
      setShowAuthPopup(true);
      return;
    }
    try {
      const res = await cartService.addToCart({ skuId, quantity: 1 });
      window.dispatchEvent(new Event('cartUpdated'));

      const backendMsg = res?.data?.message || '';
      const flashNotice = res?.data?.flashNotice || '';
      if (toast.isActive('add-to-cart-success-toast')) {
        toast.dismiss('add-to-cart-success-toast');
      }

      toast(
        ({ closeToast }) => (
          <AddToCartSuccessToast
            closeToast={closeToast}
            productName={productName}
            productImage={productImage}
            productPrice={productPrice}
            extraMessage={flashNotice || null}
          />
        ),
        {
          toastId: 'add-to-cart-success-toast',
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          closeButton: false,
          style: { background: 'transparent', boxShadow: 'none', padding: 0 },
          bodyStyle: { padding: 0 }
        }
      );
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      if (backendMsg?.includes('giới hạn Flash Sale')) {
        toast.info(backendMsg);
      } else {
        toast.warn(backendMsg || 'Thêm vào giỏ hàng thất bại!');
      }
      console.error('Lỗi addToCart:', err);
    }
  };

  const arrowButtonClass =
    'absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 dark:bg-gray-700/90 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-slate-200/80 dark:border-gray-600 transition-all duration-300 ease-in-out group md:hidden';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Danh sách yêu thích</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 mt-2">
          Sản phẩm yêu thích sẽ được lưu lại để bạn dễ dàng truy cập và đặt mua.
        </p>
        <div className="mb-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                            <Search size={22} className="text-gray-500" />
            </div>
                       
            <input
              type="text"
              placeholder="Tìm kiếm trong danh sách yêu thích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full bg-slate-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full pl-14 pr-5 py-3.5 shadow-sm transition-all duration-300 focus:shadow-md focus:bg-white dark:focus:bg-gray-600 focus:ring-0 focus:border-primary-light"
            />
                     
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : favoriteProducts.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <div className="relative">
            <button
              onClick={() => handleScroll('left')}
              className={`${arrowButtonClass} left-3 hover:scale-110 active:scale-100 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Lướt sang trái"
            >
              <ChevronLeft size={26} className="text-slate-700 dark:text-gray-300 transition-colors group-hover:text-primary" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              className={`${arrowButtonClass} right-3 hover:scale-110 active:scale-100 ${
                canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Lướt sang phải"
            >
              <ChevronRight size={26} className="text-slate-700 dark:text-gray-300 transition-colors group-hover:text-primary" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex space-x-4 md:space-x-0 md:flex-col md:space-y-5 overflow-x-auto md:overflow-visible pb-4 -mb-4 custom-scrollbar scroll-smooth scroll-p-4 sm:scroll-p-6 md:scroll-p-0 scroll-snap-x mandatory md:scroll-snap-none"
            >
              {visibleProducts.map((item) => {
                const product = item.product || {};
                const sku = item.sku || {};
                const imageUrl = sku?.ProductMedia?.[0]?.mediaUrl || product.thumbnail || 'https://via.placeholder.com/150';

                const displayPrice = parseFloat(sku.price ?? 0);
                const originalPriceFromBackend = parseFloat(sku.originalPrice ?? 0);
                const strikethroughPrice = parseFloat(item.oldPrice ?? 0);

                const isOnSale = displayPrice < originalPriceFromBackend && originalPriceFromBackend > 0;

                const discountAmount = isOnSale ? originalPriceFromBackend - displayPrice : 0;
                const discountPercent =
                  isOnSale && originalPriceFromBackend > 0 ? Math.round((discountAmount / originalPriceFromBackend) * 100) : 0;

                const isOnFlashSale = !!sku.flashSaleInfo && sku.flashSaleInfo.isSoldOut === false;
                const isInStock = sku.stock > 0;

                return (
                  <div
                    key={`${item.productId}-${item.skuId}`}
                    className="flex-shrink-0 w-[85vw] sm:w-96 md:w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 md:flex scroll-snap-start"
                  >
                    <div className="relative p-4 flex flex-col md:flex-row items-stretch md:gap-6 w-full">
                      <button
                        onClick={() => handleRemoveItem(item.productId, item.skuId, product.name)}
                        className="absolute top-2 right-2 z-10 p-2 text-gray-500 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-full hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all md:hidden"
                        title="Bỏ Yêu Thích"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex flex-1 items-start gap-4">
                        <Link to={`/product/${product.slug}?skuId=${item.skuId}`} className="flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-24 h-24 md:w-28 md:h-28 object-cover border border-gray-200 rounded-md"
                          />
                        </Link>
                        <div className="flex-grow pt-1 min-w-0">
                          <Link to={`/product/${product.slug}?skuId=${item.skuId}`} className="group">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors line-clamp-2">
                              <HighlightText text={product.name} highlight={searchTerm} />
                            </h2>
                          </Link>

                          {item.variantText && (
                            <div className="mt-2">
                              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold py-1 rounded-full dark:bg-primary-dark/20 dark:text-primary-light">
                                Phân loại: {item.variantText}
                              </span>
                            </div>
                          )}

                          <div className="mt-2 lg:hidden">
                            <div className="flex items-baseline gap-2">
                              <p className="text-lg text-primary font-bold">
                                {displayPrice > 0 ? formatCurrency(displayPrice) : formatCurrency(strikethroughPrice)}
                              </p>
                              {strikethroughPrice > 0 && strikethroughPrice > displayPrice && (
                                <p className="text-sm text-gray-500 line-through dark:text-gray-400">
                                  {formatCurrency(strikethroughPrice)}
                                </p>
                              )}
                            </div>
                            {isOnSale && (
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {isOnFlashSale ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-semibold dark:bg-red-900 dark:text-red-300">
                                          <Percent size={14} className="-ml-0.5 mr-1" /> Flash Sale
                                  </span>
                                ) : (
                                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
                                    Đang giảm giá
                                  </span>
                                )}
                                {discountPercent > 0 && (
                                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                                    Giảm {discountPercent}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="hidden lg:flex flex-col justify-center items-end w-52">
                        <p className="text-xl text-primary font-bold">{formatCurrency(displayPrice)}</p>
                        {strikethroughPrice > 0 && strikethroughPrice > displayPrice && (
                          <p className="text-base text-gray-500 line-through dark:text-gray-400">{formatCurrency(strikethroughPrice)}</p>
                        )}

                        {isOnSale && (
                          <div className="mt-2 flex flex-col items-end gap-1">
                            {isOnFlashSale ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-sm font-semibold dark:bg-red-900 dark:text-red-300">
                                <Percent size={14} className="-ml-0.5 mr-1" /> Flash Sale                  
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold dark:bg-orange-900 dark:text-orange-300">
                                Đang giảm giá
                              </span>
                            )}
                            <p className="text-sm text-red-600 font-medium bg-red-50 inline-block px-2 py-1 rounded dark:bg-red-900 dark:text-red-300">
                              Tiết kiệm {formatCurrency(discountAmount)} (-{discountPercent}%)                
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-none">
                        <button
                          onClick={() => handleAddToCart(sku.id, product.name, imageUrl, formatCurrency(displayPrice))}
                          disabled={!isInStock}
                          className={`min-w-[140px] w-full flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-lg text-sm shadow-md transition-all duration-200
                                ${
                                  isInStock
                                    ? 'bg-primary text-white hover:opacity-90 hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-80 dark:bg-gray-700 dark:text-gray-400'
                                }
                          `}
                        >
                          <ShoppingCart size={18} />
                          <span>{isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.skuId, product.name)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0 hidden md:flex"
                          title="Bỏ Yêu Thích"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {favoriteProducts.length > 5 && (
                <div className="text-center mt-6 col-span-full">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="inline-flex items-center justify-center text-primary font-medium hover:underline text-sm transition-all"
                  >
                    {expanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showAuthPopup && <PopupModal isOpen={showAuthPopup} onClose={() => setShowAuthPopup(false)} />}
    </div>
  );
};
export default FavoriteProductsPage;
