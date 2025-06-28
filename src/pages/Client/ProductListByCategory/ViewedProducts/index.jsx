import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react';
import { productViewService } from "../../../../services/client/productViewService";
import { Link } from 'react-router-dom';
const ProductCard = ({ product, onRemove }) => {
    const getPriceJsx = (product) => {
        const salePrice = product.price;
        const originalPrice = product.originalPrice;

        if (salePrice && parseFloat(salePrice) > 0) {
            return (
                <div className="flex items-baseline gap-x-2">
                    <p className="text-sm text-red-600 font-semibold">
                        {parseFloat(salePrice).toLocaleString('vi-VN')}₫
                    </p>
                    {originalPrice && parseFloat(originalPrice) > parseFloat(salePrice) ? (
                        <p className="text-xs text-gray-500 line-through">
                            {parseFloat(originalPrice).toLocaleString('vi-VN')}₫
                        </p>
                    ) : null}
                </div>
            );
        }

        if (originalPrice && parseFloat(originalPrice) > 0) {
            return (
                <p className="text-sm text-red-600 font-semibold">
                    {parseFloat(originalPrice).toLocaleString('vi-VN')}₫
                </p>
            );
        }

        return <p className="text-sm text-red-600 font-semibold">Liên hệ</p>;
    };

    return (
        <div className="h-full p-1.5">
            <div className="group/card flex items-center bg-white rounded-md shadow-sm relative p-2.5 border border-gray-200 h-full hover:shadow-lg transition-shadow duration-200">
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
                    className="absolute top-1 right-1 p-0.5 text-primary hover:text-secondary focus:outline-none transition-all"
                    aria-label="Xóa sản phẩm"
                >
                    <XIcon size={14} />
                </button>
            </div>
        </div>
    );
};

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

const ViewedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViewedProducts = async () => {
            setLoading(true);
            try {
                const viewedIds = JSON.parse(localStorage.getItem('viewed_products')) || [];
                if (viewedIds.length > 0) {
                    const response = await productViewService.getByIds(viewedIds);
                    setProducts(response.data.products || []);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm đã xem:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchViewedProducts();
    }, []);

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
        setProducts([]);
        localStorage.removeItem('viewed_products');
    };

    const numProducts = products.length;

    const settings = {
        dots: false,
        speed: 700,
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        nextArrow: <CustomArrow type="next" />,
        prevArrow: <CustomArrow type="prev" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1.5, arrows: false }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1.2, arrows: false }
            }
        ]
    };

    if (loading || numProducts === 0) {
        return null;
    }

    return (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md w-full group relative mt-8 mb-8">
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

            {numProducts > 4 ? (
                <Slider {...settings}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onRemove={handleRemoveProduct} />
                    ))}
                </Slider>
            ) : (
                <div className="flex flex-row -mx-1.5">
                    {products.map((product) => (
                        <div key={product.id} className="w-1/4">
                            <ProductCard product={product} onRemove={handleRemoveProduct} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewedProducts;
