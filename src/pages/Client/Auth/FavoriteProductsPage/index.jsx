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

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await wishlistService.getAll(searchTerm ? { keyword: searchTerm } : {});
        setFavoriteProducts(res.data || []);
      } catch (err) {
        console.error('❌ Lỗi lấy danh sách yêu thích:', err);
      }
    };

    fetchFavorites();
  }, []);

  const filteredProducts = favoriteProducts.filter((item) => item?.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

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

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-sm border border-gray-200">
          <PackageOpen size={48} className="mx-auto mb-3 text-gray-400" />
          Không tìm thấy sản phẩm nào.
        </div>
      ) : (
        filteredProducts.map((item) => {
          const product = item.product || {};
          const price = product?.skus?.[0]?.price || 0;
          const originalPrice = product?.skus?.[0]?.originalPrice || 0;

          return (
            <div key={item.id} className="bg-white mb-4 border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Heart size={16} className="text-red-500" />
                  Sản phẩm đã thêm
                </div>
              </div>

              <div className="px-4 py-4 flex border-b border-gray-200">
                <img
                  src={product.thumbnail || 'https://via.placeholder.com/80'}
                  alt={product.name}
                  className="w-20 h-20 object-cover border rounded-sm mr-4 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 mb-1 line-clamp-2">{product.name}</p>
                </div>
                <div className="text-right ml-4 whitespace-nowrap">
                  {originalPrice > price && <p className="text-xs text-gray-500 line-through">{formatCurrency(originalPrice)}</p>}
                  <p className="text-sm text-orange-500 font-semibold">{formatCurrency(price)}</p>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right">
                <div className="flex justify-end items-center mb-2">
                  <span className="text-sm text-gray-800">Giá hiện tại:</span>
                  <span className="text-lg font-semibold text-orange-500 ml-2">{formatCurrency(price)}</span>
                </div>
                <div className="flex justify-end items-center text-xs text-gray-500">
                  <Info size={14} className="mr-1" />
                  Đã thêm vào yêu thích
                </div>
              </div>

              <div className="px-4 py-3 flex flex-wrap justify-end items-center gap-2">
                <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-sm transition-colors">
                  Thêm vào giỏ
                </button>
                <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-sm transition-colors">
                  Xem Chi Tiết
                </button>
                <button
                  onClick={async () => {
                    try {
                      await wishlistService.remove(product.id);
                      setFavoriteProducts((prev) => prev.filter((fav) => fav.product.id !== product.id));
                      toast.success('Đã xoá khỏi yêu thích');
                    } catch (err) {
                      console.error('❌ Lỗi khi xoá khỏi yêu thích:', err);
                      toast.error('Không thể xoá khỏi yêu thích');
                    }
                  }}
                  className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-sm transition-colors"
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
