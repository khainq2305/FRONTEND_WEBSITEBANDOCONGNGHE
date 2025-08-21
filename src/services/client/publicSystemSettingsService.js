import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.systemSetting.base;
const getEndpoint = API_ENDPOINT.client.systemSetting.get;

export const publicSystemSettingsService = {
  getPublicSettings: () => get(`${base}${getEndpoint}`),
};