// src/components/ProductFeaturesSection.jsx
import React from 'react';

const ProductFeaturesSection = ({ products, featureOrder, showOnlyDifferences, getFilteredFeatures, renderFeatureValue }) => {
  const SIDEBAR_WIDTH_CLASS = "w-full lg:w-[230px] lg:min-w-[200px]";
  const CELL_PADDING = "py-2 px-2.5";

  return (
    <div> {/* Bỏ border-b ở div này, table sẽ tự có */}
      {/* Tiêu đề ĐẶC TÍNH SẢN PHẨM */}
      <div className={`flex items-center p-3 h-[41px] ${SIDEBAR_WIDTH_CLASS} lg:border-r lg:border-gray-300`}>
        <h2 className="text-[11px] font-semibold text-gray-700">
          ĐẶC TÍNH SẢN PHẨM
        </h2>
      </div>
      {/* Bảng dữ liệu cho "ĐẶC TÍNH SẢN PHẨM" */}
      <div className="overflow-x-auto">
        {featureOrder.filter(getFilteredFeatures).map((featureKey) => (
            <div key={featureKey} className="flex border-t border-gray-300"> {/* border-t cho mỗi hàng */}
                {/* Cột nhãn */}
                <div className={`${SIDEBAR_WIDTH_CLASS} flex-shrink-0 ${CELL_PADDING} text-left font-normal whitespace-nowrap border-r-0 lg:border-r border-gray-300 bg-white flex items-center`}>
                    {featureKey}
                </div>
                {/* Các cột giá trị */}
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3">
                    {products.map((product, productIndex) => (
                    <div
                        key={`${product.id}-${featureKey}`}
                        className={`${CELL_PADDING} text-center ${productIndex < products.length - 1 ? 'sm:border-r border-gray-300' : ''} bg-white min-h-[38px] flex flex-col justify-center whitespace-normal break-words`}
                    >
                        {renderFeatureValue(product.features[featureKey])}
                    </div>
                    ))}
                </div>
            </div>
        ))}
        {/* Hàng nút MUA NGAY */}
        <div className="flex border-t border-gray-300">
            <div className={`${SIDEBAR_WIDTH_CLASS} flex-shrink-0 ${CELL_PADDING} border-r-0 lg:border-r border-gray-300 bg-white`}></div> {/* Ô trống */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3">
                {products.map((product, productIndex) => (
                    <div key={`buy-${product.id}`} className={`${CELL_PADDING} text-center ${productIndex < products.length - 1 ? 'sm:border-r border-gray-300' : ''} bg-white py-[9px]`}> {/* Tăng padding y cho nút */}
                    <button className="bg-[#f57224] hover:bg-[#d4621c] text-white font-medium py-1.5 px-3 rounded-sm text-[10.5px] w-full max-w-[120px] mx-auto transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-orange-300 tracking-tight">
                        MUA NGAY
                    </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
export default ProductFeaturesSection;