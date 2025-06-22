import React, { useState, useEffect } from 'react';
import { PackageOpen, Search, ShoppingCart, Trash2, Percent } from 'lucide-react';
import { wishlistService } from '@/services/client/wishlistService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Skeleton khi loading
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse flex space-x-4"
      >
        <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="w-1/4 flex flex-col items-end justify-between">
          <div className="h-8 bg-gray-300 rounded w-32"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

// Rỗng
const EmptyState = ({ searchTerm }) => (
  <div className="w-full text-center py-20 px-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
    <PackageOpen size={60} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-800">
      {searchTerm ? 'Không tìm thấy sản phẩm' : 'Danh sách yêu thích của bạn trống'}
    </h3>
    <p className="text-gray-500 mt-2 max-w-md mx-auto">
      {searchTerm
        ? `Không tìm thấy sản phẩm khớp với từ khóa "${searchTerm}".`
        : 'Hãy khám phá và thêm sản phẩm bạn yêu thích vào đây để dễ theo dõi!'}
    </p>
    {!searchTerm && (
      <Link
        to="/"
        className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Bắt đầu mua sắm
      </Link>
    )}
  </div>
);

const FavoriteProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (vnd) => {
    const number = typeof vnd === 'string' ? parseFloat(vnd) : vnd;
    return number?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0₫';
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
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleRemoveItem = async (productId, skuId, productName) => {
    try {
      await wishlistService.remove(productId, skuId);
      setFavoriteProducts((prev) =>
        prev.filter((item) => !(item.productId === productId && item.skuId === skuId))
      );
      toast.info(<div>Đã xóa <strong>{productName}</strong> khỏi danh sách yêu thích</div>);
    } catch (err) {
      console.error('❌ Lỗi khi xoá khỏi yêu thích:', err);
      toast.error('Không thể xoá sản phẩm.');
    }
  };

  const handleAddToCart = (productName) => {
    toast.success(<div>Đã thêm <strong>{productName}</strong> vào giỏ hàng</div>);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tìm kiếm */}
      <div className="mb-8">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm trong danh sách yêu thích của bạn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full bg-white border border-gray-300 text-gray-900 rounded-lg pl-12 pr-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
          />
        </div>
      </div>

      {/* Danh sách */}
      {loading ? (
        <LoadingSkeleton />
      ) : favoriteProducts.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <div className="space-y-4">
          {favoriteProducts.map((item) => {
            const product = item.product || {};
            const sku = item.sku || {};
            const imageUrl =
              sku?.ProductMedia?.[0]?.mediaUrl || product.thumbnail || 'https://via.placeholder.com/100';

            const salePrice = item.salePrice ?? sku.flashSaleSkus?.[0]?.salePrice ?? null;
            const displayPrice = salePrice ?? sku.price ?? sku.originalPrice ?? 0;

            const strikethroughPrice =
              salePrice && sku.originalPrice && salePrice < sku.originalPrice
                ? sku.originalPrice
                : sku.originalPrice && sku.price && sku.price < sku.originalPrice
                ? sku.originalPrice
                : null;

            const isOnSale = !!salePrice;
            const discountAmount = strikethroughPrice && displayPrice < strikethroughPrice
              ? strikethroughPrice - displayPrice
              : 0;
            const discountPercent = discountAmount > 0
              ? Math.round((discountAmount / strikethroughPrice) * 100)
              : 0;

            return (
              <div
                key={`${item.productId}-${item.skuId}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-6">
                  {/* Ảnh + mô tả */}
                  <div className="flex-1 min-w-0 flex items-start gap-4">
                    <Link to={`/product/${product.slug}?skuId=${item.skuId}`} className="flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-gray-200 rounded-md"
                      />
                    </Link>
                    <div className="flex-grow pt-1">
                      <Link to={`/product/${product.slug}?skuId=${item.skuId}`} className="group">
                        <p className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </p>
                      </Link>
                      {item.variantText && (
                        <p className="text-sm text-gray-500 mt-1">
                          Phân loại: {item.variantText}
                        </p>
                      )}
                      <div className="mt-2 sm:hidden">
                        <div className="flex items-center gap-2">
                          <p className="text-base text-primary font-bold">
                            {formatCurrency(displayPrice)}
                          </p>
                          {isOnSale && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                              <Percent size={14} className="mr-1" /> Đang giảm giá
                            </span>
                          )}
                        </div>
                        {strikethroughPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatCurrency(strikethroughPrice)}
                          </p>
                        )}
                        {discountAmount > 0 && (
                          <p className="text-sm text-red-600 font-medium bg-red-50 inline-block px-2 py-1 rounded mt-1">
                            Giảm {formatCurrency(discountAmount)} (-{discountPercent}%)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Giá desktop */}
                  <div className="hidden sm:block sm:w-48 text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-lg text-primary font-bold">
                        {formatCurrency(displayPrice)}
                      </p>
                      {isOnSale && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                          <Percent size={14} className="mr-1" /> Đang giảm giá
                        </span>
                      )}
                    </div>
                    {strikethroughPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatCurrency(strikethroughPrice)}
                      </p>
                    )}
                    {discountAmount > 0 && (
                      <p className="text-sm text-red-600 font-medium bg-red-50 inline-block px-2 py-1 rounded mt-1">
                        Giảm {formatCurrency(discountAmount)} (-{discountPercent}%)
                      </p>
                    )}
                  </div>

                  {/* Hành động */}
                  <div className="w-full sm:w-auto flex items-center justify-end gap-2 mt-4 sm:mt-0">
                    <button
                      onClick={() => handleRemoveItem(item.productId, item.skuId, product.name)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Bỏ Yêu Thích"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product.name)}
                      className="flex items-center justify-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
                    >
                      <ShoppingCart size={16} />
                      <span>Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteProductsPage;
