import { API_ENDPOINT } from '@/config/apiEndpoints';
import { get, post, patch } from '@/services/common/crud'; // 👈 đảm bảo có hàm patch

const base = API_ENDPOINT.admin.productQuestion.base;

export const productQuestionService = {
  // Lấy danh sách (có phân trang / tìm kiếm)
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`${base}?${query}`);
  },

  // Lấy chi tiết một câu hỏi theo ID
  getById: (id) => get(`${base}/${id}`),

  // Gửi phản hồi
  reply: ({ questionId, content, replyToId = null, userId }) =>
    post(`${base}/reply`, { questionId, content, replyToId, userId }),

  // Ẩn câu hỏi hoặc phản hồi (nếu bạn dùng)
  hide: (id) => patch(`${base}/${id}/hide`)
};
