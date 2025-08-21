import React, { useState, useEffect, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react';
import { productViewService } from "../../../../services/client/productViewService";
import { Link } from 'react-router-dom';

// ProductCard component - QUAN TRỌNG: ĐÃ BỎ p-1.5 ở đây. Khoảng cách sẽ do slick-slide quản lý.
const ProductCard = ({ product, onRemove }) => {
    const getPriceJsx = (product) => {
        const sale = parseFloat(product.price) || 0;
        const orig = parseFloat(product.originalPrice) || 0;
        if (sale === 0 && orig === 0) return <p className="italic">Liên hệ</p>;
        if (sale > 0) {
            const hasDiscount = orig > sale;
            return (
                <div className="flex items-baseline gap-x-2">
                    <span className="text-sm text-red-600 font-semibold">
                        {sale.toLocaleString('vi-VN')}₫
                    </span>
                    {hasDiscount && (
                        <span className="line-through ml-1 text-gray-500 text-xs">
                            {orig.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>
            );
        }
        return (
            <span className="text-sm text-red-600 font-semibold">
                {orig.toLocaleString('vi-VN')}₫
            </span>
        );
    };

    return (
        // ĐÃ BỎ p-1.5 Ở ĐÂY. Khoảng cách sẽ được kiểm soát hoàn toàn bởi padding của .slick-slide.
        <div className="h-full"> 
            <div className="flex items-center bg-white rounded-md shadow-sm relative p-2.5 border border-gray-200 h-full hover:shadow-lg transition-shadow duration-200">
                <Link to={product.slug ? `/product/${product.slug}` : '#'} className="flex-shrink-0 mr-2">
                    <img src={product.thumbnail} alt={product.name} className="w-16 h-16 object-contain rounded" loading="lazy" />
                </Link>
                <div className="flex flex-col justify-center flex-1 min-w-0 pr-4">
                    <Link to={product.slug ? `/product/${product.slug}` : '#'} title={product.name}>
                        <p className="text-xs font-medium text-gray-800 hover:text-primary line-clamp-2 leading-snug mb-0.5">
                            {product.name}
                        </p>
                    </Link>
                    {getPriceJsx(product)}
                </div>
                <button
                    type="button"
                    onClick={(e) => onRemove(e, product.id)}
                    className="absolute top-1 right-1 p-0.5 text-primary hover:text-secondary focus:outline-none opacity-60 hover:opacity-100 focus:opacity-100 transition-all"
                    aria-label="Xóa sản phẩm"
                >
                    <XIcon size={14} />
                </button>
            </div>
        </div>
    );
};

// CustomArrow component (không thay đổi)
const CustomArrow = (props) => {
    const { className, onClick, type } = props;
    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
            aria-label={type === 'prev' ? "Previous viewed products" : "Next viewed products"}
        >
            {type === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
    );
};

// Main ViewedProducts component
const ViewedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchViewedProducts = useCallback(async () => {
        setLoading(true);
        try {
            const viewedIds = JSON.parse(localStorage.getItem('viewed_products')) || [];
            if (viewedIds.length > 0) {
                const response = await productViewService.getByIds(viewedIds);
                setProducts(response.data.products?.filter(p => p) || []);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm đã xem:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchViewedProducts();
    }, [fetchViewedProducts]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'viewed_products') {
                fetchViewedProducts();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchViewedProducts]);

    const handleRemoveProduct = (e, productIdToRemove) => {
        e.preventDefault();
        e.stopPropagation();
        const updatedProducts = products.filter(p => p.id !== productIdToRemove);
        setProducts(updatedProducts);
        const viewedIds = JSON.parse(localStorage.getItem('viewed_products')) || [];
        const updatedIds = viewedIds.filter(id => id !== productIdToRemove);
        localStorage.setItem('viewed_products', JSON.stringify(updatedIds));
    };

    const handleClearAll = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử đã xem không?')) {
            setProducts([]);
            localStorage.removeItem('viewed_products');
        }
    };

    const numProducts = products.length;

    const settings = {
        dots: false,
        speed: 700,
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: numProducts > 4,
        arrows: numProducts > 4, 
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        nextArrow: <CustomArrow type="next" />,
        prevArrow: <CustomArrow type="prev" />,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 4, infinite: numProducts > 4, arrows: numProducts > 4 } },
            { breakpoint: 1024, settings: { slidesToShow: 3, infinite: numProducts > 3, arrows: numProducts > 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, infinite: numProducts > 2, arrows: numProducts > 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1.5, slidesToScroll: 1, arrows: false, infinite: numProducts > 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1.2, slidesToScroll: 1, arrows: false, infinite: numProducts > 1 } }
        ]
    };

    if (loading || numProducts === 0) {
        return null;
    }

    return (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md w-full viewed-products-slider-container group relative mt-8 mb-8">
            <style jsx global>{`
                .viewed-products-slider-container .slick-slider {
                    position: relative;
                    /* margin-left/right âm để bù đắp padding của slick-slide,
                       đảm bảo các card ở rìa không bị "cắt" và có khoảng trống đều.
                       Nếu slick-slide padding là 6px, thì margin âm sẽ là -6px. */
                    margin: 0 -6px; /* Giữ nguyên -6px hoặc điều chỉnh */
                }
                .viewed-products-slider-container .slick-list {
                    /* Padding cho slick-list để tạo khoảng trống ở hai đầu của slider,
                       đặc biệt quan trọng khi slidesToShow là số thập phân. */
                    padding: 0 10px !important; /* Giữ 10px padding ở hai đầu */
                }
                .viewed-products-slider-container .slick-slide {
                    box-sizing: border-box;
                    height: auto;
                    /* Padding cho mỗi slide.
                       Giá trị này sẽ là khoảng cách mong muốn giữa các card chia đôi.
                       Ví dụ: muốn 12px giữa các card, thì padding mỗi bên là 6px. */
                    padding: 0 6px; /* QUAN TRỌNG: Điều chỉnh giá trị này để kiểm soát khoảng cách */
                }
                .viewed-products-slider-container .slick-slide > div {
                    height: 100%;
                    display: flex;
                }
                .viewed-products-slider-container .slick-arrow {
                    position: absolute;
                    top: 40%;
                    transform: translateY(-50%);
                    z-index: 10;
                    cursor: pointer;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--arrow-button-bg-normal, #FFFFFF);
                    border: 1px solid var(--arrow-button-border-normal, #e5e7eb);
                    color: var(--primary-color, #1CA7EC);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    transition: all 0.2s ease-in-out;
                    opacity: 0;
                    pointer-events: none;
                }
                .viewed-products-slider-container.group:hover .slick-arrow {
                    opacity: 1;
                    pointer-events: auto;
                }
                .viewed-products-slider-container .slick-arrow.slick-disabled {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                .viewed-products-slider-container .slick-arrow:hover:not(.slick-disabled) {
                    background-color: var(--arrow-button-bg-hover, var(--primary-color));
                    border-color: var(--arrow-button-bg-hover, var(--primary-color));
                    color: var(--arrow-icon-hover, #FFFFFF);
                }
                .viewed-products-slider-container .slick-arrow:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(28, 167, 236, 0.3);
                }
                .viewed-products-slider-container .slick-prev {
                    left: 8px;
                }
                .viewed-products-slider-container .slick-next {
                    right: 8px;
                }
                .viewed-products-slider-container .slick-prev:before,
                .viewed-products-slider-container .slick-next:before {
                    display: none !important;
                }
                
                .viewed-products-slider-container .slick-track {
                    margin-left: 0;
                }

                @media (max-width: 1023.98px) {
                    .viewed-products-slider-container .slick-arrow {
                        display: none !important;
                    }
                    /* Trên mobile, điều chỉnh margin-left/right của slick-slider
                       để nó khớp với padding của slick-list,
                       đảm bảo khoảng cách ở hai bên. */
                    .viewed-products-slider-container .slick-slider {
                        margin-left: -6px; /* QUAN TRỌNG: Bằng giá trị padding của slick-slide */
                        margin-right: -6px; /* QUAN TRỌNG: Bằng giá trị padding của slick-slide */
                    }
                    .viewed-products-slider-container .slick-list {
                        /* Đặt padding cho slick-list trên mobile để tạo khoảng cách ở hai đầu,
                           khiến các slide không bị dính vào viền màn hình. */
                        padding: 0 10px !important; /* Giữ 10px padding ở hai đầu mobile */
                    }
                    .viewed-products-slider-container .slick-slide {
                        /* Trên mobile, slick-slide vẫn giữ padding 0 6px để tạo khoảng cách giữa các card */
                        padding: 0 6px; 
                    }
                }
            `}</style>
            
            <div className="flex justify-between items-center mb-2 px-1"> 
                <h2 className="text-lg md:text-xl font-bold text-primary">Sản phẩm đã xem</h2>
                <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-primary hover:text-secondary text-xs md:text-sm font-medium"
                >
                    Xóa tất cả
                </button>
            </div>

            <Slider {...settings}>
                {products.map((product) => (
                    <div key={product.id}>
                        <ProductCard product={product} onRemove={handleRemoveProduct} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ViewedProducts;