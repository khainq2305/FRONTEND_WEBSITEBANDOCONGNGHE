import React, { useState, useEffect, useRef } from 'react';
import { FaTruck, FaDollarSign, FaThumbsUp } from 'react-icons/fa';

export default function ProductFilters({ currentFilters, onApplyFilters, brandOptions = [] }) {
    const [showPrice, setShowPrice] = useState(false);
    const [showBrand, setShowBrand] = useState(false);

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

    const handleFilterChange = (key, value) => {
        const newFilters = { ...currentFilters };
        if (key === 'stock') {
            newFilters.stock = !currentFilters.stock;
        }
        if (key === 'price') {
            newFilters.price = currentFilters.price === value ? null : value;
        }
        if (key === 'brand') {
            const updated = currentFilters.brand.includes(value)
                ? currentFilters.brand.filter((b) => b !== value)
                : [...currentFilters.brand, value];
            newFilters.brand = updated;
        }
        onApplyFilters(newFilters);
    };

    const resetAllFilters = () => {
        onApplyFilters({ stock: false, price: null, brand: [] });
        setShowPrice(false);
        setShowBrand(false);
    };

    const priceRanges = ['Tất Cả', 'Dưới 10 Triệu', 'Từ 10 - 16 Triệu', 'Từ 16 - 22 Triệu', 'Trên 22 Triệu'];
    const buttonBaseClass = 'border-gray-300 text-gray-700 hover-primary font-semibold';
    const buttonSelectedClass = 'bg-primary border-primary text-white font-semibold shadow-sm';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-y-2">
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full">
               
                <span className="font-semibold text-sm sm:text-[15px] mr-1 text-gray-800 flex items-center py-2 leading-none flex-shrink-0">
                    Chọn theo tiêu chí:
                </span>

               
                <div className="flex-shrink-0">
                    <button
                        className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border leading-none ${
                            currentFilters.stock ? buttonSelectedClass : `bg-white ${buttonBaseClass}`
                        }`}
                        onClick={() => handleFilterChange('stock')}
                    >
                        Còn hàng <FaTruck className="text-[1em]" />
                    </button>
                </div>

                <div className="relative flex-shrink-0" ref={priceRef}>
                    <button
                        onClick={() => {
                            setShowPrice(!showPrice);
                            setShowBrand(false);
                        }}
                        className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border leading-none ${
                            currentFilters.price ? buttonSelectedClass : `bg-white ${buttonBaseClass}`
                        }`}
                    >
                        {currentFilters.price ? currentFilters.price.replace(' Triệu', 'Tr') : 'Chọn khoảng giá'}{' '}
                        <FaDollarSign className="text-[1em]" />
                    </button>
                    <div
                        className={`absolute left-0 right-0 mx-auto sm:left-0 sm:right-auto sm:mx-0 mt-2 bg-white border border-gray-300 shadow-xl p-3.5 rounded-md w-[calc(100vw-3rem)] max-w-[280px] sm:w-80 md:w-96 z-50 transition-all duration-200 ease-out origin-top-left
                            ${showPrice ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                        `}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                            {priceRanges.map((item, index) => (
                                <label
                                    key={index}
                                    className="text-xs sm:text-sm text-gray-700 whitespace-nowrap flex items-center cursor-pointer hover:text-[var(--primary-color)] font-semibold leading-none"
                                >
                                    <input
                                        type="radio"
                                        name="price"
                                        className="mr-2.5"
                                        onChange={() => handleFilterChange('price', item === 'Tất Cả' ? null : item)}
                                        checked={item === 'Tất Cả' ? currentFilters.price === null : currentFilters.price === item}
                                    />
                                    {item}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative flex-shrink-0" ref={brandRef}>
                    <button
                        onClick={() => {
                            setShowBrand(!showBrand);
                            setShowPrice(false);
                        }}
                        className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border leading-none ${
                            currentFilters.brand.length > 0 ? buttonSelectedClass : `bg-white ${buttonBaseClass}`
                        }`}
                    >
                        {currentFilters.brand.length > 0 ? `Thương hiệu (${currentFilters.brand.length})` : 'Chọn thương hiệu'}{' '}
                        <FaThumbsUp className="text-[1em]" />
                    </button>
                    <div
                        className={`absolute left-0 right-0 mx-auto sm:left-0 sm:right-auto sm:mx-0 mt-2 bg-white border border-gray-300 shadow-xl p-3.5 rounded-md w-[calc(100vw-3rem)] max-w-[280px] sm:w-80 md:w-96 z-50 transition-all duration-200 ease-out origin-top-left
                            ${showBrand ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                        `}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                            {brandOptions.map((brand, index) => (
                                <label
                                    key={brand.id || index}
                                    className="text-xs sm:text-sm text-gray-700 whitespace-nowrap flex items-center cursor-pointer hover:text-[var(--primary-color)] font-semibold leading-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={currentFilters.brand.includes(brand.name)}
                                        onChange={() => handleFilterChange('brand', brand.name)}
                                        className="mr-2.5"
                                    />
                                    {brand.name}
                                </label>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 pt-3 border-t border-gray-200">
                            <button
                                className="border border-gray-300 px-3 py-2 rounded-md text-xs sm:text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 w-full sm:w-auto font-semibold"
                                onClick={() => onApplyFilters({ ...currentFilters, brand: [] })}
                            >
                                Bỏ Chọn ({currentFilters.brand.length})
                            </button>
                            <button
                                className="bg-primary text-white px-3 py-2 rounded-md text-xs sm:text-sm font-semibold hover:bg-secondary shadow-sm w-full sm:w-auto"
                                onClick={() => setShowBrand(false)}
                            >
                                Xem Kết Quả
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {(currentFilters.stock || currentFilters.price || currentFilters.brand.length > 0) && (
                <div className="w-full flex flex-wrap items-center gap-2 mb-3 pt-3 border-t border-gray-200">
                    <span className="font-semibold text-sm sm:text-[15px] mr-1 text-gray-800">Đang lọc theo:</span>
                    {currentFilters.stock && (
                        <div className="bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                            Còn hàng
                            <span className="cursor-pointer text-primary/80 hover:text-primary pl-1" onClick={() => handleFilterChange('stock')}>
                                ✕
                            </span>
                        </div>
                    )}
                    {currentFilters.price && (
                        <div className="bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                            {currentFilters.price}
                            <span className="cursor-pointer text-primary/80 hover:text-primary pl-1" onClick={() => handleFilterChange('price', null)}>
                                ✕
                            </span>
                        </div>
                    )}
                    {currentFilters.brand.map((b) => (
                        <div
                            key={b}
                            className="bg-primary/10 text-primary border-primary/30 text-xs sm:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold"
                        >
                            {b}
                            <span className="cursor-pointer text-primary/80 hover:text-primary pl-1" onClick={() => handleFilterChange('brand', b)}>
                                ✕
                            </span>
                        </div>
                    ))}
                    <button className="text-xs sm:text-sm text-red-500 hover:text-red-700 underline ml-2 font-semibold" onClick={resetAllFilters}>
                        Xoá tất cả
                    </button>
                </div>
            )}
        </div>
    );
}