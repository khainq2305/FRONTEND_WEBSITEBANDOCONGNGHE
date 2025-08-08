import { get, post, put, del } from '@/services/common/crud';
import { API_ENDPOINT } from '@/config/apiEndpoints';

const base = API_ENDPOINT.admin.spinReward.base;

export const spinRewardService = {
  getAll: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return get(`${base}${API_ENDPOINT.admin.spinReward.list}?${queryString}`).then(res => res.data);
  },
  getById: (id) => get(`${base}/${id}`).then(res => res.data),

  create: (data) => post(`${base}${API_ENDPOINT.admin.spinReward.create}`, data),

  update: (id, data) => put(`${base}${API_ENDPOINT.admin.spinReward.update(id)}`, data),

  remove: (id) => del(`${base}${API_ENDPOINT.admin.spinReward.delete(id)}`),

};
