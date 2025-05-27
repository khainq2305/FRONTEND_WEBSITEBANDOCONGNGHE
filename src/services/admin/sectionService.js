import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del } from '../common/crud';

const base = API_ENDPOINT.admin.section.base;

export const sectionService = {
  // Section
  list: () => get(`${base}${API_ENDPOINT.admin.section.list}`),
  create: (data) => post(`${base}${API_ENDPOINT.admin.section.create}`, data),
  update: (id, data) => patch(`${base}${API_ENDPOINT.admin.section.update(id)}`, data),
  delete: (id) => del(`${base}${API_ENDPOINT.admin.section.delete(id)}`),
getAllSkus: (search = '') => get(`${base}${API_ENDPOINT.admin.section.getAllSkus}?search=${search}`)

};
