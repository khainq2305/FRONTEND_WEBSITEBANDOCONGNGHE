import React, { useState, useRef, useEffect } from 'react';
import { Menu, ShoppingCart, Search, Bell, LayoutGrid, CircleUserRound, FileSearch, X } from 'lucide-react';
import CategoryMenu from './CategoryMenu';
import MobileCategoryPanel from './MobileCategoryPanel';
import Overlay from './Overlay';
import { useNavigate, Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import PopupModal from './PopupModal';
import { authService } from 'services/client/authService';
import { categoryService } from '../../../services/client/categoryService';
import { notificationService } from '../../../services/client/notificationService';
import Loader from '../../../components/common/Loader';
import { useSystemSetting } from '@/contexts/SystemSettingContext';
import FeatureBar from './FeatureBar';
import socket from '../../../constants/socket'; 
import ImageSearchBox from '@/components/common/ImageSearchBox';
import useAuthStore from '../../../stores/AuthStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const userInfo = user
    ? {
        fullName: user.fullName || '',
        avatarUrl: user.avatarUrl || null
      }
    : null;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [flatCategoriesFromAPI, setFlatCategoriesFromAPI] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [isSticky, setIsSticky] = useState(false);
  const { settings } = useSystemSetting() || {};
  const logoSrc = settings?.siteLogo || '/default-logo.png';

  const sentinelRef = useRef(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const accountDropdownTimerRef = useRef(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isConfirmLogoutModalOpen, setIsConfirmLogoutModalOpen] = useState(false); // <-- THÊM DÒNG NÀY

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
        if (err.response?.status === 401) {
          setNotifications([]);
        } else {
          console.error('Lỗi lấy thông báo:', err);
          setNotifications([]);
        }
      }
    };

    fetchNotifications();
  }, []);

  const fetchCartItemCount = async () => {
    try {
      const res = await import('services/client/cartService').then((m) => m.cartService.getCart());
      const items = res.data?.cartItems || [];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalQuantity);
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
    }
  };
  useEffect(() => {
    fetchCartItemCount();
  }, []);
  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartItemCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, []);
  useEffect(() => {
    socket.on('new-client-notification', (newNoti) => {
      setNotifications((prev) => [newNoti, ...prev]);
    });

    return () => {
      socket.off('new-client-notification');
    };
  }, []);
  useEffect(() => {
    const fetchCombinedCategories = async () => {
      try {
        const response = await categoryService.getCombinedMenu();
        const combinedNested = response.data || [];

        const flattenAndStandardize = (items, parentId = null) => {
          return items.flatMap((item) => {
            const standardizedItem = {
              id: item.id,
              name: item.name,

              slug: item.slug,
              parent_id: parentId,
              imageUrl: item.thumbnail,
              thumbnail: item.thumbnail,
              type: item.type
            };
            const children = item.children ? flattenAndStandardize(item.children, item.id) : [];
            return [standardizedItem, ...children];
          });
        };

        const flatList = flattenAndStandardize(combinedNested);
        setFlatCategoriesFromAPI(flatList);
        setTopLevelDesktopCategories(flatList.filter((c) => c.parent_id === null));
        setMobileCategoryTree(buildCategoryTree(flatList));
      } catch (err) {
        console.error('Lỗi lấy danh mục tổng hợp:', err);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    const initialFetch = async () => {
      setIsCategoriesLoading(true);
      await fetchCombinedCategories();
    };

    initialFetch();

    const intervalId = setInterval(fetchCombinedCategories, 300000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getUserInfo();
        const user = response.data?.user || {};
        useAuthStore.getState().login(user);
      } catch (err) {
        console.error('Lỗi lấy thông tin người dùng:', err);
      }
    };
    fetchUserInfo();
  }, []);

  const getDisplayName = (fullName, maxLength = 8) => {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
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
        avatarUrl: event.detail || null
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

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const toggleConfirmLogoutModal = () => {
    setIsConfirmLogoutModalOpen(!isConfirmLogoutModalOpen);
  };

  const handleLogout = async () => {
    setIsConfirmLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    toggleConfirmLogoutModal();
    await logout();
    navigate('/');
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
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

  const handleMenuEnter = () => {
    clearTimeout(categoryMenuTimerRef.current);
    setIsCategoryMenuOpen(true);
  };

  const handleMenuLeave = () => {
    categoryMenuTimerRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 200);
  };

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
    if (isLoginPopupOpen || isMobilePanelOpen || isNotificationModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoginPopupOpen, isMobilePanelOpen, isNotificationModalOpen]);

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

  const toggleMobilePanel = () => {
    setIsMobilePanelOpen(!isMobilePanelOpen);
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  return (
    <>
      {isCategoriesLoading && <Loader fullscreen={true} />}
      <div ref={sentinelRef} style={{ height: '1px', position: 'absolute', top: '0' }}></div>

      <div className="sticky top-0 z-30 ">
        <header className="bg-primary-gradient text-white w-full relative">
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
                <button className="p-1 text-white relative" onClick={toggleNotificationModal}>
                  <Bell className="w-6 h-6" strokeWidth={1.8} />
                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute -top-1.5 -right-0.5 bg-red-600 text-white text-xs
                        w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md
                      "
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block relative">
            <div className="flex justify-between items-center max-w-[1200px] h-[80px] mx-auto py-2">
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
                  <div className="absolute z-[9999] left-0 top-full">
                    <CategoryMenu
                      topLevelCategories={topLevelDesktopCategories}
                      allCategories={flatCategoriesFromAPI}
                      isOpen={isCategoryMenuOpen}
                    />
                  </div>
                </div>
              </div>
              <ImageSearchBox />
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link to="orderlookup">
                  <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover-primary transition-all">
                    <FileSearch className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                    <span className="text-white text-[11px] font-semibold leading-tight text-center">Tra cứu đơn hàng</span>
                  </button>
                </Link>
                <div
                  className="relative"
                  onMouseEnter={handleNotificationEnter}
                  onMouseLeave={handleNotificationLeave}
                  ref={notificationButtonRef}
                >
                  <button
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover-primary transition-all text-center w-[70px] h-[56px]"
                    onClick={handleNotificationToggle}
                  >
                    <span className="relative">
                      <Bell className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                      {unreadCount > 0 && (
                        <span
                          className="
                            absolute -top-1.5 -right-2 bg-red-600 text-white text-xs
                            w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md
                          "
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </span>

                    <span className="text-white text-[10px] font-medium leading-tight mt-1">Thông báo</span>
                  </button>

                  {isNotificationDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg z-50 transition-transform duration-200 ease-in-out">
                      <NotificationDropdown
                        isOpen={isNotificationDropdownOpen}
                        notifications={notifications}
                        setNotifications={setNotifications}
                        userInfo={userInfo}
                        onClose={() => setIsNotificationDropdownOpen(false)}
                      />
                    </div>
                  )}
                </div>

                <Link to="/cart" className="relative flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover-primary transition-all">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" strokeWidth={1.8} color="#fff" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-white text-[11px] font-semibold leading-tight text-center">Giỏ hàng</span>
                </Link>
                <div
                  className="hidden lg:block relative"
                  onMouseEnter={handleAccountDropdownEnter}
                  onMouseLeave={handleAccountDropdownLeave}
                >
                  {userInfo ? (
                    <div className="flex items-center gap-2 cursor-pointer p-2 bg-primary rounded-lg transition-colors duration-150">
                      {userInfo?.avatarUrl ? (
                        <img src={userInfo.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                      ) : userInfo?.fullName ? (
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                          {userInfo.fullName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <CircleUserRound className="w-8 h-8 text-white" strokeWidth={1.5} />
                      )}
                      <span className="text-sm font-semibold">{userInfo?.fullName ? getDisplayName(userInfo.fullName) : 'Tài khoản'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={toggleLoginPopup}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover-primary bg-white/40 transition"
                    >
                      <CircleUserRound className="w-6 h-6" strokeWidth={1.5} color="#fff" />
                      <span className="text-sm font-semibold">Tài khoản</span>
                    </button>
                  )}
                  {isDropdownOpen && userInfo && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-38 bg-white rounded-md shadow-xl z-50 text-gray-800 text-sm"
                      onMouseEnter={handleAccountDropdownEnter}
                      onMouseLeave={handleAccountDropdownLeave}
                    >
                      <div className="absolute -top-2 right-5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>
                      <ul className="py-1">
                        <li>
                          <Link
                            to="/user-profile"
                            className="block px-4 py-2.5 text-gray-700 hover-primary hover:text-white transition-colors duration-150"
                          >
                            Tài Khoản Của Tôi
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/user-profile#quan-ly-don-hang"
                            className="block px-4 py-2.5 text-primary-focus hover-primary hover:text-white transition-colors duration-150"
                          >
                            Đơn Mua
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2.5 text-gray-700 hover-primary hover:text-white transition-colors duration-150"
                          >
                            Đăng Xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <FeatureBar isSticky={isSticky} />
      </div>

      <Overlay isOpen={isMobilePanelOpen} onClick={toggleMobilePanel} />
      <MobileCategoryPanel isOpen={isMobilePanelOpen} onClose={toggleMobilePanel} categories={mobileCategoryTree} />
      <PopupModal isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} />

      {isNotificationModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-800">Thông báo của bạn</h2>
              <button onClick={toggleNotificationModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              <NotificationDropdown
                isOpen={isNotificationModalOpen}
                notifications={notifications}
                setNotifications={setNotifications}
                userInfo={userInfo}
                onClose={toggleNotificationModal}
              />
            </div>
          </div>
        </div>
      )}
      {isConfirmLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[1000]" onClick={toggleConfirmLogoutModal}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative flex flex-col p-8 md:p-10 text-center animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleConfirmLogoutModal}
              className="absolute -top-4 -right-4 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
              aria-label="Đóng"
            >
              <X size={20} strokeWidth={2} />
            </button>

            <div className="mb-4">
              <CircleUserRound size={48} className="text-gray-500 mx-auto" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Xác nhận đăng xuất</h2>

            <p className="text-base text-gray-700 mb-8 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không? Tất cả các phiên làm việc hiện tại sẽ bị chấm dứt.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={toggleConfirmLogoutModal}
                // ✅ Nút Hủy bỏ: Hover nền xám, viền xám, chữ giữ màu xám đậm
                className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium text-lg
                               hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 ease-in-out"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmLogout}
                // ✅ Nút Đăng xuất: Hover opacity 90
                className="flex-1 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-lg
                               hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
