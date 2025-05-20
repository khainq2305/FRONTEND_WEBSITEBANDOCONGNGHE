import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud';
import API from '../common/api'; // ✅ BỔ SUNG DÒNG NÀY

const base = API_ENDPOINT.client.userAddress.base;

export const userAddressService = {
  getList: () => {
    const url = `${base}${API_ENDPOINT.client.userAddress.list}`;
    console.log("📦 Gọi getList địa chỉ với URL:", url);
    return get(url);
  },
  setDefault: (id) => put(`${base}/set-default/${id}`),
  update: (id, data) => API.put(`/user-address/${id}`, data),  // ✅
  remove: (id) => API.delete(`/user-address/${id}`),           // ✅
  create: (data) => post(`${base}${API_ENDPOINT.client.userAddress.create}`, data),
};
