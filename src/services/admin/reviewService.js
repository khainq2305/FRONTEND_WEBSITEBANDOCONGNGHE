import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, put } from '@/services/common/crud';

const base = API_ENDPOINT.admin.reviews.base;

export const reviewService = {
  list: (params) => {
    const url = `${base}/list`;
    return get(url, params);
  },

  getAll: (params) => {
    const url = `${base}${API_ENDPOINT.admin.reviews.getAll}`;
    return get(url, params);
  },

  reply: (reviewId, data) => {
    const url = `${base}${API_ENDPOINT.admin.reviews.reply(reviewId)}`;
    return put(url, data);
  }
};
