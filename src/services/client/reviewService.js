import { API_ENDPOINT } from '../../config/apiEndpoints';
import { post, get } from '../common/crud';

const base = API_ENDPOINT.client.review.base;

export const reviewService = {
  create: (data) =>
    post(`${base}${API_ENDPOINT.client.review.create}`, data, {
      withCredentials: true
    }),

  getBySku: async (skuId, filters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters).reduce((acc, [k, v]) => {
        if (v !== null && v !== undefined) acc[k] = v;
        return acc;
      }, {})
    ).toString();

    const res = await get(`${base}${API_ENDPOINT.client.review.getBySku(skuId)}?${query}`);
    return Array.isArray(res?.data?.reviews) ? res.data.reviews : [];
  },


  checkUserReview: (skuId) => {

    return get(
        `${base}${API_ENDPOINT.client.review.check(skuId)}`, 
        { withCredentials: true }
    );
  }
};