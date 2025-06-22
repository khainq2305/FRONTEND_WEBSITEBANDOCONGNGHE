import { get, post, del } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const wishlist = API_ENDPOINT.client.wishlist;

export const wishlistService = {
  getAll: (params = {}) => get(wishlist.base + wishlist.list, params),

  // Cho phép truyền thêm { skuId } trong body
  add: (productId, data = {}) => post(wishlist.base + wishlist.add(productId), data),

  // Cho phép xóa theo skuId nếu có
  remove: (productId, skuId) =>
    del(wishlist.base + wishlist.remove(productId) + (skuId ? `/${skuId}` : '')),
};
