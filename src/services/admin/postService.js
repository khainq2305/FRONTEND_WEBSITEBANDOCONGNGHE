// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud'; 

const base = API_ENDPOINT.admin.news.base;
console.log("url admin", base)
export const newsService = {
  register: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.register}`, data),

  getAll: (params) => {
    return get(`${base}${API_ENDPOINT.admin.news.getAll}`, params);
  },
  create: (data) => {
    console.log(`url add ${base}${API_ENDPOINT.admin.news.create}`)
  return post(`${base}${API_ENDPOINT.admin.news.create}`, data);
},
  getBySlug: (slug) => {
  console.log(`📡 Gọi API lấy bài viết theo slug:'${base}${API_ENDPOINT.admin.news.getBySlug}/${slug}`);
  return get(`${base}${API_ENDPOINT.admin.news.getBySlug}/${slug}`);
},

update: (slug, data) => {
  console.log(`đã gọi edit ${base}${API_ENDPOINT.admin.news.update}/${slug}`)
  return put(`${base}${API_ENDPOINT.admin.news.update}/${slug}`, data);
},
  trashPost: (slugs) => {
  return post(`${base}${API_ENDPOINT.admin.news.trashPost}`, { slugs });
},
forceDelete: (slugs) => {
  return post(`${base}${API_ENDPOINT.admin.news.forceDelete}`, { slugs });
},
  restorePost: (slugs) => {
    console.log(`url đây ${base}${API_ENDPOINT.admin.news.restorePost}`)
  return post(`${base}${API_ENDPOINT.admin.news.restorePost}`, { slugs }); // ✅ bọc lại trong object
},


};
