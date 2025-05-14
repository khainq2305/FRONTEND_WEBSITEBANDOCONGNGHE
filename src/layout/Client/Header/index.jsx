import React, { useState, useRef, useEffect } from 'react';
import { Menu, ShoppingCart, Search, Bell, LayoutGrid, CircleUserRound, FileSearch, X } from 'lucide-react';
import CategoryMenu from './CategoryMenu'; // Menu Desktop (sẽ dùng phiên bản đơn giản hơn)
import MobileCategoryPanel from './MobileCategoryPanel';
import Overlay from './Overlay';
import { useNavigate } from 'react-router-dom';
import PopupModal from './PopupModal'; // Sử dụng PopupModal
// Dữ liệu phẳng gốc từ API/nguồn khác
const flatCategoriesFromAPI = [
  { id: 'sach-trong-nuoc', name: 'Sách Trong Nước', parent_id: null, icon: '📕', slug: 'sach-trong-nuoc' },
  { id: 'foreign-books', name: 'Foreign Books', parent_id: null, icon: '🌍', slug: 'foreign-books' },
  { id: 'vpp', name: 'VPP - Dụng Cụ Học Sinh', parent_id: null, icon: '✏️', slug: 'vpp' },
  { id: 'van-hoc', name: 'Văn học', parent_id: 'sach-trong-nuoc', slug: 'van-hoc' },
  { id: 'kinh-te', name: 'Kinh tế', parent_id: 'sach-trong-nuoc', slug: 'kinh-te' },
  { id: 'thieu-nhi', name: 'Thiếu Nhi', parent_id: 'sach-trong-nuoc', slug: 'thieu-nhi' },
  { id: 'tieu-thuyet', name: 'Tiểu Thuyết', parent_id: 'van-hoc', slug: 'tieu-thuyet' },
  { id: 'truyen-ngan', name: 'Truyện Ngắn', parent_id: 'van-hoc', slug: 'truyen-ngan' },
  { id: 'fiction', name: 'Fiction', parent_id: 'foreign-books', slug: 'fiction' },
  { id: 'dung-cu-ve', name: 'Dụng Cụ Vẽ', parent_id: 'vpp', slug: 'dung-cu-ve' },
  { id: 'sp-giay', name: 'Sản phẩm về Giấy', parent_id: 'vpp', slug: 'sp-giay' },
  { id: 'but-ve', name: 'Bút Vẽ', parent_id: 'dung-cu-ve', slug: 'but-ve' },
  { id: 'mau-ve', name: 'Màu Vẽ', parent_id: 'dung-cu-ve', slug: 'mau-ve' }
];

