import axios from 'axios';
import { API_BASE_URL } from '../../constants/environment';
import useAuthStore from '@/stores/AuthStore';
import { toast } from 'react-toastify';
let navigateTo = null;

export const injectNavigate = (navigate) => {
  navigateTo = navigate;
};

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
let isTokenErrorHandled = false;

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const authStore = useAuthStore.getState();

    const isTokenError = err.response && err.response.status === 401 && err.response.data?.message?.includes('Token');

    if (isTokenError && !isTokenErrorHandled) {
      isTokenErrorHandled = true;

      toast.error(err.response.data.message || 'Phiên đăng nhập đã hết hạn!');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      authStore.logout?.();

      if (navigateTo) {
        navigateTo('/dang-nhap');
      }
    }

    if (err.response?.status === 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
      if (navigateTo) {
        navigateTo('/500');
      } else {
        window.location.href = '/500';
      }
    }

    return Promise.reject(err);
  }
);

export default API;
