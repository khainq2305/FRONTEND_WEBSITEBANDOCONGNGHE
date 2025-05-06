import API from './api';

export const get = (url, params) => API.get(url, { params });
export const post = (url, data, config = {}) => API.post(url, data, config);

export const put = (url, data) => API.put(url, data);
export const del = (url) => API.delete(url);
