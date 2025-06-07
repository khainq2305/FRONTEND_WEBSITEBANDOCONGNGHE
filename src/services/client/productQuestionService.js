// src/services/client/productQuestionService.js

import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, post } from '@/services/common/crud';

// Base URL mà service sẽ gọi (VD: "http://localhost:5000/product-questions")
const base = API_ENDPOINT.client.productQuestion.base;

export const productQuestionService = {
  /**
   * GET /product-questions/:productId
   * params (object) có thể chứa phân trang, lọc,…(nếu cần)
   */
  getByProduct: (productId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const path = `${base}/${productId}` + (query ? `?${query}` : '');
    return get(path);
  },

  /**
   * POST /product-questions
   * body: { userId, productId, content }
   * Backend sẽ trả về đối tượng question vừa tạo
   */
  createQuestion: ({ userId, productId, content }) =>
    post(`${base}`, { userId, productId, content }),

  /**
   * POST /product-questions/reply
   * body: { userId, questionId, content, replyToId }
   * Backend sẽ trả về đối tượng reply vừa tạo
   */
  reply: ({ userId, questionId, content, replyToId = null }) =>
    post(`${base}/reply`, { userId, questionId, content, replyToId }),
};
