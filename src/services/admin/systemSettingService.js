import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, put } from '../common/crud';

const base = API_ENDPOINT.admin.systemSettings.base;

export const systemSettingService = {
get: () =>  get(`${base}`, { withCredentials: true }).then((res) => res.data),

  update: (data) =>
    put(`${base}/update`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    })
};
