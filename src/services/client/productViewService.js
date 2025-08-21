import { post, get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.productView.base;

export const productViewService = {
  trackView: (productId) => post(`${base}${API_ENDPOINT.client.productView.track}`, { productId }),
   searchForCompare: (params) =>
    get(`${base}${API_ENDPOINT.client.productView.searchForCompare}`, params),
  getByIds: (ids) => post(`${base}${API_ENDPOINT.client.productView.listByIds}`, { ids }),
  getTopViewed: () => get(`${base}${API_ENDPOINT.client.productView.top}`),
  getRecentlyViewedByCategoryLevel1: (categoryId) => get(`${base}${API_ENDPOINT.client.productView.recentlyViewedByCategoryLevel1}?categoryId=${categoryId}`)
};
