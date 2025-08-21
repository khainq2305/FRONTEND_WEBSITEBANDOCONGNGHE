// services/client/rewardPointService.js
import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.userPoint.base;

export const rewardPointService = {
  getTotalPoints: () => get(`${base}${API_ENDPOINT.client.userPoint.total}`),
  getHistory: (params = {}) => get(`${base}${API_ENDPOINT.client.userPoint.history}`, params)
};
