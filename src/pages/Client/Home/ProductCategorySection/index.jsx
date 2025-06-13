// DÁN TOÀN BỘ CODE NÀY VÀO FILE ProductCategorySection.js

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductCategorySection.css'; 
import { highlightedCategoryService } from "../../../../services/client/highlightedCategoryService";

const ProductCategorySection = () => {
    const [categoriesData, setCategoriesData] = useState([]);
    const sliderRef = useRef(null);

    const ITEMS_PER_ROW = 10;
    const NUM_ROWS = 2;
    const THRESHOLD_FOR_SLIDER = ITEMS_PER_ROW * NUM_ROWS;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await highlightedCategoryService.list();
                const data = Array.isArray(res.data?.data) ? res.data.data : [];
                const dataWithLabels = data.map((item, index) => {
                    if (index === 6) return { ...item, label: 'new' };
                    if (index === 8) return { ...item, label: 'hot' };
                    if (index === 9) return { ...item, label: ' nổi bật' };
                    return item;
                });
                setCategoriesData(dataWithLabels);
            } catch (err) {
                console.error("Lỗi khi tải danh mục nổi bật:", err);
            }
        };
        fetchData();
    }, []);
    
    const displayedCategoriesForStaticGrid = categoriesData.slice(0, THRESHOLD_FOR_SLIDER);
    const shouldUseSlider = categoriesData.length > THRESHOLD_FOR_SLIDER;

    const CustomSliderArrow = ({ className, onClick, type }) => (
        <button
            type="button"
            className={`${className} custom-arrow`}
            onClick={onClick}
            aria-label={type === 'prev' ? "Previous" : "Next"}
        >
            {type === 'prev' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
    );

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        rows: NUM_ROWS,
        slidesPerRow: 1,
        arrows: true,
        prevArrow: <CustomSliderArrow type="prev" />,
        nextArrow: <CustomSliderArrow type="next" />,
        slidesToShow: ITEMS_PER_ROW,
        slidesToScroll: ITEMS_PER_ROW,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 10, slidesToScroll: 10 } },
            { breakpoint: 1024, settings: { slidesToShow: 8, slidesToScroll: 8 } },
            { breakpoint: 768,  settings: { slidesToShow: 6, slidesToScroll: 6 } },
            { breakpoint: 640,  settings: { slidesToShow: 5, slidesToScroll: 5 } },
            { breakpoint: 480,  settings: { slidesToShow: 4, slidesToScroll: 4 } }
        ]
    };

    const CategoryItem = ({ item }) => {
        const itemClasses = `
            text-center p-3 text-gray-800 no-underline bg-transparent
            flex flex-col items-center justify-start h-full group
            transition-all duration-300 ease-in-out rounded-xl
            hover:shadow-lg hover:bg-white hover:-translate-y-1.5
        `;

        return (
            <a href={item.slug ? `/category/${item.slug}` : '#'} className={itemClasses} title={item.name}>
                <div className="relative w-16 h-20 md:w-20 md:h-20 mb-2 rounded-xl p-2">
                    {item.label && (
                        <span className={`
                            absolute -top-1 -right-1 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md
                            ${item.label === 'hot' ? 'bg-rose-500' : item.label === 'new' ? 'bg-cyan-500' : 'bg-amber-500'}
                        `}>
                            {item.label === 'hot' ? 'HOT' : item.label === 'new' ? 'MỚI' : 'NỔI BẬT'}
                        </span>
                    )}
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
                <span
                    className="text-xs md:text-sm leading-tight text-center font-medium"
                    style={{
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', height: '2.5em'
                    }}
                >
                    {item.name}
                </span>
            </a>
        );
    };

    return (
        <div className="w-full bg-gray-50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-2 md:p-4">
                {shouldUseSlider ? (
                    <div className="category-slider-wrapper">
                        <Slider {...sliderSettings}>
                            {categoriesData.map((category) => (
                                <div key={category.id} className="p-1 h-full">
                                    <CategoryItem item={category} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <div className="flex flex-wrap -m-1">
                        {displayedCategoriesForStaticGrid.map((item) => (
                            <div key={item.id} className="w-1/4 sm:w-1/5 md:w-1/8 lg:w-1/10 p-1">
                                <CategoryItem item={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCategorySection;