// src/components/ProductDetail/ProductInfoBox.jsx
import React from 'react';

export default function ProductInfoBox({ productInfo }) {
  const info = productInfo;

  if (!info || !info.content) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h2>

      <div className="prose max-w-none text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: info.content }} />
    </div>
  );
}
