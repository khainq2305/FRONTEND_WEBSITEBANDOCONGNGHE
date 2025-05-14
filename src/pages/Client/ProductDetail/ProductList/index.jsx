import { useState } from 'react';
import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const allProducts = [
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng Realme 14C 6GB/256GB Chính HãngRealme 14C 6GB/256GB Chính HãngRealme 14C 6GB/256GB Chính Hãng    ',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'BEST PRICE',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    },
    {
        name: 'Realme 14C 6GB/256GB Chính Hãng',
        price: '2.390.000',
        oldPrice: '3.090.000',
        image:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746613789982-Realme-14-Si.jpg&w=1920&q=75',
        badge: 'ĐẶT TRƯỚC',
        discount: 28,
        rating: 4.5,
        status: 'Còn hàng',
        couponBanner:
            'https://dienthoaigiakho.vn/_next/image?url=https%3A%2F%2Fcdn.dienthoaigiakho.vn%2Fphotos%2F1746764979821-ANDROIDONL50.png&w=1920&q=75'
    }
];

const ProductCard = ({ name, price, oldPrice, discount, image, rating, status, badge, couponBanner }) => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
            else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
            else stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
        }
        return stars;
    };

    return (
        <div className="flex flex-col h-full border rounded-sm overflow-hidden shadow-md bg-white p-3 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 relative">
            {discount && (
                <div className="absolute top-0 left-0 bg-yellow-400 text-black text-xs font-bold px-2 py-[2px] rounded-br-md z-20">
                    -{discount}%
                </div>
            )}
            <div className="relative mb-2">
                <img src={image} alt={name} className="w-full h-[230px] object-contain" />
                {couponBanner && (
                    <div className="absolute bottom-0 left-0 w-full z-10">
                        <img src={couponBanner} alt="Coupon" className="w-full h-[28px] object-cover" />
                    </div>
                )}
            </div>

            {badge && (
                <div className={`text-[11px] font-bold inline-flex items-center gap-1 h-[20px] px-2 rounded mb-2 w-max max-w-[100px] truncate ml-0 ${badge.toLowerCase().includes('giao nhanh') ? 'text-white border border-green-600 animate-badge-green'
                        : badge.toLowerCase().includes('đặt trước') ? 'text-white border border-transparent shadow-md animate-badge-blink'
                            : badge.toLowerCase().includes('best') ? 'text-yellow-400 border border-yellow-400 animate-badge-fire'
                                : 'text-white border border-gray-500'
                    }`}>
                    <span className={badge.toLowerCase().includes('đặt trước') ? 'animate-bounce text-xs' : 'text-xs'}>
                        {badge.toLowerCase().includes('giao nhanh') ? '🚀' :
                            badge.toLowerCase().includes('đặt trước') ? '⏳' :
                                badge.toLowerCase().includes('best') ? '🔥' : '🏷️'}
                    </span>
                    <span>{badge}</span>
                </div>
            )}

            <h3 className="font-medium text-[14px] line-clamp-2 min-h-[40px] mb-1">{name}</h3>

            <div className="text-[15px] mb-1">
                <span className="text-red-600 font-bold">{price}₫</span>
                {oldPrice && <span className="text-gray-400 text-xs line-through ml-2">{oldPrice}₫</span>}
            </div>

            {oldPrice && (
                <div className="text-green-600 text-xs font-medium mb-2">
                    Giảm {(parseFloat(oldPrice.replaceAll('.', '')) - parseFloat(price.replaceAll('.', ''))).toLocaleString('vi-VN')}₫
                </div>
            )}

            <div className="flex justify-between items-center mt-auto gap-x-2 text-xs">
                {rating && <div className="flex items-center gap-[2px] text-yellow-400 mb-1">{renderStars(rating)}</div>}
                <div className="text-green-600 text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                    {status}
                    <img
                        src="https://dienthoaigiakho.vn/_next/image?url=%2Ficons%2Fcommon%2Ficon-deli.png&w=48&q=75"
                        alt="check"
                        className="w-4 h-4"
                    />
                </div>
            </div>
        </div>
    );
};

const ProductList = () => {
    const scrollRef = useRef();

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const card = container.querySelector('.product-card-wrapper');
        if (!card) return;

        const cardWidth = card.offsetWidth;
        const gap = 16;
        const scrollAmount = (cardWidth + gap) * 5;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-6 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative">
            {/* Nút điều hướng */}
            <button onClick={() => scroll('left')} className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white border rounded-full shadow-md p-2 hover:bg-gray-100">
                <FaChevronLeft />
            </button>
            <button onClick={() => scroll('right')} className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white border rounded-full shadow-md p-2 hover:bg-gray-100">
                <FaChevronRight />
            </button>

            {/* Scroll sản phẩm ngang */}
            <div className="overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex gap-1 scroll-smooth overflow-x-auto whitespace-nowrap [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
                >
                    {allProducts.map((item, index) => (
                        <div
                            key={index}
                            className="
      product-card-wrapper 
      flex-shrink-1
      min-w-[calc(100vw/2.5)]
      sm:min-w-[calc(100vw/3.2)]
      md:min-w-[calc(100vw/4.5)]
      lg:min-w-[calc(100vw/5.2)]
      xl:min-w-[240px]
    "
                        >
                            <ProductCard {...item} />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default ProductList;