import { get } from '../common/crud';
const BASE = '/combos';

export const comboServiceClient = {
  getAll: () => get(BASE),
};
