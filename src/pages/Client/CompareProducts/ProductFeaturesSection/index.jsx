import React from 'react';

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-gray-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const ProductFeaturesSection = ({
    products,
    featureOrder,
    showOnlyDifferences,
    getFilteredFeatures,
    renderFeatureValue,
    sidebarWidthClass,
    productColumnClasses
}) => {
    const SIDEBAR_WIDTH_CLASS = sidebarWidthClass;
    const PRODUCT_COL_CLASSES = productColumnClasses;
    const CELL_PADDING = "py-2 px-2.5 md:py-3 md:px-4"; // Tăng padding trên md

    const safeFeatureOrder = Array.isArray(featureOrder) ? featureOrder : [];

    return (
        <div className="mt-4">
            {/* Header của Product Features Section */}
            <div className={`flex items-center p-3 h-[41px] md:h-[50px] ${SIDEBAR_WIDTH_CLASS}`}>
                <ChevronDownIcon />
                <h2 className="text-[13px] md:text-base font-semibold text-gray-800 ml-1.5 uppercase">
                    TỔNG QUAN
                </h2>
            </div>

            {/* Container cho các dòng tính năng, thêm overflow-x-auto */}
            <div className="overflow-x-auto">
                <div className="min-w-[540px]"> {/* Adjusted min-w to accommodate 3 columns of ~180px each */}
                    {safeFeatureOrder.filter(getFilteredFeatures).map((featureKey) => (
                        <div key={featureKey} className="flex border-t border-gray-300">
                            {/* Sidebar cho tên tính năng */}
                            <div className={`${SIDEBAR_WIDTH_CLASS} flex-shrink-0 ${CELL_PADDING} text-left font-normal whitespace-nowrap border-r border-gray-300 bg-white flex items-center text-xs md:text-sm`}>
                                {featureKey}
                            </div>
                            {/* Các cột giá trị tính năng */}
                            <div className="flex-grow grid grid-cols-3"> {/* Changed to grid-cols-3 */}
                                {products.map((product, productIndex) => (
                                    <div
                                        key={`${product?.id || 'empty'}-${featureKey}`}
                                        className={`${CELL_PADDING} text-center ${productIndex < products.length - 1 ? 'border-r border-gray-300' : ''} bg-white min-h-[38px] md:min-h-[48px] flex flex-col justify-center whitespace-normal break-words text-xs md:text-sm min-w-[180px] lg:min-w-0`} // Added min-w
                                    >
                                        {renderFeatureValue(product?.features?.[featureKey])}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

           {/* Hàng nút CHI TIẾT */}
<div className="flex border-t border-gray-300">
    <div className={`${SIDEBAR_WIDTH_CLASS} flex-shrink-0 ${CELL_PADDING} border-r border-gray-300 bg-white`}></div>
    <div className="flex-grow grid grid-cols-3">
        {products.map((product, productIndex) => (
            <div
                key={`detail-${product?.id || productIndex}`}
                className={`${CELL_PADDING} text-center ${
                    productIndex < products.length - 1 ? 'border-r border-gray-300' : ''
                } bg-white py-[9px] md:py-3 min-w-[180px] lg:min-w-0`}
            >
                {product ? (
                    <a
                        href={`/product/${product.slug}`}
                        className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-sm text-sm w-full max-w-[140px] mx-auto transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-300 tracking-tight block"
                    >
                        CHI TIẾT
                    </a>
                ) : (
                    <div className="text-gray-400 text-sm">-</div>
                )}
            </div>
        ))}
    </div>
</div>

        </div>
    );
};

export default ProductFeaturesSection;