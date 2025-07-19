import { get, post, put, patch } from '../common/crud';

import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.order.base || '/orders'}`;

export const orderService = {
  createOrder: (data) => {
    console.log('[orderService] createOrder called with data:', data);
    return post(`${base}/create`, data);
  },
  viettelMoney: (payload) => post(`${base}${API_ENDPOINT.client.order.viettelMoney}`, payload),
  payAgain: (orderId, data = {}) =>
  post(`${base}${API_ENDPOINT.client.order.payAgain(orderId)}`, data),

  getShippingFee: (data) => {
    return post(`${base}/calculate-shipping-fee`, data);
  },
  updatePaymentStatus: (orderId, data) => {
    // data sẽ có dạng { paymentStatus: 'processing' }
    return patch(`${base}${API_ENDPOINT.client.order.updatePaymentStatus(orderId)}`, data);
  },
  getPaymentMethods: () => {
    return get(`${base}${API_ENDPOINT.client.order.paymentMethods}`);
  },

  getShippingOptions: (data) => {
    console.log('[orderService] getShippingOptions payload:', data); // 👈 Log input
    return post(`${base}${API_ENDPOINT.client.order.shippingOptions}`, data)
      .then((res) => {
        console.log('[orderService] getShippingOptions response:', res?.data); // 👈 Log output
        return res;
      })
      .catch((err) => {
        console.error('[orderService] getShippingOptions ERROR:', err?.response?.data || err);
        throw err;
      });
  },
  bookReturnPickup: (returnId) => post(`${base}${API_ENDPOINT.client.order.bookPickup(returnId)}`),
  getUserOrders: () => {
    return get(`${base}/user-orders`);
  },
  lookupOrder: (code, phone) => {
    return get(`${base}/lookup?code=${code}&phone=${phone}`);
  },

  cancelOrder: (id, reason) => put(`${base}/${id}/cancel`, { reason }),
  momoPay: (payload) => {
    return post(`${base}/momo`, payload);
  },
  zaloPay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.order.zaloPay}`, payload);
  },
  momoCallback: (data) => post(`${base}${API_ENDPOINT.client.order.momoCallback}`, data),
  vnpayCallback: (data) => post(`${base}${API_ENDPOINT.client.order.vnpayCallback}`, data),
  vnpay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.order.vnpay}`, payload);
  },
  returnRequest: (formData) => {
    return post(`${base}${API_ENDPOINT.client.order.return}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  vietqrPay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.order.vietqrPay}`, payload);
  },
  generateVietQR: (payload) => {
  return post(`${base}/generate-vietqr`, payload); // ⬅️ đúng path backend m định nghĩa
},
  uploadProof: (orderId, formData) => {
    return post(
      `${base}${API_ENDPOINT.client.order.uploadProof(orderId)}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
  chooseReturnMethod: (id, data) => {
    return put(`${base}/return/${id}/choose-method`, data);
  },
    stripePay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.order.stripePay}`, payload);
  }
,
  markAsCompleted: (orderId) => {
    return put(`${base}${API_ENDPOINT.client.order.markAsCompleted(orderId)}`);
  },

  reorder: (orderId) => {
    return post(`${base}${API_ENDPOINT.client.order.reorder(orderId)}`);
  },
  getOrderById: (orderCode) => {
    return get(`${base}/code/${orderCode}`);
  }
};
