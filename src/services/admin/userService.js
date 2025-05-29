import { get, post, put, del } from '../common/crud'; // ✅ Import CRUD

const base = '/admin/users'; 

export const getAllUsers = async ({ page = 1, limit = 10, search = '', status = '' }) => {
  const res = await get(base, { page, limit, search, status });
  return res.data;
};

export const getDeletedUsers = async ({ page = 1, limit = 10, search = '' }) => {
  const res = await get(`${base}/deleted`, { page, limit, search });
  return res.data;
};

export const getAllRoles = async () => {
  const res = await get('/admin/roles'); 
  return res.data;
};

export const getUserById = async (id) => {
  const res = await get(`${base}/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await post(base, data);
  return res.data;
};

export const updateUserStatus = async (userId, status, reason = '') => {
  const res = await put(`${base}/${userId}/status`, { status, reason });
  return res.data;
};

export const resetUserPassword = async (userId) => {
  const res = await post(`${base}/${userId}/reset-password`);
  return res.data;
};

export const deleteInactiveUsers = async () => {
  const res = await del(`${base}/inactive`);
  return res.data;
};

export const forceDeleteManyUsers = async (ids) => {
  const res = await post(`${base}/force-delete-many`, { ids });
  return res.data;
};
