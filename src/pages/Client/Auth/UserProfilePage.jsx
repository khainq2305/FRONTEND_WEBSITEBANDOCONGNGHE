// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { User, Edit3, Bell, Ticket, FileText } from 'lucide-react';

import ProfileContent from './ProfileContent';
import RenderDonMuaContentTuyChinh from './PurchaseHistoryPage';
import AddressPageContent from './RenderDiaChiContent';
import { authService } from '../../../services/client/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; 

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.hash.replace('#', '') || 'ho-so';
  });

  const [sidebarUserInfo, setSidebarUserInfo] = useState({
    initial: '?',
    displayName: 'Đang tải...',
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
            initial: apiUser.fullName ? apiUser.fullName.charAt(0).toUpperCase() : '?',
            displayName: apiUser.fullName || apiUser.email || 'Tài khoản',
            avatarUrl: finalAvatarUrl,
          });
        } else {
          console.error("❌ Lỗi fetch thông tin cho sidebar: Dữ liệu user không hợp lệ.", response);
          setSidebarUserInfo({
            initial: '!',
            displayName: 'Lỗi dữ liệu',
            avatarUrl: null,
          });
        }
      } catch (error) {
        console.error("❌ Lỗi fetch thông tin cho sidebar (catch):", error);
        setSidebarUserInfo({
          initial: '!',
          displayName: 'Lỗi tải',
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
      setActiveTab(tabFromHash || 'ho-so');
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
    { id: 'thong-bao', label: 'Thông Báo', icon: Bell, href: '#thong-bao', notification: true },
    {
      id: 'tai-khoan', label: 'Tài Khoản Của Tôi', icon: User, subItems: [
        { id: 'ho-so', label: 'Hồ Sơ', href: '#ho-so' },
        { id: 'dia-chi', label: 'Địa Chỉ', href: '#dia-chi' },
        { id: 'doi-mat-khau', label: 'Đổi Mật Khẩu', href: '#doi-mat-khau' },
      ]
    },
    { id: 'don-mua', label: 'Đơn Mua', icon: FileText, href: '#don-mua' },
    { id: 'kho-voucher', label: 'Kho Voucher', icon: Ticket, href: '#kho-voucher', iconColor: 'text-red-500'}, // Giữ màu đỏ cho voucher
  ];

  const renderSidebarContent = () => {
    const isParentActive = (item) => item.subItems && item.subItems.some(sub => sub.id === activeTab);

    return (
      // Thêm class `bg-white dark:bg-gray-800` cho sidebar nếu muốn nó có nền riêng và hỗ trợ dark mode
      <div className="w-[250px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto sticky top-0 bg-white dark:bg-gray-850">
        <div className="px-4 pb-4 pt-6">
          <div className="flex items-center mb-3 pl-1">
            {/* Sử dụng class bg-primary cho nền avatar */}
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
              {/* Thay hover:text-orange-500 bằng hover:text-sky-500 (gần với var(--primary-color)) */}
              <a
                href="#sua-ho-so" 
                onClick={(e) => { e.preventDefault(); handleTabClick('ho-so'); }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 flex items-center"
              >
                <Edit3 size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">Sửa Hồ Sơ</span>
              </a>
            </div>
          </div>
          <nav>
            <ul>
              {sidebarNavItems.map(item => {
                const parentIsActive = isParentActive(item);
                const itemIsActive = activeTab === item.id;
                // Sử dụng text-primary cho màu icon active
                const currentIconColor = itemIsActive ? 'text-primary' : (item.iconColor || 'text-gray-600 dark:text-gray-400');
                return (
                  <li key={item.id} className="mb-0">
                    {item.subItems ? (
                      <>
                        {/* Sử dụng text-primary khi parent active, hover:text-sky-500 */}
                        <div className={`flex items-center py-2.5 px-3 rounded-md text-sm relative ${parentIsActive ? 'text-primary' : 'text-gray-800 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400'}`}>
                          {item.icon && <item.icon size={18} className={`mr-3 flex-shrink-0 ${parentIsActive ? 'text-primary' : item.iconColor || 'text-gray-600 dark:text-gray-400'}`} strokeWidth={parentIsActive ? 2.5 : 2} />}
                          <span className={`truncate ${parentIsActive ? 'font-medium' : ''}`}>{item.label}</span>
                        </div>
                        <ul className="pl-[2.3rem] mt-0.5 mb-1 space-y-0.5">
                          {item.subItems.map(subItem => (
                            <li key={subItem.id} className="relative">
                              <a
                                href={subItem.href}
                                onClick={(e) => { e.preventDefault(); handleTabClick(subItem.id); }}
                                // Sử dụng text-primary khi active, hover:text-sky-500. Thêm dark mode cho text
                                className={`block py-[7px] px-0 rounded-md text-sm hover:text-sky-500 dark:hover:text-sky-400 truncate ${activeTab === subItem.id ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                              >
                                {/* Sử dụng bg-primary cho thanh chỉ báo active */}
                                {activeTab === subItem.id && <span className="absolute left-[-1.1rem] top-0 bottom-0 w-[3px] bg-primary rounded-r-sm"></span>}
                                {subItem.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) => { e.preventDefault(); handleTabClick(item.id); }}
                        // Sử dụng text-primary khi active, hover:text-sky-500
                        className={`flex items-center py-2.5 px-3 rounded-md text-sm transition-colors duration-150 relative ${itemIsActive ? 'text-primary font-medium' : 'text-gray-800 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400'}`}
                      >
                        {/* Sử dụng bg-primary cho thanh chỉ báo active */}
                        {itemIsActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-sm"></span>}
                        {item.icon && (
                          <div className="relative mr-3">
                            <item.icon size={18} className={`flex-shrink-0 ${currentIconColor}`} strokeWidth={itemIsActive ? 2.5 : 2} />
                            {item.id === 'thong-bao' && item.notification && (
                              <span className="absolute top-[1px] right-[1px] block h-1.5 w-1.5 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-800"></span>
                            )}
                          </div>
                        )}
                        <span className="truncate">{item.label}</span>
                      </a>
                    )}
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
      <div className="max-w-screen-xl mx-auto font-sans px-4">
        <div className="flex flex-row">
          {renderSidebarContent()}
          <div className="flex-1 min-w-0 lg:pl-8 md:pl-6 pl-2">
            {activeTab === 'ho-so' && <ProfileContent /> }
            {activeTab === 'ngan-hang' && <EmptyContent title="Ngân Hàng" />}
            {activeTab === 'dia-chi' && <AddressPageContent />}
            {activeTab === 'doi-mat-khau' && <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-gray-700"><h2 className="text-xl font-semibold dark:text-gray-100">Đổi Mật Khẩu</h2><p className="text-sm dark:text-gray-300">Nội dung trang Đổi Mật Khẩu...</p></div>}
            {activeTab === 'thong-bao' && <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-gray-700"><h2 className="text-xl font-semibold dark:text-gray-100">Thông Báo</h2><p className="text-sm dark:text-gray-300">Nội dung trang Thông Báo...</p></div>}
            {activeTab === 'don-mua' && <RenderDonMuaContentTuyChinh />}
            {activeTab === 'kho-voucher' && <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md border border-gray-200 dark:border-gray-700"><h2 className="text-xl font-semibold dark:text-gray-100">Kho Voucher</h2><p className="text-sm dark:text-gray-300">Nội dung trang Kho Voucher...</p></div>}
          </div>
        </div>
      </div>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
          color: #333; /* Màu chữ mặc định cho body */
        }
        /* Lớp .dark sẽ được thêm vào <html> hoặc <body> để kích hoạt dark mode */
        .dark body {
            color: #E5E7EB; /* Màu chữ xám nhạt cho dark mode */
            background-color: #111827; /* Màu nền tối cho body trong dark mode */
        }

        .form-radio-custom {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 1.5px solid #BDBDBD; /* Màu border xám cho light mode */
          border-radius: 50%;
          outline: none;
          cursor: pointer;
          position: relative;
          top: 0.1em; 
          transition: border-color 0.2s ease;
        }
        .dark .form-radio-custom {
            border-color: #4B5563; /* Màu border xám đậm hơn cho dark mode */
        }

        .form-radio-custom:checked {
          /* Sử dụng màu chủ đạo từ biến CSS */
          border-color: var(--primary-color);
        }
        /* Không cần .dark ở đây vì var(--primary-color) sẽ tự áp dụng */

        .form-radio-custom:checked::before {
          content: '';
          display: block;
          width: 10px; 
          height: 10px; 
          /* Sử dụng màu chủ đạo từ biến CSS */
          background-color: var(--primary-color);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .form-radio-custom:focus-visible {
            /* RGB của #1CA7EC là 28, 167, 236 */
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
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239CA3AF' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E"); /* Đổi màu fill SVG cho dark mode nếu cần */
        }

        /* Thanh cuộn cho sidebar (và các khu vực khác dùng overflow-y-auto) */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px; 
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          /* Tùy chọn: Sử dụng màu chủ đạo cho thanh cuộn */
          /* background-color: var(--primary-color); */
          background-color: #D1D5DB; /* Hoặc giữ màu xám mặc định */
          border-radius: 3px;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: #4B5563; /* Màu thanh cuộn cho dark mode */
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