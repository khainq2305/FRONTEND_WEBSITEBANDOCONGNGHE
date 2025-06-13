import { get, post } from '../common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.client.productQuestion.base;

export const productQuestionService = {
    create: (data) => post(`${base}${API_ENDPOINT.client.productQuestion.create}`, data),
    reply: (data) => post(`${base}${API_ENDPOINT.client.productQuestion.reply}`, data),
    getByProductId: (productId) => get(`${base}${API_ENDPOINT.client.productQuestion.getByProductId(productId)}`),
};
