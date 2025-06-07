import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud';
const base = API_ENDPOINT.admin.orders.base;
export const ordersService = {
  list: (params) => get(`${base}${API_ENDPOINT.admin.orders.list}`, params),
  cancel: (orderId, data) => post(`${base}/${orderId}/cancel`, data),
  getById: (id) => get(`${base}/${id}`),
  updateStatus: (orderId, data) => put(`${base}${API_ENDPOINT.admin.orders.updateStatus(orderId)}`, data),
};