import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get } from '@/services/common/crud';

const base = API_ENDPOINT.admin.dashboard.base;

export const dashboardService = {
    getStats: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await get(`${base}${API_ENDPOINT.admin.dashboard.getStats}?${query}`);
        return res.data;
    },

    getRevenueByDate: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await get(`${base}${API_ENDPOINT.admin.dashboard.getRevenueByDate}?${query}`);
        return res.data;
    },


    getOrdersByDate: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await get(`${base}${API_ENDPOINT.admin.dashboard.getOrdersByDate}?${query}`);
        return res.data;
    },


    getTopSellingProducts: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await get(`${base}${API_ENDPOINT.admin.dashboard.getTopSellingProducts}?${query}`);
        return res.data;
    },

    getFavoriteProducts: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await get(`${base}${API_ENDPOINT.admin.dashboard.getFavoriteProducts}?${query}`);
        return res.data;
    },
};
