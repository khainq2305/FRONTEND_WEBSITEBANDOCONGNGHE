import { post } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.chat.base;

export const chatService = {
  sendMessage: (data) => post(`${base}${API_ENDPOINT.client.chat.send}`, data),
};
