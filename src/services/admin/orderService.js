import { get, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.order.base;

export const orderService = {
  getAll: (params) => {
    console.log(`📡 Gọi API danh sách đơn hàng: ${base}${API_ENDPOINT.admin.order.list}`, params);
    return get(`${base}${API_ENDPOINT.admin.order.list}`, params);
  },

  getById: (id) => {
    const url = `${API_ENDPOINT.admin.order.base}${API_ENDPOINT.admin.order.getById(id)}`;

    console.log(`📡 Gọi API chi tiết đơn hàng: ${url}`);
    return get(url);
  },

  updateStatus: (id, data) => {
  const url = `${base}${API_ENDPOINT.admin.order.updateStatus(id)}`;
  console.log(`📡 Gọi API cập nhật trạng thái đơn hàng: ${url}`, data);
  return put(url, data); // truyền object { status, cancelReason }
},


  updatePaymentStatus: (orderId, paymentStatus) => {
    const url = `${base}${API_ENDPOINT.admin.order.updatePaymentStatus(orderId)}`;
    console.log(`📡 Gọi API cập nhật trạng thái thanh toán: ${url}`, { paymentStatus });
    return put(url, { paymentStatus });
  },

  cancel: (id, reason) => {
    const url = `${base}${API_ENDPOINT.admin.order.cancel.replace(':id', id)}`;
    console.log(`📡 Gọi API hủy đơn hàng: ${url}`, reason);
    return put(url, { reason });
  },
};
