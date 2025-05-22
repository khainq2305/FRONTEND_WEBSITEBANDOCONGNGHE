// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud'; 

const base = API_ENDPOINT.admin.news.base;

export const newsService = {
  register: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.register}`, data),

  getAll: () => {
    console.log('là',`${base}${API_ENDPOINT.admin.news.getAll}`)
    return get(`${base}${API_ENDPOINT.admin.news.getAll}`);
  },
  create: (data) => {
  return post(`${base}${API_ENDPOINT.admin.news.create}`, data);
},
getById: (id) => {
  console.log('đã gọi edit')
  return get(`${base}${API_ENDPOINT.admin.news.getById}/${id}`);
},
update: (id, data) => {
  console.log('đã gọi edit')
  return put(`${base}${API_ENDPOINT.admin.news.update}/${id}`, data);
},
  trashPost: (ids) => {
  console.log("ID đây", ids);
  return post(`${base}${API_ENDPOINT.admin.news.trashPost}`, { ids });
},
forceDelete: (ids) => {
  console.log("ID đây", ids);
  return post(`${base}${API_ENDPOINT.admin.news.forceDelete}`, { ids });
},
  restorePost: (ids) => {
  console.log("ID khôi phục đây", ids );
  return post(`${base}${API_ENDPOINT.admin.news.restorePost}`, { ids }); // ✅ bọc lại trong object
},


};
