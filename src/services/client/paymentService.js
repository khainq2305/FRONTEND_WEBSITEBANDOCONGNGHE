import { get, post, put, patch } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.payment.base || '/payment'}`;

export const paymentService = {
  viettelMoney: (payload) => post(`${base}${API_ENDPOINT.client.payment.viettelMoney}`, payload),
  payAgain: (orderId, data = {}) => post(`${base}${API_ENDPOINT.client.payment.payAgain(orderId)}`, data),
  updatePaymentStatus: (orderId, data) => {
    return patch(`${base}${API_ENDPOINT.client.payment.updatePaymentStatus(orderId)}`, data);
  },
  getPaymentMethods: () => {
    return get(`${base}${API_ENDPOINT.client.payment.paymentMethods}`);
  },
  momoPay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.payment.momoPay}`, payload);
  },
  zaloPay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.payment.zaloPay}`, payload);
  },
  momoCallback: (data) => post(`${base}${API_ENDPOINT.client.payment.momoCallback}`, data),
  vnpayCallback: (data) => post(`${base}${API_ENDPOINT.client.payment.vnpayCallback}`, data),
  vnpay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.payment.vnpay}`, payload);
  },
  vietqrPay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.payment.vietqrPay}`, payload);
  },
  generateVietQR: (payload) => {
    return post(`${base}/generate-vietqr`, payload);
  },
  uploadProof: (orderId, formData) => {
    return post(`${base}${API_ENDPOINT.client.payment.uploadProof(orderId)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  stripePay: (payload) => {
    return post(`${base}${API_ENDPOINT.client.payment.stripePay}`, payload);
  },
};