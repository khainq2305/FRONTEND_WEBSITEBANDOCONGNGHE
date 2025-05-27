import { get, post, del, put } from '../common/crud'; 
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.cart.base;

export const cartService = {
  addToCart: (data) =>
    post(`${base}${API_ENDPOINT.client.cart.add}`, data),

  getCart: () =>
    get(`${base}${API_ENDPOINT.client.cart.list}`),


updateQuantity: (data) =>
  put(`${base}${API_ENDPOINT.client.cart.updateQuantity}`, data),

  deleteItem: (id) =>
    del(`${base}${API_ENDPOINT.client.cart.deleteItem(id)}`)
};
