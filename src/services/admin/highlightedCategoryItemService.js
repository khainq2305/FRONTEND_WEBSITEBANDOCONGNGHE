import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, del, put } from '../common/crud'; // đừng quên có 'put'

const base = API_ENDPOINT.admin.highlightedCategoryItem.base;

export const highlightedCategoryItemService = {
  list: (params = {}) =>
    get(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.list}`, params),

  create: (data) =>
    post(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.create}`, data),

  update: (id, data) =>
    put(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.update(id)}`, data),
getById: (id) =>
  get(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.update(id)}`),

  delete: (id) =>
    del(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.delete(id)}`),
deleteMany: (ids) =>
  post(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.deleteMany}`, { ids }),
getCategories: () =>
  get(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.getCategories}`)
,
  reorder: (items) =>
    post(`${base}${API_ENDPOINT.admin.highlightedCategoryItem.reorder}`, { items }) // ✅ thêm hàm này
};

