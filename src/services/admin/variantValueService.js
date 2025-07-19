// src/services/admin/variantValueService.js
import { get, post, del, patch, put } from '../common/crud'; // ✅ thêm put
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.variantValue.base;

export const variantValueService = {
  getByVariantId: (id, { isTrash = false, search = '', page = 1, limit = 10 } = {}) =>
    get(`${base}${API_ENDPOINT.admin.variantValue.getByVariantId(id)}?deleted=${isTrash}&search=${search}&page=${page}&limit=${limit}`),

  create: (data) => post(`${base}${API_ENDPOINT.admin.variantValue.create}`, data),

  update: (id, data) => put(`${base}/variant-values/${id}`, data), 

  softDelete: (id) => del(`${base}${API_ENDPOINT.admin.variantValue.softDelete(id)}`),
  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.variantValue.forceDelete(id)}`),
  restore: (id) => patch(`${base}${API_ENDPOINT.admin.variantValue.restore(id)}`),
  reorder: (data) => post(`${base}${API_ENDPOINT.admin.variantValue.reorder}`, data),
  createQuick: (data) => post(`${base}${API_ENDPOINT.admin.variantValue.createQuick}`, data),

  softDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.variantValue.softDeleteMany}`, { ids }),
  forceDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.variantValue.forceDeleteMany}`, { ids }),
  restoreMany: (ids) => post(`${base}${API_ENDPOINT.admin.variantValue.restoreMany}`, { ids })
};
