// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { User, Edit3, Bell, Ticket, FileText } from 'lucide-react';

import ProfileContent from './ProfileContent'; // ProfileContent giờ tự quản lý dữ liệu
import RenderDonMuaContentTuyChinh from './PurchaseHistoryPage';
import AddressPageContent from './RenderDiaChiContent';
import { authService } from '../../../services/client/authService'; // Vẫn cần cho sidebar

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('ho-so');
  
  // State cho thông tin hiển thị trên sidebar (tên, initial, avatar)
  const [sidebarUserInfo, setSidebarUserInfo] = useState({
    initial: '?',
    displayName: 'Đang tải...', // Tên hiển thị trên sidebar
    avatarUrl: null,
  });
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarUserInfo = async () => {
      setIsSidebarLoading(true);
      try {
        const response = await authService.getUserInfo(); // API này nên trả về ít nhất fullName và avatarUrl
        const apiUser = response.data.user;
        setSidebarUserInfo({
          initial: apiUser.fullName ? apiUser.fullName.charAt(0).toUpperCase() : '?',
          displayName: apiUser.fullName || apiUser.email || 'Tài khoản',
          avatarUrl: apiUser.avatarUrl || null,
        });
      } catch (error) {
        console.error("❌ Lỗi fetch thông tin cho sidebar:", error);
        setSidebarUserInfo({
          initial: '!',
          displayName: 'Lỗi',
          avatarUrl: null,
        });
      } finally {
        setIsSidebarLoading(false);
      }
    };
    fetchSidebarUserInfo();
  }, []); // Có thể thêm dependency array nếu muốn fetch lại khi có sự kiện nào đó


  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
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
    { id: 'kho-voucher', label: 'Kho Voucher', icon: Ticket, href: '#kho-voucher', iconColor: 'text-red-500'},
  ];

  const renderSidebarContent = () => {
    const isParentActive = (item) => item.subItems && item.subItems.some(sub => sub.id === activeTab);

    return (
      <div className="w-[250px] flex-shrink-0 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0">
        <div className="px-4 pb-4 pt-6">
          <div className="flex items-center mb-3 pl-1">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-2.5 flex-shrink-0 overflow-hidden">
              {sidebarUserInfo.avatarUrl ? (
                <img src={sidebarUserInfo.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-xl font-semibold">{isSidebarLoading ? '...' : sidebarUserInfo.initial}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-gray-900 truncate">{isSidebarLoading ? 'Đang tải...' : sidebarUserInfo.displayName}</p>
              <a
                href="#sua-ho-so" // Vẫn giữ link này để tiện click
                onClick={(e) => { e.preventDefault(); handleTabClick('ho-so'); }}
                className="text-xs text-gray-500 hover:text-orange-500 flex items-center"
              >
                <Edit3 size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">Sửa Hồ Sơ</span>
              </a>
            </div>
          </div>
          <nav>
            {/* Nội dung nav items giữ nguyên */}
            <ul>
              {sidebarNavItems.map(item => {
                const parentIsActive = isParentActive(item);
                const itemIsActive = activeTab === item.id;
                const currentIconColor = itemIsActive ? 'text-orange-500' : (item.iconColor || 'text-gray-600');
                return (
                  <li key={item.id} className="mb-0">
                    {item.subItems ? (
                      <>
                        <div className={`flex items-center py-2.5 px-3 rounded-md text-sm relative ${parentIsActive ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'}`}>
                          {item.icon && <item.icon size={18} className={`mr-3 flex-shrink-0 ${parentIsActive ? 'text-orange-500' : item.iconColor || 'text-gray-600'}`} strokeWidth={parentIsActive ? 2.5 : 2} />}
                          <span className={`truncate ${parentIsActive ? 'font-medium' : ''}`}>{item.label}</span>
                        </div>
                        <ul className="pl-[2.3rem] mt-0.5 mb-1 space-y-0.5">
                          {item.subItems.map(subItem => (
                            <li key={subItem.id} className="relative">
                              <a
                                href={subItem.href}
                                onClick={(e) => { e.preventDefault(); handleTabClick(subItem.id); }}
                                className={`block py-[7px] px-0 rounded-md text-sm hover:text-orange-500 truncate ${activeTab === subItem.id ? 'text-orange-500 font-medium' : 'text-gray-700'}`}
                              >
                                {activeTab === subItem.id && <span className="absolute left-[-1.1rem] top-0 bottom-0 w-[3px] bg-orange-500 rounded-r-sm"></span>}
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
                        className={`flex items-center py-2.5 px-3 rounded-md text-sm transition-colors duration-150 relative ${itemIsActive ? 'text-orange-500 font-medium' : 'text-gray-800 hover:text-orange-500'}`}
                      >
                        {itemIsActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 rounded-r-sm"></span>}
                        {item.icon && (
                          <div className="relative mr-3">
                              <item.icon size={18} className={`flex-shrink-0 ${currentIconColor}`} strokeWidth={itemIsActive ? 2.5 : 2} />
                              {item.id === 'thong-bao' && item.notification && (
                                <span className="absolute top-[1px] right-[1px] block h-1.5 w-1.5 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 ring-1 ring-white"></span>
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
    <div className="bg-white p-6 shadow-md rounded-md border border-gray-200">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm">Nội dung cho mục này hiện không có sẵn hoặc đã được loại bỏ.</p>
    </div>
  );

  return (
    <div className="bg-[#F5F5F5] min-h-screen font-sans">
      <div className="max-w-screen-xl mx-auto pt-5">
        <div className="flex flex-row">
          {renderSidebarContent()}
          <div className="flex-1 min-w-0 lg:pl-8 md:pl-6 pl-2">
            {activeTab === 'ho-so' && <ProfileContent /> /* Không cần truyền props dữ liệu nữa */}
            {activeTab === 'ngan-hang' && <EmptyContent title="Ngân Hàng" />}
            {activeTab === 'dia-chi' && <AddressPageContent />}
            {activeTab === 'doi-mat-khau' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Đổi Mật Khẩu</h2><p className="text-sm">Nội dung trang Đổi Mật Khẩu...</p></div>}
            {activeTab === 'thong-bao' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Thông Báo</h2><p className="text-sm">Nội dung trang Thông Báo...</p></div>}
            {activeTab === 'don-mua' && <RenderDonMuaContentTuyChinh />}
            {activeTab === 'kho-voucher' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Kho Voucher</h2><p className="text-sm">Nội dung trang Kho Voucher...</p></div>}
          </div>
        </div>
      </div>
    <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
          color: #333;
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
        .form-radio-custom:checked {
          border-color: #EE4D2D;
        }
        .form-radio-custom:checked::before {
          content: '';
          display: block;
          width: 10px; 
          height: 10px; 
          background-color: #EE4D2D;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .form-radio-custom:focus-visible {
            box-shadow: 0 0 0 2px rgba(238, 77, 45, 0.3);
        }
        select.appearance-none {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23757575' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 0.75em;
            padding-right: 2.5rem;
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px; 
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #9CA3AF;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background-color: transparent; 
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;