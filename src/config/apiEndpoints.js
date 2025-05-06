import { API_BASE_URL } from '../constants/environment';


export const API_ENDPOINT = {
  client: {
    auth: {
      base: `${API_BASE_URL}`,
      login: '/login',
      register: '/register',
      google: '/google',
      facebook: '/facebook',
      verifyEmail: '/verify-email', 
    }
  },
};
