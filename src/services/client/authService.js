// src/services/client/authService.js
import { API_ENDPOINT } from '../../config/apiEndpoints';
import { get, post, put } from '../common/crud'; // ✅ Đảm bảo đã import put

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
  checkVerificationStatus: (email) =>
    get(`${base}${API_ENDPOINT.client.auth.checkVerificationStatus}?email=${email}`), // ✅ Thêm API kiểm tra xác thực
  forgotPassword: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.forgotPassword}`, data),
  resendForgotPassword: (data) => post(`${base}${API_ENDPOINT.client.auth.resendForgotPassword}`, data), // ✅ API gửi lại email
  // ✅ Đặt lại mật khẩu với token (SỬA LẠI ĐÚNG POST)
  resetPassword: (data) =>
    post(`${base}${API_ENDPOINT.client.auth.resetPassword}`, data), // 👈 Đúng hàm post
  // ✅ Xác thực token đặt lại mật khẩu (Mới thêm)
  verifyResetToken: (token) =>
    get(`${base}${API_ENDPOINT.client.auth.verifyResetToken}?token=${token}`),
  checkResetStatus: (email) =>
    get(`${API_ENDPOINT.client.auth.base}${API_ENDPOINT.client.auth.checkResetStatus}?email=${email}`),
  getUserInfo: () => {
   
    return get(`${base}${API_ENDPOINT.client.auth.userInfo}`);
  },
   updateProfile: (data, isFormData = false) => {
    if (isFormData) {
      return put(`${base}${API_ENDPOINT.client.auth.updateProfile}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      return put(`${base}${API_ENDPOINT.client.auth.updateProfile}`, data);
    }
  },
   getResetCooldown: (email) =>
    get(`${base}${API_ENDPOINT.client.auth.getResetCooldown}?email=${email}`),
  getVerificationCooldown: (email) =>
    get(`${base}${API_ENDPOINT.client.auth.verificationCooldown}?email=${email}`),
  logout: () => post(`${base}/logout`, {}, { withCredentials: true }),
};
