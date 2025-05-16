// src/pages/UserProfilePage.jsx (hoặc components/UserProfilePage.jsx)
import React, { useState } from 'react';
// Import icons từ lucide-react
import { User, Edit3, Bell, Settings, Ticket, CircleDollarSign, ShoppingBag, FileText, Tag, Gift } from 'lucide-react';


import RenderDonMuaContentTuyChinh from './PurchaseHistoryPage'; // Đổi tên để tránh trùng lặp nếu cần
import AddressPageContent from './RenderDiaChiContent'; // Đường dẫn đến file bạn vừa tạo
const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('ho-so');
  const [userAvatar, setUserAvatar] = useState(null);
  const [userInitial] = useState('Q');
  const [userName] = useState('vanhaihia2002');
  const [userEmail] = useState('kh**********@gmail.com');
  const [userPhone] = useState('*******94');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const sidebarNavItems = [
    { id: 'ngay-sale', label: 'Ngày 15 Sale Giữa Tháng', icon: Tag, href: '#ngay-sale', tag: 'New', tagColor: 'bg-red-500 text-white', iconColor: 'text-orange-500' },
    { id: 'thong-bao', label: 'Thông Báo', icon: Bell, href: '#thong-bao', notification: true },
    {
      id: 'tai-khoan', label: 'Tài Khoản Của Tôi', icon: User, subItems: [
        { id: 'ho-so', label: 'Hồ Sơ', href: '#ho-so' },
        { id: 'ngan-hang', label: 'Ngân Hàng', href: '#ngan-hang' },
        { id: 'dia-chi', label: 'Địa Chỉ', href: '#dia-chi' },
        { id: 'doi-mat-khau', label: 'Đổi Mật Khẩu', href: '#doi-mat-khau' },
      ]
    },
    { id: 'cai-dat-thong-bao', label: 'Cài Đặt Thông Báo', icon: Settings, href: '#cai-dat-thong-bao' },
    { id: 'thiet-lap-rieng-tu', label: 'Những Thiết Lập Riêng Tư', icon: Settings, href: '#thiet-lap-rieng-tu' },
    { id: 'don-mua', label: 'Đơn Mua', icon: FileText, href: '#don-mua' },
    { id: 'kho-voucher', label: 'Kho Voucher', icon: Ticket, href: '#kho-voucher', iconColor: 'text-red-500'},
    { id: 'shopee-xu', label: 'Shopee Xu', icon: CircleDollarSign, href: '#shopee-xu', iconColor: 'text-yellow-500' },
  ];

  const renderSidebarContent = () => {
    const isParentActive = (item) => item.subItems && item.subItems.some(sub => sub.id === activeTab);

    return (
      // Root div of the sidebar, this is the white background container for sidebar
      <div className="w-[250px] flex-shrink-0 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0">
        {/* Inner container for sidebar content, with adjusted top padding */}
        <div className="px-4 pb-4 pt-6"> {/* CHỈNH SỬA: pt-11 thành pt-6 */}
          {/* User info block, with adjusted bottom margin */}
          <div className="flex items-center mb-3 pl-1"> {/* CHỈNH SỬA: mb-4 thành mb-3 */}
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-2.5 flex-shrink-0">
              <span className="text-white text-xl font-semibold">{userInitial}</span>
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-gray-900 truncate">{userName}</p>
              <a
                href="#sua-ho-so"
                onClick={(e) => { e.preventDefault(); handleTabClick('ho-so'); }}
                className="text-xs text-gray-500 hover:text-orange-500 flex items-center"
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
                        {item.tag && (
                          <span className={`ml-auto text-[10px] font-semibold px-1 py-0 rounded ${item.tagColor || 'bg-gray-500 text-white'}`}>
                            {item.tag}
                          </span>
                        )}
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

  const handleAvatarChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserAvatar(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const renderProfileContent = () => (
    <div className="bg-white p-6 shadow-md rounded-md border border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800 mb-1.5">Hồ Sơ Của Tôi</h1>
      <p className="text-sm text-gray-600 mb-8">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-6">
        <form className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label htmlFor="username" className="text-sm text-gray-500 text-right pr-2">Tên đăng nhập</label>
            <div className="md:col-span-1">
              <input type="text" id="username" value={userName} readOnly className="w-full p-2.5 border-none text-sm text-gray-800 bg-transparent focus:outline-none" />
              <p className="text-xs text-gray-400 mt-1">Tên Đăng nhập chỉ có thể thay đổi một lần.</p>
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label htmlFor="name" className="text-sm text-gray-500 text-right pr-2">Tên</label>
            <div>
              <input type="text" id="name" placeholder="Nhập tên của bạn" className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm placeholder-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label htmlFor="email" className="text-sm text-gray-500 text-right pr-2">Email</label>
            <div className="flex items-center">
              <p className="text-sm text-gray-800 mr-3 truncate">{userEmail}</p>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 flex-shrink-0">Thay Đổi</button>
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label htmlFor="phone" className="text-sm text-gray-500 text-right pr-2">Số điện thoại</label>
            <div className="flex items-center">
                 <p className="text-sm text-gray-800 mr-3 truncate">{userPhone}</p>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 flex-shrink-0">Thay Đổi</button>
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <label className="text-sm text-gray-500 text-right pr-2">Giới tính</label>
            <div className="flex items-center gap-x-6">
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="gender" value="male" className="form-radio-custom" />
                <span className="ml-2">Nam</span>
              </label>
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="gender" value="female" className="form-radio-custom" />
                <span className="ml-2">Nữ</span>
              </label>
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="gender" value="other" className="form-radio-custom" defaultChecked />
                <span className="ml-2">Khác</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start gap-4">
            <label className="text-sm text-gray-500 text-right pr-2 pt-2.5">Ngày sinh</label>
            <div className="grid grid-cols-3 gap-3">
              <select defaultValue="" className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none">
                <option value="" disabled>Ngày</option>
                {[...Array(31)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
              <select defaultValue="" className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none">
                <option value="" disabled>Tháng</option>
                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
              <select defaultValue="" className="w-full p-2.5 border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm text-gray-700 bg-white appearance-none">
                <option value="" disabled>Năm</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center gap-4">
            <div className="lg:col-start-2">
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-7 rounded text-sm transition-colors shadow-sm hover:shadow">
                Lưu
              </button>
            </div>
          </div>
        </form>

        <div className="lg:col-span-1 flex flex-col items-center pt-3 lg:pt-0 lg:border-l lg:border-gray-200 lg:pl-8">
          <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center mb-4 overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-5xl font-semibold">{userInitial}</span>
            )}
          </div>
          <input type="file" id="avatarUpload" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleAvatarChange} />
          <label htmlFor="avatarUpload" className="cursor-pointer bg-white border border-gray-300/80 text-gray-700 text-sm py-2 px-5 rounded hover:bg-gray-50 transition-colors shadow-sm mb-2.5">
            Chọn Ảnh
          </label>
          <div className="text-xs text-gray-500 text-center leading-snug">
            <p>Dung lượng file tối đa 1 MB</p>
            <p>Định dạng: .JPEG, .PNG</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F5F5F5] min-h-screen font-sans">
      <div className="max-w-screen-xl mx-auto pt-5">
        <div className="flex flex-row">
          {renderSidebarContent()}
          {/* CHỈNH SỬA: Loại bỏ div với p-5 bao ngoài, thêm pl vào đây để tạo khoảng cách với sidebar */}
          <div className="flex-1 min-w-0 lg:pl-8 md:pl-6 pl-5"> {/* Spacing between sidebar and main content card area */}
            {activeTab === 'ho-so' && renderProfileContent()}
            {activeTab === 'ngan-hang' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Ngân Hàng</h2><p className="text-sm">Nội dung trang Ngân Hàng...</p></div>}
 {activeTab === 'dia-chi' && <AddressPageContent />}
            {activeTab === 'doi-mat-khau' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Đổi Mật Khẩu</h2><p className="text-sm">Nội dung trang Đổi Mật Khẩu...</p></div>}
            {activeTab === 'thong-bao' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Thông Báo</h2><p className="text-sm">Nội dung trang Thông Báo...</p></div>}
            {activeTab === 'ngay-sale' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Ngày 15 Sale Giữa Tháng</h2><p className="text-sm">Nội dung trang Sale...</p></div>}
            {activeTab === 'cai-dat-thong-bao' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Cài Đặt Thông Báo</h2><p className="text-sm">Nội dung trang Cài Đặt Thông Báo...</p></div>}
            {activeTab === 'thiet-lap-rieng-tu' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Những Thiết Lập Riêng Tư</h2><p className="text-sm">Nội dung trang Thiết Lập Riêng Tư...</p></div>}
             {activeTab === 'don-mua' && <RenderDonMuaContentTuyChinh />} {/* THAY ĐỔI Ở ĐÂY */}
            {activeTab === 'kho-voucher' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Kho Voucher</h2><p className="text-sm">Nội dung trang Kho Voucher...</p></div>}
            {activeTab === 'shopee-xu' && <div className="bg-white p-6 shadow-md rounded-md border border-gray-200"><h2 className="text-xl font-semibold">Shopee Xu</h2><p className="text-sm">Nội dung trang Shopee Xu...</p></div>}
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