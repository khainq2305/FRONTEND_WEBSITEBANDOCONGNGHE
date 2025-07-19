import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, del, delWithBody } from '../common/crud';

const base = API_ENDPOINT.admin.roles.base;

export const rolesService = { 
    getAll: (params) => {
        return get(`${base}${API_ENDPOINT.admin.roles.getAll}`, params);
    },
    getById: (id) => {
        return get(`${base}${API_ENDPOINT.admin.roles.getById}/${id}`);
    },
    create: (data) => {
        return post(`${base}${API_ENDPOINT.admin.roles.create}`, data);
    },
    update: (id,data) => {
        return put(`${base}${API_ENDPOINT.admin.roles.update}/${id}`, data);
    },
    remove: (id, params = {}) => {
        console.log(`${base}${API_ENDPOINT.admin.roles.delete}/${id}`, params)
        return delWithBody(`${base}${API_ENDPOINT.admin.roles.delete}/${id}`, params );
}

}