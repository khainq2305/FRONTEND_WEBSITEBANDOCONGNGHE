import React from 'react';
import { CheckCircle, ShoppingBag, Tag, Bell } from 'lucide-react';

const NotificationItem = ({ notification }) => {
  let IconComponent;
  let iconColor = 'text-gray-500';

  switch (notification.type) {
    case 'order_shipped':
      IconComponent = CheckCircle;
      iconColor = 'text-green-500';
      break;
    case 'order_confirmed':
      IconComponent = ShoppingBag;
      iconColor = 'text-blue-500';
      break;
    case 'promotion':
      IconComponent = Tag;
      iconColor = 'text-orange-500';
      break;
    default:
      IconComponent = Bell;
  }

  return (
    <a
      href={notification.link || '#'}
      className={`block p-3 transition-colors duration-150 border-b border-gray-100 last:border-b-0 
                  ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-100'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${iconColor} flex-shrink-0`}>
          <IconComponent size={20} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs leading-relaxed ${!notification.isRead ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
            {notification.title}
          </p>
          {notification.message && <p className="text-[11px] text-gray-500 mt-0.5">{notification.message}</p>}
          <p className="text-[10px] text-gray-400 mt-1">{notification.timestamp}</p>
        </div>
        {!notification.isRead && <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 ml-auto flex-shrink-0" title="Chưa đọc"></span>}
      </div>
    </a>
  );
};

const NotificationDropdown = ({ isOpen, notifications = [], onClose }) => {
  if (!isOpen) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 flex flex-col">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
          {notifications.length > 0 && (
            <a href="#mark-all-read" className="text-[11px] text-blue-600 hover:underline">
              Bạn đã đọc tất cả thông báo <CheckCircle size={12} className="inline ml-0.5 text-green-500" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="px-3 py-1.5 rounded-full bg-secondary text-gradient font-medium border border-secondary">
            Tất cả {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button className="px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 border border-gray-200">Đơn hàng</button>
        </div>
      </div>

      <div
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-blue-100 hover:scrollbar-thumb-primary transition-colors"
        style={{
          maxHeight: '300px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--primary-color) transparent'
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notif) => <NotificationItem key={notif.id} notification={notif} />)
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-gray-500 min-h-[150px]">
            <Bell size={40} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium">Không có thông báo mới</p>
            <p className="text-xs mt-1">Tất cả thông báo của bạn sẽ được hiển thị ở đây.</p>
          </div>
        )}
      </div>

      <div className="p-2.5 text-center border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <button
          onClick={onClose}
          className="text-xs font-medium text-gradient py-1.5 px-4 rounded-md w-full hover-primary transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
