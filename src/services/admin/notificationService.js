import API from '../common/api';
import { get, post, put, del } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.notification.base;

export const notificationService = {
  //Dùng API từ axios instance
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

  update: (id, formData) =>
    API.put(`${base}${API_ENDPOINT.admin.notification.update.replace(':id', id)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  delete: (id) => del(`${base}${API_ENDPOINT.admin.notification.delete.replace(':id', id)}`),

  deleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.notification.deleteMany}`, { ids })
};
