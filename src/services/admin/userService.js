import axios from 'axios';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const getToken = () => localStorage.getItem('token');

const API = axios.create({
  baseURL: API_ENDPOINT.admin.base,
  withCredentials: true
});

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllUsers = async ({ page = 1, limit = 10, search = '', status = '' }) => {
  const response = await API.get(API_ENDPOINT.admin.users, {
    params: { page, limit, search, status }
  });
  return response.data;
};

export const createUser = async (userData) => {
  try {
    const response = await API.post(API_ENDPOINT.admin.users, userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw { errors: error.response.data.errors }; 
    }

    throw error;
  }
};

export const getAllRoles = async () => {
  const response = await API.get(API_ENDPOINT.admin.roles);
  return response.data;
};

export const updateUserStatus = async (userId, status, reason = '') => {
  const response = await API.put(`${API_ENDPOINT.admin.users}/${userId}/status`, {
    status,
    reason
  });
  return response.data;
};

export const resetUserPassword = async (userId) => {
  const response = await API.post(`${API_ENDPOINT.admin.base}${API_ENDPOINT.admin.users}/${userId}/reset-password`);
  return response.data;
};

export const cancelUserScheduledBlock = async (userId) => {
  const response = await API.put(`${API_ENDPOINT.admin.users}/${userId}/cancel-block`);
  return response.data;
};
