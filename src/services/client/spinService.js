// src/services/client/spinService.js
import { get, post } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.spin.base;

export const spinService = {
    getRewards: () => get(`${base}${API_ENDPOINT.client.spin.rewards}`),
    getStatus: () => get(`${base}${API_ENDPOINT.client.spin.status}`),
    spin: () => post(`${base}${API_ENDPOINT.client.spin.roll}`),
    getHistory: () => get(`${base}${API_ENDPOINT.client.spin.history}`),


};
