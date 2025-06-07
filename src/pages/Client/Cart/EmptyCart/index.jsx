// src/pages/Client/CartPage/components/EmptyCart.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// SVG cho giỏ hàng trống, bạn có thể thay bằng ảnh của riêng mình
const EmptyCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);


const EmptyCart = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center py-16 px-4">
      <EmptyCartIcon />
      <h2 className="mt-6 text-xl font-semibold text-gray-800">
        Giỏ hàng của bạn còn trống
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
      </p>
      <Link to="/" className="mt-6">
        <button className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:bg-primary-dark transition-all duration-200">
          Tiếp tục mua sắm
        </button>
      </Link>
    </div>
  );
};

export default EmptyCart;