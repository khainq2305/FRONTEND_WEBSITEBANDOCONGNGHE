import React from 'react';

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-gray-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const QuickCompareSection = ({
  products,
  specs = [],
  sidebarWidthClass,
  productColumnMinWidthClass,
  showOnlyDifferences // ✅ Dù chưa dùng vẫn giữ nếu sau này cần lọc
}) => {
  const CELL_PADDING = 'py-2 px-2.5';

  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null);
  }

  return (
    <div className="mb-2">
      {/* Header: So sánh nhanh */}
      <div className={`flex items-center p-3 ${sidebarWidthClass}`}>
        <ChevronDownIcon />
        <h2 className="text-[13px] font-semibold text-gray-800 ml-1.5 uppercase">
          So sánh nhanh <span className="text-yellow-500">⭐</span>
        </h2>
      </div>

      {/* Hàng mô tả so sánh nhanh */}
      <div className="flex border-t border-gray-300 bg-white">
        {/* Cột tiêu đề cố định bên trái */}
        <div className={`${sidebarWidthClass} flex-shrink-0 ${CELL_PADDING} text-left font-medium whitespace-nowrap border-r border-gray-300 flex items-start`}>
          So sánh nhanh
        </div>

        {/* Các cột mô tả của từng sản phẩm */}
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-3">
          {columnsToRender.map((product, idx) => (
            <div
              key={`summary-${product?.id || 'empty'}`}
              className={`${CELL_PADDING} text-left ${idx < columnsToRender.length - 1 ? 'sm:border-r border-gray-300' : ''} bg-white whitespace-normal break-words`}
            >
              {(product?.summary || '').split('\n').map((line, i) => (
                <div key={i} className="text-[11.5px] leading-snug text-gray-700">
                  • {line}
                </div>
              )) || <span className="text-gray-400">Trống</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickCompareSection;
