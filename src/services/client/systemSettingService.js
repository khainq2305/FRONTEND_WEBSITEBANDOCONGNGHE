import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get } from '../common/crud';

const base = API_ENDPOINT.client.systemSettings.base;

export const systemSettingClientService = {
  get: () => get(`${base}`).then((res) => res.data)
};
