// src/components/CategoryMenu.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const CategoryMenu = ({
  topLevelCategories = [],
  allCategories = [],
  isOpen = false,
  onMouseEnter = () => {},
  onMouseLeave = () => {}
}) => {
  const [activeL1Category, setActiveL1Category] = useState(null);
  const [level2Display, setLevel2Display] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Khi menu MỞ:
      // Nếu chưa có activeL1Category nào (ví dụ: lần đầu mở, hoặc vừa reset)
      // VÀ có danh sách topLevelCategories, thì tự động chọn mục đầu tiên.
      if (!activeL1Category && topLevelCategories.length > 0) {
        const firstCategory = topLevelCategories[0];
        setActiveL1Category(firstCategory); // Đặt category cấp 1 đầu tiên là active
        // Tìm con cấp 2 của category cấp 1 đầu tiên này
        const l2Children = allCategories.filter(cat => cat.parent_id === firstCategory.id);
        setLevel2Display(l2Children);
      }
      // Nếu đã có activeL1Category rồi (ví dụ người dùng đang di chuột qua lại), không làm gì cả ở đây.
    } else {
      // Khi menu ĐÓNG: reset tất cả
      setActiveL1Category(null);
      setLevel2Display([]);
    }
  }, [isOpen, topLevelCategories, allCategories, activeL1Category]); // Thêm activeL1Category vào dependency để kiểm tra

  const handleCategoryHover = (l1Category) => {
    setActiveL1Category(l1Category);
    if (l1Category) {
      const l2Children = allCategories.filter(cat => cat.parent_id === l1Category.id);
      setLevel2Display(l2Children);
    } else {
      setLevel2Display([]);
    }
  };

  // Không render gì nếu panel không mở (mặc dù isOpen được kiểm tra trong useEffect rồi)
  if (!isOpen && !activeL1Category) { // Chỉ return null nếu thực sự không có gì để hiển thị
    return null;
  }


  return (
    <div
      className={`
        absolute top-full left-0 right-0 max-w-screen-xl mx-auto mt-0
        bg-white rounded-b-md shadow-lg z-20 text-black flex
        border border-gray-200 border-t-transparent
        ${isOpen || activeL1Category ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        transition-all duration-200 ease-in-out
      `}
      style={{ minHeight: '380px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Cột Trái (Danh mục cấp 1) */}
      <div className="w-[240px] flex-shrink-0 border-r border-gray-200 py-2 max-h-[500px] overflow-y-auto scrollbar-thin">
        {topLevelCategories.length > 0 ? (
            <ul>
            {topLevelCategories.map((l1Cat) => (
                <li key={l1Cat.id}>
                <button
                    type="button"
                    className={`w-full text-left px-4 py-2.5 flex justify-between items-center text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-inset ${
                    activeL1Category?.id === l1Cat.id ? 'bg-red-50 font-semibold text-red-600' : 'hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => handleCategoryHover(l1Cat)}
                >
                    <span>{l1Cat.name}</span>
                    {allCategories.some(cat => cat.parent_id === l1Cat.id) && (
                    <ChevronRight className={`w-4 h-4 ${activeL1Category?.id === l1Cat.id ? 'text-red-600' : 'text-gray-400'}`} />
                    )}
                </button>
                </li>
            ))}
            </ul>
        ) : (
            <p className="p-4 text-xs text-gray-400">Không có danh mục.</p>
        )}
      </div>

      {/* Cột Phải (Cấp 2 làm tiêu đề cột, Cấp 3 làm link) */}
      <div className="flex-1 p-5 max-h-[500px] overflow-y-auto scrollbar-thin">
        {/* Luôn hiển thị nội dung nếu activeL1Category có giá trị (tức là đã hover hoặc được set mặc định) */}
        {activeL1Category && level2Display.length > 0 ? (
          <>
            <h3 className="text-base font-bold text-red-600 mb-4 flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2 rounded-sm"></span>
                {activeL1Category.name}
            </h3>
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
              {level2Display.map((l2Cat) => {
                const l3Children = allCategories.filter(cat => cat.parent_id === l2Cat.id);
                return (
                  <div key={l2Cat.id}>
                    <h4 className="font-semibold text-sm mb-2 text-gray-800 uppercase truncate">
                      <a href={l2Cat.slug ? `#${l2Cat.slug}` : '#'} className="hover:text-red-600">
                        {l2Cat.name}
                      </a>
                    </h4>
                    {l3Children.length > 0 && (
                      <ul className="space-y-1.5">
                        {l3Children.map((l3Cat) => (
                          <li key={l3Cat.id}>
                            <a
                              href={l3Cat.slug ? `#${l3Cat.slug}` : '#'}
                              className="text-xs text-gray-600 hover:text-red-600 hover:underline"
                            >
                              {l3Cat.name}
                            </a>
                          </li>
                        ))}
                        {l2Cat.slug && ( // Chỉ hiện "Xem tất cả" nếu l2Cat có slug
                            <li className="mt-1.5">
                                <a href={`#${l2Cat.slug}`} className="text-xs text-blue-600 font-medium hover:text-red-600 hover:underline">
                                    Xem tất cả
                                </a>
                            </li>
                        )}
                      </ul>
                    )}
                    {/* Trường hợp L2 không có L3 con, nhưng vẫn là một link */}
                    {l3Children.length === 0 && l2Cat.slug && (
                        <a href={`#${l2Cat.slug}`} className="text-xs text-blue-600 font-medium hover:text-red-600 hover:underline block mt-1">
                            Xem chi tiết {l2Cat.name}
                        </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          // Hiển thị khi activeL1Category có (tức là đã hover/set mặc định) nhưng level2Display rỗng
          activeL1Category ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Không có chi tiết cho danh mục "{activeL1Category.name}".
            </div>
          ) : (
          // Trường hợp này gần như không xảy ra nếu logic useEffect đúng, nhưng để dự phòng
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Đang tải...
            </div>
          )

        )}
      </div>
    </div>
  );
};

export default CategoryMenu;