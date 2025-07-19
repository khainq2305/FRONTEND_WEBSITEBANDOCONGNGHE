import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.highlightedCategory.base;

export const highlightedCategoryService = {
  list: () => get(`${base}${API_ENDPOINT.client.highlightedCategory.list}`)
};
