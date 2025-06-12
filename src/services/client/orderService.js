import { get, post, put } from '../common/crud'; // ✅ Giả sử đã có hàm get()

import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.order.base || '/orders'}`;

export const orderService = {
  createOrder: (data) => {
    console.log('[orderService] createOrder called with data:', data);
    return post(`${base}/create`, data);
  },

  getShippingFee: (data) => {
    return post(`${base}/calculate-shipping-fee`, data);
  },
  getUserOrders: () => {
    return get(`${base}/user-orders`);
  },

  cancelOrder: (id, reason) => put(`${base}/${id}/cancel`, { reason }), // ✅ chuẩn
  momoPay: (payload) => {
    return post(`${base}/momo`, payload);
  },
vietqrPay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.order.vietqrPay}`, payload);
  },

  // ✅ THÊM MỚI
getOrderById: (orderCode) => {
  return get(`${base}/code/${orderCode}`); // 🔁 Backend đang expect /orders/code/:orderCode
}

};
