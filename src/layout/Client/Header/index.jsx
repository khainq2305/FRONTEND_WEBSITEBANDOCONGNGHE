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
import { authService } from 'services/client/authService';
import logoSrc from '../../../assets/Client/images/Logo/logo.svg';
import { categoryService } from '../../../services/client/categoryService';
import { notificationService } from '../../../services/client/notificationService';
import Loader from '../../../components/common/Loader'; // <-- 1. IMPORT LOADER VÀO ĐÂY

import FeatureBar from './FeatureBar'; 



const Header = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [flatCategoriesFromAPI, setFlatCategoriesFromAPI] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;
const [isSticky, setIsSticky] = useState(false);
    // Ref để tham chiếu đến "con mắt" theo dõi
    const sentinelRef = useRef(null);
        const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const accountDropdownTimerRef = useRef(null);
  const handleAccountDropdownEnter = () => {
    clearTimeout(accountDropdownTimerRef.current);
    setIsDropdownOpen(true);
  };
  const handleAccountDropdownLeave = () => {
    accountDropdownTimerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getForUser();
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Lỗi lấy thông báo:', err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const res = await import('services/client/cartService').then(m => m.cartService.getCart());
        const items = res.data?.cartItems || [];
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalQuantity);
      } catch (err) {
        console.error('Lỗi khi lấy giỏ hàng:', err);
      }
    };

    fetchCartItemCount();
  }, []);
// Thay thế cho useEffect cũ trong file Header.jsx

 // Đoạn mã cũ cần được THAY THẾ HOÀN TOÀN

