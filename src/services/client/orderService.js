import { get, post, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.order.base || '/orders'}`;

export const orderService = {
  createOrder: (data) => {
    return post(`${base}${API_ENDPOINT.client.order.create}`, data);
  },
  getUserOrders: () => {
    return get(`${base}/user-orders`);
  },
  lookupOrder: (code, phone) => {
    return get(`${base}${API_ENDPOINT.client.order.lookup(code, phone)}`);
  },
  cancelOrder: (id, reason) => put(`${base}${API_ENDPOINT.client.order.cancel(id)}`, { reason }),
  markAsCompleted: (orderId) => {
    return put(`${base}${API_ENDPOINT.client.order.markAsCompleted(orderId)}`);
  },
  reorder: (orderId) => {
    return post(`${base}${API_ENDPOINT.client.order.reorder(orderId)}`);
  },
  getOrderById: (orderCode) => {
    return get(`${base}/code/${orderCode}`);
  },
  getShippingOptions: (data) => {
    return post(`${base}${API_ENDPOINT.client.order.shippingOptions}`, data)
      .then((res) => res)
      .catch((err) => {
        throw err;
      });
  },
};