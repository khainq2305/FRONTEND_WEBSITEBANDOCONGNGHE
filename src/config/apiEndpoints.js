import { Update } from '@mui/icons-material';
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
       verificationCooldown: '/verification-cooldown', // ✅ Thêm endpoint này
      userInfo: '/user-info' // ✅ Endpoint lấy thông tin người dùng
    }
  },
  admin: {
    news: {
      base: `${API_BASE_URL}/admin/quan-ly-bai-viet`,
      getAll: '',
      create: '/them-bai-viet',
      getById: '/chinh-sua-bai-viet',
      update: '/cap-nhat-bai-viet',
      trashPost: '/chuyen-vao-thung-rac',
      forceDelete: '/xoa-vinh-vien',
      restorePost: '/khoi-phuc'
    }
  }
};