const Header = () => {
  const navigate = useNavigate();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuTimerRef = useRef(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  // State cho danh mục cấp 1 (cho cột trái của Desktop Menu)
  const [topLevelDesktopCategories, setTopLevelDesktopCategories] = useState([]);
  // State cho cây danh mục của Mobile Panel
  const [mobileCategoryTree, setMobileCategoryTree] = useState([]);
  // Hàm xây dựng cây danh mục
  const buildCategoryTree = (categories, parentId = null) => {
    return categories
      .filter((category) => category.parent_id === parentId)
      .map((category) => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  };
  const toggleLoginPopup = () => {
    setIsLoginPopupOpen(!isLoginPopupOpen);
  };
  useEffect(() => {
    // Lọc danh mục cấp 1 cho Desktop Menu
    setTopLevelDesktopCategories(flatCategoriesFromAPI.filter((cat) => cat.parent_id === null));
    // Xây dựng cây cho Mobile Panel
    setMobileCategoryTree(buildCategoryTree(flatCategoriesFromAPI));
  }, []); // Chạy một lần khi component mount

  const handleMenuEnter = () => {
    clearTimeout(categoryMenuTimerRef.current);
    setIsCategoryMenuOpen(true);
  };
  const handleMenuLeave = () => {
    categoryMenuTimerRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 200);
  };
  const toggleMobilePanel = () => {
    setIsMobilePanelOpen(!isMobilePanelOpen);
  };
  // 👉 Hàm xử lý khi nhấn "Đăng ký" và "Đăng nhập"
  const handleRegister = () => {
    setIsLoginPopupOpen(false);
    navigate('/dang-ky');
  };

  const handleLogin = () => {
    setIsLoginPopupOpen(false);
    navigate('/dang-nhap');
  };
  return (
    <>
      <header className="bg-red-600 text-white w-full shadow-md z-30 relative">
        {/* Mobile & Tablet View */}
        <div className="lg:hidden">
          <div className="flex justify-center items-center pt-2.5 pb-1.5 px-4">
            <img src="/logo.png" alt="Logo" className="h-7" />
          </div>
          <div className="flex items-center gap-x-2 px-3 pb-2.5 pt-0">
            <button className="p-1 text-white flex-shrink-0 -ml-1" onClick={toggleMobilePanel} aria-label="Mở danh mục">
              <LayoutGrid className="w-6 h-6" strokeWidth={2} />
            </button>
            <div className="flex-grow mx-1">
              <div className="flex items-center bg-white text-gray-600 pl-3 pr-1 py-1 h-[36px] rounded-lg w-full shadow-sm">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="flex-1 text-[13px] outline-none bg-transparent placeholder-gray-400"
                />
                <button className="flex items-center justify-center w-[28px] h-[28px] bg-red-100 rounded-full hover:bg-red-200 transition ml-1 flex-shrink-0">
                  <Search color="red" strokeWidth={2.5} className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-x-1 flex-shrink-0">
              <button className="p-1 text-white">
                <ShoppingCart className="w-6 h-6" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block relative">
          <div className="flex justify-between items-center max-w-screen-xl mx-auto py-2 px-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="h-10" />
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
              >
                <LayoutGrid className="w-5 h-5" strokeWidth={1.8} color="#fff" />
                <span className="text-sm font-semibold">Danh mục</span>
              </button>
            </div>
            <div className="flex-1 mx-4">
              <div className="relative flex items-center bg-white text-gray-600 px-3 h-[40px] rounded-full w-full max-w-[600px] mx-auto shadow-sm">
                <input
                  type="text"
                  placeholder="Siêu phẩm Samsung Galaxy S25"
                  className="flex-1 text-sm outline-none bg-transparent pr-10"
                />
                <button className="absolute right-[4px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[36px] h-[36px] bg-red-100 rounded-full hover:bg-red-200 transition">
                  <Search color="red" strokeWidth={2} className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-red-600 hover:bg-[#8b1a1a] transition-all">
                <FileSearch className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                <span className="text-white text-[11px] font-semibold leading-tight text-center">Tra cứu đơn hàng</span>
              </button>
              {/* ... các nút actions khác ... */}
              <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-red-600 hover:bg-[#8b1a1a] transition-all">
                <Bell className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                <span className="text-white text-[11px] font-semibold leading-tight text-center">Thông báo</span>
              </button>
              <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg bg-red-600 hover:bg-[#8b1a1a] transition-all">
                <ShoppingCart className="w-6 h-6" strokeWidth={1.8} color="#fff" />
                <span className="text-white text-[11px] font-semibold leading-tight text-center">Giỏ hàng</span>
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"
                onClick={toggleLoginPopup}
              >
                <CircleUserRound className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                <span className="text-sm font-semibold">Tài khoản</span>
              </button>
            </div>
          </div>

          <CategoryMenu
            // --- Truyền dữ liệu đã được xử lý riêng cho desktop ---
            topLevelCategories={topLevelDesktopCategories} // Chỉ danh mục cấp 1
            allCategories={flatCategoriesFromAPI} // Toàn bộ danh sách phẳng
            // ---
            isOpen={isCategoryMenuOpen}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          />
        </div>
      </header>

      <Overlay isOpen={isMobilePanelOpen} onClick={toggleMobilePanel} />
      <MobileCategoryPanel
        isOpen={isMobilePanelOpen}
        onClose={toggleMobilePanel}
        categories={mobileCategoryTree} // Mobile Panel dùng cây đã xử lý
      />
      {/* Popup Đăng Nhập sử dụng PopupModal */}
      <PopupModal isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} title="Đăng nhập tài khoản" showFooter={false}>
        <p>Vui lòng đăng nhập để sử dụng các tính năng tốt nhất.</p>
        <div className="flex justify-between gap-3 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300" onClick={handleRegister}>
            Đăng ký
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={handleLogin}>
            Đăng nhập
          </button>
        </div>
      </PopupModal>
    </>
  );
};

export default Header;
