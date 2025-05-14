import React from 'react';

const ProductList = ({ products }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
            Sản phẩm trong đơn ({products.length})
        </h2>
        <div className="space-y-4">
            {products.map((product, index) => (
                <div key={index} className="flex items-start gap-3">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover mt-1"
                    />
                    <div className="flex justify-between items-start w-full">
                        <p className="text-sm text-gray-800">{product.name}</p>
                        <div className="text-right">
                            <div className="text-sm text-red-600 font-semibold">
                                {product.price.toLocaleString()} ₫
                            </div>
                            <div className="text-xs text-gray-400 line-through">
                                {product.originalPrice.toLocaleString()} ₫
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProductList;
