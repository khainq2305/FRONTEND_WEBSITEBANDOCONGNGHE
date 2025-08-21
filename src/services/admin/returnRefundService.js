import { get, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.returnRefund.base;

export const returnRefundService = {
  // TRẢ HÀNG
  getReturnsByOrder: (orderId) => {
    const url = `${base}${API_ENDPOINT.admin.returnRefund.getReturnsByOrder(orderId)}`;
    console.log(`📡 Lấy danh sách trả hàng theo order: ${url}`);
    return get(url);
  },
 updateReturnStatus: (id, payload) => {
  const url = `${base}${API_ENDPOINT.admin.returnRefund.updateReturnStatus(id)}`;
  console.log(`📡 Cập nhật trạng thái trả hàng: ${url}`, payload);
  return put(url, payload); 
}
,
  getReturnDetail: (id) => {
    const url = `${base}${API_ENDPOINT.admin.returnRefund.getReturnDetail(id)}`;
    console.log(`📡 Lấy chi tiết yêu cầu trả hàng: ${url}`);
    return get(url);
  },
  // HOÀN TIỀN
  getRefundsByOrder: (orderId) => {
    const url = `${base}${API_ENDPOINT.admin.returnRefund.getRefundsByOrder(orderId)}`;
    console.log(`📡 Lấy danh sách hoàn tiền theo order: ${url}`);
    return get(url);
  },
 updateRefundStatus: (id, payload) => {
  const url = `${base}${API_ENDPOINT.admin.returnRefund.updateRefundStatus(id)}`;
  console.log(`📡 Cập nhật trạng thái hoàn tiền: ${url}`, payload);
  return put(url, payload);
}

};
