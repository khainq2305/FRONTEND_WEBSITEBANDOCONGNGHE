import { get, post } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.search.base;

export const searchService = {
  search: (params) => get(`${base}${API_ENDPOINT.client.search.search}`, params),
  getHistory: () => get(`${base}${API_ENDPOINT.client.search.history}`)
};
