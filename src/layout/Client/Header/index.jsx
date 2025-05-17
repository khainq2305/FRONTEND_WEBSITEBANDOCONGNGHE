// src/layout/Client/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, ShoppingCart, Search, Bell, LayoutGrid, CircleUserRound, FileSearch, X } from 'lucide-react';
import CategoryMenu from './CategoryMenu';
import MobileCategoryPanel from './MobileCategoryPanel';
import Overlay from './Overlay';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import PopupModal from './PopupModal';

// BƯỚC 1: Import logo từ thư mục assets
// Đường dẫn này là tương đối so với vị trí file Header.js hiện tại.
// Giả sử Header.js nằm trong src/layout/Client/ và logo nằm trong src/assets/Client/images/Logo/
// thì đường dẫn có thể là '../../assets/Client/images/Logo/logo.svg'
// HÃY ĐIỀU CHỈNH ĐƯỜNG DẪN NÀY CHO ĐÚNG VỚI CẤU TRÚC THỰC TẾ CỦA BẠN
import logoSrc from '../../../assets/Client/images/Logo/logo.svg'; 

const flatCategoriesFromAPI = [
  // ===== DANH MỤC CẤP 1 (L1) =====
  {
    id: 'dien-gia-dung',
    name: 'Điện gia dụng',
    parent_id: null,
    slug: 'dien-gia-dung'
  },
  {
    id: 'phu-kien',
    name: 'Phụ kiện',
    parent_id: null,
    slug: 'phu-kien'
  },
  {
    id: 'do-gia-dung',
    name: 'Đồ gia dụng',
    parent_id: null,
    slug: 'do-gia-dung'
  },
  {
    id: 'may-cu', 
    name: 'Máy cũ, trưng bày',
    parent_id: null,
    slug: 'may-cu'
  },


  
  {
    id: 'quat-dieu-hoa-1', 
    name: 'Quạt điều hòa',
    parent_id: 'dien-gia-dung',
    slug: 'quat-dieu-hoa-1', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-xay-sinh-to-1', 
    name: 'Máy xay sinh tố',
    parent_id: 'dien-gia-dung',
    slug: 'may-xay-sinh-to-1', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-ep-trai-cay-1', 
    name: 'Máy ép trái cây',
    parent_id: 'dien-gia-dung',
    slug: 'may-ep-trai-cay-1', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'quat-dieu-hoa-2', 
    name: 'Quạt điều hòa',
    parent_id: 'dien-gia-dung',
    slug: 'quat-dieu-hoa-2', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-xay-sinh-to-2', 
    name: 'Máy xay sinh tố',
    parent_id: 'dien-gia-dung',
    slug: 'may-xay-sinh-to-2',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-ep-trai-cay-2', 
    name: 'Máy ép trái cây',
    parent_id: 'dien-gia-dung',
    slug: 'may-ep-trai-cay-2', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'quat-dieu-hoa-3', 
    name: 'Quạt điều hòa',
    parent_id: 'dien-gia-dung',
    slug: 'quat-dieu-hoa-3', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-xay-sinh-to-3', 
    name: 'Máy xay sinh tố',
    parent_id: 'dien-gia-dung',
    slug: 'may-xay-sinh-to-3', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-ep-trai-cay-3', 
    name: 'Máy ép trái cây',
    parent_id: 'dien-gia-dung',
    slug: 'may-ep-trai-cay-3',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'quat-dieu-hoa-4',
    name: 'Quạt điều hòa',
    parent_id: 'dien-gia-dung',
    slug: 'quat-dieu-hoa-4',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-xay-sinh-to-4', 
    name: 'Máy xay sinh tố',
    parent_id: 'dien-gia-dung',
    slug: 'may-xay-sinh-to-4', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-ep-trai-cay-4',
    name: 'Máy ép trái cây',
    parent_id: 'dien-gia-dung',
    slug: 'may-ep-trai-cay-4', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-loc-nuoc', 
    name: 'Máy lọc nước',
    parent_id: 'dien-gia-dung',
    slug: 'may-loc-nuoc',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'noi-com-dien', 
    name: 'Nồi cơm điện',
    parent_id: 'dien-gia-dung',
    slug: 'noi-com-dien',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'bep-dien',
    name: 'Bếp điện các loại',
    parent_id: 'dien-gia-dung',
    slug: 'bep-dien',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-hut-bui-01',
    name: 'Máy hút bụi A',
    parent_id: 'dien-gia-dung',
    slug: 'may-hut-bui-a', 
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-hut-bui-02', 
    name: 'Máy hút bụi B',
    parent_id: 'dien-gia-dung',
    slug: 'may-hut-bui-b',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-hut-bui-03', 
    name: 'Máy hút bụi C',
    parent_id: 'dien-gia-dung',
    slug: 'may-hut-bui-c',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  }
,
  {
    id: 'may-cu-item-1',
    name: 'Máy cũ loại X',
    parent_id: 'may-cu', 
    slug: 'may-cu-loai-x',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'may-cu-item-2',
    name: 'Máy cũ loại Y',
    parent_id: 'may-cu',
    slug: 'may-cu-loai-y',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'sac-du-phong-pk', 
    name: 'Sạc dự phòng',
    parent_id: 'phu-kien',
    slug: 'sac-du-phong',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  },
  {
    id: 'tai-nghe-pk',
    name: 'Tai nghe',
    parent_id: 'phu-kien',
    slug: 'tai-nghe',
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/265390/265390-600x600.jpg'
  }
];

