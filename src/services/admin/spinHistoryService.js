import { get } from '@/services/common/crud';
import { API_ENDPOINT } from '@/config/apiEndpoints';

const base = API_ENDPOINT.admin.spinHistory.base;

export const spinHistoryService = {
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return get(`${base}${API_ENDPOINT.admin.spinHistory.list}?${queryParams}`);
    },
    getById: (id) => get(`${base}${API_ENDPOINT.admin.spinHistory.getById(id)}`),
};
