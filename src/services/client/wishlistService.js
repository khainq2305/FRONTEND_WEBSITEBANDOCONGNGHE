import { get, post, del } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.wishlist.base;

export const wishlistService = {
getAll: (params = {}) => get(base, params),
  add: (productId) => post(`${base}/${productId}`),
  remove: (productId) => del(`${base}/${productId}`),
};
