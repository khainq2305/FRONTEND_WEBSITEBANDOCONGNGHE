import { get, post, patch } from '@/services/common/crud';
import { API_ENDPOINT } from '../../config/apiEndpoints';

const base = API_ENDPOINT.admin.productQuestion.base;

export const productQuestionService = {
    getAll: () => get(`${base}${API_ENDPOINT.admin.productQuestion.getAll}`),

    getById: (id) => get(`${base}${API_ENDPOINT.admin.productQuestion.getById(id)}`),

    reply: (questionId, data) =>
        post(`${base}${API_ENDPOINT.admin.productQuestion.reply(questionId)}`, data),

    toggleVisibility: (answerId) =>
        patch(`${base}${API_ENDPOINT.admin.productQuestion.toggleVisibility(answerId)}`),

    toggleQuestionVisibility: (questionId) =>
        patch(`${base}${API_ENDPOINT.admin.productQuestion.toggleQuestionVisibility(questionId)}`),
};