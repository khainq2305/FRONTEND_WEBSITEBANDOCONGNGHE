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
   getDropoffServices: (id) => {
    const url = `${base}${API_ENDPOINT.client.returnRefund.dropoffServices(id)}`;
    console.log("🔥 Lấy danh sách dịch vụ drop-off:", url);
    return get(url);
  },

  createDropoffReturnOrder: (id, data) => {
    const url = `${base}${API_ENDPOINT.client.returnRefund.createDropoff(id)}`;
    console.log("🔥 Tạo đơn trả hàng tại bưu cục:", url, data);
    return post(url, data);
  },
  getPickupFee: (id) => {
    const url = `${base}${API_ENDPOINT.client.returnRefund.pickupFee(id)}`;
    console.log("🚚 Lấy phí GHN pickup:", url);
    return get(url);
  },
};