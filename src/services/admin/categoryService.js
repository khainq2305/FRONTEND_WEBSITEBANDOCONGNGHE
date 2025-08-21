import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, del } from '../common/crud';

const base = API_ENDPOINT.admin.category.base;

export const categoryService = {
  getAll: (params) => get(`${base}`, params),
  getById: (id) => get(`${base}/${id}`),
  getAllNested: () => get(`${base}/nested`),

  create: (data) =>
    post(`${base}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    }),

  update: (id, data) =>
    put(`${base}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    }),

  forceDelete: (id) => del(`${base}/force-delete/${id}`, null, { withCredentials: true }),
  forceDeleteMany: (ids) => post(`${base}/force-delete-many`, { ids }, { withCredentials: true }),

  softDelete: (id) => post(`${base}/soft-delete`, { ids: [id] }, { withCredentials: true }),
  softDeleteMany: (ids) => post(`${base}/soft-delete`, { ids }, { withCredentials: true }),

  restore: (id) => post(`${base}/restore/${id}`, null, { withCredentials: true }),
  restoreMany: (ids) => post(`${base}/restore-many`, { ids }, { withCredentials: true }),
  restoreAll: () => post(`${base}/restore-all`, null, { withCredentials: true }),

  updateOrderIndex: (ordered) => post(`${base}/update-order-index`, { ordered }, { withCredentials: true })
};
