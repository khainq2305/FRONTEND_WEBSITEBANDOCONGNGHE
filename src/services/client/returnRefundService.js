import { get, post, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.returnRefund.base || '/return-refund'}`;

export const returnRefundService = {
  requestReturn: (formData) => {
    return post(`${base}${API_ENDPOINT.client.returnRefund.request}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getReturnByCode: (code) => {
  const url = `${base}${API_ENDPOINT.client.returnRefund.getByReturnCode(code)}`;
  console.log("🔥 Gọi API lấy đơn trả theo mã:", url);
  return get(url);
},

getReturnDetail: (id) => {
  const url = `${base}${API_ENDPOINT.client.returnRefund.getDetail(id)}`;
  console.log("🔥 URL đang gọi:", url);
  return get(url);
},
  cancelReturnRequest: (id) => {
    return put(`${base}${API_ENDPOINT.client.returnRefund.cancel(id)}`);
  },
  chooseReturnMethod: (id, data) => {
    return put(`${base}${API_ENDPOINT.client.returnRefund.chooseMethod(id)}`, data);
  },
  bookReturnPickup: (id) => {
    return post(`${base}${API_ENDPOINT.client.returnRefund.bookPickup(id)}`);
  },
};