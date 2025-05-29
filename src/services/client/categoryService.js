// src/services/client/categoryService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get } from '../common/crud'; 

const base = API_ENDPOINT.client.category.base;

export const categoryService = {
  getAll() {
    return get(base);
  },
  getBySlug(slug) {
    if (!slug) throw new Error('❌ Missing category slug');
    return get(`${base}/${slug}`);
  }
};
