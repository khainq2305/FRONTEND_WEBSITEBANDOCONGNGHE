import React from 'react';

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-gray-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const QuickCompareSection = ({ products, specs = [], sidebarWidthClass, productColumnMinWidthClass }) => {
  const CELL_PADDING = 'py-2 px-2.5 md:py-3 md:px-4'; 

  const quickSpecs = [...specs].slice(0, 5);

  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null);
  }

  return (
    <div className="mb-2">
      
      <div className={`flex items-center p-3 h-[41px] md:h-[50px] ${sidebarWidthClass} border-r border-gray-300`}>
        <ChevronDownIcon />
        <h2 className="text-[13px] md:text-base font-semibold text-gray-800 ml-1.5 uppercase">
          So sánh nhanh <span className="text-yellow-500">⭐</span>
        </h2>
      </div>

      
      <div className="overflow-x-auto">
        <div className="min-w-[540px]">
          {quickSpecs.map((spec) => (
            <div key={spec.specKey} className="flex border-t border-gray-300 bg-white">
             
              <div className={`${sidebarWidthClass} flex-shrink-0 ${CELL_PADDING} text-left font-medium whitespace-nowrap border-r border-gray-300 flex items-center text-xs md:text-sm`}>
                {spec.displayName || spec.specKey}
              </div>
            
              <div className="flex-grow grid grid-cols-3">
                {columnsToRender.map((product, idx) => {
                  const value = product?.id !== undefined
                                ? spec.values?.[String(product.id)]
                                : undefined;

                  return (
                    <div
                      key={`${spec.specKey}-${product?.id || 'empty'}`}
                      className={`${CELL_PADDING} text-center ${idx < columnsToRender.length - 1 ? 'border-r border-gray-300' : ''} bg-white min-h-[38px] md:min-h-[48px] flex flex-col justify-center whitespace-normal break-words text-xs md:text-sm min-w-[180px] lg:min-w-0`} // Added min-w
                    >
                      {value || '-'}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickCompareSection;