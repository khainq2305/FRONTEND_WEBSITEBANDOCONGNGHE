import { API_ENDPOINT } from '../../config/apiEndpoints';
import { post } from '../common/crud';

const base = API_ENDPOINT.client.auth.base;

export const authService = {
  register: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.register}`, data),

  login: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.login}`, data, {
      withCredentials: true
    }),

  loginWithGoogle: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.google}`, data, {
      withCredentials: true
    }),
    loginWithFacebook: (data, config = {}) =>
      post(`${base}${API_ENDPOINT.client.auth.facebook}`, data, config),
    verifyEmail: (token) =>
      get(`${base}${API_ENDPOINT.client.auth.verifyEmail}?token=${token}`), // 👈 thêm hàm này
};
