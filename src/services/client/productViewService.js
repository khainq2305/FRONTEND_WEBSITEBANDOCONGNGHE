import { post, get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.productView.base;

export const productViewService = {
  trackView: (productId) => post(`${base}${API_ENDPOINT.client.productView.track}`, { productId }),
  getByIds: (ids) => post(`${base}${API_ENDPOINT.client.productView.listByIds}`, { ids }),
  getTopViewed: () => get(`${base}${API_ENDPOINT.client.productView.top}`)
};
