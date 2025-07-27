import React, { useState } from 'react';
import { Bell, CheckCircle, ShoppingBag, Tag, Truck, PackageCheck } from 'lucide-react';
import { notificationService } from '@/services/client/notificationService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const NotificationItem = ({ notification, onClick }) => {
  let IconComponent = Bell;
  let iconColor = 'text-gray-500 bg-gray-100';

  switch (notification.type) {
    case 'order':
      IconComponent = ShoppingBag;
      iconColor = 'text-blue-500 bg-blue-100';
      break;
    case 'promotion':
      IconComponent = Tag;
      iconColor = 'text-orange-500 bg-orange-100';
      break;
    case 'order_shipped':
      IconComponent = Truck;
      iconColor = 'text-green-600 bg-green-100';
      break;
    case 'order_delivered':
      IconComponent = PackageCheck;
      iconColor = 'text-lime-600 bg-lime-100';
      break;
    case 'system':
    default:
      IconComponent = Bell;
      iconColor = 'text-gray-500 bg-gray-100';
  }

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        onClick(notification.id);
      } catch (err) {
        console.error('Lỗi đánh dấu đã đọc:', err);
      }
    }
  };

  return (
    <a
      href={notification.link || '#'}
      onClick={handleClick}
      className={`block p-3 transition-colors duration-150 border-b border-gray-100 last:border-b-0 
        ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-100'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full flex items-center justify-center ${iconColor}`}>
          <IconComponent size={18} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-snug ${!notification.isRead ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
            {notification.title}
          </p>
          <div className="text-xs text-gray-500 mt-0.5 line-clamp-2" dangerouslySetInnerHTML={{ __html: notification.message }} />
          {notification.startAt && <p className="text-[11px] text-gray-400 mt-0.5">{dayjs(notification.startAt).fromNow()}</p>}
        </div>
        {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 ml-auto flex-shrink-0" title="Chưa đọc"></span>}
      </div>
    </a>
  );
};

const NotificationDropdown = ({ isOpen, notifications = [], onClose, setNotifications, userInfo }) => {
  const [activeTab, setActiveTab] = useState('all');
  if (!isOpen) return null;

  // Nếu chưa đăng nhậpp
  if (!userInfo) {
    return (
      <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 flex flex-col has-arrow-up">
        <div className="p-6 text-center text-gray-500 text-sm">
          <Bell size={40} className="mb-2 text-gray-300 mx-auto" />
          <p className="font-medium">Bạn cần đăng nhập để xem thông báo</p>
          <p className="text-xs mt-1">Vui lòng đăng nhập để nhận các cập nhật mới nhất từ hệ thống.</p>
        </div>
        <div className="p-2.5 text-center border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <a
            href="/dang-nhap"
            className="text-xs font-medium text-gradient py-1.5 px-4 rounded-md w-full inline-block hover-primary transition-colors"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  const totalPromotion = notifications.filter((n) => n.type === 'promotion').length;
  const totalOrder = notifications.filter((n) => n.type === 'order').length;
 const handleMarkAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead();
    
    // ✅ GỌI LẠI API
    const res = await notificationService.getForUser();
    setNotifications(res.data || []);
  } catch (err) {
    console.error('Lỗi markAllAsRead:', err);
  }
};

  const handleSingleRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'order') return n.type === 'order';
    if (activeTab === 'promotion') return n.type === 'promotion';
    return true; 
  });

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 flex flex-col has-arrow-up">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>

          {notifications.length > 0 &&
            (unreadCount === 0 ? (
              <span className="text-[11px] text-gray-500">
                Bạn đã đọc tất cả thông báo
                <CheckCircle size={12} className="inline ml-0.5 text-green-500" />
              </span>
            ) : (
              <button onClick={handleMarkAllAsRead} className="text-[11px] text-blue-600 hover:underline">
                Đánh dấu tất cả là đã đọc
                <CheckCircle size={12} className="inline ml-0.5 text-green-500" />
              </button>
            ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full border ${
              activeTab === 'all' ? 'bg-secondary text-gradient border-secondary' : 'text-gray-600 hover:bg-gray-100 border-gray-200'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`px-3 py-1.5 rounded-full border ${
              activeTab === 'order' ? 'bg-secondary text-gradient border-secondary' : 'text-gray-600 hover:bg-gray-100 border-gray-200'
            }`}
          >
            Đơn hàng ({notifications.filter((n) => n.type === 'order').length})
          </button>
          <button
            onClick={() => setActiveTab('promotion')}
            className={`px-3 py-1.5 rounded-full border ${
              activeTab === 'promotion' ? 'bg-secondary text-gradient border-secondary' : 'text-gray-600 hover:bg-gray-100 border-gray-200'
            }`}
          >
            Khuyến mãi ({totalPromotion})
          </button>
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
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => <NotificationItem key={notif.id} notification={notif} onClick={handleSingleRead} />)
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-gray-500 min-h-[150px]">
            <Bell size={40} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium">Không có thông báo</p>
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
