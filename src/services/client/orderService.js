import { get, post } from '../common/crud'; // ✅ Giả sử đã có hàm get()

import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.order.base || '/orders'}`;

export const orderService = {
  createOrder: (data) => {
    console.log("[orderService] createOrder called with data:", data);
    return post(`${base}/create`, data);
  },

  getShippingFee: (data) => {
    return post(`${base}/calculate-shipping-fee`, data);
  },

  momoPay: (payload) => {
    return post(`${base}/momo`, payload);
  },

  // ✅ THÊM MỚI
  getOrderById: (id) => {
    console.log("[orderService] getOrderById:", id);
    return get(`${base}/${id}`); // => /orders/:id
  }
};
