// services/client/comboService.js
import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get } from '../common/crud';

const base = API_ENDPOINT.client.combo.base;

export const comboServiceClient = {
  getBySlug: (slug) => get(`${base}${API_ENDPOINT.client.combo.getBySlug(slug)}`),
getAll: () => get(`${base}`),
getAvailable: (params) => get(`${base}/available`, params)
};
