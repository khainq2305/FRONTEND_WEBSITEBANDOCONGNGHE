// services/client/shippingService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get } from '../common/crud';

const base = API_ENDPOINT.client.shipping.base;

export const shippingService = {
  getProvinces: async () => {
    const res = await get(`${base}${API_ENDPOINT.client.shipping.provinces}`);
    return res.data || []; 
  },
  getDistricts: async (provinceId) => {
    const res = await get(`${base}${API_ENDPOINT.client.shipping.districts}`, {
      province_id: provinceId,
    });
    return res.data || []; 
  },
  getWards: async (districtId) => {
    const res = await get(`${base}${API_ENDPOINT.client.shipping.wards}`, {
      district_id: districtId,
    });
    return res.data || [];
  },
};
