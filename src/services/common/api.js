import axios from 'axios';
import { API_BASE_URL } from '../../constants/environment';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Không cho redirect nếu đang ở trang login (tránh F5 loop)
let isHandling401 = false;

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginPage = window.location.pathname.includes('/dang-nhap');

    if (err.response?.status === 401 && !isHandling401) {
      isHandling401 = true;

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!isLoginPage) {
        if (token) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        } else {
          toast.error("Bạn chưa đăng nhập!");
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');

        setTimeout(() => {
          window.location.href = '/dang-nhap';
        }, 200);
      }
    }

    return Promise.reject(err);
  }
);

export default API;
