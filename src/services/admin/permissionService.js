import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, post, put, del } from '@/services/common/crud';
import { subject } from '@casl/ability';

const base = API_ENDPOINT.admin.permissions.base;

export const permissionsService = {
  getAll: () => {
    console.log(`goi jđăng nhập admin ${base}${API_ENDPOINT.admin.permissions.getAll} `);
    return get(`${base}${API_ENDPOINT.admin.permissions.getAll}`);
  },
  getSubject: () => {
    console.log(`lấy subject permissionsService ${base}${API_ENDPOINT.admin.permissions.getSubJect} `);
    return get(`${base}${API_ENDPOINT.admin.permissions.getSubJect}`);
  },
  getMatrix: (subject) => {
    return get(`${base}${API_ENDPOINT.admin.permissions.getMatrix}/${subject}`);
  },
  getActionsForSubject: (subject) => {
    return get(`${base}${API_ENDPOINT.admin.permissions.ActForSubject}/${subject}`);
  },
  updatePermission: (payload) => {
    console.log('payload',payload)
    return post(`${base}${API_ENDPOINT.admin.permissions.updatePerm}`, payload);
  },
  getPermissionsByRole: (roleId) => {
    return get(`${base}${API_ENDPOINT.admin.permissions.getPermByRole}/${roleId}`);
  },

};
