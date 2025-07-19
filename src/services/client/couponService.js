import { post, get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.coupon.base;

export const couponService = {
  applyCoupon: (data) => post(`${base}${API_ENDPOINT.client.coupon.apply}`, data),
 getAvailable: (queryString = '') =>
  get(`${base}${API_ENDPOINT.client.coupon.available}${queryString}`)

};
