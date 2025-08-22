import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, del, patch } from '../common/crud';

const base = API_ENDPOINT.admin.combo.base;

export const comboService = {
  getAll: () => get(`${base}${API_ENDPOINT.admin.combo.getAll}`),
  getBySlug: (slug) => get(`${base}${API_ENDPOINT.admin.combo.getBySlug(slug)}`),
  create: (data) => post(`${base}${API_ENDPOINT.admin.combo.create}`, data),
  update: (slug, data) => put(`${base}${API_ENDPOINT.admin.combo.update(slug)}`, data),
  softDelete: (id) => del(`${base}${API_ENDPOINT.admin.combo.softDelete(id)}`),
  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.combo.forceDelete(id)}`),
  restore: (id) => patch(`${base}${API_ENDPOINT.admin.combo.restore(id)}`),
  softDeleteMany: (ids) => post(`${base}/soft-delete-many`, { ids }),
  getAllSkus: () => get(`${base}/skus`)
  
};
