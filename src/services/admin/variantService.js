// src/services/admin/variantService.js
import { get, post, del, patch, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.variant.base;

export const variantService = {
  getVariants: (queryParams) => {
    return get(`${base}${API_ENDPOINT.admin.variant.list}`, queryParams);
  },
  createVariant: (data) => post(`${base}${API_ENDPOINT.admin.variant.create}`, data),
  createVariantType: (data) => post(`${base}${API_ENDPOINT.admin.variant.typeCreate}`, data),

  softDelete: (id) => del(`${base}/variants/${id}`),

  getAllWithValues: () => get(`${base}${API_ENDPOINT.admin.variant.getAllWithValues}`),

  forceDelete: (id) => del(`${base}/variants/${id}/force`),

  restore: (id) => patch(`${base}/variants/${id}/restore`),

  softDeleteMany: (ids) => post(`${base}/variants/delete-many`, { ids }),

  forceDeleteMany: (ids) => post(`${base}/variants/force-delete-many`, { ids }),

  restoreMany: (ids) => post(`${base}/variants/restore-many`, { ids }),
  getById: (slug) => get(`${base}/variants/${slug}`),
  update: (slug, data) => put(`${base}/variants/${slug}`, data)
};
