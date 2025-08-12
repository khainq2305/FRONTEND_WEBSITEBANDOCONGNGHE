import React, { useState, useEffect } from 'react';
import { ChevronRight, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import fallbackImage from '../../../../assets/Client/images/News/Danh-gia-Oppo-Reno12-5G-Dien-thoai-tam-trung-so-huu-AI-dinh-cao-350x250.jpg'; // ✅ thêm fallback
import { API_BASE_URL } from '../../../../constants/environment';

const CategoryMenu = ({ topLevelCategories = [], allCategories = [], isOpen = false }) => {
  const [activeL1Category, setActiveL1Category] = useState(null);
  const [level2Display, setLevel2Display] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (topLevelCategories.length > 0) {
        const currentActiveIsValid = activeL1Category && topLevelCategories.find((cat) => cat.id === activeL1Category.id);
        const firstCategory = topLevelCategories[0];
        const categoryToLoadChildrenFor = currentActiveIsValid ? activeL1Category : firstCategory;
        if (!currentActiveIsValid) setActiveL1Category(firstCategory);
        if (categoryToLoadChildrenFor?.type === 'post') {
          setLevel2Display([]);
        } else {
          const children = allCategories.filter((cat) => cat.parent_id === categoryToLoadChildrenFor.id);
          setLevel2Display(children);
        }
      } else {
        setActiveL1Category(null);
        setLevel2Display([]);
      }
    }
  }, [isOpen, topLevelCategories, activeL1Category, allCategories]);

  useEffect(() => {
    if (activeL1Category && isOpen) {
      if (activeL1Category.type === 'post') {
        setLevel2Display([]);
      } else {
        const children = allCategories.filter((cat) => cat.parent_id === activeL1Category.id);
        setLevel2Display(children);
      }
    }
  }, [activeL1Category, isOpen, allCategories]);

  const handleCategoryHover = (l1Cat) => {
    if (l1Cat?.id !== activeL1Category?.id) {
      setActiveL1Category(l1Cat);
    }
  };
  const getCategoryLink = (cat) => {
    if (cat.type === 'product') {
      return `/category/${cat.slug}`;
    }
    return `#`;
  };

  const tinNoiBat = { id: 'tin-noi-bat', name: 'Tin nổi bật', type: 'post', slug: 'tin-noi-bat' };
  const menuCategories = [tinNoiBat, ...topLevelCategories];

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 z-[9999 bg-white shadow-lg text-black flex border border-gray-200 border-t-0 rounded-b-lg min-w-[780px] overflow-hidden"
      style={{ height: '460px' }}
    >
      {/* Cột trái - danh mục cha */}
      <div className="w-[250px] bg-[#F0F0F0] border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-bl-lg">
        <ul>
          {menuCategories.map((cat) => (
            <li key={cat.id} className="relative">
              <button
                className={`w-full text-left px-4 py-2.5 flex justify-between items-center text-sm ${
                  activeL1Category?.id === cat.id
                    ? 'bg-white text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`}
                onMouseEnter={() => handleCategoryHover(cat)}
              >
                {activeL1Category?.id === cat.id && <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm"></span>}
                <span className="truncate pr-1">{cat.name}</span>

                {cat.type !== 'post' && allCategories.some((c) => c.parent_id === cat.id) && (
                  <ChevronRight className={`w-4 h-4 ml-1 ${activeL1Category?.id === cat.id ? 'text-primary' : 'text-gray-400'}`} />
                )}
              </button>
            </li>
          ))}
        </ul>
        <Link to="/tin-noi-bat" className="w-full text-left px-4 py-2.5 flex justify-between items-center text-sm">
          <span className="text-primary ">Tin nổi bật</span>
        </Link>
      </div>

      <div className="flex-1 pl-6 pr-5 py-3 rounded-br-lg">
        {activeL1Category && (
          <div className="mb-3 pb-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary uppercase">{activeL1Category.name}</h3>
            {activeL1Category.id && (
              <Link
                to={getCategoryLink(activeL1Category)}
                className="text-xs text-primary hover:text-orange-500 hover:underline font-medium flex items-center"
              >
                Xem tất cả
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            )}
          </div>
        )}

        {activeL1Category?.type === 'post' ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm py-10 text-center">
            <FileSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3" />
            <span>
              Click vào "<span className="font-semibold">Xem tất cả</span>" để đến trang tin tức.
            </span>
          </div>
        ) : level2Display.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 h-full content-start">
            {level2Display.map((cat) => (
              <Link to={getCategoryLink(cat)} key={cat.id} className="text-center group flex flex-col items-center">
                <div className="mb-1.5 w-[80px] h-[80px] p-1.5 flex items-center justify-center rounded-md bg-white border border-gray-200 group-hover:border-blue-300">
                  <img
                    src={
                      cat.thumbnail
                        ? cat.thumbnail.startsWith('http')
                          ? cat.thumbnail
                          : `${API_BASE_URL}/${cat.thumbnail}`
                        : fallbackImage
                    }
                    alt={cat.name}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-[11px] sm:text-xs text-gray-700 group-hover:text-primary truncate w-full">{cat.name}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm py-10 text-center">
            <FileSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3" />
            <span>
              Không có sản phẩm hay danh mục con cho <strong>{activeL1Category?.name}</strong>.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMenu;
