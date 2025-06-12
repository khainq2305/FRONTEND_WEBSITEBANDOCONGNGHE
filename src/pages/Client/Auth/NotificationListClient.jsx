import React, { useEffect, useState } from 'react';
import { notificationService } from '@/services/client/notificationService';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');

const NotificationListClient = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationService.getForUser();
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Lỗi lấy thông báo:', err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
  }, []);

  if (loading) return <p className="text-sm text-gray-600">Đang tải thông báo...</p>;
  if (notifications.length === 0)
    return <p className="text-sm text-gray-500">Bạn chưa có thông báo nào.</p>;

  return (
  <div className="space-y-0 divide-y divide-gray-200">
  {notifications.map((n) => (
    <div
      key={n.id}
  className="flex items-start gap-4 p-4 border-b border-gray-200 bg-white hover:bg-[#f5f5f5] hover:shadow-sm transition-all duration-150"
    >
      <img
        src={n.imageUrl}
        alt="Thumb"
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800">{n.title}</h3>
        <div
          className="text-sm text-gray-600 mt-1"
          dangerouslySetInnerHTML={{ __html: n.message }}
        />
        <p className="text-xs text-gray-400 mt-1">
          {dayjs(n.startAt).format('HH:mm DD-MM-YYYY')}
        </p>
      </div>
      <a
        href={n.link || '#'}
        className="text-sm  px-3 py-1 border border-[rgba(0,0,0,0.09)]
  hover:bg-blue-50 ml-2 whitespace-nowrap"
      >
        Xem Chi Tiết
      </a>
    </div>
  ))}
</div>
  );
};

export default NotificationListClient;
