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
      verifyResetToken: '/verify-reset-token',
      forgotPassword: '/forgot-password',
      checkVerificationStatus: '/check-verification-status',
      resendForgotPassword: '/resend-forgot-password',
      checkResetStatus: '/check-reset-status',
      resetPassword: '/reset-password',
      getResetCooldown: '/get-reset-cooldown',
      verificationCooldown: '/verification-cooldown',
      userInfo: '/user-info',
      updateProfile: '/update-profile'
    },
    shipping: {
      base: `${API_BASE_URL}/shipping`,
      provinces: '/provinces',
      districts: '/districts',
      wards: '/wards'
    },
    userAddress: {
      base: `${API_BASE_URL}/user-address`,
      list: '/',
      create: '/'
    }
  },
  admin: {
    product: {
      base: `${API_BASE_URL}/admin`,
      create: '/product/create',
      list: '/product/list'
    },
    variant: {
      base: `${API_BASE_URL}/admin`,
      list: '/variants'
    },
    user: {
      base: `${API_BASE_URL}/admin`,
      users: '/users',
      roles: '/roles'
    },
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
