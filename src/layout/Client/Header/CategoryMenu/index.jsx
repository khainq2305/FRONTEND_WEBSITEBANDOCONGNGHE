// src/components/CategoryMenu.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, FileSearch } from 'lucide-react';

const CategoryMenu = ({ topLevelCategories = [], allCategories = [], isOpen = false }) => {
  const [activeL1Category, setActiveL1Category] = useState(null);
  const [level2Display, setLevel2Display] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (topLevelCategories.length > 0) {
        const currentActiveIsValid = activeL1Category && topLevelCategories.find(cat => cat.id === activeL1Category.id);
        let categoryToLoadChildrenFor = currentActiveIsValid ? activeL1Category : topLevelCategories[0];

        if (!currentActiveIsValid) {
          setActiveL1Category(topLevelCategories[0]);
        }
        
        if (categoryToLoadChildrenFor) {
          const l2Children = allCategories.filter((cat) => cat.parent_id === categoryToLoadChildrenFor.id);
          setLevel2Display(l2Children);
        } else if (topLevelCategories.length > 0) { 
          setActiveL1Category(topLevelCategories[0]);
          const l2Children = allCategories.filter((cat) => cat.parent_id === topLevelCategories[0].id);
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
        absolute top-full left-0 z-200 
        bg-white shadow-lg text-black flex
        border border-gray-200 border-t-0 
        rounded-b-lg
        rounded-t-none
        transition-opacity duration-200 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        min-w-[780px]
        overflow-hidden 
      `}
      style={{ height: menuContentOverallHeight }} 
    >
    
      {/* ===== CỘT TRÁI (DANH MỤC L1) ===== */}
      <div
        className="w-[250px] flex-shrink-0 bg-[#F0F0F0] border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-bl-lg"
        style={{ height: '100%' }} 
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
                                    ? 'bg-white text-primary font-medium'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                }`}
                  onMouseEnter={() => handleCategoryHover(l1Cat)}
                >
                  {activeL1Category?.id === l1Cat.id && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm"></span>
                  )}
                  <span className="truncate pr-1">{l1Cat.name}</span>
                  {allCategories.some((cat) => cat.parent_id === l1Cat.id) && (
                    <ChevronRight
                      className={`w-4 h-4 ml-1 flex-shrink-0 transition-colors duration-100 ${
                        activeL1Category?.id === l1Cat.id ? 'text-primary' : 'text-gray-400'
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

      
      <div
        className={`
          flex-1 pl-6 pr-5 py-3 rounded-br-lg
          ${level2Display.length > 0 
            ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100' 
            : 'overflow-y-hidden' 
          }
        `}
        style={{ height: '100%' }}
      >
        {activeL1Category && (
          <div className="mb-3 pb-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary uppercase">{activeL1Category.name}</h3>
            {allCategories.some((cat) => cat.parent_id === activeL1Category.id) && activeL1Category.slug && (
              <a
                href={`/category/${activeL1Category.slug}`}
                className="text-xs text-blue-600 hover:text-orange-500 hover:underline font-medium flex items-center whitespace-nowrap flex-shrink-0 ml-3"
              >
                Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            )}
          </div>
        )}

        {activeL1Category && level2Display.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-3">
            {level2Display.map((l2Cat) => (
              <div key={l2Cat.id} className="text-center group flex flex-col items-center">
                <a
                  href={l2Cat.slug ? `/category/${l2Cat.slug}` : '#'}
                  className="block mb-1.5 w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] p-1.5 flex items-center justify-center
                                    rounded-md hover:shadow-md transition-all duration-200 bg-white border border-gray-200 group-hover:border-blue-300 group-hover:shadow-lg"
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
                      <FileSearch className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                    </div>
                  )}
                </a>
                <h4 className="font-normal text-[11px] sm:text-xs leading-snug text-gray-700 group-hover:text-primary transition-colors duration-150 w-full truncate text-center mt-0.5">
                  <a href={l2Cat.slug ? `/category/${l2Cat.slug}` : '#'} className="hover:text-primary">
                    {l2Cat.name}
                  </a>
                </h4>
              </div>
            ))}
          </div>
        ) : activeL1Category ? ( 
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm py-10 text-center">
            <FileSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3" />
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