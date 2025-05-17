// SortBar.js
import React, { useState, useEffect, useRef } from 'react';
import { FaTruck, FaDollarSign, FaThumbsUp, FaArrowUp, FaArrowDown, FaFire } from 'react-icons/fa';
// Assuming your CSS with variables is loaded globally or imported here
// import './YourGlobalStyles.css'; 

export default function SortBar({ sticky }) {
  const [showPrice, setShowPrice] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [filters, setFilters] = useState({ stock: false, price: null, brand: [] });
  const [sortOption, setSortOption] = useState('popular');

  const priceRef = useRef();
  const brandRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priceRef.current && !priceRef.current.contains(e.target)) setShowPrice(false);
      if (brandRef.current && !brandRef.current.contains(e.target)) setShowBrand(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      if (key === 'stock') return { ...prev, stock: !prev.stock };
      if (key === 'price') return { ...prev, price: prev.price === value ? null : value };
      if (key === 'brand') {
        const updated = prev.brand.includes(value) ? prev.brand.filter((b) => b !== value) : [...prev.brand, value];
        return { ...prev, brand: updated };
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({ stock: false, price: null, brand: [] });
    setShowPrice(false);
    setShowBrand(false);
  }

  const priceRanges = ['Tất Cả', 'Dưới 10 Triệu', 'Từ 10 - 16 Triệu', 'Từ 16 - 22 Triệu', 'Trên 22 Triệu'];
  const brandOptions = [
    'Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Nokia', 
    'Google', 'OnePlus', 'Asus', 'Sony', 'Huawei', 'Motorola', 'LG'
  ];

  // Common class for non-selected filter/sort buttons
  const buttonBaseClass = "border-gray-300 text-gray-700 hover-primary"; // Uses .hover-primary from your CSS
  // Common class for selected filter/sort buttons - NOW USES text-white
  const buttonSelectedClass = "bg-primary border-primary text-white font-semibold shadow-sm"; 

  return (
    <div className={`bg-white ${sticky ? 'sticky top-0 z-20 shadow-md' : 'shadow-sm'} p-2 sm:p-3 md:p-4 rounded-lg mb-4 transition-shadow duration-200`}>
      {/* Lọc */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3 relative">
        <span className="font-semibold text-sm sm:text-[15px] mr-1 text-gray-800">Chọn theo tiêu chí:</span>

        <button
          className={`px-3 py-1.5 sm:px-4 sm:py-1 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border ${
            filters.stock ? buttonSelectedClass : buttonBaseClass
          }`}
          onClick={() => toggleFilter('stock')}
        >
          Còn hàng <FaTruck className="text-[1em]"/>
        </button>

        {/* Dropdown khoảng giá */}
        <div className="relative" ref={priceRef}>
          <button
            onClick={() => {
              setShowPrice(!showPrice);
              setShowBrand(false);
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-1 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border ${
              filters.price ? buttonSelectedClass : buttonBaseClass
            }`}
          >
            {filters.price ? filters.price.replace(" Triệu", "Tr") : "Chọn khoảng giá"} <FaDollarSign className="text-[1em]"/>
          </button>
          <div
            className={`absolute left-0 right-0 mx-auto sm:left-0 sm:right-auto sm:mx-0 mt-2 bg-white border border-gray-300 shadow-xl p-3.5 rounded-md w-[calc(100vw-3rem)] max-w-[280px] sm:w-80 md:w-96 z-50 transition-all duration-200 ease-out origin-top-left
              ${showPrice ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {priceRanges.map((item, index) => (
                <label key={index} className="text-xs sm:text-sm text-gray-700 whitespace-nowrap flex items-center cursor-pointer hover:text-[var(--primary-color)]">
                  <input
                    type="radio"
                    name="price"
                    className="mr-2.5 accent-[var(--primary-color)]" 
                    onChange={() => {
                        toggleFilter('price', item === 'Tất Cả' ? null : item);
                    }}
                    checked={item === 'Tất Cả' ? filters.price === null : filters.price === item}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Dropdown thương hiệu */}
        <div className="relative" ref={brandRef}>
          <button
            onClick={() => {
              setShowBrand(!showBrand);
              setShowPrice(false);
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-1 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border ${
                filters.brand.length > 0 ? buttonSelectedClass : buttonBaseClass
            }`}
          >
            {filters.brand.length > 0 ? `Thương hiệu (${filters.brand.length})` : "Chọn thương hiệu"} <FaThumbsUp className="text-[1em]"/>
          </button>
          <div
            className={`absolute left-0 right-0 mx-auto sm:left-0 sm:right-auto sm:mx-0 mt-2 bg-white border border-gray-300 shadow-xl p-3.5 rounded-md w-[calc(100vw-3rem)] max-w-[280px] sm:w-80 md:w-96 z-50 transition-all duration-200 ease-out origin-top-left
              ${showBrand ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
              {brandOptions.map((brand, index) => (
                <label key={index} className="text-xs sm:text-sm text-gray-700 whitespace-nowrap flex items-center cursor-pointer hover:text-[var(--primary-color)]">
                  <input
                    type="checkbox"
                    className="mr-2.5 accent-[var(--primary-color)] rounded-sm border-gray-400 focus:ring-2 focus:ring-offset-0 focus:ring-[var(--primary-color)]"
                    checked={filters.brand.includes(brand)}
                    onChange={() => toggleFilter('brand', brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 pt-3 border-t border-gray-200">
              <button
                className="border border-gray-300 px-3 py-1.5 rounded-md text-xs sm:text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 w-full sm:w-auto transition-colors"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, brand: [] }));
                }}
              >
                Bỏ Chọn ({filters.brand.length})
              </button>
              <button
                    // Changed text-[#fff] to text-white for consistency with Tailwind
                className="bg-primary text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold hover:bg-secondary shadow-sm w-full sm:w-auto transition-colors"
                onClick={() => setShowBrand(false)}
              >
                Xem Kết Quả
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc đang áp dụng */}
      {(filters.stock || filters.price || filters.brand.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 mb-3 pt-3 border-t border-gray-200">
          <span className="font-semibold text-sm sm:text-[15px] mr-1 text-gray-800">Đang lọc theo:</span>

          {filters.stock && (
            <div className="bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              Còn hàng
              <span
                className="cursor-pointer text-primary/80 hover:text-primary pl-1"
                onClick={() => toggleFilter('stock')}
                title="Bỏ lọc còn hàng"
              >
                ✕
              </span>
            </div>
          )}

          {filters.price && (
            <div className="bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              {filters.price}
              <span
                className="cursor-pointer text-primary/80 hover:text-primary pl-1"
                onClick={() => toggleFilter('price', null)}
                title={`Bỏ lọc giá: ${filters.price}`}
              >
                ✕
              </span>
            </div>
          )}

          {filters.brand.map((b) => (
            <div key={b} className="bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              {b}
              <span
                className="cursor-pointer text-primary/80 hover:text-primary pl-1"
                onClick={() => toggleFilter('brand', b)}
                title={`Bỏ lọc thương hiệu: ${b}`}
              >
                ✕
              </span>
            </div>
          ))}

          {(filters.stock || filters.price || filters.brand.length > 0) && (
          <button className="text-xs sm:text-sm text-red-500 hover:text-red-700 underline ml-2 font-medium" onClick={clearFilters}>
              Xoá tất cả
            </button>
        )}
        </div>
      )}

      {/* Sắp xếp */}
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap pt-3 border-t border-gray-200">
        <span className="font-semibold text-sm sm:text-[15px] mr-1 text-gray-800">Sắp xếp theo:</span>
        {[
            {key: 'popular', label: 'Phổ biến', icon: <FaFire className="text-[1em]"/>},
            {key: 'asc', label: 'Giá tăng dần', icon: <FaArrowUp className="text-[1em]"/>},
            {key: 'desc', label: 'Giá giảm dần', icon: <FaArrowDown className="text-[1em]"/>}
        ].map(option => (
            <button
                key={option.key}
                className={`px-3 py-1.5 sm:px-4 sm:py-1 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border ${
                sortOption === option.key ? buttonSelectedClass : buttonBaseClass
                }`}
                onClick={() => setSortOption(option.key)}
            >
                {option.label} {option.icon}
            </button>
        ))}
      </div>
    </div>
  );
}
