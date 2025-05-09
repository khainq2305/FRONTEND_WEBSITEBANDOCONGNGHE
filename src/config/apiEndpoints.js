import { API_BASE_URL } from '../constants/environment';


export const API_ENDPOINT = {
  client: {
    auth: {
      base: `${API_BASE_URL}`,
      login: '/login',
      register: '/register',
      resendVerificationLink: '/resend-verification-link',
      google: '/google',
      facebook: '/facebook',
      verifyEmail: '/verify-email', 
      forgotPassword: '/forgot-password', // 👈 thêm endpoint này
      
      resendForgotPassword: '/resend-forgot-password',
      resetPassword: '/reset-password' ,  // 👈 thêm endpoint này
      userInfo: '/user-info' // ✅ Endpoint lấy thông tin người dùng
    }
  },
};
