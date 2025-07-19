import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.banner.base}`;

export const bannerService = {
  /**
   * Lấy danh sách banner theo type (vị trí hiển thị)
   * @param {string} type - Ví dụ: homepage_slider, topbar, homepage_side_3, ...
   * @returns {Promise}
   */
  getByType: (type) => get(`${base}${API_ENDPOINT.client.banner.getByType(type)}`),
   getByCategoryId: (categoryId) => get(`${base}${API_ENDPOINT.client.banner.getByCategory(categoryId)}`),
getByProductId: (productId) =>
  get(`${API_ENDPOINT.client.banner.base}${API_ENDPOINT.client.banner.getByProduct(productId)}`)

};
