import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, put } from '../common/crud';

const isAdmin = location.pathname.startsWith('/admin');
const base = isAdmin
  ? API_ENDPOINT.admin.systemSettings.base
  : API_ENDPOINT.client.systemSettings.base;

export const systemSettingService = {
  get: () =>
    get(`${base}?t=${Date.now()}`, { withCredentials: true })
      .then((res) => res.data?.data || res.data),

  update: (data) =>
    put(`${base}/update`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }).then((res) => res.data?.data || res.data),
};
