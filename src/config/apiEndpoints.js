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
      verifyResetToken: '/verify-reset-token', // ✅ Thêm đúng endpoint này
      forgotPassword: '/forgot-password', // 👈 thêm endpoint này
      checkVerificationStatus: '/check-verification-status', // ✅ Thêm endpoint này
      resendForgotPassword: '/resend-forgot-password',
      checkResetStatus: '/check-reset-status', // ✅ Thêm endpoint này
      resetPassword: '/reset-password' , 
       // 👈 thêm endpoint này
        getResetCooldown: '/get-reset-cooldown',
       verificationCooldown: '/verification-cooldown', // ✅ Thêm endpoint này
      userInfo: '/user-info', // ✅ Endpoint lấy thông tin người dùng
       updateProfile: '/update-profile'
    },
     shipping: {
      base: `${API_BASE_URL}/shipping`,
      provinces: '/provinces',
      districts: '/districts',
      wards: '/wards',
    }
  },
};
