// src/services/admin/couponService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del } from '../common/crud';

const base = API_ENDPOINT.admin.coupon.base;

export const couponService = {
  // Danh sách + tìm kiếm + phân trang
  list: (params = {}) => get(`${base}${API_ENDPOINT.admin.coupon.list}`, params),

  // Tạo và cập nhật
  create: (data) => post(`${base}${API_ENDPOINT.admin.coupon.create}`, data),
  update: (id, data) => patch(`${base}${API_ENDPOINT.admin.coupon.update(id)}`, data),

  // Lấy 1 mã theo id
  getById: (id) => get(`${base}/coupon/${id}`),

  // Xoá mềm 1 + nhiều
  softDelete: (id) => del(`${base}${API_ENDPOINT.admin.coupon.softDelete(id)}`),
  softDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.coupon.softDeleteMany}`, { ids }),

  // Khôi phục 1 + nhiều
  restore: (id) => patch(`${base}${API_ENDPOINT.admin.coupon.restore(id)}`),
  restoreMany: (ids) => post(`${base}${API_ENDPOINT.admin.coupon.restoreMany}`, { ids }),

  // Xoá vĩnh viễn 1 + nhiều
  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.coupon.forceDelete(id)}`),
  forceDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.coupon.forceDeleteMany}`, { ids }),

  // 👇 Thêm các hàm lấy dữ liệu áp dụng
  getUsers: () => get(`${base}/coupon/users`),
  getCategories: () => get(`${base}/coupon/categories`),
  getProducts: () => get(`${base}/coupon/products`)
};
