// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud';

const base = API_ENDPOINT.client.news.base;

export const newsSevice = {
  getFeature: (params) => {
    return get(`${base}${API_ENDPOINT.client.news.featurePost}`, params);
  },
  getNewsByCategory: (slug, limit = 5) => {
    return get(`${base}${API_ENDPOINT.client.news.byCategory}/${slug}?limit=${limit}`);
  },
  getBySlug: (slug) => {
    return get(`${base}${API_ENDPOINT.client.news.getBySlug}/${slug}`);
  },
  getRelated: (slug) => {
    return get(`${base}${API_ENDPOINT.client.news.getRelated}/${slug}`);
  }
};
