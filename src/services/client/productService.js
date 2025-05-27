import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get } from '../common/crud';

const base = API_ENDPOINT.client.product.base;

export const productService = {
  getBySlug: (slug) => get(`${base}${API_ENDPOINT.client.product.getBySlug(slug)}`)
};
