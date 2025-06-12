import { get, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.order.base;

export const orderService = {
  // ✅ Lấy danh sách đơn hàng
  getAll: (params) => {
    console.log(`📡 Gọi API danh sách đơn hàng: ${base}${API_ENDPOINT.admin.order.list}`, params);
    return get(`${base}${API_ENDPOINT.admin.order.list}`, params);
  },

  // ✅ Lấy chi tiết đơn hàng theo ID
  getById: (id) => {
    const url = `${base}${API_ENDPOINT.admin.order.getById.replace(':id', id)}`;
    console.log(`📡 Gọi API chi tiết đơn hàng: ${url}`);
    return get(url);
  },

  // ✅ Cập nhật trạng thái đơn hàng
  updateStatus: (id, status) => {
    const url = `${base}${API_ENDPOINT.admin.order.updateStatus.replace(':id', id)}`;
    console.log(`📡 Gọi API cập nhật trạng thái đơn hàng: ${url}`, status);
    return put(url, { status });
  },

  // ✅ Hủy đơn hàng
  cancel: (id) => {
    const url = `${base}${API_ENDPOINT.admin.order.cancel.replace(':id', id)}`;
    console.log(`📡 Gọi API hủy đơn hàng: ${url}`);
    return put(url);
  }
};
