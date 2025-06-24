// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, MapPin, Eye, Ticket, Heart } from 'lucide-react';

import ProfileContent from './ProfileContent';
import RenderDonMuaContentTuyChinh from './PurchaseHistoryPage';
import AddressPageContent from './RenderDiaChiContent';
import { authService }from '../../../services/client/authService';
import FavoriteProductsPage from './FavoriteProductsPage';
import ChangePasswordTab from './ChangePasswordTab';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.hash.replace('#', '') || 'thong-tin-tai-khoan';
  });

  const [sidebarUserInfo, setSidebarUserInfo] = useState({
    initial: '?',
    displayName: 'Đang tải...',
    email: 'Đang tải...', // ✅ THÊM FIELD EMAIL VÀO STATE
    avatarUrl: null,
  });
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);

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
            initial: apiUser.fullName ? apiUser.fullName.charAt(0).toUpperCase() : (apiUser.email ? apiUser.email.charAt(0).toUpperCase() : '?'), // ✅ Lấy initial từ email nếu không có fullName
            displayName: apiUser.fullName || apiUser.email || 'Tài khoản',
            email: apiUser.email || 'Không có email', // ✅ GÁN EMAIL TỪ API
            avatarUrl: finalAvatarUrl,
          });
        } else {
          console.error("❌ Lỗi fetch thông tin cho sidebar: Dữ liệu user không hợp lệ.", response);
          setSidebarUserInfo({
            initial: '!',
            displayName: 'Lỗi dữ liệu',
            email: 'Lỗi tải email', // ✅ SET EMAIL KHI CÓ LỖI
            avatarUrl: null,
          });
        }
      } catch (error) {
        console.error("❌ Lỗi fetch thông tin cho sidebar (catch):", error);
        setSidebarUserInfo({
          initial: '!',
          displayName: 'Lỗi tải',
          email: 'Lỗi tải email', // ✅ SET EMAIL KHI CÓ LỖI
          avatarUrl: null,
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
    };

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useEffect(() => {
    const handleAvatarUpdate = (event) => {
      const newAvatarUrl = event.detail;
      setSidebarUserInfo((prev) => ({
        ...prev,
        avatarUrl: newAvatarUrl,
        initial: newAvatarUrl ? (prev.displayName.charAt(0).toUpperCase() || '?') : (prev.displayName.charAt(0).toUpperCase() || '?')
      }));
    };

    const handleProfileUpdate = (event) => {
      const updatedUserFromEvent = event.detail.user;
      if (updatedUserFromEvent) {
        setSidebarUserInfo((prev) => ({
          ...prev,
          displayName: updatedUserFromEvent.fullName || prev.displayName,
          email: updatedUserFromEvent.email || prev.email, // ✅ CẬP NHẬT EMAIL KHI PROFILE UPDATE
          initial: updatedUserFromEvent.fullName ? updatedUserFromEvent.fullName.charAt(0).toUpperCase() : prev.initial,
        }));
      }
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const sidebarNavItems = [
    { id: 'thong-tin-tai-khoan', label: 'Thông tin tài khoản', icon: User, href: '#thong-tin-tai-khoan' },
    { id: 'quan-ly-don-hang', label: 'Quản lý đơn hàng', icon: ShoppingBag, href: '#quan-ly-don-hang' },
    { id: 'so-dia-chi', label: 'Sổ địa chỉ', icon: MapPin, href: '#so-dia-chi' },
    { id: 'san-pham-da-xem', label: 'Sản phẩm đã xem', icon: Eye, href: '#san-pham-da-xem' },
    { id: 'kho-voucher', label: 'Kho voucher', icon: Ticket, href: '#kho-voucher', iconColor: 'text-red-500' },
    { id: 'san-pham-yeu-thich', label: 'Sản phẩm yêu thích', icon: Heart, href: '#san-pham-yeu-thich' },
  ];

  const renderSidebarContent = () => {
    return (
      <div className="w-[250px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto sticky top-0 bg-white dark:bg-gray-850">
        <div className="px-4 pb-4 pt-6">
          {/* Thông tin user trên sidebar */}
          <div className="flex items-center mb-6 pl-1 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-2.5 flex-shrink-0 overflow-hidden">
              {sidebarUserInfo.avatarUrl ? (
                <img src={sidebarUserInfo.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-xl font-semibold">{isSidebarLoading ? '...' : sidebarUserInfo.initial}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {isSidebarLoading ? 'Đang tải...' : sidebarUserInfo.displayName}
              </p>
              {/* ✅ HIỂN THỊ EMAIL THẬT CỦA USER */}
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {isSidebarLoading ? '...' : sidebarUserInfo.email}
              </p>
            </div>
          </div>
          <nav>
            <ul>
              {sidebarNavItems.map(item => {
                const itemIsActive = activeTab === item.id;
                const currentIconColor = itemIsActive ? 'text-primary' : (item.iconColor || 'text-gray-600 dark:text-gray-400');
                
                return (
                  <li key={item.id} className="mb-0.5">
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); handleTabClick(item.id); }}
                      className={`flex items-center py-2.5 px-3 rounded-md text-sm transition-colors duration-150 relative
                        ${itemIsActive ? 'bg-gray-100 dark:bg-gray-700 text-primary font-medium' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
                      `}
                    >
                      {/* Icon */}
                      {item.icon && (
                        <div className="relative mr-3 flex-shrink-0">
                          <item.icon size={18} className={`${currentIconColor}`} strokeWidth={itemIsActive ? 2.5 : 2} />
                          {/* Dấu chấm thông báo (nếu có) */}
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

  const EmptyContent = ({ title }) => (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Nội dung cho mục này hiện không có sẵn hoặc đã được loại bỏ.</p>
    </div>
  );

  return (
    <div className="bg-[#F5F5F5] dark:bg-gray-900 min-h-screen pt-5">
      <div className="max-w-[1200px] mx-auto font-sans">
        <div className="flex flex-row">
          {renderSidebarContent()}
          <div className="flex-1 min-w-0 lg:pl-8 md:pl-6 pl-2">
            {activeTab === 'thong-tin-tai-khoan' && <ProfileContent />}
            {activeTab === 'quan-ly-don-hang' && <RenderDonMuaContentTuyChinh />}
            {activeTab === 'so-dia-chi' && <AddressPageContent />}
            {activeTab === 'san-pham-da-xem' && <EmptyContent title="Sản phẩm đã xem" />}
            {activeTab === 'kho-voucher' && <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-gray-700"><h2 className="text-xl font-semibold dark:text-gray-100">Kho Voucher</h2><p className="text-sm dark:text-gray-300">Nội dung trang Kho Voucher...</p></div>}
            {activeTab === 'san-pham-yeu-thich' && <FavoriteProductsPage />}
            {activeTab === 'doi-mat-khau' && <ChangePasswordTab />}
          </div>
        </div>
      </div>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
          color: #333;
        }
        .dark body {
            color: #E5E7EB;
            background-color: #111827;
        }

        .form-radio-custom {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 1.5px solid #BDBDBD;
          border-radius: 50%;
          outline: none;
          cursor: pointer;
          position: relative;
          top: 0.1em; 
          transition: border-color 0.2s ease;
        }
        .dark .form-radio-custom {
            border-color: #4B5563;
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

        /* Thanh cuộn cho sidebar (và các khu vực khác dùng overflow-y-auto) */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px; 
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
          border-radius: 3px;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: #4B5563;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #9CA3AF;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background-color: #6B7280;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background-color: transparent; 
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;