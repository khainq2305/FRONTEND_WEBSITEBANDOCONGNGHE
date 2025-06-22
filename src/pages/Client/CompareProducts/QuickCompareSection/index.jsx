// src/pages/Client/CompareProducts/QuickCompareSection/index.jsx
import React from 'react';

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-gray-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const QuickCompareSection = ({ products, specs = [], sidebarWidthClass, productColumnMinWidthClass }) => {
  const CELL_PADDING = 'py-2 px-2.5';

  const quickSpecs = [...specs]
    .filter(spec => typeof spec.sortOrder === 'number')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 5);

  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null);
  }

  return (
    <div className="mb-2">
      <div className={`flex items-center p-3 ${sidebarWidthClass}`}>
        <ChevronDownIcon />
        <h2 className="text-[13px] font-semibold text-gray-800 ml-1.5 uppercase">
          So sánh nhanh <span className="text-yellow-500">⭐</span>
        </h2>
      </div>

      {quickSpecs.map((spec) => (
        <div key={spec.specKey} className="flex border-t border-gray-300 bg-white">
          <div className={`${sidebarWidthClass} flex-shrink-0 ${CELL_PADDING} text-left font-medium whitespace-nowrap border-r border-gray-300 flex items-center`}>
            {spec.specKey}
          </div>
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-3">
            {columnsToRender.map((product, idx) => {
              const value = spec?.values?.[String(product?.id)];
              console.log('🧵 QuickSpec:', spec.specKey, '| Product:', product?.id, '| Value:', value);
              return (
                <div
                  key={`${spec.specKey}-${product?.id || 'empty'}`}
                  className={`${CELL_PADDING} text-center ${idx < columnsToRender.length - 1 ? 'sm:border-r border-gray-300' : ''} bg-white min-h-[38px] flex flex-col justify-center whitespace-normal break-words`}
                >
                  {value || '-'}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickCompareSection;
