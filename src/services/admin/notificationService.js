import API from '../common/api';
import { get, post, put, del } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.notification.base;
//
export const notificationService = {
  getUsers: async () => {
    try {
      const res = await API.get('/admin/users');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (err) {
      console.error('Lỗi ! lấy danh sách user:', err);
      return [];
    }
  },
  getUsersByNotification: (notificationId) => API.get(`/admin/notification-users/${notificationId}`),

  getAll: (params = {}) => get(`${base}${API_ENDPOINT.admin.notification.getAll}`, params),

  getById: (id) => get(`${base}${API_ENDPOINT.admin.notification.getById.replace(':id', id)}`),

  create: (formData) => post(`${base}${API_ENDPOINT.admin.notification.create}`, formData),
  getBySlug: (slug) => get(`${base}/slug/${slug}`),

  update: (id, formData) =>
    API.put(`${base}${API_ENDPOINT.admin.notification.update.replace(':id', id)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  delete: (id) => del(`${base}${API_ENDPOINT.admin.notification.delete.replace(':id', id)}`),

  deleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.notification.deleteMany}`, { ids }),
  getByRole: () => API.get('/admin/notifications/by-role'),
 markAsRead: async (id) => {
    try {
      const res = await API.patch(`/admin/notification-users/${id}/read`);
      return res;
    } catch (error) {
      console.error("Lỗi khi gọi markAsRead API:", error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const res = await API.patch('/admin/notification-users/read-all');
      return res;
    } catch (error) {
      console.error("Lỗi khi gọi markAllAsRead API:", error);
      throw error;
    }
  }

};
