import { get, post, put, del } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.paymentMethod.base;

export const paymentMethodService = {
  list: (params) => get(`${base}`, params),

  getById: (id) => get(`${base}${API_ENDPOINT.admin.paymentMethod.getById(id)}`),

  create: (data) =>
    post(`${base}${API_ENDPOINT.admin.paymentMethod.create}`, data, {
      withCredentials: true
    }),


  update: (id, data) =>
    put(`${base}${API_ENDPOINT.admin.paymentMethod.update(id)}`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }),

  delete: (id) =>
    del(`${base}${API_ENDPOINT.admin.paymentMethod.forceDelete(id)}`, null, {
      withCredentials: true
    }),


};
