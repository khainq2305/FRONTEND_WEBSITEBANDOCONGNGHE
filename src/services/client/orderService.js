import { post } from '../common/crud'; 
import { API_ENDPOINT } from '../../config/apiEndpoints';
import axios from 'axios';

const base = `${API_ENDPOINT.client.order.base || '/order'}`;

export const orderService = {
  createOrder: (data) => {
    console.log("[orderService] createOrder called with data:", data);
    return post(`${base}/create`, data);
  },
  getShippingFee: async (data) => {
    console.log("📡 GỌI THẲNG AXIOS POST ĐẾN:", `${base}/calculate-shipping-fee`);
    return await axios.post(`${base}/calculate-shipping-fee`, data);
  },
};