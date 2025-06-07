// src/services/client/flashSaleService.js
import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.flashSale.base;

export const flashSaleService = {
  list: () => get(`${base}${API_ENDPOINT.client.flashSale.list}`)
};
