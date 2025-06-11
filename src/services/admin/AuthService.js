import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, post, put, del } from '@/services/common/crud';

const base = API_ENDPOINT.admin.Auth.base;

export const AuthService = {
  login: (data) => {
    console.log(`goi jđăng nhập admin ${base}${API_ENDPOINT.admin.Auth.login} ` )
    return post(`${base}${API_ENDPOINT.admin.Auth.login}`, data, {
      withCredentials: true,
    });
  },
  getUserInfo: () => {
    console.log(`goi lấy info ${base}${API_ENDPOINT.admin.Auth.getUserInfo} ` )
    return get(`${base}${API_ENDPOINT.admin.Auth.getUserInfo}`, {
      withCredentials: true
    });
  },
  logout: () => {
    console.log(`goi logout ${base}${API_ENDPOINT.admin.Auth.logout} ` )
    return post(`${base}${API_ENDPOINT.admin.Auth.logout}`, {
      withCredentials: true,
    });
  },
};
