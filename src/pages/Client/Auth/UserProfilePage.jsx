// src/pages/UserProfilePage.jsx (hoặc components/UserProfilePage.jsx)
import React, { useState } from 'react';
// Import icons từ lucide-react
import { User, Edit3, Bell, Settings, Ticket, CircleDollarSign, Gift, ShoppingBag } from 'lucide-react';
import RenderDonMuaContent from './PurchaseHistoryPage';
const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('ho-so');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const sidebarNavItems = [
    { id: 'ngay-sale', label: 'Ngày 15 Sale Giữa Tháng', icon: Gift, href: '#ngay-sale', tag: 'New', tagColor: 'bg-orange-500 text-white' },
    { id: 'thong-bao', label: 'Thông Báo', icon: Bell, href: '#thong-bao' },
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
    { id: 'don-mua', label: 'Đơn Mua', icon: ShoppingBag, href: '#don-mua' },
    { id: 'kho-voucher', label: 'Kho Voucher', icon: Ticket, href: '#kho-voucher' },
    { id: 'shopee-xu', label: 'Shopee Xu', icon: CircleDollarSign, href: '#shopee-xu' },
  ];

  const renderSidebarContent = () => {
    const isParentActive = (item) => item.subItems && item.subItems.some(sub => sub.id === activeTab);

    return (
      // Sidebar: Chiều rộng được điều chỉnh cho các kích thước màn hình.
      // h-screen và overflow-y-auto để sidebar có thể cuộn độc lập và chiếm toàn bộ chiều cao.
      <div className="w-[140px] sm:w-[170px] md:w-[200px] lg:w-[240px] flex-shrink-0 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0">
        {/* sticky top-0 để giữ sidebar ở trên cùng khi cuộn toàn trang (nếu không dùng h-screen cho main-content-wrapper) */}
        <div className="p-2 pt-4 sm:p-3 sm:pt-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300 flex items-center justify-center mr-2 overflow-hidden flex-shrink-0">
              <img src="https://placehold.co/40x40/E2E8F0/A0AEC0?text=AV" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-[11px] sm:text-xs text-gray-800 truncate">khinguynquoc013</p>
              <a
                href="#sua-ho-so"
                onClick={(e) => { e.preventDefault(); handleTabClick('ho-so'); }}
                className="text-[9px] sm:text-[10px] text-gray-500 hover:text-orange-500 flex items-center"
              >
                <Edit3 size={10} className="mr-0.5 sm:mr-1 flex-shrink-0" />
                <span className="truncate">Sửa Hồ Sơ</span>
              </a>
            </div>
          </div>

          <nav>
            <ul>
              {sidebarNavItems.map(item => {
                const parentIsActive = isParentActive(item);
                return (
                  <li key={item.id} className="mb-[2px]">
                    {item.subItems ? (
                      <>
                        <div className={`flex items-center p-[5px] sm:p-2 rounded-sm text-[11px] sm:text-xs ${parentIsActive ? 'text-orange-500 font-semibold' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`}>
                          {item.icon && <item.icon size={14} className={`mr-1.5 sm:mr-2 flex-shrink-0 ${parentIsActive ? 'text-orange-500' : 'text-gray-500'}`} strokeWidth={parentIsActive ? 2.5 : 2} />}
                          <span className="truncate">{item.label}</span>
                        </div>
                        <ul className="pl-2.5 sm:pl-4 mt-[2px] space-y-0">
                          {item.subItems.map(subItem => (
                            <li key={subItem.id}>
                              <a
                                href={subItem.href}
                                onClick={(e) => { e.preventDefault(); handleTabClick(subItem.id); }}
                                className={`block py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-sm text-[11px] sm:text-xs hover:text-orange-500 hover:bg-orange-50 truncate ${activeTab === subItem.id ? 'text-orange-500 font-semibold bg-orange-50' : 'text-gray-600'}`}
                              >
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
                        className={`flex items-center p-[5px] sm:p-2 rounded-sm text-[11px] sm:text-xs transition-colors duration-150 ${activeTab === item.id ? 'text-orange-500 font-semibold bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`}
                      >
                        {item.icon && <item.icon size={14} className={`mr-1.5 sm:mr-2 flex-shrink-0 ${activeTab === item.id ? 'text-orange-500' : 'text-gray-500'}`} strokeWidth={activeTab === item.id ? 2.5 : 2} />}
                        <span className="truncate">{item.label}</span>
                        {item.tag && (
                          <span className={`ml-auto text-[8px] sm:text-[10px] font-medium px-1 py-0.5 rounded-sm flex-shrink-0 ${item.tagColor || 'bg-gray-500 text-white'}`}>
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

  const renderProfileContent = () => (
    <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200">
      <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1">Hồ Sơ Của Tôi</h1>
      <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-2 sm:gap-y-3 md:gap-y-4">
        <form className="lg:col-span-2 space-y-2 sm:space-y-3 md:space-y-4">
          {/* Các trường input với kích thước và khoảng cách đã được thu nhỏ */}
          {/* Tên đăng nhập */}
          <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-4 items-center gap-1 sm:gap-2">
            <label htmlFor="username" className="text-[10px] sm:text-xs md:text-sm text-gray-600 md:text-right md:pr-2 lg:pr-4 col-span-1 truncate">Tên đăng nhập</label>
            <div className="md:col-span-3">
              <input type="text" id="username" value="khinguynquoc013" readOnly className="w-full p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-sm bg-gray-50 text-[10px] sm:text-xs md:text-sm text-gray-700 cursor-not-allowed focus:outline-none" />
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5 sm:mt-1">Tên Đăng nhập chỉ có thể thay đổi một lần.</p>
            </div>
          </div>
          {/* Tên */}
          <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-4 items-center gap-1 sm:gap-2">
            <label htmlFor="name" className="text-[10px] sm:text-xs md:text-sm text-gray-600 md:text-right md:pr-2 lg:pr-4 col-span-1">Tên</label>
            <div className="md:col-span-3">
              <input type="text" id="name" placeholder="Nhập tên của bạn" className="w-full p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-[10px] sm:text-xs md:text-sm" />
            </div>
          </div>
          {/* Email */}
          <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-4 items-center gap-1 sm:gap-2">
            <label htmlFor="email" className="text-[10px] sm:text-xs md:text-sm text-gray-600 md:text-right md:pr-2 lg:pr-4 col-span-1">Email</label>
            <div className="md:col-span-3 flex items-center">
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 mr-1.5 sm:mr-2 truncate">ng**********@gmail.com</p>
              <button type="button" className="text-[10px] sm:text-xs md:text-sm text-blue-600 hover:underline flex-shrink-0">Thay Đổi</button>
            </div>
          </div>
          {/* Số điện thoại */}
          <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-4 items-center gap-1 sm:gap-2">
            <label htmlFor="phone" className="text-[10px] sm:text-xs md:text-sm text-gray-600 md:text-right md:pr-2 lg:pr-4 col-span-1">SĐT</label>
            <div className="md:col-span-3">
              <button type="button" className="text-[10px] sm:text-xs md:text-sm text-blue-600 hover:underline">Thêm</button>
            </div>
          </div>
          {/* Giới tính */}
          <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-4 items-center gap-1 sm:gap-2">
            <label className="text-[10px] sm:text-xs md:text-sm text-gray-600 md:text-right md:pr-2 lg:pr-4 col-span-1">Giới tính</label>
            <div className="md:col-span-3 flex items-center gap-x-1.5 sm:gap-x-2 md:gap-x-3">
              <label className="flex items-center text-[10px] sm:text-xs md:text-sm text-gray-700">
                <input type="radio" name="gender" value="male" className="form-radio !w-3 !h-3 sm:!w-3.5 sm:!h-3.5 md:!w-4 md:!h-4 text-orange-500 focus:ring-orange-500 mr-0.5 sm:mr-1" /> Nam
              </label>
              <label className="flex items-center text-[10px] sm:text-xs md:text-sm text-gray-700">
                <input type="radio" name="gender" value="female" className="form-radio !w-3 !h-3 sm:!w-3.5 sm:!h-3.5 md:!w-4 md:!h-4 text-orange-500 focus:ring-orange-500 mr-0.5 sm:mr-1" /> Nữ
              </label>
              <label className="flex items-center text-[10px] sm:text-xs md:text-sm text-gray-700">
                <input type="radio" name="gender" value="other" className="form-radio !w-3 !h-3 sm:!w-3.5 sm:!h-3.5 md:!w-4 md:!h-4 text-orange-500 focus:ring-orange-500 mr-0.5 sm:mr-1" defaultChecked /> Khác
              </label>
            </div>
          </div>
          {/* Ngày sinh */}
          <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-4 items-start sm:items-center gap-1 sm:gap-2">
            <label className="text-[10px] sm:text-xs md:text-sm text-gray-600 md:text-right md:pr-2 lg:pr-4 col-span-1 pt-0.5 sm:pt-1">Ngày sinh</label>
            <div className="md:col-span-3 grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
              <select defaultValue="" className="w-full p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-[10px] sm:text-xs md:text-sm text-gray-700">
                <option value="" disabled>Ngày</option>
                {[...Array(31)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
              <select defaultValue="" className="w-full p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-[10px] sm:text-xs md:text-sm text-gray-700">
                <option value="" disabled>Tháng</option>
                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
              <select defaultValue="" className="w-full p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-[10px] sm:text-xs md:text-sm text-gray-700">
                <option value="" disabled>Năm</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>
          {/* Nút Lưu */}
          <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] md:grid-cols-4 items-center gap-1 sm:gap-2">
            <div className="md:col-start-2 md:col-span-3">
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 sm:py-1.5 md:py-2 px-3 sm:px-4 md:px-6 rounded-sm text-[10px] sm:text-xs md:text-sm transition-colors shadow-sm">
                Lưu
              </button>
            </div>
          </div>
        </form>

        {/* Avatar */}
        <div className="lg:col-span-1 flex flex-col items-center mt-3 sm:mt-4 lg:mt-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center mb-1.5 sm:mb-2 overflow-hidden">
            <User size={32} className="text-gray-400" />
          </div>
          <input type="file" id="avatarUpload" className="hidden" accept=".jpg,.jpeg,.png" />
          <label htmlFor="avatarUpload" className="cursor-pointer bg-white border border-gray-300 text-gray-700 text-[10px] sm:text-xs md:text-sm py-1 sm:py-1.5 px-2 sm:px-3 rounded-sm hover:bg-gray-50 transition-colors shadow-sm mb-1 sm:mb-1.5">
            Chọn Ảnh
          </label>
          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-1 text-center">Dung lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG</p>
        </div>
      </div>
    </div>
  );


  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-row"> {/* Bỏ h-screen ở đây nếu muốn toàn trang cuộn */}
          {renderSidebarContent()}
          {/* Thêm h-screen ở đây nếu muốn content cuộn độc lập và sidebar sticky */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="p-2 sm:p-3 md:p-4">
              {activeTab === 'ho-so' && renderProfileContent()}
              {activeTab === 'ngan-hang' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Ngân Hàng</h2><p className="text-xs sm:text-sm">Nội dung trang Ngân Hàng...</p></div>}
              {activeTab === 'dia-chi' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Địa Chỉ</h2><p className="text-xs sm:text-sm">Nội dung trang Địa Chỉ...</p></div>}
              {activeTab === 'doi-mat-khau' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Đổi Mật Khẩu</h2><p className="text-xs sm:text-sm">Nội dung trang Đổi Mật Khẩu...</p></div>}
              {activeTab === 'thong-bao' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Thông Báo</h2><p className="text-xs sm:text-sm">Nội dung trang Thông Báo...</p></div>}
              {activeTab === 'ngay-sale' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Ngày 15 Sale Giữa Tháng</h2><p className="text-xs sm:text-sm">Nội dung trang Sale...</p></div>}
              {activeTab === 'cai-dat-thong-bao' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Cài Đặt Thông Báo</h2><p className="text-xs sm:text-sm">Nội dung trang Cài Đặt Thông Báo...</p></div>}
              {activeTab === 'thiet-lap-rieng-tu' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Những Thiết Lập Riêng Tư</h2><p className="text-xs sm:text-sm">Nội dung trang Thiết Lập Riêng Tư...</p></div>}
             {activeTab === 'don-mua' && <RenderDonMuaContent />}
              {activeTab === 'kho-voucher' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Kho Voucher</h2><p className="text-xs sm:text-sm">Nội dung trang Kho Voucher...</p></div>}
              {activeTab === 'shopee-xu' && <div className="bg-white p-3 sm:p-4 md:p-6 shadow-sm rounded-md border border-gray-200"><h2 className="text-sm sm:text-base md:text-lg font-semibold">Shopee Xu</h2><p className="text-xs sm:text-sm">Nội dung trang Shopee Xu...</p></div>}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        .form-radio {
          appearance: none;
          border-radius: 50%;
          border: 1.5px solid #D1D5DB; /* gray-300 */ /* Giảm độ dày border */
          transition: all 0.15s ease-in-out;
          position: relative;
          top: 1px;
          cursor: pointer;
        }
        .form-radio:checked {
          border-color: #F97316; /* orange-500 */
          background-color: #F97316; /* orange-500 */
        }
        .form-radio:checked:after {
          content: '';
          display: block;
          width: calc(100% - 4px); /* Chấm nhỏ hơn */
          height: calc(100% - 4px); /* Chấm nhỏ hơn */
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .form-radio:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3); /* Giảm độ đậm shadow */
        }
        /* Custom scrollbar cho webkit browsers (Chrome, Safari) */
        .overflow-y-auto::-webkit-scrollbar {
          width: 5px; /* Scrollbar mỏng hơn */
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #CBD5E0; /* gray-400 */
          border-radius: 2.5px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #A0AEC0; /* gray-500 */
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background-color: transparent; /* Nền trong suốt */
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;