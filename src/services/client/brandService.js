import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const brandBase = API_ENDPOINT.client.brand.base;

export const brandService = {
  /**
   * Nếu bạn truyền vào một số, nó sẽ thêm ?categoryId=...
   * Nếu không, nó lấy toàn bộ
   */
  getAll: (categoryId) => {
    const url = categoryId
      ? `${brandBase}?categoryId=${encodeURIComponent(categoryId)}`
      : brandBase;
    return get(url);
  },
};
