import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, post, put, del, patch, delWithBody } from '@/services/common/crud';

const base = API_ENDPOINT.admin.brand.base;

export const brandService = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return get(`${base}?${query}`);
    },

    getById: (id) => get(`${base}/detail/${id}`),

    create: (data) => {
        const url = `${base}/create`;
        const formData = buildFormData(data);
        return post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    update: (id, data) => {
        const url = `${base}/update/${id}`;
        const formData = buildFormData(data);
        return put(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    softDelete: (ids) => delWithBody(`${base}/soft-delete`, { ids }),

    forceDelete: (ids) => delWithBody(`${base}/force-delete`, { ids }),

    restore: (ids) => patch(`${base}/restore`, { ids }),

    updateOrderIndex: (ordered) => post(`${base}/update-order`, ordered)


};

// ✅ Tách ra hàm dựng FormData chung
function buildFormData(data) {
    const formData = new FormData();
    for (const key in data) {
        if (key === 'isActive') {
            formData.append(key, data[key] ? '1' : '0'); // ép số
        } else {
            formData.append(key, data[key]);
        }
    }
    return formData;
}
