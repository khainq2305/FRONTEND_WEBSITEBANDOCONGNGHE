import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del, put } from '../common/crud';

const base = API_ENDPOINT.admin.section.base;

export const sectionService = {
  list: (params = {}) => {
    const cleanParams = {};
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        cleanParams[key] = params[key];
      }
    }
    const query = new URLSearchParams(cleanParams).toString();
    return get(`${base}${API_ENDPOINT.admin.section.list}?${query}`);
  },
  updateOrder: (orderedItems) =>
  patch(`${base}${API_ENDPOINT.admin.section.updateOrder}`, { orderedItems }),

  create: (data) => post(`${base}${API_ENDPOINT.admin.section.create}`, data),

  update: (slug, data) => put(`${base}${API_ENDPOINT.admin.section.update(slug)}`, data),

  getById: (slug) => get(`${base}${API_ENDPOINT.admin.section.getById(slug)}`),
  getAllCategories: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`${base}${API_ENDPOINT.admin.section.getAllCategories}?${query}`);
  },
  delete: (id) => del(`${base}${API_ENDPOINT.admin.section.delete(id)}`),
   getAllProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`${base}${API_ENDPOINT.admin.section.getAllProducts}?${query}`);
  },

};
