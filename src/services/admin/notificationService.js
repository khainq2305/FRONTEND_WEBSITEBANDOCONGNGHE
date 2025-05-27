// src/services/admin/notificationService.js
import { get, post, put, del } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.notification.base;

export const notificationService = {
  getAll: (params = {}) =>
    get(`${base}${API_ENDPOINT.admin.notification.getAll}`, params),

  getById: (id) =>
    get(`${base}${API_ENDPOINT.admin.notification.getById.replace(':id', id)}`),

  create: (formData) => {
    return post(`${base}${API_ENDPOINT.admin.notification.create}`, formData);
  },

  update: (id, formData) => {
    return put(`${base}${API_ENDPOINT.admin.notification.update.replace(':id', id)}`, formData);
  },

  delete: (id) =>
    del(`${base}${API_ENDPOINT.admin.notification.delete.replace(':id', id)}`),

  deleteMany: (ids) =>
    post(`${base}${API_ENDPOINT.admin.notification.deleteMany}`, { ids }),

  updateOrderIndex: (data) =>
    post(`${base}${API_ENDPOINT.admin.notification.updateOrder}`, data)
};
