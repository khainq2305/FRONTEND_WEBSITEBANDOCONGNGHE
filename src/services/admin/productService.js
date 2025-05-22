import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post } from '../common/crud';

const base = API_ENDPOINT.admin.product.base;

export const productService = {
  create: (data) => post(`${base}${API_ENDPOINT.admin.product.create}`, data),
  list: () => get(`${base}${API_ENDPOINT.admin.product.list}`)
};
