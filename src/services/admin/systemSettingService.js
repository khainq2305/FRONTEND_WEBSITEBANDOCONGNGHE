// src/services/systemSettingService.js
import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, put } from '../common/crud';

// Chọn endpoint theo người dùng (client hoặc admin)
const isAdmin = location.pathname.startsWith('/admin'); // hoặc tuỳ theo logic của bạn
const base = isAdmin
  ? API_ENDPOINT.admin.systemSettings.base
  : API_ENDPOINT.client.systemSettings.base;

export const systemSettingService = {
  get: () => get(`${base}`, { withCredentials: true }).then((res) => res.data?.data || res.data),
  update: (data) =>
    put(`${base}/update`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }),
};
