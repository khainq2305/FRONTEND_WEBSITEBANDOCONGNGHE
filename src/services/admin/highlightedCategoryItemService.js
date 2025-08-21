import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, del, put } from '../common/crud'; 

const base = API_ENDPOINT.admin.highlightedCategoryItem.base;

export const highlightedCategoryItemService = {
  list: (params = {}) => get(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.list}`, params),

  create: (data) => post(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.create}`, data),

 update: (slug, data) => put(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.update(slug)}`, data),
getById: (slug) => get(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.getBySlug(slug)}`),
  delete: (id) => del(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.delete(id)}`),
  deleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.deleteMany}`, { ids }),
  getCategories: () => get(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.getCategories}`),
  reorder: (items) => post(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.reorder}`, { items })
};
