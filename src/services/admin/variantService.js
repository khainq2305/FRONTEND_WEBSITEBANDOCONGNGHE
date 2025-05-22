// src/services/admin/variantService.js
import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.variant.base;

export const variantService = {
  getVariants: () => get(`${base}${API_ENDPOINT.admin.variant.list}`)
};
