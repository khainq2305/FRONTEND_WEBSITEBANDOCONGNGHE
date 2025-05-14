// src/components/MobileCategoryPanel.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';

const MobileCategoryPanel = ({ isOpen, onClose, categories = [] }) => { // categories ở đây là cây đã xử lý từ buildCategoryTree
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [expandedRightSections, setExpandedRightSections] = useState({});

  // useEffect này sẽ chạy khi panel mở (isOpen) hoặc khi danh sách categories thay đổi
  useEffect(() => {
    if (isOpen) {
      if (categories.length > 0) {
        // Nếu chưa có category nào được chọn (selectedCategoryId là null)
        // HOẶC category đang chọn không còn tồn tại trong danh sách categories mới
        // thì mặc định chọn category đầu tiên.
        const currentSelectionIsValid = categories.some(cat => cat.id === selectedCategoryId);
        if (selectedCategoryId === null || !currentSelectionIsValid) {
          setSelectedCategoryId(categories[0].id);
          setExpandedRightSections({}); // Reset trạng thái xổ xuống của cột phải
        }
        // Nếu selectedCategoryId đã có và hợp lệ, không làm gì cả, giữ nguyên lựa chọn.
        // Trạng thái expandedRightSections cũng được giữ nguyên trừ khi selectedCategoryId thay đổi.
      } else {
        // Nếu không có categories, reset hết
        setSelectedCategoryId(null);
        setExpandedRightSections({});
      }
    } else {
      // Khi panel đóng, reset selectedCategoryId để lần mở sau sẽ chọn lại mục đầu tiên.
      // expandedRightSections cũng được reset.
      // Bạn có thể cân nhắc giữ lại selectedCategoryId nếu muốn người dùng quay lại đúng mục đã chọn trước đó khi mở lại panel ngay.
      // Tuy nhiên, reset hoàn toàn thường cho trải nghiệm "sạch" hơn khi mở lại từ đầu.
      setSelectedCategoryId(null);
      setExpandedRightSections({});
    }
  }, [isOpen, categories]); // Chỉ phụ thuộc vào isOpen và categories


  // Tìm dữ liệu của danh mục đang được chọn ở cột trái
  const selectedCategoryData = selectedCategoryId
    ? categories.find(cat => cat.id === selectedCategoryId)
    : null;

  // Hàm xử lý khi chọn một mục ở cột trái
  const handleSelectCategory = (categoryId) => {
    // Chỉ cập nhật nếu chọn một category KHÁC category hiện tại
    if (selectedCategoryId !== categoryId) {
      setSelectedCategoryId(categoryId);
      setExpandedRightSections({}); // Reset (đóng) tất cả các section con ở cột phải
    }
  };

  // Hàm xử lý mở/đóng một section ở cột phải
  const toggleRightSectionExpansion = (sectionTitle) => {
    setExpandedRightSections(prev => ({
      // ...prev, // Giữ lại trạng thái của các section khác nếu muốn
      // Hoặc chỉ cho phép một section mở tại một thời điểm:
      // {[sectionTitle]: !prev[sectionTitle]}
      // Hiện tại: cho phép nhiều section mở cùng lúc
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Không render gì nếu panel không mở
  // Việc này cũng giúp tránh lỗi nếu categories chưa kịp tải khi isOpen=true
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 w-full sm:w-4/5 sm:max-w-xs h-full bg-gray-100 shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-modal="true" // Accessibility
      role="dialog"
    >
      {/* Header của Panel */}
      <div className="flex items-center justify-between p-3 bg-red-600 text-white sticky top-0 z-10 flex-shrink-0 shadow">
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Đóng danh mục"
        >
           <ArrowLeft size={24} />
        </button>
        <h2 className="text-base font-semibold mx-2" id="mobile-category-panel-title">Danh Mục Sản Phẩm</h2>
        <span className="w-8 h-8"></span> {/* Placeholder để căn giữa tiêu đề */}
      </div>

      {/* Body của Panel - Chia 2 cột */}
      <div className="flex flex-grow overflow-hidden" role="navigation" aria-labelledby="mobile-category-panel-title">

        {/* Cột Trái (Icon + Tên Danh mục chính - L1) */}
        <nav className="w-[88px] flex-shrink-0 bg-gray-50 overflow-y-auto scrollbar-hidden border-r border-gray-200">
          {categories.length > 0 ? (
            <ul>
              {categories.map((categoryL1) => (
                <li key={categoryL1.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectCategory(categoryL1.id)}
                    className={`w-full flex flex-col items-center justify-center p-1.5 py-2.5 text-center cursor-pointer transition-colors h-[76px] border-b border-gray-200 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-inset ${
                      selectedCategoryId === categoryL1.id
                        ? 'bg-red-50 text-red-600 font-semibold relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={categoryL1.name}
                    aria-current={selectedCategoryId === categoryL1.id ? "page" : undefined}
                  >
                    <span className="text-xl mb-0.5">{categoryL1.icon || '📄'}</span>
                    <span className="text-[10px] leading-tight line-clamp-2">{categoryL1.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-xs text-gray-500 text-center">Không có danh mục.</p>
          )}
        </nav>

        {/* Cột Phải (Chi tiết danh mục con - L2 làm section, L3 làm link) */}
        <div className="flex-grow bg-white overflow-y-auto scrollbar-hidden p-1">
          {/* Trường hợp đang đợi selectedCategoryId được thiết lập hoặc không có categories */}
          {!selectedCategoryId && categories.length > 0 && (
             <div className="p-4 text-center text-gray-400 text-sm h-full flex items-center justify-center">Đang tải...</div>
          )}

          {/* Trường hợp đã chọn category cha và có dữ liệu con (L2) */}
          {selectedCategoryData && selectedCategoryData.children && selectedCategoryData.children.length > 0 && (
            <div>
              {selectedCategoryData.children.map((categoryL2) => { // categoryL2 là con của selectedCategoryData
                const sectionTitle = categoryL2.name; // Dùng name làm key cho expanded state nếu ID không phải lúc nào cũng có hoặc trùng
                const isSectionExpanded = !!expandedRightSections[sectionTitle];
                const hasSubLinks = categoryL2.children && categoryL2.children.length > 0; // categoryL3

                return (
                  <div key={categoryL2.id} className="border-b border-gray-100 last:border-b-0">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 text-left focus:outline-none focus:ring-1 focus:ring-red-300 focus:ring-inset"
                      onClick={hasSubLinks ? () => toggleRightSectionExpansion(sectionTitle) : () => {
                          // Nếu categoryL2 không có con (hasSubLinks=false), thì khi nhấn vào nó sẽ đóng panel
                          // và có thể thực hiện điều hướng (ví dụ: đến trang của categoryL2)
                          // if (categoryL2.slug) { /* history.push(`/${categoryL2.slug}`) hoặc window.location.href */ }
                          onClose();
                      }}
                      aria-expanded={hasSubLinks ? isSectionExpanded : undefined}
                      aria-controls={hasSubLinks ? `section-content-${categoryL2.id}` : undefined}
                    >
                      <span className="truncate">{sectionTitle}</span>
                      {hasSubLinks && (
                          isSectionExpanded ? <ChevronDown size={18} className="text-gray-500 flex-shrink-0" /> : <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                      )}
                      {!hasSubLinks && <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />}
                    </button>

                    {/* Danh sách các link con (categoryL3) */}
                    {hasSubLinks && isSectionExpanded && (
                      <div className="pb-2 pl-5 pr-2 pt-1 bg-white" id={`section-content-${categoryL2.id}`}>
                        <ul>
                          {categoryL2.children.map((categoryL3) => (
                            <li key={categoryL3.id} className="py-1.5">
                              <a
                                href={categoryL3.slug ? `#${categoryL3.slug}` : '#'} // Thay bằng link thật
                                onClick={onClose} // Đóng panel khi chọn
                                className="flex items-center justify-between text-xs group text-gray-600 hover:text-red-600 hover:underline"
                              >
                                <span className="truncate">{categoryL3.name}</span>
                                {/* <ChevronRight size={14} className="text-gray-300 group-hover:text-red-500 flex-shrink-0"/> */}
                              </a>
                            </li>
                          ))}
                          {/* Tùy chọn: Link "Xem tất cả" cho categoryL2 */}
                          {categoryL2.slug && (
                            <li className="py-1.5 mt-1">
                                  <a
                                    href={`#${categoryL2.slug}`} // Link đến trang của categoryL2
                                    onClick={onClose}
                                    className="text-xs text-blue-600 font-medium hover:text-red-600 hover:underline"
                                  >
                                      Xem tất cả {categoryL2.name}
                                  </a>
                              </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Trường hợp đã chọn category cha nhưng không có con (L2) */}
          {selectedCategoryId && selectedCategoryData && (!selectedCategoryData.children || selectedCategoryData.children.length === 0) && (
             <div className="p-4 text-center text-gray-500 text-sm h-full flex items-center justify-center">
                Không có chi tiết cho danh mục này.
             </div>
          )}

          {/* Trường hợp không có category nào được chọn (ví dụ: categories rỗng) */}
           {isOpen && !selectedCategoryId && categories.length === 0 && (
             <div className="p-4 text-center text-gray-500 text-sm h-full flex items-center justify-center">
                Không có dữ liệu danh mục.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCategoryPanel;