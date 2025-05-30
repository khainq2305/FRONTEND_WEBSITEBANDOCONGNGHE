// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud';

const base = API_ENDPOINT.client.news.base;

export const newsSevice = {
    getFeature: (params) => {
        console.log(`📡 Gọi API lấy bài viết nổi bật: ${base}${API_ENDPOINT.client.news.featurePost}`, params);
        return get(`${base}${API_ENDPOINT.client.news.featurePost}`, params);
    },
    getNewsByCategory: (slug) => {
        console.log(`API lấy bài viết nè: ${base}${API_ENDPOINT.client.news.byCategory}/${slug}`);
        return get(`${base}${API_ENDPOINT.client.news.byCategory}/${slug}`);
    }
}