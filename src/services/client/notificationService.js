import axiosInstance from '../common/api';

export const notificationService = {
  // Gọi API để lấy danh sách thông báo của user hiện tại
  getForUser: () => axiosInstance.get('/notifications'),

  //Đánh dấu 1 thông báo là đã đọc
  markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),

  //Đánh dấu tất cả là đã đọc/
  markAllAsRead: () => axiosInstance.patch('/notifications/read-all')
};
