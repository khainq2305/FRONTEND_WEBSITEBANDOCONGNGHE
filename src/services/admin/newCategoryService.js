import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '@/services/common/crud'; // Sửa lại chỗ này

const base = API_ENDPOINT.admin.newsCategory.base;

export const newsCategoryService = {
  register: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.register}`, data),

  getAll: (params) => {
  console.log('danh mục url đây:', `${base}${API_ENDPOINT.admin.newsCategory.getAll}`, params );
  return get(`${base}${API_ENDPOINT.admin.newsCategory.getAll}`, params ); // ✅ Gửi query đúng chuẩn
},

  create: (data) => {
    return post(`${base}${API_ENDPOINT.admin.newsCategory.create}`, data)
  },
  getBySlug: (slug) => {
    return get(`${base}${API_ENDPOINT.admin.newsCategory.getBySlug}/${slug}`)
  },
  update: (slug, data) => {
    return post(`${base}${API_ENDPOINT.admin.newsCategory.update}/${slug}`, data)
  },
  trashPost: (slugs) => {
    console.log('danh mục url đây:', `${base}${API_ENDPOINT.admin.newsCategory.trashPost}`)
    return post(`${base}${API_ENDPOINT.admin.newsCategory.trashPost}`, {slugs})
  },
  restorePost: (slugs) => {
    console.log('danh mục url đây:', `${base}${API_ENDPOINT.admin.newsCategory.restorePost}`)
    return post(`${base}${API_ENDPOINT.admin.newsCategory.restorePost}`, {slugs})
  },
  postCount: () => {
    return get(`${base}${API_ENDPOINT.admin.newsCategory.postCount}`)
  } 
}