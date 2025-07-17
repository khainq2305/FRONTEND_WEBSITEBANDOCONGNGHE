import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, patch } from '../common/crud';

const base = API_ENDPOINT.admin.paymentMethod.base;

export const paymentMethodService = {
  list:   (params = {})        => get  (`${base}${API_ENDPOINT.admin.paymentMethod.list}`, params),
  create: (data)               => post (`${base}${API_ENDPOINT.admin.paymentMethod.create}`, data),
  update: (id, data)           => put  (`${base}${API_ENDPOINT.admin.paymentMethod.update(id)}`, data),
  toggle: (id)                 => patch(`${base}${API_ENDPOINT.admin.paymentMethod.toggle(id)}`)
};
