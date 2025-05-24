import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '@/services/common/crud'; // Sửa lại chỗ này

const base = API_ENDPOINT.admin.newsCategory.base;

export const newsCategoryService = {
  register: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.register}`, data),

  getAll: () => {
    console.log('danh mục url đây:', `${base}${API_ENDPOINT.admin.newsCategory.getAll}`)
    return get(`${base}${API_ENDPOINT.admin.newsCategory.getAll}`);
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
    return post(`${base}${API_ENDPOINT.admin.newsCategory.trashPost}`, {slugs})
  },
  postCount: () => {
    return get(`${base}${API_ENDPOINT.admin.newsCategory.postCount}`)
  } 
}