import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud';
import API from '../common/api';

const base = API_ENDPOINT.client.userAddress.base;

export const userAddressService = {
  getList: () => {
    const url = `${base}${API_ENDPOINT.client.userAddress.list}`;
    return get(url);
  },
  setDefault: (id) => put(`${base}/set-default/${id}`),
  update: (id, data) => {
    if (!id) throw new Error('ID không được để trống khi cập nhật địa chỉ');
    return put(`${base}/${id}`, data);
  },
  remove: (id) => API.delete(`/user-address/${id}`),
  create: (data) => post(`${base}${API_ENDPOINT.client.userAddress.create}`, data),
  getDefault: (addressId) => {
    let url = `${base}/default`;
    if (addressId) {
      url += `?addressId=${addressId}`;
    }
    return get(url);
  }
};
