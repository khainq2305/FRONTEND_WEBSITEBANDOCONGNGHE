// src/services/client/categoryService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get } from '../common/crud'; 

const base = API_ENDPOINT.client.category.base;

export const categoryService = {
  getAll() {
    return get(base);
  },
  getByCategory(slug, page = 1, limit = 20) {
    return get(base, { slug, page, limit });
  }
};
