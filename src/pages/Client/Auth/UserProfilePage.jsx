import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, ShoppingBag, MapPin, Eye, Ticket, Heart, ChevronDown, X } from 'lucide-react';
import { Wallet2 } from 'lucide-react';

import { Outlet, useParams, useNavigate } from 'react-router-dom';
import ProfileContent from './ProfileContent';
import RenderDonMuaContentTuyChinh from './PurchaseHistoryPage';
import AddressPageContent from './RenderDiaChiContent';
import { authService } from '../../../services/client/authService';
import FavoriteProductsPage from './FavoriteProductsPage';
import ChangePasswordTab from './ChangePasswordTab';
import Breadcrumb from '../../../components/common/Breadcrumb';
import RewardPage from './RewardPage';
import MembershipPage from './MembershipPage';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
import { rewardPointService } from '../../../services/client/rewardPointService';
import { walletService } from '../../../services/client/walletService';

import InternalWalletPage from './InternalWalletPage';
const formatPoint = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const hashTab = window.location.hash.replace('#', '');
    const savedTab = localStorage.getItem('activeTab');
    return hashTab || savedTab || 'thong-tin-tai-khoan';
  });
  const [walletBalance, setWalletBalance] = useState(null);

  const [sidebarUserInfo, setSidebarUserInfo] = useState({
    initial: '?',
    displayName: 'Đang tải...',
    email: 'Đang tải...',
    avatarUrl: null
  });
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { orderCode, id, returnCode } = useParams();
  const [totalPoints, setTotalPoints] = useState(null);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const fetchSidebarUserInfo = async () => {
      setIsSidebarLoading(true);
      try {
        const response = await authService.getUserInfo();
        if (response && response.data && response.data.user) {
          const apiUser = response.data.user;
          let finalAvatarUrl = null;
          if (apiUser.avatarUrl) {
            if (apiUser.avatarUrl.startsWith('http://') || apiUser.avatarUrl.startsWith('https://')) {
              finalAvatarUrl = `${apiUser.avatarUrl}?_=${new Date().getTime()}`;
            } else {
              const cleanedApiBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
              const cleanedAvatarUrlPath = apiUser.avatarUrl.startsWith('/') ? apiUser.avatarUrl.substring(1) : apiUser.avatarUrl;
              finalAvatarUrl = `${cleanedApiBaseUrl}${cleanedAvatarUrlPath}?_=${new Date().getTime()}`;
            }
          }

          setSidebarUserInfo({
            fullName: apiUser.fullName || '',
            initial: apiUser.fullName
              ? apiUser.fullName.charAt(0).toUpperCase()
              : apiUser.email
                ? apiUser.email.charAt(0).toUpperCase()
                : '?',
            displayName: apiUser.fullName || apiUser.email || 'Tài khoản',
            email: apiUser.email || 'Không có email',
            avatarUrl: finalAvatarUrl
          });
        } else {
          console.error('Lỗi fetch thông tin cho sidebar: Dữ liệu user không hợp lệ.', response);
          setSidebarUserInfo({
            initial: '!',
            displayName: 'Lỗi dữ liệu',
            email: 'Lỗi tải email',
            avatarUrl: null
          });
        }
      } catch (error) {
        console.error('Lỗi fetch thông tin cho sidebar (catch):', error);
        setSidebarUserInfo({
          initial: '!',
          displayName: 'Lỗi tải',
          email: 'Lỗi tải email',
          avatarUrl: null
        });
      } finally {
        setIsSidebarLoading(false);
      }
    };
    fetchSidebarUserInfo();
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const tabFromHash = window.location.hash.replace('#', '');

      setActiveTab(tabFromHash || 'thong-tin-tai-khoan');
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  useEffect(() => {
    rewardPointService.getTotalPoints()
      .then((res) => {
        setTotalPoints(res?.data?.totalPoints || 0);
      })
      .catch((err) => {
        console.error('Lỗi lấy điểm thưởng:', err);
        setTotalPoints(0);
      });


  }, []);
  useEffect(() => {
    const handleAvatarUpdate = (event) => {
      const newAvatarUrl = event.detail;
      setSidebarUserInfo((prev) => ({
        ...prev,
        avatarUrl: newAvatarUrl,
        initial: newAvatarUrl ? prev.displayName.charAt(0).toUpperCase() || '?' : prev.displayName.charAt(0).toUpperCase() || '?'
      }));
    };

    const handleProfileUpdate = (event) => {
      const updatedUserFromEvent = event.detail.user;
      if (updatedUserFromEvent) {
        setSidebarUserInfo((prev) => ({
          ...prev,
          displayName: updatedUserFromEvent.fullName || prev.displayName,
          email: updatedUserFromEvent.email || prev.email,
          initial: updatedUserFromEvent.fullName ? updatedUserFromEvent.fullName.charAt(0).toUpperCase() : prev.initial
        }));
      }
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);
  useEffect(() => {
    walletService.getBalance()
      .then((res) => {
        setWalletBalance(res?.data?.balance ?? 0);
      })
      .catch((err) => {
        console.error('Lỗi lấy số dư ví:', err);
        setWalletBalance(0);
      });
  }, []);
  const handleTabClick = (tabId) => {
    localStorage.setItem('activeTab', tabId);

    if (tabId === 'san-pham-da-xem') {
      navigate('/san-pham-da-xem');
    } else {
      setActiveTab(tabId);
      if (orderCode) {
        navigate(`/user-profile#${tabId}`, { replace: true });
      } else {
        window.location.hash = tabId;
      }
    }
    setIsDropdownOpen(false);
  };

  const sidebarNavItems = [

    { id: 'quan-ly-don-hang', label: 'Quản lý đơn hàng', icon: ShoppingBag, href: '#quan-ly-don-hang' },
    { id: 'so-dia-chi', label: 'Sổ địa chỉ', icon: MapPin, href: '#so-dia-chi' },
    { id: 'khach-hang-than-thiet', label: 'Khách hàng thân thiết', icon: Ticket, href: '#khach-hang-than-thiet' },
    { id: 'diem-thuong', label: 'Điểm thưởng', icon: Ticket, href: '#diem-thuong' },
    {
      id: 'vi-noi-bo',
      label: 'Ví nội bộ',
      icon: Wallet2,
      href: '#vi-noi-bo'
    }
    ,

    { id: 'san-pham-da-xem', label: 'Sản phẩm đã xem', icon: Eye, href: '/san-pham-da-xem' },
    { id: 'san-pham-yeu-thich', label: 'Sản phẩm yêu thích', icon: Heart, href: '#san-pham-yeu-thich' },
    { id: 'doi-mat-khau', label: 'Đổi mật khẩu', icon: Eye, href: '#doi-mat-khau' }
  ];

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    {
      label: sidebarNavItems.find((item) => item.id === activeTab)?.label || 'Tài khoản',

      href: activeTab === 'san-pham-da-xem' ? '/san-pham-da-xem' : window.location.hash || '#thong-tin-tai-khoan'
    }
  ];

  const DesktopSidebar = () => {
    const HEADER_HEIGHT_PX = 64;

    return (
      <div
        className={`w-[250px] flex-shrink-0 dark:border-gray-700 h-screen overflow-y-auto sticky top-[${HEADER_HEIGHT_PX}px] dark:bg-gray-850 hidden lg:block`}
      >
        <div className="pb-4">
          <div className="bg-white rounded-lg p-2 mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-2.5 flex-shrink-0 overflow-hidden">
                {sidebarUserInfo.avatarUrl ? (
                  <img src={sidebarUserInfo.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white text-xl font-semibold">{isSidebarLoading ? '...' : sidebarUserInfo.initial}</span>
                )}
              </div>

              <div className="flex flex-col flex-1 overflow-hidden pr-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Tài khoản của</p>
                <p className="font-medium text-base text-gray-900 dark:text-gray-100 truncate">
                  {isSidebarLoading ? 'Đang tải...' : sidebarUserInfo.fullName || '---'}
                </p>
                <button
                  onClick={() => handleTabClick('thong-tin-tai-khoan')}
                  className="text-xs text-blue-600 font-medium hover:underline text-left mt-1"
                >
                  Xem hồ sơ
                </button>
              </div>
            </div>

            {totalPoints !== null && (
              <div className="mt-3 bg-[#EFF6FF] rounded-md p-3 flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-600">Điểm thưởng của bạn</p>
                  <p className="text-base font-semibold text-primary flex items-center gap-1 mt-0.5">
                    {formatPoint(totalPoints)}
                    <img
                      src="src/assets/Client/images/xudiem.png"
                      alt="coin"
                      className="w-4 h-4 object-contain"
                    />
                  </p>
                  <a
                    href="/diem-thuong/the-le"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Xem thể lệ
                  </a>
                </div>


                <img
                  src="src/assets/Client/images/NENDIEM.png"
                  alt="coin banner"
                  className="w-20 h-20 object-cover ml-3 select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            )}

          </div>

          <nav className="bg-white rounded-lg shadow-sm my-2 py-2">

            <ul>
              {sidebarNavItems.map((item) => {
                const itemIsActive = activeTab === item.id;
                const isViewedProductsActive =
                  item.id === 'san-pham-da-xem' && window.location.pathname === '/san-pham-da-xem';
                const currentIconColor =
                  itemIsActive || isViewedProductsActive
                    ? 'text-primary'
                    : item.iconColor || 'text-gray-600 dark:text-gray-400';

                return (
                  <li key={item.id} className={`mb-0.5 ${item.id === 'thong-tin-tai-khoan' ? 'mt-4' : ''}`}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick(item.id);
                      }}
                      className={`flex items-center py-2.5 px-3  text-sm transition-all duration-200 relative
              ${itemIsActive || isViewedProductsActive
                          ? 'bg-[#EFF6FF] border-l-2 border-primary text-primary font-semibold'
                          : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
            `}
                    >
                      {item.icon && (
                        <div className="relative mr-3 flex-shrink-0">
                          <item.icon
                            size={18}
                            className={`${currentIconColor}`}
                            strokeWidth={itemIsActive || isViewedProductsActive ? 2.5 : 2}
                          />
                          {item.id === 'thong-bao' && item.notification && (
                            <span className="absolute top-[1px] right-[1px] block h-1.5 w-1.5 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-800"></span>
                          )}
                        </div>
                      )}
                      <span className="truncate">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

        </div>
      </div>
    );
  };
  const MobileUserDropdown = () => {
    return (
      <div className="relative w-full lg:hidden mb-4" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-expanded={isDropdownOpen}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0 overflow-hidden">
              {sidebarUserInfo.avatarUrl ? (
                <img src={sidebarUserInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-semibold">{isSidebarLoading ? '...' : sidebarUserInfo.initial}</span>
              )}
            </div>
            <div className="text-left overflow-hidden">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {isSidebarLoading ? 'Đang tải...' : sidebarUserInfo.displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {isSidebarLoading ? 'Đang tải...' : sidebarUserInfo.email}
              </p>
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`text-gray-600 dark:text-gray-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-30">
            <nav>
              <ul>
                {sidebarNavItems.map((item) => {
                  const itemIsActive = activeTab === item.id;

                  const isViewedProductsActive = item.id === 'san-pham-da-xem' && window.location.pathname === '/san-pham-da-xem';
                  const currentIconColor =
                    itemIsActive || isViewedProductsActive ? 'text-primary' : item.iconColor || 'text-gray-600 dark:text-gray-400';

                  return (
                    <li key={item.id} className="mb-0.5 last:mb-0">
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabClick(item.id);
                        }}
                        className={`flex items-center py-2.5 px-3 rounded-md text-sm transition-all duration-200 relative
                          ${itemIsActive || isViewedProductsActive
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary font-semibold'
                            : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {item.icon && (
                          <div className="relative mr-3 flex-shrink-0">
                            <item.icon
                              size={18}
                              className={`${currentIconColor}`}
                              strokeWidth={itemIsActive || isViewedProductsActive ? 2.5 : 2}
                            />
                            {item.id === 'thong-bao' && item.notification && (
                              <span className="absolute top-[1px] right-[1px] block h-1.5 w-1.5 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-800"></span>
                            )}
                          </div>
                        )}
                        <span className="truncate">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
  };

  const EmptyContent = ({ title }) => (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Nội dung cho mục này hiện không có sẵn hoặc đã được loại bỏ.</p>
    </div>
  );

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="max-w-[1200px] mx-auto font-sans">
        <div className="mb-3 pt-4 sm:pt-4 lg:pt-0">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <MobileUserDropdown />

        <div className="flex flex-row">
          <DesktopSidebar />

          <div className="flex-1 min-w-0 lg:pl-8 md:pl-6 pl-0 pb-8">
            {(orderCode || id || returnCode) ? (
              <Outlet />
            ) : (
              <>
                {activeTab === 'thong-tin-tai-khoan' && <ProfileContent />}
                {activeTab === 'quan-ly-don-hang' && <RenderDonMuaContentTuyChinh />}
                {activeTab === 'so-dia-chi' && <AddressPageContent />}
                {activeTab === 'khach-hang-than-thiet' && <MembershipPage />}
                {activeTab === 'diem-thuong' && <RewardPage />}

                {activeTab === 'san-pham-yeu-thich' && <FavoriteProductsPage />}
                {activeTab === 'doi-mat-khau' && <ChangePasswordTab />}
                {activeTab === 'vi-noi-bo' && <InternalWalletPage />}

              </>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        body {
          font-family:
            -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
            'WenQuanYi Micro Hei', sans-serif;
          color: #333;
        }
        .dark body {
          color: #e5e7eb;
          background-color: #111827;
        }

        .form-radio-custom {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 1.5px solid #bdbdbd;
          border-radius: 50%;
          outline: none;
          cursor: pointer;
          position: relative;
          top: 0.1em;
          transition: border-color 0.2s ease;
        }
        .dark .form-radio-custom {
          border-color: #4b5563;
        }

        .form-radio-custom:checked {
          border-color: var(--primary-color);
        }
        .form-radio-custom:checked::before {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          background-color: var(--primary-color);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .form-radio-custom:focus-visible {
          box-shadow: 0 0 0 2px rgba(28, 167, 236, 0.3);
        }

        select.appearance-none {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23757575' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 0.75em;
          padding-right: 2.5rem;
        }
        .dark select.appearance-none {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239CA3AF' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
        }

        /* Scrollbar styles for sidebar (and other overflow-y-auto areas) */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;
