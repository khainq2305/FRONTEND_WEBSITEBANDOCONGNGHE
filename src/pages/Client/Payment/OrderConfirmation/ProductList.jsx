import React from 'react';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

const ProductList = ({ products }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-2">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
            Sản phẩm trong đơn ({products.length})
        </h2>
        <div className="space-y-4">
            {products.map((product, index) => (
                <div key={index} className="flex items-start gap-3">
                    <img
                        src={product.image || '/images/default-thumbnail.jpg'}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover mt-1"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">{product.name || "Sản phẩm không tên"}</p>
                        <p className="text-xs text-gray-500">Số lượng: {product.quantity || 1}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-sm text-red-600 font-semibold">
                            {formatCurrencyVND(product.price ?? 0)}
                        </div>
                      {Number(product.originalPrice) > Number(product.price) && (
  <div className="text-xs text-gray-400 line-through">
    {formatCurrencyVND(product.originalPrice)}
  </div>
)}

                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProductList;
