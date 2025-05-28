import { get, post } from '@/services/common/crud';
import { API_ENDPOINT } from '@/config/apiEndpoints';

const base = API_ENDPOINT.admin.productQuestion.base;

export const productQuestionService = {
    getAll: () => get(`${base}${API_ENDPOINT.admin.productQuestion.getAll}`),

    reply: (questionId, content) =>
        post(`${base}${API_ENDPOINT.admin.productQuestion.reply}`, { questionId, content })
};