const sampleNotifications = [
  { id: 'notif1', type: 'order_shipped', title: 'Đơn hàng WN0301700710 vừa được giao thành công.', message: 'Cảm ơn bạn đã đặt hàng tại CellphoneS.', timestamp: '1 năm trước', link: '#order-detail-1', isRead: false },
  { id: 'notif2', type: 'order_confirmed', title: 'Đơn hàng WN0301700710 đã được cửa hàng xác nhận và sẽ giao tới bạn trong thời gian sớm nhất.', timestamp: '1 năm trước', link: '#order-detail-1', isRead: true },
  { id: 'notif3', type: 'promotion', title: 'Flash Sale cuối tháng! Giảm đến 50%++ cho hàng loạt iPhone, iPad.', timestamp: '2 ngày trước', link: '#promotion-link', isRead: false },
  // ... (các notifications khác đã được lược bỏ cho ngắn gọn)
];

const Header = () => {
  const navigate = useNavigate();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuTimerRef = useRef(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [topLevelDesktopCategories, setTopLevelDesktopCategories] = useState([]);
  const [mobileCategoryTree, setMobileCategoryTree] = useState([]);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const notificationDropdownTimerRef = useRef(null);
  const notificationButtonRef = useRef(null);

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
    if (isLoginPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoginPopupOpen]);

  const handleNotificationToggle = () => {
    setIsNotificationDropdownOpen((prev) => !prev);
  };

  const handleNotificationEnter = () => {
    clearTimeout(notificationDropdownTimerRef.current);
    setIsNotificationDropdownOpen(true);
  };

  const handleNotificationLeave = () => {
    notificationDropdownTimerRef.current = setTimeout(() => {
      setIsNotificationDropdownOpen(false);
    }, 300);
  };

  useEffect(() => {
    setTopLevelDesktopCategories(flatCategoriesFromAPI.filter((cat) => cat.parent_id === null));
    setMobileCategoryTree(buildCategoryTree(flatCategoriesFromAPI));
  }, []);

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

  return (
    <>
      <header className="bg-primary-gradient text-white w-full shadow-md z-30 relative">
        {/* Mobile & Tablet View */}
        <div className="lg:hidden">
          <div className="flex justify-center items-center pt-2.5 pb-1.5 px-4">
            <Link to="/">
              {/* BƯỚC 2: Sử dụng biến logoSrc đã import cho logo ở Mobile View */}
              <img src={logoSrc} alt="Logo" className="h-15 w-auto max-w-[400px]" />
            </Link>
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
                <button className="flex items-center justify-center w-[28px] h-[28px] hover-secondary bg-primary rounded-full transition ml-1 flex-shrink-0">
                  <Search style={{ color: 'var(--text-primary)' }} strokeWidth={2.5} className="w-4 h-4" />
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
          <div className="flex justify-between items-center max-w-screen-xl h-[80px] mx-auto py-2 px-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link to="/">
              
                <img src={logoSrc} alt="Logo" className="h-18 w-auto max-w-[700px]" /> 
              
              </Link>
                  <div
                className="relative" 
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button" 
                  className={`flex items-center gap-2 px-3 py-2.5 transition-all duration-150 ease-in-out
                    ${
                      isCategoryMenuOpen
                        ? 'bg-white text-primary rounded-t-lg shadow-md pb-4' 
                        : 'bg-white/20 hover:bg-white/30 text-white rounded-lg' 
                    }`}
                >
                  <LayoutGrid className={`w-5 h-5 stroke-[1.8px] ${isCategoryMenuOpen ? 'text-primary' : 'text-white'}`} />
                  <span className={`text-sm font-semibold ${isCategoryMenuOpen ? 'text-primary' : 'text-white'}`}>
                    Danh mục
                  </span>
                </button>
                <CategoryMenu
                  topLevelCategories={topLevelDesktopCategories}
                  allCategories={flatCategoriesFromAPI}
                  isOpen={isCategoryMenuOpen}
                />
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className="relative flex items-center bg-white text-gray-600 px-3 h-[40px] rounded-full w-full max-w-[600px] mx-auto shadow-sm">
                <input
                  type="text"
                  placeholder="Siêu phẩm Samsung Galaxy S25"
                  className="flex-1 text-sm outline-none bg-transparent pr-10"
                />
                <button className="absolute right-[4px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[36px] h-[36px] rounded-full bg-primary transition hover-secondary">
                  <Search style={{ color: 'var(--text-primary)' }} strokeWidth={2} className="w-5 h-5 transition-all" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ">
              <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover-primary transition-all">
                <FileSearch className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                <span className="text-white text-[11px] font-semibold leading-tight text-center">Tra cứu đơn hàng</span>
              </button>
              <div
                className="relative"
                onMouseEnter={handleNotificationEnter}
                onMouseLeave={handleNotificationLeave}
                ref={notificationButtonRef}
              >
                <button
                  className="flex flex-col items-center justify-center p-2 rounded-lg hover-primary transition-all text-center w-[70px] h-[56px]"
                  onClick={handleNotificationToggle}
                  aria-haspopup="true"
                  aria-expanded={isNotificationDropdownOpen}
                >
                  <Bell className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                  <span className="text-white text-[10px] font-medium leading-tight mt-1">Thông báo</span>
                </button>
                {isNotificationDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg z-50 transition-transform duration-200 ease-in-out"
                  >
                    <NotificationDropdown
                      isOpen={isNotificationDropdownOpen}
                      notifications={sampleNotifications}
                      onClose={() => setIsNotificationDropdownOpen(false)}
                    />
                  </div>
                )}
              </div>
              <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover-primary transition-all">
                <ShoppingCart className="w-6 h-6" strokeWidth={1.8} color="#fff" />
                <span className="text-white text-[11px] font-semibold leading-tight text-center">Giỏ hàng</span>
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover-primary bg-white/40 transition"
                onClick={toggleLoginPopup}
              >
                <CircleUserRound className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                <span className="text-sm font-semibold">Tài khoản</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Overlay isOpen={isMobilePanelOpen} onClick={toggleMobilePanel} />
      <MobileCategoryPanel
        isOpen={isMobilePanelOpen}
        onClose={toggleMobilePanel}
        categories={mobileCategoryTree} 
      />
      <PopupModal
        isOpen={isLoginPopupOpen}
        onClose={toggleLoginPopup}
      />
    </>
  );
};

export default Header;
