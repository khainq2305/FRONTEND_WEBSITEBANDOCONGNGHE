import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, post, put, del } from '@/services/common/crud';

const base = API_ENDPOINT.admin.user.base;

export const userService1 = { 
    getById: (id) => {
        console.log(`📡 Gọi API lấy thông tin người dùng theo ID: ${base}${API_ENDPOINT.admin.user.getById}`, { id });
        return get(`${base}${API_ENDPOINT.admin.user.getById}/${id}`);
    },
    getUserByRole: (roleId) => {
        return get(`${base}${API_ENDPOINT.admin.user.getByRole}/${roleId}`);
    },

}