useEffect(() => {
        const fetchCombinedCategories = async () => {
            try {
                // Không cần log ở đây nữa
                const response = await categoryService.getCombinedMenu();
                const combinedNested = response.data || [];
                //... (logic flattenAndStandardize và buildCategoryTree giữ nguyên)
                const flattenAndStandardize = (items, parentId = null) => {
                    return items.flatMap(item => {
                        const standardizedItem = { id: item.id, name: item.name, slug: item.slug, parent_id: parentId, thumbnail: item.thumbnail, type: item.type };
                        const children = item.children ? flattenAndStandardize(item.children, item.id) : [];
                        return [standardizedItem, ...children];
                    });
                };

                const flatList = flattenAndStandardize(combinedNested);
                setFlatCategoriesFromAPI(flatList);
                setTopLevelDesktopCategories(flatList.filter(c => c.parent_id === null));
                setMobileCategoryTree(buildCategoryTree(flatList));

            } catch (err) {
                console.error('Lỗi lấy danh mục tổng hợp:', err);
            } finally {
                setIsCategoriesLoading(false); // Kết thúc loading
            }
        };

        const initialFetch = async () => {
            setIsCategoriesLoading(true); // Bật loading
            await fetchCombinedCategories(); // Chờ fetch xong
        };

        initialFetch(); // Gọi lần đầu

        const intervalId = setInterval(fetchCombinedCategories, 300000);
        return () => clearInterval(intervalId);
    }, []);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getUserInfo();
        const user = response.data?.user || {};
        setUserInfo({
          fullName: user.fullName || '',
          avatarUrl: user.avatarUrl || null,
        });
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
        setUserInfo(null);

      }
    };
    fetchUserInfo();
  }, []);

  const getDisplayName = (fullName, maxLength = 8) => {
    if (!fullName) return '';
    const nameParts = fullName.split(" ");
    const lastName = nameParts[nameParts.length - 1];

    if (lastName.length > maxLength) {
      return `${lastName.substring(0, maxLength)}...`;
    }
    return lastName;
  };
  useEffect(() => {
    const handleAvatarUpdate = (event) => {
      setUserInfo((prev) => ({
        ...prev,
        avatarUrl: event.detail || null,
      }));
    };

    const handleProfileUpdate = (event) => {
      const updatedUser = event.detail?.user || {};
      setUserInfo((prev) => ({
        ...prev,
        fullName: updatedUser.fullName || prev.fullName,
        email: updatedUser.email || prev.email
      }));
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);



  const handleLogout = async () => {
    try {

      await authService.logout();


      localStorage.removeItem("token");
      sessionStorage.removeItem("token");


      setUserInfo(null);
      setIsDropdownOpen(false);


      navigate("/dang-nhap");
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);


      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      setUserInfo(null);
      setIsDropdownOpen(false);
      navigate("/dang-nhap");
    }
  };




  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

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
  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsSticky(!entry.isIntersecting);
    },
    { root: null, threshold: 0 }
  );

  if (sentinelRef.current) {
    observer.observe(sentinelRef.current);
  }

  return () => {
    if (sentinelRef.current) {
      observer.unobserve(sentinelRef.current);
    }
  };
}, []);
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsSticky(!entry.isIntersecting);
    },
    { root: null, threshold: 0 }
  );

  if (sentinelRef.current) {
    observer.observe(sentinelRef.current);
  }

  return () => {
    if (sentinelRef.current) {
      observer.unobserve(sentinelRef.current);
    }
  };
}, []);

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
   {isCategoriesLoading && <Loader fullscreen={true} />}
   <div ref={sentinelRef} style={{ height: '1px', position: 'absolute', top: '0' }}></div>
        {/* DIV WRAPPER: Đây là cái "khay" làm nhiệm vụ dính lại.
          Nó không có màu nền. Nó chứa cả Header và FeatureBar.
        */}
        <div className="sticky top-0 z-30 ">

            {/* 1. HEADER: Nền xanh, không còn sticky */}
            <header className="bg-primary-gradient text-white w-full relative">
                
                {/* Mobile & Tablet View */}
                <div className="lg:hidden">
                    <div className="flex justify-center items-center pt-2.5 pb-1.5 px-4">
                        <Link to="/">
                            <img src={logoSrc} alt="Logo" className="h-15 w-auto max-w-[400px]" />
                        </Link>
                    </div>
                    <div className="flex items-center gap-x-2 px-3 pb-2.5 pt-0">
                        <button className="p-1 text-white flex-shrink-0 -ml-1" onClick={toggleMobilePanel} aria-label="Mở danh mục">
                            <LayoutGrid className="w-6 h-6" strokeWidth={2} />
                        </button>
                        <div className="flex-grow mx-1">
                            <div className="flex items-center bg-white text-gray-600 pl-3 pr-1 py-1 h-[36px] rounded-lg w-full shadow-sm">
                                <input type="text" placeholder="Tìm kiếm..." className="flex-1 text-[13px] outline-none bg-transparent placeholder-gray-400" />
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
                    <div className="flex justify-between items-center max-w-[1200px] h-[80px] mx-auto py-2 px-4">
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <Link to="/">
                                <img src={logoSrc} alt="Logo" className="h-18 w-auto max-w-[700px]" />
                            </Link>
                            <div className="relative" onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
                                <button
                                    type="button"
                                    className={`flex items-center gap-2 px-3 py-2.5 transition-all duration-150 ease-in-out ${isCategoryMenuOpen ? 'bg-white text-primary rounded-t-lg shadow-md pb-4' : 'bg-white/20 hover:bg-white/30 text-white rounded-lg'}`}
                                >
                                    <LayoutGrid className={`w-5 h-5 stroke-[1.8px] ${isCategoryMenuOpen ? 'text-primary' : 'text-white'}`} />
                                    <span className={`text-sm font-semibold ${isCategoryMenuOpen ? 'text-primary' : 'text-white'}`}>Danh mục</span>
                                </button>
                                <CategoryMenu topLevelCategories={topLevelDesktopCategories} allCategories={flatCategoriesFromAPI} isOpen={isCategoryMenuOpen} />
                            </div>
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="relative flex items-center bg-white text-gray-600 px-3 h-[40px] rounded-full w-full max-w-[600px] mx-auto shadow-sm">
                                <input type="text" placeholder="Siêu phẩm Samsung Galaxy S25" className="flex-1 text-sm outline-none bg-transparent pr-10" />
                                <button className="absolute right-[4px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[36px] h-[36px] rounded-full bg-primary transition hover-secondary">
                                    <Search style={{ color: 'var(--text-primary)' }} strokeWidth={2} className="w-5 h-5 transition-all" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover-primary transition-all">
                                <FileSearch className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                                <span className="text-white text-[11px] font-semibold leading-tight text-center">Tra cứu đơn hàng</span>
                            </button>
                            <div className="relative" onMouseEnter={handleNotificationEnter} onMouseLeave={handleNotificationLeave} ref={notificationButtonRef}>
                                <button className="flex flex-col items-center justify-center p-2 rounded-lg hover-primary transition-all text-center w-[70px] h-[56px]" onClick={handleNotificationToggle}>
                                    <Bell className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                                    <span className="text-white text-[10px] font-medium leading-tight mt-1">Thông báo</span>
                                </button>
                                {isNotificationDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg z-50 transition-transform duration-200 ease-in-out">
                                        <NotificationDropdown isOpen={isNotificationDropdownOpen} notifications={notifications} setNotifications={setNotifications} onClose={() => setIsNotificationDropdownOpen(false)} />
                                    </div>
                                )}
                            </div>
                            <Link to="/cart" className="relative flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover-primary transition-all">
                                <div className="relative">
                                    <ShoppingCart className="w-6 h-6" strokeWidth={1.8} color="#fff" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">{cartItemCount}</span>
                                    )}
                                </div>
                                <span className="text-white text-[11px] font-semibold leading-tight text-center">Giỏ hàng</span>
                            </Link>
                            <div className="hidden lg:block relative" onMouseEnter={handleAccountDropdownEnter} onMouseLeave={handleAccountDropdownLeave}>
                                {userInfo ? (
                                    <div className="flex items-center gap-2 cursor-pointer p-2 bg-primary rounded-lg transition-colors duration-150">
                                        {userInfo?.avatarUrl ? (
                                            <img src={userInfo.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                        ) : userInfo?.fullName ? (
                                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">{userInfo.fullName.charAt(0).toUpperCase()}</div>
                                        ) : (
                                            <CircleUserRound className="w-8 h-8 text-white" strokeWidth={1.5} />
                                        )}
                                        <span className="text-sm font-semibold">{userInfo?.fullName ? getDisplayName(userInfo.fullName) : 'Tài khoản'}</span>
                                    </div>
                                ) : (
                                    <button onClick={toggleLoginPopup} className="flex items-center gap-2 px-3 py-2 rounded-lg hover-primary bg-white/40 transition">
                                        <CircleUserRound className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                                        <span className="text-sm font-semibold">Tài khoản</span>
                                    </button>
                                )}
                                {isDropdownOpen && userInfo && (
                                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-38 bg-white rounded-md shadow-xl z-50 text-gray-800 text-sm" onMouseEnter={handleAccountDropdownEnter} onMouseLeave={handleAccountDropdownLeave}>
                                        <div className="absolute -top-2 right-5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>
                                        <ul className="py-1">
                                            <li><Link to="/user-profile" className="block px-4 py-2.5 text-gray-700 hover-primary hover:text-white transition-colors duration-150">Tài Khoản Của Tôi</Link></li>
                                            <li><Link to="/don-mua" className="block px-4 py-2.5 text-primary-focus hover-primary hover:text-white transition-colors duration-150">Đơn Mua</Link></li>
                                            <li><button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-gray-700 hover-primary hover:text-white transition-colors duration-150">Đăng Xuất</button></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>


{/* Truyền state isSticky vào FeatureBar qua prop */}
                <FeatureBar isSticky={isSticky} />
        </div>

        {/* Các component Overlay và Panel vẫn nằm ngoài như cũ */}
        <Overlay isOpen={isMobilePanelOpen} onClick={toggleMobilePanel} />
        <MobileCategoryPanel isOpen={isMobilePanelOpen} onClose={toggleMobilePanel} categories={mobileCategoryTree} />
        <PopupModal isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} />
    </>
  );
};

export default Header;
