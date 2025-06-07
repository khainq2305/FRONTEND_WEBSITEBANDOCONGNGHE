// src/components/ProductDetail/ProductInfoBox.jsx
import React from 'react';

export default function ProductInfoBox({ productInfo }) {
  // ✅ SỬA LỖI Ở ĐÂY:
  // Dữ liệu 'productInfo' từ quan hệ hasOne là một OBJECT, không phải mảng.
  // Vì vậy, chúng ta không cần kiểm tra Array.isArray nữa.
  const info = productInfo;

  // Nếu không có object info hoặc không có thuộc tính 'content' thì không hiển thị.
  if (!info || !info.content) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h2>
      
      {/* Sử dụng dangerouslySetInnerHTML để render chuỗi HTML từ database.
        Class 'prose' của plugin @tailwindcss/typography sẽ giúp tự động style
        các thẻ h1, ul, li, strong... cho đẹp mắt mà không cần viết CSS.
      */}
      <div 
        className="prose max-w-none text-sm text-gray-700" 
        dangerouslySetInnerHTML={{ __html: info.content }} 
      />
    </div>
  );
}
