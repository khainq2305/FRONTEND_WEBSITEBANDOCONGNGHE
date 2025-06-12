import React, { useState, useEffect } from 'react';
import { Info, Heart, PackageOpen, Search } from 'lucide-react';
import { wishlistService } from '@/services/client/wishlistService';
import { toast } from 'react-toastify';

const formatCurrency = (vnd) => {
  const number = typeof vnd === 'string' ? parseFloat(vnd) : vnd;
  return number?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0₫';
};

const FavoriteProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading để trải nghiệm tốt hơn

  // Sử dụng useEffect để gọi lại API khi searchTerm thay đổi
  useEffect(() => {
    // Sử dụng debounce để tránh gọi API liên tục khi người dùng gõ
    const handler = setTimeout(() => {
      const fetchFavorites = async () => {
        setLoading(true);
        try {
          const res = await wishlistService.getAll({ keyword: searchTerm });
          setFavoriteProducts(res.data || []);
        } catch (err) {
          console.error('❌ Lỗi lấy danh sách yêu thích:', err);
          toast.error("Không thể tải danh sách sản phẩm.");
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }, 300); // Đợi 300ms sau khi người dùng ngừng gõ rồi mới tìm kiếm

    return () => {
      clearTimeout(handler); // Cleanup timeout
    };
  }, [searchTerm]); // Phụ thuộc vào searchTerm

  const handleRemoveItem = async (productId) => {
    try {
      await wishlistService.remove(productId);
      setFavoriteProducts((prev) => prev.filter((fav) => fav.product.id !== productId));
      toast.success('Đã xoá khỏi yêu thích');
    } catch (err) {
      console.error('❌ Lỗi khi xoá khỏi yêu thích:', err);
      toast.error('Không thể xoá khỏi yêu thích');
    }
  };
  
  // Không cần lọc ở client nữa vì API đã hỗ trợ tìm kiếm
  // const filteredProducts = favoriteProducts.filter(...);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản Phẩm Yêu Thích</h2>

      <div className="mb-4 relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full bg-white border border-gray-300 text-sm text-gray-900 rounded-sm pl-10 pr-3 py-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-16">Đang tải...</div>
      ) : favoriteProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-sm border border-gray-200">
          <PackageOpen size={48} className="mx-auto mb-3 text-gray-400" />
          {searchTerm ? "Không tìm thấy sản phẩm nào phù hợp." : "Bạn chưa có sản phẩm yêu thích nào."}
        </div>
      ) : (
        favoriteProducts.map((item) => {
          const product = item.product || {};

          // ✅ LOGIC GIÁ MỚI
          // Lấy giá gốc và giá khuyến mãi mà không dùng fallback `|| 0`
          const listPrice = product?.skus?.[0]?.originalPrice;
          const salePrice = product?.skus?.[0]?.price;

          // Giá hiển thị chính là giá sale, nếu không có thì mới lấy giá gốc
          const displayPrice = salePrice ?? listPrice ?? 0;
          
          // Giá bị gạch chỉ tồn tại khi có giá sale và giá sale nhỏ hơn giá gốc
          const strikethroughPrice = (salePrice != null && salePrice < listPrice) ? listPrice : null;

          return (
            <div key={item.id} className="bg-white mb-4 border border-gray-200 rounded-sm shadow-sm overflow-hidden">
              <div className="px-4 py-4 flex items-start border-b border-gray-200">
                <img
                  src={product.thumbnail || 'https://via.placeholder.com/80'}
                  alt={product.name}
                  className="w-20 h-20 object-cover border rounded-sm mr-4 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</p>
                   {/* ✅ HIỂN THỊ GIÁ THEO LOGIC MỚI */}
                  <div className="flex items-baseline gap-2">
                    <p className="text-base text-orange-500 font-semibold">{formatCurrency(displayPrice)}</p>
                    {strikethroughPrice && (
                      <p className="text-xs text-gray-500 line-through">{formatCurrency(strikethroughPrice)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 flex flex-wrap justify-end items-center gap-2">
                <button className="text-sm bg-primary hover:opacity-85 text-white px-4 py-2 rounded-sm transition-colors">
                  Thêm vào giỏ
                </button>
                <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-sm transition-colors">
                  Xem Chi Tiết
                </button>
                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-red-600 hover:border-red-400 px-4 py-2 rounded-sm transition-colors"
                >
                  Bỏ Yêu Thích
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FavoriteProductsPage;