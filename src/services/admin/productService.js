import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, del, patch, put } from '../common/crud';

const base = API_ENDPOINT.admin.product.base;

export const productService = {
  create: (data) => post(`${base}${API_ENDPOINT.admin.product.create}`, data),
  list: (params = {}) => get(`${base}${API_ENDPOINT.admin.product.list}`, params),

  getCategoryTree: () => get(`${base}${API_ENDPOINT.admin.product.getCategoryTree}`),
  getBrandList: () => get(`${base}${API_ENDPOINT.admin.product.getBrandList}`),
 getById: (id) => get(`${base}${API_ENDPOINT.admin.product.getById(id)}`),
  softDelete: (id) => del(`${base}${API_ENDPOINT.admin.product.softDelete(id)}`),
  softDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.product.softDeleteMany}`, { ids }),
update: (id, data) => put(`${base}/product/update/${id}`, data),

  restore: (id) => patch(`${base}${API_ENDPOINT.admin.product.restore(id)}`),
  restoreMany: (ids) => post(`${base}${API_ENDPOINT.admin.product.restoreMany}`, { ids }),
  updateOrderIndexBulk: (data) => post(`${base}${API_ENDPOINT.admin.product.updateOrderIndexBulk}`, data),

  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.product.forceDelete(id)}`)
};
