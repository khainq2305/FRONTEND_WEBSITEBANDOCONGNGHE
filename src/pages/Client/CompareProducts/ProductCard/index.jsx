// ProductCard.jsx
import React from 'react';
import { X } from "lucide-react";

// Component hiển thị 1 sản phẩm
const SingleProductCard = ({ imageSrc, name, price, gift, rating, sold }) => {
  return (
    <div className="w-full md:w-1/3 bg-white border border-gray-150 p-2 relative">
      <div className="absolute bg-[rgb(222,222,222)] text-xs">Trả chậm 0%</div>
      <div className="absolute top-2 right-2 cursor-pointer bg-white border border-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
        <X size={10} />
      </div>
      <div className="relative mb-4 mt-8">
        <img src={imageSrc} alt={name} className="w-full h-72 object-cover" />
        <img src="https://cdn.tgdd.vn/2023/10/campaign/label-tgdd-200x200.png?v=2024" alt="Label" className="w-10 h-10 absolute bottom-0 left-0" />
      </div>
      <h2 className="text-sm font-semibold text-gray-800">{name}</h2>
      <p className="text-base font-bold text-red-600">{price}</p>
      <p className="text-xs text-gray-600">{gift}</p>
      <div className="flex items-center space-x-1 text-yellow-500 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27l-5.18 3.09 1.64-6.91L2 9.24l6.91-.58L12 2l2.09 6.66 6.91.58-4.46 4.21 1.64 6.91L12 17.27z" />
        </svg>
        <span className="text-xs text-gray-600">{rating}</span>
      </div>
      <p className="text-xm font-semibold text-gray-600 mt-2">• Đã bán {sold}</p>
    </div>
  );
};

// Danh sách sản phẩm mẫu (giữ nguyên dữ liệu như bạn yêu cầu)
const products = [
  {
    imageSrc: "https://cdn.tgdd.vn/Products/Images/42/323543/oppo-a60-blue-thumb-600x600.jpg",
    name: "OPPO A60 8GB/128GB",
    price: "5.490.000₫",
    gift: "Quà 500.000₫",
    rating: 4.9,
    sold: "232,4k"
  },
  {
    imageSrc: "https://cdn.tgdd.vn/Products/Images/42/319466/realme-12-green-thumb-600x600.jpg",
    name: "realme 12 8GB/256GB",
    price: "5.490.000₫",
    gift: "Quà 500.000₫",
    rating: 4.5,
    sold: "200k"
  },
  {
    imageSrc: "https://cdn.tgdd.vn/Products/Images/42/323544/oppo-a60-blue-thumb-1-600x600.jpg",
    name: "OPPO A60 8GB/256GB",
    price: "5.990.000₫",
    gift: "Quà 500.000₫",
    rating: 5,
    sold: "300k"
  }
];

// Component xuất ra danh sách 3 sản phẩm
const ProductList = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-0 gap-6">
      {products.map((product, index) => (
        <SingleProductCard key={index} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
