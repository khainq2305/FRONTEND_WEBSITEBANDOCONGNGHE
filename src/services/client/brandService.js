import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get } from '../common/crud';

const brandBase = API_ENDPOINT.client.brand.base; 

export const brandService = {
  getAll: () => get(brandBase),
};
