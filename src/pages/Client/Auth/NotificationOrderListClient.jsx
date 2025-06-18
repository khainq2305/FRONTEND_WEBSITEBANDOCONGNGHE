// src/pages/Client/NotificationOrderListClient.jsx
import React, { useEffect, useState } from 'react';
import { notificationService } from '@/services/client/notificationService';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');

const NotificationOrderListClient = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasUnread = notifications.some((n) => !n.isRead);

  const fetchNotifs = async () => {
    try {
      const res = await notificationService.getForUser();
      const filtered = res.data.filter((n) => n.type === 'order');
      setNotifications(filtered);
    } catch (err) {
      console.error('Lỗi lấy thông báo:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifs();
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc tất cả:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  if (loading) return <p className="text-sm text-gray-600">Đang tải thông báo...</p>;
  if (notifications.length === 0) return <p className="text-sm text-gray-500">Bạn chưa có thông báo nào.</p>;

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={handleMarkAllAsRead}
          disabled={!hasUnread}
          className={`text-sm ${hasUnread ? 'text-black font-medium' : 'text-gray-400'} cursor-pointer focus:outline-none`}
          style={{ background: 'transparent', border: 'none' }}
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="space-y-0 divide-y divide-gray-200">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleMarkAsRead(n.id)}
            className={`flex items-start gap-4 p-4 border-b border-gray-200 cursor-pointer transition-all duration-150 ${n.isRead ? 'bg-white' : 'bg-red-50'} hover:bg-[#f5f5f5] hover:shadow-sm`}
          >
            <img src={n.imageUrl} alt="Thumb" className="w-16 h-16 object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800">{n.title}</h3>
              <div className="text-sm text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: n.message }} />
              <p className="text-xs text-gray-400 mt-1">{dayjs(n.startAt).format('HH:mm DD-MM-YYYY')}</p>
            </div>
            <a
              href={n.link || '#'}
              className="text-sm px-3 py-1 border border-[rgba(0,0,0,0.09)] hover:bg-blue-50 ml-2 whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              Xem Chi Tiết
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationOrderListClient;
