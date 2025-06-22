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
lookupOrder: (code, phone) => {
  return get(`${base}/lookup?code=${code}&phone=${phone}`);
},

  cancelOrder: (id, reason) => put(`${base}/${id}/cancel`, { reason }), // ✅ chuẩn
  momoPay: (payload) => {
    return post(`${base}/momo`, payload);
  },
  zaloPay: (payload) => {
  return post(`${base}${API_ENDPOINT.client.order.zaloPay}`, payload);
},

vnpay: (payload) => {
  return post(`${base}${API_ENDPOINT.client.order.vnpay}`, payload);
},
returnRequest: (formData) => {
  return post(`${base}${API_ENDPOINT.client.order.return}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
,
vietqrPay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.order.vietqrPay}`, payload);
  },
chooseReturnMethod: (id, data) => {
  return put(`${base}/return/${id}/choose-method`, data);
}
,
markAsCompleted: (orderId) => {
  return put(`${base}${API_ENDPOINT.client.order.markAsCompleted(orderId)}`);
},

reorder: (orderId) => {
  return post(`${base}${API_ENDPOINT.client.order.reorder(orderId)}`);
},

  // ✅ THÊM MỚI
getOrderById: (orderCode) => {
  return get(`${base}/code/${orderCode}`); // 🔁 Backend đang expect /orders/code/:orderCode
}

};
