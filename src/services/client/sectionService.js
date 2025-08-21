// src/services/client/sectionService.js
import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.section.base;

export const sectionService = {
  list: () => get(`${base}${API_ENDPOINT.client.section.list}`)
};
