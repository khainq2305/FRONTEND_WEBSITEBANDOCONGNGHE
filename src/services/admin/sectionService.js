import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del } from '../common/crud';

const base = API_ENDPOINT.admin.section.base;

export const sectionService = {
  // Section
list: (params = {}) => {
  const cleanParams = {};
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      cleanParams[key] = params[key];
    }
  }
  const query = new URLSearchParams(cleanParams).toString();
  return get(`${base}${API_ENDPOINT.admin.section.list}?${query}`);
}
,
updateOrder: (orderedIds) =>
    patch(`${base}${API_ENDPOINT.admin.section.updateOrder}`, { orderedIds }), // ✅ thêm dòng này
  create: (data) => post(`${base}${API_ENDPOINT.admin.section.create}`, data),
  update: (id, data) => patch(`${base}${API_ENDPOINT.admin.section.update(id)}`, data),
  delete: (id) => del(`${base}${API_ENDPOINT.admin.section.delete(id)}`),
getAllSkus: (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return get(`${base}${API_ENDPOINT.admin.section.getAllSkus}?${query}`);
}
,
 getDetail: (id) => get(`${base}${API_ENDPOINT.admin.section.getDetail(id)}`)  // ✅ thêm dòng này
};
