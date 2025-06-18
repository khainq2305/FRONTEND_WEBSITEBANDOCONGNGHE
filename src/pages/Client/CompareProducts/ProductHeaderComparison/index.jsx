import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductHeaderComparison = ({ products = [], onRemoveProduct, onAddProduct, sidebarWidthClass, productColumnClasses }) => {
  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null); // Thêm slot trống
  }

  const parseAndFormatPrice = (priceString) => {
    const numericString = String(priceString).replace(/\D/g, '');
    const number = parseFloat(numericString);
    if (isNaN(number)) return '';
    return number.toLocaleString('vi-VN');
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<FaStar key={`star-${i}`} className={`text-yellow-400 text-[11px] ${i > rating ? 'opacity-20' : ''}`} />);
    }
    return stars;
  };

  return (
    <div className="flex border-b border-gray-300">
      {/* Sidebar cột nhãn */}
      <div className={`${sidebarWidthClass} flex-shrink-0 border-r border-gray-300 bg-white p-2 flex items-center`}>
        <span className="font-semibold text-xs text-gray-700 uppercase">So sánh sản phẩm</span>
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

                <div className="mt-2 mb-1 text-red-600 font-bold text-sm">{parseAndFormatPrice(product.price)}₫</div>

                {product.originalPrice && (
                  <div className="text-[11px] line-through text-gray-400">{parseAndFormatPrice(product.originalPrice)}₫</div>
                )}

                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span className="flex items-center gap-0.5">{renderStars(product.rating)}</span>
                  <span className="text-[11px]">{product.soldCount ? `Đã bán ${product.soldCount}` : '-'}</span>
                </div>
              </>
            ) : (
              // Slot thêm mới
              <div
                onClick={onAddProduct} // ✅ Gắn sự kiện
                className="flex flex-col items-center justify-center h-full text-gray-400 hover:text-blue-500 cursor-pointer"
              >
                <div className="text-2xl">＋</div>
                <p className="text-xs text-center">Thêm sản phẩm</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHeaderComparison;
