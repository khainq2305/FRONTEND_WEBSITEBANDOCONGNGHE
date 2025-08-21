// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud';

const base = API_ENDPOINT.client.news.base;

export const newsSevice = {
  getFeature: (params) => {
    console.log(`getFeature post ${base}${API_ENDPOINT.client.news.featurePost}`, params);
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
  },
  getAllTitle: () => {
    console.log(`getAll title post ${base}`);
    console.log(`getAll title post ${API_ENDPOINT.client.news.getAllTitle}`);
    console.log(`getAll title post ${base}${API_ENDPOINT.client.news.getAllTitle}`);
    return get(`${base}${API_ENDPOINT.client.news.getAllTitle}`);
  }
};
