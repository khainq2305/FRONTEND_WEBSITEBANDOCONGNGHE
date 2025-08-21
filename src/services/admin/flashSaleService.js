import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, patch, del } from '../common/crud';

const base = API_ENDPOINT.admin.flashSale.base;

export const flashSaleService = {
  updateSortOrder: (slug, list) =>                    
 patch(`${base}${API_ENDPOINT.admin.flashSale.updateSortOrder(slug)}`, list),
  list: (params = {}) => get(`${base}${API_ENDPOINT.admin.flashSale.list}`, params),
 getById: (slug) => get(`${base}${API_ENDPOINT.admin.flashSale.getById(slug)}`),
  create: (data) => post(`${base}${API_ENDPOINT.admin.flashSale.create}`, data),
   update: (slug, data) => patch(`${base}${API_ENDPOINT.admin.flashSale.update(slug)}`, data),
  softDelete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.softDelete(id)}`),
updateOrder: (list) => patch(`${base}${API_ENDPOINT.admin.flashSale.updateOrder}`, list),

  softDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.softDeleteMany}`, { ids }),
  restore: (id) => patch(`${base}${API_ENDPOINT.admin.flashSale.restore(id)}`),
  restoreMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.restoreMany}`, { ids }),
  delete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.delete(id)}`),
  deleteMany: (ids) => del(`${base}${API_ENDPOINT.admin.flashSale.deleteMany}`, { ids }),
  forceDelete: (id) => del(`${base}${API_ENDPOINT.admin.flashSale.forceDelete(id)}`),
  forceDeleteMany: (ids) => post(`${base}${API_ENDPOINT.admin.flashSale.forceDeleteMany}`, { ids }),
  getSkus: () => get(`${base}${API_ENDPOINT.admin.flashSale.getSkus}`),
  getCategories: () => get(`${base}${API_ENDPOINT.admin.flashSale.getCategories}`)
};
