import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put, patch } from '../common/crud';

const base = API_ENDPOINT.admin.shippingProvider.base;

export const shippingProviderService = {
  list:   (params = {})            => get  (`${base}${API_ENDPOINT.admin.shippingProvider.list}`, params),
  create: (data)                   => post (`${base}${API_ENDPOINT.admin.shippingProvider.create}`, data),
  update: (id, data)               => put  (`${base}${API_ENDPOINT.admin.shippingProvider.update(id)}`, data),
  toggle: (id)                     => patch(`${base}${API_ENDPOINT.admin.shippingProvider.toggle(id)}`)
};
