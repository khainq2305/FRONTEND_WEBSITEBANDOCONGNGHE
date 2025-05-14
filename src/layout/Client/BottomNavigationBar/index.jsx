// src/components/BottomNavigationBar.jsx
import React from 'react';
import { Home, LayoutGrid, ShoppingCart, User, Bell } from 'lucide-react'; // Ví dụ icon

const BottomNavigationBar = () => {
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, href: '/', active: true }, // active: true để tô màu item hiện tại
    { id: 'category', label: 'Danh mục', icon: LayoutGrid, href: '/categories' },

    { id: 'notifications', label: 'Thông báo', icon: Bell, href: '/notifications', badge: 3 }, // Ví dụ có badge
    { id: 'account', label: 'Tài khoản', icon: User, href: '/account' },
  ];

  // Chỉ hiển thị thanh này trên mobile và tablet (dưới lg breakpoint - 1024px)
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top-nav z-40">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center h-[56px] px-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center p-1 text-center w-[calc(100%/5)] relative 
                        ${item.active ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}
                        transition-colors duration-200`}
            aria-label={item.label}
          >
            <item.icon size={22} strokeWidth={item.active ? 2 : 1.8} className="mb-0.5" />
            <span className={`text-[10px] leading-tight font-medium ${item.active ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute top-0.5 right-[calc(50%-18px)] transform translate-x-1/2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </a>
        ))}
      </div>
      {/* CSS để tạo shadow phía trên thanh nav */}
      <style jsx>{`
        .shadow-top-nav {
          box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </nav>
  );
};

export default BottomNavigationBar;