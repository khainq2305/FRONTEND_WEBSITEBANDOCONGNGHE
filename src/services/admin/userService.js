import axios from 'axios';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const getToken = () => localStorage.getItem('token');

const API = axios.create({
  baseURL: API_ENDPOINT.admin.user.base,
  withCredentials: true
});

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllUsers = async ({ page = 1, limit = 10, search = '', status = '' }) => {
  const res = await API.get(API_ENDPOINT.admin.user.users, {
    params: { page, limit, search, status }
  });
  console.log('data', res.data)
  return res.data;
};

export const updateUserStatus = async (userId, status, reason = '') => {
  const res = await API.put(`${API_ENDPOINT.admin.user.users}/${userId}/status`, { status, reason });
  return res.data;
};

export const resetUserPassword = async (userId) => {
  const res = await API.post(`${API_ENDPOINT.admin.user.users}/${userId}/reset-password`);
  return res.data;
};

export const deleteInactiveUsers = async () => {
  const res = await API.delete(`${API_ENDPOINT.admin.user.users}/inactive`);
  return res.data;
};

export const getDeletedUsers = async ({ page = 1, limit = 10, search = '' }) => {
  const res = await API.get('/users/deleted', {
    params: { page, limit, search }
  });
  return res.data;
};
export const getAllRolesApi = async () => {
  const res = await API.get('/roles');
  return res.data;
};
export const createUser = async (data) => {
  const res = await API.post(API_ENDPOINT.admin.user.users, data);
  return res.data;
};
export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  console.log('🚀 ~ getUserById ~ res:', res);
  return res.data;
};
export const forceDeleteManyUsers = async (ids) => {
  const res = await API.post('/users/force-delete-many', { ids });
  return res.data;
};
export const updateRoles = async (userId, roles) => {
  const res = await API.put(
    `${API_ENDPOINT.admin.user.users}/${userId}/roles`,
    { roleIds: roles }
  );
  return res.data;
};



