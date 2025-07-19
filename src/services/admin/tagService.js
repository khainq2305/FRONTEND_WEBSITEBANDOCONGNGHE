// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud';

const base = API_ENDPOINT.admin.tags.base;

export const tagService = {
    getAll: (params) => {
        console.log(`📡 Gọi API Tags name: ${base}${API_ENDPOINT.admin.tags.getAll}`, params);
        return get(`${base}${API_ENDPOINT.admin.tags.getAll}`, params);
    },
}