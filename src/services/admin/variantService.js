// src/services/admin/variantService.js
import { get, post, del, patch, put } from '../common/crud'; // ✅ thêm put nếu cần
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.variant.base;

export const variantService = {
getVariants: (queryParams) => {
  return get(`${base}${API_ENDPOINT.admin.variant.list}`, queryParams); // ✅ chỉ truyền queryParams thẳng
}
,

  createVariant: (data) => post(`${base}${API_ENDPOINT.admin.variant.create}`, data) ,
  createVariantType: (data) =>
  post(`${base}${API_ENDPOINT.admin.variant.typeCreate}`, data),

  softDelete: (id) => del(`${base}/variants/${id}`),

getAllWithValues: () =>
  get(`${base}${API_ENDPOINT.admin.variant.getAllWithValues}`),

update: (id, data) => put(`${base}/variants/${id}`, data), // nếu BE dùng PUT

  // Xoá vĩnh viễn 1 cái
  forceDelete: (id) => del(`${base}/variants/${id}/force`),

  // Khôi phục 1 cái
  restore: (id) => patch(`${base}/variants/${id}/restore`),

  // Xoá mềm nhiều cái
  softDeleteMany: (ids) => post(`${base}/variants/delete-many`, { ids }),

  // Xoá vĩnh viễn nhiều cái
  forceDeleteMany: (ids) => post(`${base}/variants/force-delete-many`, { ids }),

  // Khôi phục nhiều cái
  restoreMany: (ids) => post(`${base}/variants/restore-many`, { ids }),
  getById: (id) => get(`${base}/variants/${id}`),

};
