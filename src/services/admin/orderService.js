import { get, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.order.base;

export const orderService = {
  getAll: (params) => {
    console.log(`📡 Gọi API danh sách đơn hàng: ${base}${API_ENDPOINT.admin.order.list}`, params);
    return get(`${base}${API_ENDPOINT.admin.order.list}`, params);
  },
  getById: (id) => {
    const url = `${base}${API_ENDPOINT.admin.order.getById.replace(':id', id)}`;
    console.log(`📡 Gọi API chi tiết đơn hàng: ${url}`);
    return get(url);
  },
 updateStatus: (id, status) => {
  const url = `${base}${API_ENDPOINT.admin.order.updateStatus(id)}`;
  console.log(`📡 Gọi API cập nhật trạng thái đơn hàng: ${url}`, status);
  return put(url, { status });
},


 cancel: (id, reason) => {
  const url = `${base}${API_ENDPOINT.admin.order.cancel.replace(':id', id)}`;
  console.log(`📡 Gọi API hủy đơn hàng: ${url}`, reason);
  return put(url, { reason }); // ✅ TRUYỀN ĐÚNG DỮ LIỆU
},
 // ✅ LẤY DANH SÁCH YÊU CẦU TRẢ HÀNG CỦA ĐƠN
  getReturnByOrder: (orderId) => {
    const url = `${base}/order/${orderId}/returns`;
    console.log(`📡 Gọi API lấy yêu cầu trả hàng: ${url}`);
    return get(url);
  },

  // ✅ DUYỆT / CẬP NHẬT YÊU CẦU TRẢ HÀNG
  updateReturnStatus: (id, data) => {
    const url = `${base}/returns/${id}/status`;
    console.log(`📡 Gọi API cập nhật trạng thái trả hàng: ${url}`, data);
    return put(url, data); // data = { status, responseNote }
  },

  // ✅ LẤY DANH SÁCH YÊU CẦU HOÀN TIỀN CỦA ĐƠN
  getRefundByOrder: (orderId) => {
    const url = `${base}/order/${orderId}/refunds`;
    console.log(`📡 Gọi API lấy yêu cầu hoàn tiền: ${url}`);
    return get(url);
  },

  // ✅ DUYỆT / CẬP NHẬT YÊU CẦU HOÀN TIỀN
  updateRefundStatus: (id, data) => {
    const url = `${base}/refunds/${id}/status`;
    console.log(`📡 Gọi API cập nhật trạng thái hoàn tiền: ${url}`, data);
    return put(url, data); // data = { status, responseNote }
  }
};
