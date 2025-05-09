// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post } from '../common/crud'; // Sửa lại chỗ này

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
  resendVerificationLink: (data) => post(`${base}${API_ENDPOINT.client.auth.resendVerificationLink}`, data),
  forgotPassword: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.forgotPassword}`, data),
  resendForgotPassword: (data) => post(`${base}${API_ENDPOINT.client.auth.resendForgotPassword}`, data), // ✅ API gửi lại email
  // ✅ Đặt lại mật khẩu với token (SỬA LẠI ĐÚNG POST)
  resetPassword: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.resetPassword}`, data), // 👈 Đúng hàm post
  getUserInfo: () => {
    console.log("🔎 Đang gọi API lấy thông tin người dùng");
    return get(`${base}${API_ENDPOINT.client.auth.userInfo}`);
  },
  logout: () => post(`${base}/logout`, {}, { withCredentials: true }),
};
