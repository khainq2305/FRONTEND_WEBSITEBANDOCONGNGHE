import axiosInstance from '../common/api';

export const notificationService = {
  // Gọi API để lấy danh sách thông báo của user hiện tại
  getForUser: () => axiosInstance.get('/notifications'),

  // Thông báo là đã đọc
  markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),

  // Tất cả đã đọc
  markAllAsRead: () => axiosInstance.patch('/notifications/read-all')
};
