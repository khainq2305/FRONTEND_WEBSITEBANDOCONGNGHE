import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, del, delWithBody } from '../common/crud';

const base = API_ENDPOINT.admin.banner.base;
const paths = API_ENDPOINT.admin.banner;

export const sliderService = {
  list: (params = {}) => get(`${base}${paths.list}`, params),

  getById: (slug) => get(`${base}${paths.getById(slug)}`),
  update: (slug, formData) => put(`${base}${paths.update(slug)}`, formData),

  create: (formData) => post(`${base}${paths.create}`, formData),

  delete: (id) => del(`${base}${paths.delete(id)}`),

  updateOrder: (id, displayOrder) => put(`${base}${paths.updateOrder(id)}`, { displayOrder }),
  deleteMany: (idsArray) => delWithBody(`${base}${paths.forceDeleteMany}`, { ids: idsArray }),
  getCategoriesForSelect: () => get(`${base}${API_ENDPOINT.admin.banner.categoriesForSelect}`),

  getProductsForSelect: () => get(`${base}${API_ENDPOINT.admin.banner.productsForSelect}`)
};
