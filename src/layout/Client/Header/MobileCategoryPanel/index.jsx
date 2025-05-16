// src/components/MobileCategoryPanel.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, FileSearch } from 'lucide-react';

const MobileCategoryPanel = ({ isOpen, onClose, categories = [] }) => {
  const [selectedL1CategoryId, setSelectedL1CategoryId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (categories.length > 0) {
        const currentL1Exists = categories.some((cat) => cat.id === selectedL1CategoryId);
        if (selectedL1CategoryId === null || !currentL1Exists) {
          setSelectedL1CategoryId(categories[0].id);
        }
      } else {
        setSelectedL1CategoryId(null);
      }
    } else {
      setSelectedL1CategoryId(null);
    }
  }, [isOpen, categories, selectedL1CategoryId]);

  const activeL1CategoryData = selectedL1CategoryId ? categories.find((cat) => cat.id === selectedL1CategoryId) : null;

  const level2Display = activeL1CategoryData?.children || [];

  const handleSelectL1Category = (categoryId) => {
    if (selectedL1CategoryId !== categoryId) {
      setSelectedL1CategoryId(categoryId);
    }
  };

  const handleNavigate = (slug) => {
    console.log('Simulating navigation to:', slug);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 w-full sm:w-4/5 sm:max-w-md h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-modal="true"
      role="dialog"
    >
      <div className="flex items-center justify-between px-3 py-2.5 bg-primary-gradient text-white sticky top-0 z-10 flex-shrink-0 shadow-md">
        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-red-700 focus:outline-none" aria-label="Đóng danh mục">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-base font-semibold mx-2 truncate" id="mobile-category-panel-title">
          {activeL1CategoryData?.name || 'Danh Mục'}
        </h2>
        {activeL1CategoryData && activeL1CategoryData.slug && level2Display.length > 0 ? (
          <a
            href={activeL1CategoryData.slug ? `#${activeL1CategoryData.slug}` : '#'}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate(activeL1CategoryData.slug);
            }}
            className="text-xs font-medium hover:underline whitespace-nowrap p-2"
          >
            Xem tất cả
          </a>
        ) : (
          <span className="w-[70px] h-8"></span>
        )}
      </div>

      <div className="flex flex-grow overflow-hidden">
        <nav className="w-[120px] sm:w-[140px] flex-shrink-0 bg-[#F0F0F0] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-gray-200">
          {categories.length > 0 ? (
            <ul>
              {categories.map((categoryL1) => (
                <li key={categoryL1.id} className="block relative border-b border-gray-200 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => handleSelectL1Category(categoryL1.id)}
                    className={`w-full text-left px-3 py-3 flex justify-between items-center transition-colors duration-100 ease-in-out text-xs sm:text-sm 
                      ${
                        selectedL1CategoryId === categoryL1.id
                          ? 'bg-white text-[#0058AB] font-semibold'
                          : 'text-gray-800 hover:bg-gray-200 hover:text-[#0058AB]'
                      }`}
                    title={categoryL1.name}
                  >
                    {selectedL1CategoryId === categoryL1.id && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0058AB] rounded-r-sm"></span>
                    )}
                    <span className="truncate pr-1">{categoryL1.name}</span>
                    {categoryL1.children && categoryL1.children.length > 0 && (
                      <ChevronRight
                        size={16}
                        className={`flex-shrink-0 ${selectedL1CategoryId === categoryL1.id ? 'text-[#0058AB]' : 'text-gray-400'}`}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-xs text-gray-500 text-center">Không có danh mục.</p>
          )}
        </nav>

        <div className="flex-grow bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 p-3 sm:p-4">
          {level2Display.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {level2Display.map((categoryL2) => (
                <div key={categoryL2.id} className="text-center group flex flex-col items-center">
                  <a
                    href={categoryL2.slug ? `#${categoryL2.slug}` : '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigateL2(categoryL2.slug);
                    }}
                    className="block mb-1 w-full aspect-square p-1 sm:p-1.5 flex items-center justify-center
                                   rounded-md hover:shadow-md transition-shadow duration-150 bg-white border border-gray-200 group-hover:border-blue-400"
                  >
                    {categoryL2.imageUrl ? (
                      <img
                        src={categoryL2.imageUrl}
                        alt={categoryL2.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          /* ... */
                        }}
                      />
                    ) : null}
                    {!categoryL2.imageUrl && (
                      <div
                        className={`w-full h-full bg-gray-50 rounded flex items-center justify-center text-gray-300 fallback-icon-container ${categoryL2.imageUrl ? 'hidden' : ''}`}
                      >
                        <FileSearch className="w-1/2 h-1/2 text-gray-400 opacity-50" />
                      </div>
                    )}
                  </a>
                  <h4 className="font-normal text-[10px] sm:text-xs leading-tight text-gray-700 group-hover:text-blue-600 transition-colors duration-150 w-full line-clamp-2 text-center mt-0.5 px-0.5">
                    <a
                      href={categoryL2.slug ? `#${categoryL2.slug}` : '#'}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigateL2(categoryL2.slug);
                      }}
                      className="hover:text-blue-600"
                    >
                      {categoryL2.name}
                    </a>
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            selectedL1CategoryId && (
              <div className="p-4 text-center text-gray-500 text-sm h-full flex flex-col items-center justify-center">
                <FileSearch className="w-10 h-10 text-gray-300 mb-2" />
                <span>Không có sản phẩm con cho danh mục này.</span>
              </div>
            )
          )}
          {!selectedL1CategoryId && categories.length > 0 && (
            <div className="p-4 text-center text-gray-400 text-sm h-full flex items-center justify-center">
              Vui lòng chọn một danh mục từ bên trái.
            </div>
          )}
          {categories.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm h-full flex items-center justify-center">Không có dữ liệu danh mục.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCategoryPanel;
