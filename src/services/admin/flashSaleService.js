import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del } from '../common/crud';

const base = API_ENDPOINT.admin.flashSale.base;

export const flashSaleService = {
  // Danh sách & chi tiết
  list: (params = {}) => get(`${base}${API_ENDPOINT.admin.flashSale.list}`, params),
  getById: (id) => get(`${base}${API_ENDPOINT.admin.flashSale.getById(id)}`),

  // Thêm & cập nhật
  create: (data) => post(`${base}${API_ENDPOINT.admin.flashSale.create}`, data),
  update: (id, data) => patch(`${base}${API_ENDPOINT.admin.flashSale.update(id)}`, data),

  // Xoá mềm
  softDelete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.softDelete(id)}`),
  softDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.softDeleteMany}`, { ids }),

  // Khôi phục
  restore: (id) => patch(`${base}${API_ENDPOINT.admin.flashSale.restore(id)}`),
  restoreMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.restoreMany}`, { ids }),

  // Xoá vĩnh viễn
  delete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.delete(id)}`),
  deleteMany: (ids) => del(`${base}${API_ENDPOINT.admin.flashSale.deleteMany}`, { ids }),
  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.forceDelete(id)}`),
  forceDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.forceDeleteMany}`, { ids }),

  // Dữ liệu cần cho form tạo/sửa
  getSkus: () => get(`${base}${API_ENDPOINT.admin.flashSale.getSkus}`),
  getCategories: () => get(`${base}${API_ENDPOINT.admin.flashSale.getCategories}`)
};
