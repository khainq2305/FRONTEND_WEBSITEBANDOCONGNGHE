import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import ProductSelectModal from '../../../../components/common/ProductSelectModal'; // ✅ Thêm dòng này

const ProductHeaderComparison = ({
  products = [],
  onRemoveProduct,
  onAddProduct,
  sidebarWidthClass,
  productColumnClasses,
  showOnlyDifferences,
  onToggleDifferences
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Thêm dòng này

  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null); // Thêm slot trống
  }

const parseAndFormatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    console.warn("⚠️ Giá không hợp lệ:", price);
    return '0';
  }
  return price.toLocaleString('vi-VN');
};



  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={`star-${i}`}
          className={`text-yellow-400 text-[11px] ${i > rating ? 'opacity-20' : ''}`}
        />
      );
    }
    return stars;
  };

  const handleAddProduct = () => {
    setIsModalOpen(true); // ✅ mở modal
  };

  const handleSelectProduct = (product) => {
    onAddProduct(product);     // gọi callback
    setIsModalOpen(false);     // đóng modal
  };

  return (
    <>
      <div className="flex border-b border-gray-300">
        {/* Sidebar cột nhãn */}
        <div className={`${sidebarWidthClass} flex-shrink-0 border-r border-gray-300 bg-white p-2`}>
          <span className="text-xm text-gray-700 block mb-2">So sánh sản phẩm</span>

          <div className="text-[12px] uppercase font-semibold text-gray-800 leading-snug">
            {products.map((p, idx) => (
              <span key={p.id}>
                {p.name}
                {idx < products.length - 1 && (
                  <span className="mx-1 text-gray-500">
                    <br /> & <br />
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Checkbox: chỉ xem điểm khác biệt */}
          <div className="mt-2">
            <label className="flex items-center space-x-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={showOnlyDifferences}
                onChange={onToggleDifferences}
                className="w-4 h-4 rounded border-gray-300 focus:ring-0"
              />
              <span>Chỉ xem điểm khác biệt</span>
            </label>
          </div>
        </div>

        {/* Danh sách sản phẩm + slot trống */}
        <div className="flex-grow grid grid-cols-3 bg-white">
          {columnsToRender.map((product, index) => (
            <div
              key={product?.id || `empty-${index}`}
              className={`${productColumnClasses} relative border-r border-gray-300 p-2 flex flex-col items-center justify-start`}
            >
              {product ? (
                <>
                  {products.length > 1 && (
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="absolute top-1 right-1 text-gray-400 hover:text-red-600"
                      title="Xoá khỏi so sánh"
                    >
                      ✕
                    </button>
                  )}

                  <Link to={`/product/${product.slug}`} className="text-center group w-full">
                    <div className="my-2 w-full flex justify-center">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="max-h-28 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-[13px] font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 px-1">
                      {product.name || '-'}
                    </div>
                  </Link>

                  {/* ✅ Hiển thị giá & ưu đãi */}
                  <div className="mt-2 text-red-600 font-bold text-sm">
                    {parseAndFormatPrice(product.priceNum)}₫
                  </div>

                  {product.originalPriceNum > product.priceNum && (
                    <div className="text-[11px] line-through text-gray-400">
                      {parseAndFormatPrice(product.originalPriceNum)}₫
                    </div>
                  )}

                  {product.originalPriceNum > product.priceNum && (
                    <div className="text-green-600 text-[11px] mt-0.5">
                      Tiết kiệm {parseAndFormatPrice(product.originalPriceNum - product.priceNum)}₫
                    </div>
                  )}

                  {product.badge && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded mt-1">
                      🔥 {product.badge}
                    </div>
                  )}

                  {/* Sao và lượt bán */}
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="flex items-center gap-0.5">{renderStars(product.rating)}</span>
                    <span className="text-[11px]">{product.soldCount ? `Đã bán ${product.soldCount}` : '-'}</span>
                  </div>
                </>
              ) : (
                // Slot thêm mới
                <div
  onClick={handleAddProduct}
  className="flex flex-col items-center justify-center h-full py-6 cursor-pointer transition hover:scale-105"
>
  <div className="w-12 h-12 border border-blue-400 border-dashed flex items-center justify-center text-blue-500 rounded-sm text-2xl">
    +
  </div>
  <span className="text-sm text-gray-600 mt-2">Thêm sản phẩm</span>
</div>

              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Hiển thị modal chọn sản phẩm */}
      {isModalOpen && (
        <ProductSelectModal
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelectProduct}
          excludedProductIds={products.map((p) => p.id)}
        />
      )}
    </>
  );
};

export default ProductHeaderComparison;
