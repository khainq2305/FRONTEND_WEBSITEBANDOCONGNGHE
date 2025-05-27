import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, del, patch } from '../common/crud'; // nhớ có patch

const base = API_ENDPOINT.admin.product.base;

export const productService = {
  create: (data) => post(`${base}${API_ENDPOINT.admin.product.create}`, data),
list: (params = {}) => get(`${base}${API_ENDPOINT.admin.product.list}`, params),

  getCategoryTree: () => get(`${base}${API_ENDPOINT.admin.product.getCategoryTree}`), // ← Thêm dòng này
 getBrandList: () => get(`${base}${API_ENDPOINT.admin.product.getBrandList}`) ,// ✅ thêm dòng này
// 🗑 Xoá mềm
  softDelete: (id) => del(`${base}${API_ENDPOINT.admin.product.softDelete(id)}`),
  softDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.product.softDeleteMany}`, { ids }),

  // ♻️ Khôi phục
  restore: (id) => patch(`${base}${API_ENDPOINT.admin.product.restore(id)}`),
  restoreMany: (ids) => post(`${base}${API_ENDPOINT.admin.product.restoreMany}`, { ids }),
updateOrderIndexBulk: (data) => post(`${base}${API_ENDPOINT.admin.product.updateOrderIndexBulk}`, data),

  // 💀 Xoá vĩnh viễn
  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.product.forceDelete(id)}`)
};
