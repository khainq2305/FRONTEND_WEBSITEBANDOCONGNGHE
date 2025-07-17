import React from 'react';

const ProductFeaturesSection = ({ products, featureOrder, showOnlyDifferences, getFilteredFeatures, renderFeatureValue }) => {
  const SIDEBAR_WIDTH_CLASS = "w-full lg:w-[230px] lg:min-w-[200px]";
  const CELL_PADDING = "py-2 px-2.5";

  // ✅ Hàm kiểm tra dòng có khác biệt không
  const isDifferent = (featureKey) => {
    const values = products.map(p => (p.features?.[featureKey] || '-').toLowerCase().trim());
    const first = values[0];
    return values.some(v => v !== first);
  };

  return (
    <div>
      <div className={`flex items-center p-3 h-[41px] ${SIDEBAR_WIDTH_CLASS} lg:border-r lg:border-gray-300`}>
        <h2 className="text-[13px] font-semibold text-gray-800 ml-1.5 uppercase">
          ĐẶC TÍNH SẢN PHẨM
        </h2>
      </div>

      <div className="overflow-x-auto">
        {featureOrder.map((featureKey) => {
          if (showOnlyDifferences && !isDifferent(featureKey)) return null; // ✅ ẩn nếu giống nhau

          return (
            <div key={featureKey} className="flex border-t border-gray-300">
              <div className={`${SIDEBAR_WIDTH_CLASS} flex-shrink-0 ${CELL_PADDING} text-left font-normal whitespace-nowrap border-r-0 lg:border-r border-gray-300 bg-white flex items-center`}>
                {featureKey}
              </div>

              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3">
                {products.map((product, productIndex) => (
                  <div
                    key={`${product.id}-${featureKey}`}
                    className={`${CELL_PADDING} text-center ${
                      productIndex < products.length - 1 ? 'sm:border-r border-gray-300' : ''
                    } bg-white min-h-[38px] flex flex-col justify-center whitespace-normal break-words`}
                  >
                    {renderFeatureValue(product.features[featureKey])}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Nút mua ngay */}
        <div className="flex border-t border-gray-300">
          <div className={`${SIDEBAR_WIDTH_CLASS} flex-shrink-0 ${CELL_PADDING} border-r-0 lg:border-r border-gray-300 bg-white`}></div>
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-3">
            {products.map((product, productIndex) => (
              <div key={`buy-${product.id}`} className={`${CELL_PADDING} text-center ${productIndex < products.length - 1 ? 'sm:border-r border-gray-300' : ''} bg-white py-[9px]`}>
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
