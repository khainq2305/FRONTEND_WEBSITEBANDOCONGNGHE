import { get, put } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.systemSetting.base;

export const systemSettingsService = {
  get: () => get(`${base}`),
  update: (data) =>
    put(`${base}${API_ENDPOINT.admin.systemSetting.update}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }),
};
