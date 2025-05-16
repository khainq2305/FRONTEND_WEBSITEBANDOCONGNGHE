// src/components/CategoryMenu.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, FileSearch } from 'lucide-react';

const CategoryMenu = ({ topLevelCategories = [], allCategories = [], isOpen = false }) => {
  const [activeL1Category, setActiveL1Category] = useState(null);
  const [level2Display, setLevel2Display] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (topLevelCategories.length > 0) {
        if (!activeL1Category || !topLevelCategories.find((cat) => cat.id === activeL1Category.id)) {
          const firstCategory = topLevelCategories[0];
          setActiveL1Category(firstCategory);
        }

        if (activeL1Category) {
          const l2Children = allCategories.filter((cat) => cat.parent_id === activeL1Category.id);
          setLevel2Display(l2Children);
        } else if (topLevelCategories.length > 0) {
          const firstCategory = topLevelCategories[0];
          const l2Children = allCategories.filter((cat) => cat.parent_id === firstCategory.id);
          setLevel2Display(l2Children);
        }
      } else {
        setActiveL1Category(null);
        setLevel2Display([]);
      }
    }
  }, [isOpen, topLevelCategories, activeL1Category, allCategories]);

  useEffect(() => {
    if (activeL1Category && isOpen) {
      const l2Children = allCategories.filter((cat) => cat.parent_id === activeL1Category.id);
      setLevel2Display(l2Children);
    } else if (!isOpen) {
      setLevel2Display([]);
    }
  }, [activeL1Category, isOpen, allCategories]);

  const handleCategoryHover = (l1Category) => {
    if (l1Category?.id !== activeL1Category?.id) {
      setActiveL1Category(l1Category);
    }
  };

  if (!isOpen) {
    return null;
  }

  const menuContentOverallHeight = '460px';

  return (
    <div
      className={`
        absolute top-full left-0 right-0 mt-0 z-20
        bg-white rounded-b-md shadow-lg text-black flex
        border border-gray-200 border-t-transparent
        transition-all duration-200 ease-in-out
        opacity-100 translate-y-0  /* Luôn hiển thị khi isOpen, không dựa vào activeL1Category nữa */
        max-w-[780px] /* Chiều rộng menu đã fix, có thể là 980px hoặc 1024px tùy theo ĐMX */
        mx-auto
      `}
      style={{ height: menuContentOverallHeight }}
    >
      {/* ===== CỘT TRÁI (DANH MỤC CẤP 1) ===== */}
      <div
        className="w-[250px] flex-shrink-0 bg-[#F0F0F0] border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" // Tăng chiều rộng cột trái, đổi màu nền
        style={{ maxHeight: menuContentOverallHeight }}
      >
        {topLevelCategories.length > 0 ? (
          <ul>
            {topLevelCategories.map((l1Cat) => (
              <li key={l1Cat.id} className="block relative">
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors duration-100 ease-in-out
                                text-sm 
                                ${
                                  activeL1Category?.id === l1Cat.id
                                    ? 'bg-white text-[#0058AB] font-medium'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#0058AB]'
                                }`}
                  onMouseEnter={() => handleCategoryHover(l1Cat)}
                >
                  {activeL1Category?.id === l1Cat.id && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0058AB] rounded-r-sm"></span>
                  )}
                  <span className="truncate pr-1">{l1Cat.name}</span>
                  {allCategories.some((cat) => cat.parent_id === l1Cat.id) && (
                    <ChevronRight
                      className={`w-4 h-4 ml-1 flex-shrink-0 transition-colors duration-100 ${
                        activeL1Category?.id === l1Cat.id ? 'text-[#0058AB]' : 'text-gray-400'
                      }`}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm text-gray-500">Không có danh mục.</p>
        )}
      </div>

      {/* ===== CỘT PHẢI (NỘI DUNG L2) ===== */}
      <div
        className="flex-1 pl-6 pr-5 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
        style={{ maxHeight: menuContentOverallHeight }}
      >
        {activeL1Category && (
          <div className="mb-3 pb-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#0058AB] uppercase">{activeL1Category.name}</h3>
            {allCategories.some((cat) => cat.parent_id === activeL1Category.id) && activeL1Category.slug && (
              <a
                href={`#${activeL1Category.slug}`}
                className="text-xs text-blue-600 hover:text-orange-500 hover:underline font-medium flex items-center whitespace-nowrap flex-shrink-0 ml-3"
              >
                Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            )}
          </div>
        )}

        {activeL1Category && level2Display.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-4 gap-y-4">
            {level2Display.map((l2Cat) => (
              <div key={l2Cat.id} className="text-center group flex flex-col items-center">
                <a
                  href={l2Cat.slug ? `#${l2Cat.slug}` : '#'}
                  className="block mb-1.5 w-[80px] h-[80px] p-1.5 flex items-center justify-center
                                   rounded-md hover:shadow-lg transition-all duration-200 bg-white border border-gray-100 group-hover:border-blue-200"
                >
                  {l2Cat.imageUrl ? (
                    <img
                      src={l2Cat.imageUrl}
                      alt={l2Cat.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement.querySelector('.fallback-icon-container');
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  {!l2Cat.imageUrl && (
                    <div
                      className={`w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-300 fallback-icon-container ${l2Cat.imageUrl ? 'hidden' : ''}`}
                    >
                      {' '}
                      {}
                      <FileSearch className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                </a>
                <h4 className="font-normal text-xs leading-snug text-gray-700 group-hover:text-blue-600 transition-colors duration-150 w-full truncate text-center mt-0.5">
                  <a href={l2Cat.slug ? `#${l2Cat.slug}` : '#'} className="hover:text-blue-600">
                    {l2Cat.name}
                  </a>
                </h4>
              </div>
            ))}
          </div>
        ) : activeL1Category ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 text-sm py-10 text-center">
            <FileSearch className="w-12 h-12 text-gray-300 mb-3" />
            <span className="block">Không có sản phẩm hay danh mục con</span>
            <span className="block">
              cho danh mục <span className="font-semibold text-gray-600">"{activeL1Category.name}"</span>.
            </span>
          </div>
        ) : isOpen && topLevelCategories.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Không có danh mục nào để hiển thị.</div>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryMenu;
