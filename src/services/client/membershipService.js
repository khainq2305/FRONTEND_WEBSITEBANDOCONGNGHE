// src/services/client/membershipService.js
import { get } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = `${API_ENDPOINT.client.membership.base}`;

export const membershipService = {
  /**
   * Lấy thông tin hội viên của user đang đăng nhập
   * @returns {Promise}
   */
  getMyMembershipInfo: () =>
    get(`${base}${API_ENDPOINT.client.membership.info}`, {}, { withCredentials: true })
};
