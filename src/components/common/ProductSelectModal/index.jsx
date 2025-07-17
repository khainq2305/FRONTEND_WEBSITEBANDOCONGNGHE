import React, { useEffect, useState } from 'react';
import { productService } from '../../../services/client/productService';
import { FaSearch } from 'react-icons/fa';

const ProductSelectModal = ({ onClose, onSelect, excludedProductIds = [], categoryId }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.searchForCompare({ keyword: search, categoryId });
      if (res?.data) {
        const filtered = res.data.filter(
          (p) => !excludedProductIds.includes(p.id) && p.name.toLowerCase().includes(search.toLowerCase())
        );
        setProducts(filtered);
      }
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompare = (product) => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentIds = urlParams.get('ids')?.split(',').map((id) => parseInt(id)) || [];
    const updatedIds = [...new Set([...currentIds, product.id])];

    const newUrl = `/compare-products?ids=${updatedIds.join(',')}`;
    window.history.pushState({}, '', newUrl);

    if (onSelect) onSelect(product);
    onClose();
  };

  return (
<div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-md shadow-lg p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg">
          ✕
        </button>

        <h2 className="text-base font-semibold text-gray-800 mb-3 text-center">Chọn sản phẩm để so sánh</h2>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {loading ? (
          <div className="text-sm text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((product) => {
              const hasDiscount = product.originalPriceNum > product.priceNum;
              const discountAmount = product.savings || 0;
              const discountPercent = product.discount || 0;

              return (
                <div
  key={product.id}
  className="relative border border-gray-200 rounded-md p-3 hover:shadow-md transition duration-200 flex flex-col items-center text-center"
>

                  {hasDiscount && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded">
                      -{discountPercent}%
                    </div>
                  )}

                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-28 object-contain mb-2"
                  />

                  {product.badge && (
                    <div className="inline-block text-[10px] font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded mb-1">
                      🔥 {product.badge}
                    </div>
                  )}

                  <div className="text-xs font-medium text-blue-700 hover:underline line-clamp-2 min-h-[32px]">
                    {product.name}
                  </div>

                  <div className="text-red-600 font-bold text-sm mt-1">
                    {Math.round(product.priceNum).toLocaleString('vi-VN')}₫
                  </div>

                  {hasDiscount && (
                    <>
                      <div className="text-xs text-gray-400 line-through">
                        {Math.round(product.originalPriceNum).toLocaleString('vi-VN')}₫
                      </div>
                      <div className="text-xs text-green-600">
                        Tiết kiệm {Math.round(discountAmount).toLocaleString('vi-VN')}₫
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => handleAddCompare(product)}
                    className="text-blue-500 text-xs mt-2 hover:underline block"
                  >
                    Thêm so sánh
                  </button>
                </div>
              );
            })}

            {!products.length && (
              <div className="text-center text-gray-500 col-span-full text-sm py-4">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelectModal;