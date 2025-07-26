import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, del, delWithBody } from '../common/crud';

const base = API_ENDPOINT.admin.sku.base;

export const skuService = {
  getAll: (params) => get(`${base}${API_ENDPOINT.admin.sku.getAll}`,  params),
  logBySkuId: (id, type) => get(`${base}${API_ENDPOINT.admin.sku.logsBySkuId(id)}`, {type}),
  importStock: (data, id) => post(`${base}${API_ENDPOINT.admin.sku.importStock(id)}`, data),
  exportStock: (data, id) => post(`${base}${API_ENDPOINT.admin.sku.exportStock(id)}`, data),

//   delete: (id) => del(`${base}${paths.delete(id)}`),

//   updateOrder: (id, displayOrder) => put(`${base}${paths.updateOrder(id)}`, { displayOrder }),
//   deleteMany: (idsArray) => delWithBody(`${base}${paths.forceDeleteMany}`, { ids: idsArray }),
//   getCategoriesForSelect: () => get(`${base}${API_ENDPOINT.admin.banner.categoriesForSelect}`),

//   getProductsForSelect: () => get(`${base}${API_ENDPOINT.admin.banner.productsForSelect}`)
};