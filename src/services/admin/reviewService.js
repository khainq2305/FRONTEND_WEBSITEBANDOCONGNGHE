import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, patch } from '../common/crud';

const base = API_ENDPOINT.admin.review.base;

export const reviewService = {
  getBySku: (skuId, params) => {
    // console.log(`urlBY sku ${base}/${skuId}`, params)
    return get(`${base}/${skuId}`, params)
  },
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`${base}/all${query ? `?${query}` : ''}`);
  },

  getGroupedByProduct: (params) => {
    return get(`${base}`, params)
  },
  replyToReview: (id, data) => patch(`${base}/reply/${id}`, data),

};
