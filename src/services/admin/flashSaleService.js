import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del } from '../common/crud';

const base = API_ENDPOINT.admin.flashSale.base;

export const flashSaleService = {
  // Lấy danh sách flash sale
  list: (params = {}) => get(`${base}${API_ENDPOINT.admin.flashSale.list}`, params),

  // Tạo và cập nhật
  create: (data) => post(`${base}${API_ENDPOINT.admin.flashSale.create}`, data),
  update: (id, data) => patch(`${base}${API_ENDPOINT.admin.flashSale.update(id)}`, data),

  // Lấy chi tiết theo id
  getById: (id) => get(`${base}/flash-sale/${id}`),

  // Xóa mềm
  delete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.delete(id)}`),
  deleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.deleteMany}`, { ids }),

  // Khôi phục
  restore: (id) => patch(`${base}${API_ENDPOINT.admin.flashSale.restore(id)}`),
  restoreMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.restoreMany}`, { ids }),

  // Xoá vĩnh viễn
  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.forceDelete(id)}`),
  forceDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.forceDeleteMany}`, { ids }),

  // Lấy dữ liệu SKU & Danh mục áp dụng
  getSkus: () => get(`${base}${API_ENDPOINT.admin.flashSale.getSkus}`),
  getCategories: () => get(`${base}${API_ENDPOINT.admin.flashSale.getCategories}`)
};
