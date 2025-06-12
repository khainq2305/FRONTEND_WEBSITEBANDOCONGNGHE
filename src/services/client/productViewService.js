import { post, get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.productView.base;

export const productViewService = {
  // 📌 Ghi nhận lượt xem sản phẩm (ẩn danh)
  trackView: (productId) => post(`${base}${API_ENDPOINT.client.productView.track}`, { productId }),

  // 📌 Lấy danh sách sản phẩm đã xem từ localStorage
  getByIds: (ids) => post(`${base}${API_ENDPOINT.client.productView.listByIds}`, { ids }),

  // 📌 Lấy top sản phẩm được xem nhiều nhất
  getTopViewed: () => get(`${base}${API_ENDPOINT.client.productView.top}`)
};
